import os
from groq import Groq

def get_client():
    key = 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#os.getenv("GROQ_API_KEY")
    if not key:
        raise RuntimeError("GROQ_API_KEY missing")
    return Groq(api_key=key)

def clean_text(text: str):
    return text.replace("**", "").strip()

def summarize_transcript(transcript: str):
    client = get_client()   # ✅ create client HERE (runtime)

    prompt = f"""
You are an expert note-maker.

TASK:
1. Write a clear, high-impact summary (4–5 lines)
2. Extract 5–7 important key points
3. Focus on core ideas and concepts

FORMAT:
Summary:
<paragraph>

Key Points:
- point 1
- point 2

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
        if p.strip()
    ]

    return {
        "summary": summary,
        "keypoints": keypoints
    }
