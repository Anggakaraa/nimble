"use client";

import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    primaryFocus: "",
    secondaryFocus: "",
    effortLevel: "",
    tools: [] as string[],
    time: ""
  });

  const [routine, setRoutine] = useState<string>("Generating your routine...");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "select-multiple") {
      const options = (e.target as HTMLSelectElement).selectedOptions;
      const selectedTools = Array.from(options).map((option) => option.value);
      setFormData({ ...formData, [name]: selectedTools });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/generate-routine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      setRoutine(data.result || "No routine generated.");
    } catch (error) {
      console.error(error);
      setRoutine("Failed to generate routine.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Mobility Routine Generator</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label>Primary Focus Area:</label>
          <select name="primaryFocus" value={formData.primaryFocus} onChange={handleChange} required>
            <option value="">Select one</option>
            <option value="shoulders">Shoulders</option>
            <option value="spine">Spine</option>
            <option value="hips">Hips</option>
            <option value="wrists">Wrists</option>
            <option value="knees">Knees</option>
          </select>
        </div>

        <div>
          <label>Secondary Focus Area (optional):</label>
          <select name="secondaryFocus" value={formData.secondaryFocus} onChange={handleChange}>
            <option value="">None</option>
            <option value="shoulders">Shoulders</option>
            <option value="spine">Spine</option>
            <option value="hips">Hips</option>
            <option value="wrists">Wrists</option>
            <option value="knees">Knees</option>
          </select>
        </div>

        <div>
          <label>Effort Level:</label>
          <select name="effortLevel" value={formData.effortLevel} onChange={handleChange} required>
            <option value="">Select one</option>
            <option value="Restore & Reset">🟢 Restore & Reset</option>
            <option value="Build & Control">🟡 Build & Control</option>
            <option value="Push Adaptive Limits">🔴 Push Adaptive Limits</option>
          </select>
        </div>

        <div>
          <label>Tools Available (hold Ctrl or Cmd to select multiple):</label>
          <select name="tools" multiple onChange={handleChange}>
            <option value="resistance band">Resistance Band</option>
            <option value="foam roller">Foam Roller</option>
            <option value="mini band">Mini Band</option>
            <option value="dumbbell">Dumbbell</option>
            <option value="yoga block">Yoga Block</option>
            <option value="wall">Wall</option>
            <option value="stick">Stick/Dowel</option>
            <option value="floor">Floor</option>
          </select>
        </div>

        <div>
          <label>Time Available:</label>
          <select name="time" value={formData.time} onChange={handleChange} required>
            <option value="">Select one</option>
            <option value="less than 30 minutes">Less than 30 minutes</option>
            <option value="30–45 minutes">30–45 minutes</option>
            <option value="more than 45 minutes">More than 45 minutes</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className="bg-black text-white p-2 rounded">
          {loading ? "Generating..." : "Generate Routine"}
        </button>
      </form>

      <div className="mt-10 p-4 border rounded bg-gray-100">
        {routine}
      </div>
    </main>
  );
}

