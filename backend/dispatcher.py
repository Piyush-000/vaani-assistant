from commands.apps import (
    open_chrome,
    open_notepad,
    open_calculator,
    open_vscode,
)

from commands.explorer import (
    open_explorer,
    open_downloads,
    open_documents,
)

COMMANDS = {
    ("open", "chrome"): open_chrome,
    ("open", "notepad"): open_notepad,
    ("open", "calculator"): open_calculator,
    ("open", "vscode"): open_vscode,
    ("open", "explorer"): open_explorer,
    ("open", "downloads"): open_downloads,
    ("open", "documents"): open_documents,
}


def execute_command(action: str, target: str):
    action = action.lower().strip()
    target = target.lower().strip()

    handler = COMMANDS.get((action, target))

    if handler:
        return handler()

    return {
        "success": False,
        "message": f"Unknown command: {action} {target}"
    }