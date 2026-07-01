from pathlib import Path

from faster_whisper import WhisperModel


def format_timestamp(seconds: float) -> str:
    ms = max(0, int(round(seconds * 1000)))
    h, rem = divmod(ms, 3600000)
    m, rem = divmod(rem, 60000)
    s, ms = divmod(rem, 1000)
    return f"{h:02d}:{m:02d}:{s:02d}.{ms:03d}"


def main() -> None:
    project_root = Path(__file__).resolve().parents[1]
    media_dir = project_root / "public" / "media"
    video_path = media_dir / "chatbox-cliente-explicativo.mp4"
    vtt_path = media_dir / "chatbox-cliente-explicativo.vtt"

    if not video_path.exists():
        raise FileNotFoundError(f"No existe el video: {video_path}")

    model = WhisperModel("small", device="cpu", compute_type="int8")
    segments, info = model.transcribe(
        str(video_path),
        language="es",
        vad_filter=True,
        word_timestamps=False,
        condition_on_previous_text=True,
    )

    lines = ["WEBVTT", ""]
    index = 1
    for segment in segments:
        text = segment.text.strip()
        if not text:
            continue

        lines.append(str(index))
        lines.append(f"{format_timestamp(segment.start)} --> {format_timestamp(segment.end)}")
        lines.append(text)
        lines.append("")
        index += 1

    if index == 1:
        lines.extend(
            [
                "1",
                "00:00:00.000 --> 00:00:03.000",
                "[No se detecto voz claramente en el audio para generar subtitulos.]",
                "",
            ]
        )

    vtt_path.write_text("\n".join(lines), encoding="utf-8")

    print(f"Idioma detectado: {info.language} (prob={info.language_probability:.3f})")
    print(f"Subtitulos generados en: {vtt_path}")


if __name__ == "__main__":
    main()
