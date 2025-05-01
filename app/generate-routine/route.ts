import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { effort, primaryFocus, secondaryFocus, time, notes } = body;

    const prompt = `
You are a mobility coach trained in CARs, PAILs/RAILs, FRC, and fascia decompression.

Generate a mobility routine based on:
- Effort: ${effort}
- Primary focus: ${primaryFocus}
- Secondary focus: ${secondaryFocus}
- Time: ${time}
- Notes: ${notes}

Respond with only a JSON array like this:
[
  {
    "stage": "Warm-up",
    "title": "Seated Thoracic CARs",
    "duration": "2 mins",
    "instructions": ["step 1", "step 2", "step 3"]
  },
  ...
]

Do not include any extra text, explanation, or markdown.
    `;

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
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content || "";

    // 💡 Auto-extract JSON array if GPT includes extra text
    const match = raw.match(/\[\s*{[\s\S]*}\s*\]/);
    if (!match) {
      return NextResponse.json(
        { error: "No JSON array found in GPT response", raw },
        { status: 500 }
      );
    }

    const routine = JSON.parse(match[0]);
    return NextResponse.json({ routine });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}
