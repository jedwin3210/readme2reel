import argparse
import sys

from .core import format_text


def main() -> None:
    parser = argparse.ArgumentParser(prog="tidyjson")
    parser.add_argument("path")
    parser.add_argument("--indent", type=int, default=2)
    args = parser.parse_args()
    with open(args.path) as f:
        sys.stdout.write(format_text(f.read(), args.indent))
