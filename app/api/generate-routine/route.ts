import { NextResponse } from "next/server"

// Define exercise count requirements based on time
const getExerciseCountByTime = (time: string) => {
  if (time.includes("<30")) return { min: 3, max: 4 }
  if (time.includes("30-45")) return { min: 4, max: 6 }
  if (time.includes(">45")) return { min: 5, max: 8 }
  return { min: 4, max: 6 } // Default
}

// Define intensity guidelines based on effort level
const getIntensityByEffort = (effort: string) => {
  const effortLower = effort.toLowerCase()
  if (effortLower.includes("restore")) return "gentle, restorative movements with focus on control and breath"
  if (effortLower.includes("build")) return "moderate intensity with focus on building strength and control"
  if (effortLower.includes("push")) return "challenging movements that push your limits while maintaining control"
  return "balanced intensity with focus on control and awareness"
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    },
  )
}

export async function POST(req: Request) {
  try {
    console.log("API route handler started")

    // Parse request body
    const body = await req.json()
    const { effort, primaryFocus, secondaryFocus, time, notes } = body

    console.log("Received request with body:", body)

    // Validate required fields
    if (!effort || !primaryFocus || !time) {
      console.error("Missing required fields:", { effort, primaryFocus, time })
      return NextResponse.json(
        { error: "Missing required fields: effort, primaryFocus, and time are required" },
        { status: 400 },
      )
    }

    // Get exercise count requirements based on time
    const { min, max } = getExerciseCountByTime(time)

    // Get intensity guidelines based on effort
    const intensityGuidelines = getIntensityByEffort(effort)

    const prompt = `
You are a mobility coach trained in FRC, CARs, PAILs/RAILs, end-range strength, fascia decompression, and active joint control.

Generate a personalized mobility routine based on the following inputs:

- Effort Level: ${effort} (${intensityGuidelines})
- Primary Focus: ${primaryFocus}
- Secondary Focus: ${secondaryFocus || "None"}
- Time Available: ${time}
- Notes: ${notes || "None"}

Follow this structure for each exercise:
1. Exercise Name
2. Duration or Sets/Reps
3. Bullet-point instructions (clear, breath-led, concise)
4. Tools Needed (e.g., yoga blocks, resistance bands, sticks, ball, foam roller, etc. or "None" if no tools required)
5. Optional: What should or shouldn't be felt

IMPORTANT REQUIREMENTS:
- For this ${time} routine, include EXACTLY ${min}-${max} total exercises
- Include 1-2 warm-up exercises
- Include ${Math.max(2, min - 3)} to ${Math.max(3, max - 3)} main exercises focused primarily on ${primaryFocus}${secondaryFocus ? ` and secondarily on ${secondaryFocus}` : ""}
- Include 1 cooldown/decompression exercise
- Match the intensity to the "${effort}" effort level
- Ensure exercises are appropriate for the time available (${time})

Avoid:
- Yoga or passive stretching
- General fitness routines
- Exercises that don't match the requested effort level

IMPORTANT: Your response MUST be a JSON object with an "exercises" key containing an ARRAY of exercise objects. The format should be:

{
  "exercises": [
    {
      "section": "Warm-up",
      "title": "Exercise Name",
      "duration": "Duration or Sets/Reps",
      "instructions": ["Instruction 1", "Instruction 2", "Instruction 3"],
      "tools": ["Tool 1", "Tool 2"] or ["None"],
      "focus": "Primary body area this targets"
    },
    {
      "section": "Main",
      "title": "Exercise Name",
      "duration": "Duration or Sets/Reps",
      "instructions": ["Instruction 1", "Instruction 2", "Instruction 3"],
      "tools": ["Tool 1", "Tool 2"] or ["None"],
      "focus": "Primary body area this targets"
    },
    {
      "section": "Cooldown",
      "title": "Exercise Name",
      "duration": "Duration or Sets/Reps",
      "instructions": ["Instruction 1", "Instruction 2", "Instruction 3"],
      "tools": ["Tool 1", "Tool 2"] or ["None"],
      "focus": "Primary body area this targets"
    }
  ]
}

Your response should be valid JSON that can be parsed directly.
    `.trim()

    console.log("Sending prompt to OpenAI")

    try {
      // Check if OpenAI API key exists
      if (!process.env.OPENAI_API_KEY) {
        console.error("OPENAI_API_KEY is not defined")
        return NextResponse.json({ error: "OpenAI API key is not configured" }, { status: 500 })
      }

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a mobility coach. Always respond with valid JSON containing an array of exercises. 
                 For ${time} routines, include ${min}-${max} exercises total.
                 Match the intensity to the "${effort}" effort level.
                 Focus primarily on ${primaryFocus}${secondaryFocus ? ` and secondarily on ${secondaryFocus}` : ""}.`,
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          response_format: { type: "json_object" },
        }),
      })

      console.log("OpenAI response status:", res.status)

      if (!res.ok) {
        const errorText = await res.text()
        console.error("OpenAI API error:", res.status, errorText)
        return NextResponse.json({ error: `OpenAI API error: ${res.status} ${errorText}` }, { status: 500 })
      }

      const data = await res.json()
      console.log("OpenAI response received")

      if (data.error) {
        console.error("❌ OpenAI Error:", data.error.message)
        return NextResponse.json({ error: data.error.message }, { status: 500 })
      }

      const result = data.choices?.[0]?.message?.content

      if (!result || result.trim() === "") {
        console.error("Empty response from OpenAI")
        return NextResponse.json({ error: "Empty response from OpenAI" }, { status: 500 })
      }

      console.log("OpenAI result content received")

      // Try to parse the JSON response
      try {
        const parsedRoutine = JSON.parse(result)
        console.log("Successfully parsed JSON from OpenAI")

        // Check if the response has an "exercises" field or is an array directly
        let routineData = parsedRoutine.exercises || parsedRoutine

        // If routineData is not an array, wrap it in an array
        if (!Array.isArray(routineData)) {
          console.log("Response is not an array, wrapping in array:", routineData)
          routineData = [routineData]
        }

        // Validate exercise count
        if (routineData.length < min) {
          console.log(`Warning: Not enough exercises. Got ${routineData.length}, expected at least ${min}`)
        }

        return NextResponse.json(
          { routine: routineData },
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
          },
        )
      } catch (e) {
        console.error("Failed to parse JSON from OpenAI:", e)
        // Fall back to returning the raw text
        return NextResponse.json(
          { routine: result, error: "Failed to parse structured data" },
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
          },
        )
      }
    } catch (openaiErr) {
      console.error("OpenAI API call failed:", openaiErr)
      return NextResponse.json(
        { error: `OpenAI API call failed: ${openaiErr instanceof Error ? openaiErr.message : String(openaiErr)}` },
        { status: 500 },
      )
    }
  } catch (err) {
    console.error("🔥 API call failed:", err)
    return NextResponse.json(
      {
        error: `Something went wrong while generating the routine: ${err instanceof Error ? err.message : String(err)}`,
      },
      { status: 500 },
    )
  }
}
