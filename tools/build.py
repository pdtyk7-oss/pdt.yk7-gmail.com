"""Regenerates the server price table and every HTML page (Arabic and English).

    python3 tools/build.py

Edit the page texts in tools/pages.py (Arabic) and tools/pages_en.py (English),
the tracks and fees in assets/data.js and assets/data.en.js, then run this file.
"""
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

subprocess.run(['node', str(HERE.parent / 'scripts' / 'build-stages.js')], check=True)

import pages, pages_en  # noqa: E402  (imported after sys.path is set)

pages.main()
pages_en.main()
