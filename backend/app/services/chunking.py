from app.config import settings
from app.services.text_types import ParsedSegment


def chunk_segments(segments: list[ParsedSegment]) -> list[ParsedSegment]:
    chunks: list[ParsedSegment] = []
    chunk_size = settings.chunk_size
    overlap = settings.chunk_overlap

    for segment in segments:
        text = segment.content
        if len(text) <= chunk_size:
            chunks.append(ParsedSegment(content=text, page_number=segment.page_number))
            continue

        start = 0
        while start < len(text):
            end = start + chunk_size
            chunk_text = text[start:end].strip()
            if chunk_text:
                chunks.append(ParsedSegment(content=chunk_text, page_number=segment.page_number))
            if end >= len(text):
                break
            start = max(end - overlap, start + 1)

    return chunks
