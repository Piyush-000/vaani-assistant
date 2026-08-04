import subprocess
from pathlib import Path


def launch_executable(path: Path, app_name: str):
    if path.exists():
        subprocess.Popen([str(path)])
        return {
            "success": True,
            "message": f"{app_name} opened successfully."
        }

    return {
        "success": False,
        "message": f"{app_name} not found."
    }


def launch_command(command, app_name: str):
    try:
        subprocess.Popen(command)
        return {
            "success": True,
            "message": f"{app_name} opened successfully."
        }
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }