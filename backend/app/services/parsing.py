from pathlib import Path

from docx import Document as DocxDocument
from pypdf import PdfReader

from app.services.text_types import ParsedSegment


def parse_document(file_path: Path, file_type: str) -> list[ParsedSegment]:
    if file_type == "pdf":
        return _parse_pdf(file_path)
    if file_type == "docx":
        return _parse_docx(file_path)
    if file_type == "txt":
        return _parse_txt(file_path)
    raise ValueError(f"Unsupported file type: {file_type}")


def _parse_pdf(file_path: Path) -> list[ParsedSegment]:
    reader = PdfReader(str(file_path))
    segments: list[ParsedSegment] = []
    for index, page in enumerate(reader.pages, start=1):
        text = (page.extract_text() or "").strip()
        if text:
            segments.append(ParsedSegment(content=text, page_number=index))
    return segments


def _parse_docx(file_path: Path) -> list[ParsedSegment]:
    doc = DocxDocument(str(file_path))
    paragraphs = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
    if not paragraphs:
        return []
    return [ParsedSegment(content="\n\n".join(paragraphs))]


def _parse_txt(file_path: Path) -> list[ParsedSegment]:
    content = file_path.read_text(encoding="utf-8", errors="ignore").strip()
    if not content:
        return []
    return [ParsedSegment(content=content)]
