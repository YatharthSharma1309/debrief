"""Assemble a Build Week demo video from frames + voiceover."""
from pathlib import Path
import subprocess
import imageio_ffmpeg

ROOT = Path(__file__).resolve().parent
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
FRAMES = [
    ("frame-01-home.png", 22),
    ("frame-02-dashboard.png", 28),
    ("frame-03-workspace.png", 28),
    ("frame-04-brief.png", 42),
    ("frame-05-docs-chat.png", 35),
]
# Total ~155s — trim voiceover sync by stretching last frames if needed


def main() -> None:
    list_file = ROOT / "frames.txt"
    lines = []
    for name, secs in FRAMES:
        path = (ROOT / name).resolve().as_posix().replace("'", r"'\''")
        lines.append(f"file '{path}'")
        lines.append(f"duration {secs}")
    # last frame must be repeated for concat demuxer
    last = (ROOT / FRAMES[-1][0]).resolve().as_posix().replace("'", r"'\''")
    lines.append(f"file '{last}'")
    list_file.write_text("\n".join(lines) + "\n", encoding="utf-8")

    silent = ROOT / "video-silent.mp4"
    out = ROOT / "debrief-build-week-demo.mp4"
    audio = ROOT / "voiceover.mp3"

    # Slideshow from stills
    subprocess.check_call(
        [
            FFMPEG,
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(list_file),
            "-vf",
            "scale=1440:900:force_original_aspect_ratio=decrease,pad=1440:900:(ow-iw)/2:(oh-ih)/2,fps=30,format=yuv420p",
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            str(silent),
        ]
    )

    # Mux voiceover; shortest stream wins so we stay under ~3 min
    subprocess.check_call(
        [
            FFMPEG,
            "-y",
            "-i",
            str(silent),
            "-i",
            str(audio),
            "-c:v",
            "copy",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-shortest",
            "-movflags",
            "+faststart",
            str(out),
        ]
    )

    # Probe duration (ffmpeg -i exits 1 when no output file — expected)
    try:
        probe = subprocess.check_output(
            [FFMPEG, "-i", str(out)],
            stderr=subprocess.STDOUT,
            text=True,
            errors="ignore",
        )
    except subprocess.CalledProcessError as exc:
        probe = exc.output or ""
    print(out)
    for line in probe.splitlines():
        if "Duration" in line or "Audio" in line or "Video" in line:
            print(line.strip())
    print("OK — upload debrief-build-week-demo.mp4 to YouTube (public)")


if __name__ == "__main__":
    main()
