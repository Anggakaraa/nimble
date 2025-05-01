import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { effort, primaryFocus, secondaryFocus, time, notes } = body;

    const prompt = `
You are a mobility coach trained in CARs, PAILs/RAILs, FRC, and fascia decompression.

Based on the following inputs, generate a mobility routine:
- Effort: ${effort}
- Focus: ${primaryFocus}
- Secondary: ${secondaryFocus}
- Time: ${time}
- Notes: ${notes}

Please return ONLY a JSON array, like this:
[
  {
    "stage": "Warm-up",
    "title": "Seated Thoracic CARs",
    "duration": "2 mins",
    "instructions": [
      "Sit upright with neutral spine",
      "Slowly rotate thoracic spine with breath",
      "Avoid moving shoulders"
    ]
  },
  ...
]

DO NOT include any explanations or extra text. Just the array.
    `;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Make sure this is set in Vercel env vars
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a mobility coach." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    const data = await res.json();

    const raw = data.choices?.[0]?.message?.content || "";

    // Attempt to parse GPT's response as JSON
    try {
      const routine = JSON.parse(raw);
      if (!Array.isArray(routine)) throw new Error("Not an array");
      return NextResponse.json({ routine });
    } catch (err) {
      return NextResponse.json(
        {
          error: "OpenAI responded with unstructured data",
          raw,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong on the server." },
      { status: 500 }
    );
  }
}
