import { NextResponse } from "next/server"

export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    }
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { effort, primaryFocus, secondaryFocus, time, notes } = body

    const prompt = `
You are a mobility coach trained in FRC, CARs, PAILs/RAILs, end-range strength, fascia decompression, and active joint control.

Generate a personalized mobility routine based on the following inputs:

- Effort Level: ${effort}
- Primary Focus: ${primaryFocus}
- Secondary Focus: ${secondaryFocus || "None"}
- Time Available: ${time}
- Notes: ${notes || "None"}

Follow this structure:
1. Exercise Name
2. Duration or Sets/Reps
3. Bullet-point instructions (clear, breath-led, concise)
4. Optional: What should or shouldn’t be felt

Include:
- A warm-up
- A main phase (based on effort level)
- A short decompression or cooldown

Avoid:
- Yoga or passive stretching
- General fitness routines

Your response should be clean, structured, and ready to parse.
    `.trim()

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a mobility coach." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
      }),
    })

    const data = await res.json()

    if (data.error) {
      console.error("❌ OpenAI Error:", data.error.message)
      return NextResponse.json({ error: data.error.message }, { status: 500 })
    }

    const result = data.choices?.[0]?.message?.content

    if (!result || result.trim() === "") {
      return NextResponse.json({ error: "Empty response from OpenAI" }, { status: 500 })
    }

    return NextResponse.json(
      { routine: result },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        }
      }
    )
  } catch (err) {
    console.error("🔥 API call failed:", err)
    return NextResponse.json({ error: "Something went wrong while generating the routine." }, { status: 500 })
  }
}
