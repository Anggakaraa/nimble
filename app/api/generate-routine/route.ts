// route.ts – updated to support paragraph-style input and soft coaching tone

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { effort, primaryFocus, secondaryFocus, time, notes } = body;

  const prompt = `
You are a mobility coach trained in FRC, CARs, PAILs/RAILs, end-range strength, fascia decompression, and active joint control.

The user has described how their body feels today and what they’d like to focus on:

- Effort Mode: ${effort || "Not specified"}
- Primary Focus Area: ${primaryFocus || "Not specified"}
- Secondary Area: ${secondaryFocus || "None"}
- Available Time: ${time || "Not specified"}
- Additional Notes: ${notes || "None"}

Based on this, generate a mobility routine. The routine should be structured into:
1. Warm-up (gentle activation)
2. Main Work (joint-specific control, PAILs/RAILs, CARs, etc.)
3. Decompression/Cooldown (fascia release, breath-based control)

Each exercise should include:
- A bold title
- Duration or reps
- 2–3 bullet-point instructions (focus on breathing, tension, control)
- Optional: a note on what to feel or avoid

Use clear formatting. Do not suggest tools unless they are absolutely needed. If tools are used, list them briefly before the routine.
`; 

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a thoughtful, body-aware mobility coach." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await res.json();

    if (data.error) {
      console.error("OpenAI Error:", data.error.message);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const result = data.choices?.[0]?.message?.content;

    if (!result || result.trim() === "") {
      return NextResponse.json({
        result: "⚠️ OpenAI responded, but no routine was generated. Try again or modify your input."
      });
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("API call failed:", error);
    return NextResponse.json({ error: "Something went wrong while talking to OpenAI." }, { status: 500 });
  }
}
