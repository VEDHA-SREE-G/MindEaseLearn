import os
from groq import Groq

# ✅ Create client HERE (this is what was missing)
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def clean_text(text: str):
    return text.replace("**", "").strip()
def summarize_transcript(transcript: str):
    prompt = f"""
You are an expert note-maker.

TASK:
1. Write a **clear, high-impact summary** (4–5 lines)
2. Extract **5–7 important key points**
3. Focus on:
   - Core ideas
   - Concepts
   - Explanations
   - NOT examples or filler sentences

FORMAT (STRICT):
Summary:
<paragraph>

Key Points:
- point 1
- point 2
- point 3
- ...

Transcript:
{transcript}
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )

    text = response.choices[0].message.content

    summary_raw = text.split("Key Points:")[0].replace("Summary:", "").strip()
    keypoints_raw = text.split("Key Points:")[1].split("\n")

    summary = clean_text(summary_raw)

    keypoints = [
        clean_text(p.strip("- ").strip())
        for p in keypoints_raw
        if p.strip() and p.strip() != "**"
    ]

    return {
        "summary": summary,
        "keypoints": keypoints
    }


