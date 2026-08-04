import os
from pathlib import Path

from core.launcher import launch_command, launch_executable


def open_chrome():
    possible_paths = [
        Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
        Path(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"),
        Path(os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe")),
    ]

    for path in possible_paths:
        if path.exists():
            return launch_executable(path, "Chrome")

    return {
        "success": False,
        "message": "Chrome not found."
    }


def open_notepad():
    return launch_command(
        ["notepad.exe"],
        "Notepad"
    )


def open_calculator():
    return launch_command(
        ["calc.exe"],
        "Calculator"
    )


def open_vscode():
    possible_paths = [
        Path(r"C:\Program Files\Microsoft VS Code\Code.exe"),
        Path(r"C:\Program Files (x86)\Microsoft VS Code\Code.exe"),
        Path(os.path.expandvars(r"%LOCALAPPDATA%\Programs\Microsoft VS Code\Code.exe")),
    ]

    for path in possible_paths:
        if path.exists():
            return launch_executable(path, "VS Code")

    return {
        "success": False,
        "message": "VS Code not found."
    }


def open_calculator():
    return launch_command(
        ["calc.exe"],
        "Calculator"
    )


def open_vscode():
    possible_paths = [
        Path(r"C:\Program Files\Microsoft VS Code\Code.exe"),
        Path(r"C:\Program Files (x86)\Microsoft VS Code\Code.exe"),
        Path(os.path.expandvars(r"%LOCALAPPDATA%\Programs\Microsoft VS Code\Code.exe")),
    ]

    for path in possible_paths:
        if path.exists():
            return launch_executable(path, "VS Code")

    return {
        "success": False,
        "message": "VS Code not found."
    }