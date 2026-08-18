import os
import shutil
from pathlib import Path

from core.launcher import (
    launch_command,
    launch_executable,
)


# ============================================================
# Chrome
# ============================================================

def open_chrome():
    possible_paths = [
        Path(
            r"C:\Program Files\Google\Chrome\Application\chrome.exe"
        ),
        Path(
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
        ),
        Path(
            os.path.expandvars(
                r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
            )
        ),
    ]

    for path in possible_paths:
        if path.exists():
            return launch_executable(
                path,
                "Chrome",
                window_keywords=[
                    "chrome",
                ],
            )

    return {
        "success": False,
        "message": "Chrome not found.",
    }


# ============================================================
# Notepad
# ============================================================

def open_notepad():
    return launch_command(
        ["notepad.exe"],
        "Notepad",
        window_keywords=[
            "notepad",
        ],
    )


# ============================================================
# Calculator
# ============================================================

def open_calculator():
    return launch_command(
        ["calc.exe"],
        "Calculator",
        window_keywords=[
            "calculator",
        ],
    )


# ============================================================
# VS Code
# ============================================================

def open_vscode():
    # First try VS Code from PATH.
    code_command = shutil.which(
        "code"
    )

    if code_command:
        return launch_command(
            [code_command],
            "VS Code",
            window_keywords=[
                "visual studio code",
            ],
        )

    # Common VS Code installation paths.
    possible_paths = [
        Path(
            r"C:\Program Files\Microsoft VS Code\Code.exe"
        ),
        Path(
            r"C:\Program Files (x86)\Microsoft VS Code\Code.exe"
        ),
        Path(
            os.path.expandvars(
                r"%LOCALAPPDATA%\Programs\Microsoft VS Code\Code.exe"
            )
        ),
        Path(
            os.path.expandvars(
                r"%LOCALAPPDATA%\Programs\Microsoft VS Code\bin\code.cmd"
            )
        ),
    ]

    for path in possible_paths:
        if path.exists():
            return launch_executable(
                path,
                "VS Code",
                window_keywords=[
                    "visual studio code",
                ],
            )

    return {
        "success": False,
        "message": "VS Code not found.",
    }