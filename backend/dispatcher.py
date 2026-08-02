from commands.apps import open_chrome


def execute_command(action: str, target: str):
    action = action.lower()
    target = target.lower()

    if action == "open":
        if target == "chrome":
            return open_chrome()

    return {
        "success": False,
        "message": f"Unknown command: {action} {target}"
    }