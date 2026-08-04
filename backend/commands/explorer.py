import os

from core.launcher import launch_command


def open_explorer():
    return launch_command(
        ["explorer"],
        "File Explorer"
    )


def open_downloads():
    downloads = os.path.join(os.path.expanduser("~"), "Downloads")

    return launch_command(
        ["explorer", downloads],
        "Downloads"
    )


def open_documents():
    documents = os.path.join(os.path.expanduser("~"), "Documents")

    return launch_command(
        ["explorer", documents],
        "Documents"
    )