# Generated demo assets

These were generated for OpenAI Build Week submission.

## Files

| File | Purpose |
|------|---------|
| `voiceover.txt` | Narration script (covers product + Codex + GPT-5.6) |
| `voiceover.mp3` | AI voiceover (edge-tts, en-US-GuyNeural) |
| `debrief-build-week-demo.mp4` | Demo video (~1:41, under 3 minutes) |
| `frame-*.png` | Live-app screenshots used as video frames |
| `capture_frames.py` / `build_demo_video.py` | Regenerators |

## Upload to YouTube

1. Open [YouTube Studio](https://studio.youtube.com/) → **Create** → **Upload videos**
2. Select `docs/demo-assets/debrief-build-week-demo.mp4`
3. Title: `Debrief — OpenAI Build Week Demo`
4. Description (paste):

```
Debrief recovers cited Decision Briefs from scattered team docs.

Live: https://debrief-psi.vercel.app
Demo: demo@debrief.app / DemoBuildWeek2026!
Repo: https://github.com/YatharthSharma1309/debrief

Built with Codex + GPT-5.6 for OpenAI Build Week (Work & Productivity).
Runtime demo uses OpenRouter free models.
```

5. Visibility: **Public** (or Unlisted if Devpost accepts unlisted — FAQ asks public)
6. Copy the YouTube URL into Devpost + `docs/DEVPOST_SUBMISSION.md`

## Codex Session ID (cannot be generated here)

1. Open your **main Codex build thread** (where most of Debrief was built)
2. Run: `/feedback`
3. Copy the Session ID into the Devpost form

## Regenerate

```powershell
cd docs/demo-assets
python capture_frames.py
python -c "import asyncio,edge_tts; asyncio.run(edge_tts.Communicate(open('voiceover.txt',encoding='utf-8').read(),'en-US-GuyNeural').save('voiceover.mp3'))"
python build_demo_video.py
```
