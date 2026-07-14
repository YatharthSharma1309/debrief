from dataclasses import dataclass


@dataclass
class ParsedSegment:
    content: str
    page_number: int | None = None
