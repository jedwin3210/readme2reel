import json


def format_text(text: str, indent: int = 2) -> str:
    return json.dumps(json.loads(text), indent=indent, sort_keys=True) + "\n"
