import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { primaryFocus, secondaryFocus, effortLevel, tools, time } = body;

  const prompt = `
You are a mobility coach trained in FRC, CARs, PAILs/RAILs, end-range strength, fascia decompression, and active joint control.

Generate a mobility routine based on the following user input:

- Effort Level: ${effortLevel}
- Primary Focus: ${primaryFocus}
- Secondary Focus: ${secondaryFocus || "None"}
- Tools: ${tools.length ? tools.join(", ") : "None"}
- Time Available: ${time}

Use the following format:
1. Exercise Name
2. Duration/Reps
3. Bullet-point instructions (clear and concise, with breath and control cues)
4. Optional: focus cue (e.g. what should/shouldn’t be felt)

Use Prompt Guideline v1.1 principles. Prioritize active mobility, not yoga or passive stretching. Include warm-up, main work, and a short decompression/cooldown.
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
          { role: "system", content: "You are a mobility coach." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    const result = data.choices?.[0]?.message?.content || "No routine generated.";

    return NextResponse.json({ result });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}