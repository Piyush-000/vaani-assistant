import os
import subprocess
from pathlib import Path

def open_chrome():
    possible_paths = [
        Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
        Path(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"),
        Path(os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe")),
    ]

    for chrome_path in possible_paths:
        if chrome_path.exists():
            subprocess.Popen([str(chrome_path)])
            return {
                "success": True,
                "message": "Chrome opened successfully."
            }

    return {
        "success": False,
        "message": "Google Chrome not found."
    }