import ctypes
import subprocess
import time
from pathlib import Path


# ============================================================
# Windows API
# ============================================================

user32 = ctypes.windll.user32

EnumWindowsProc = ctypes.WINFUNCTYPE(
    ctypes.c_bool,
    ctypes.c_void_p,
    ctypes.c_void_p,
)

SW_RESTORE = 9


def _is_window_visible(hwnd):
    return bool(user32.IsWindowVisible(hwnd))


def _get_window_title(hwnd):
    length = user32.GetWindowTextLengthW(hwnd)

    if length <= 0:
        return ""

    buffer = ctypes.create_unicode_buffer(
        length + 1
    )

    user32.GetWindowTextW(
        hwnd,
        buffer,
        length + 1,
    )

    return buffer.value


def _get_window_process_id(hwnd):
    process_id = ctypes.c_ulong()

    user32.GetWindowThreadProcessId(
        hwnd,
        ctypes.byref(process_id),
    )

    return process_id.value


def _restore_and_focus_window(hwnd):
    try:
        # Restore the window if minimized.
        user32.ShowWindow(
            hwnd,
            SW_RESTORE,
        )

        # Bring it to the foreground.
        user32.SetForegroundWindow(hwnd)

        # Bring it to the top of the Z-order.
        user32.BringWindowToTop(hwnd)

        return True

    except Exception:
        return False


def _find_window_by_process(process_id):
    result = {
        "hwnd": None
    }

    def callback(hwnd, _):
        if not _is_window_visible(hwnd):
            return True

        window_process_id = (
            _get_window_process_id(hwnd)
        )

        if window_process_id == process_id:
            result["hwnd"] = hwnd
            return False

        return True

    callback_function = EnumWindowsProc(
        callback
    )

    user32.EnumWindows(
        callback_function,
        0,
    )

    return result["hwnd"]


def _find_window_by_title(keywords):
    if not keywords:
        return None

    keywords = [
        keyword.lower()
        for keyword in keywords
    ]

    result = {
        "hwnd": None
    }

    def callback(hwnd, _):
        if not _is_window_visible(hwnd):
            return True

        title = _get_window_title(hwnd).lower()

        if not title:
            return True

        if any(
            keyword in title
            for keyword in keywords
        ):
            result["hwnd"] = hwnd
            return False

        return True

    callback_function = EnumWindowsProc(
        callback
    )

    user32.EnumWindows(
        callback_function,
        0,
    )

    return result["hwnd"]


def focus_application(
    process=None,
    window_keywords=None,
    timeout=3.0,
):
    """
    Wait for an application's window and bring it
    to the foreground.

    First tries the process PID.

    If no window is found, optionally searches
    visible window titles.
    """

    process_id = None

    if process is not None:
        process_id = process.pid

    end_time = (
        time.time() + timeout
    )

    while time.time() < end_time:

        # --------------------------------------------
        # First: find a window belonging to the
        # process that we launched.
        # --------------------------------------------
        if process_id:
            hwnd = _find_window_by_process(
                process_id
            )

            if hwnd:
                return _restore_and_focus_window(
                    hwnd
                )

        # --------------------------------------------
        # Second: search by application title.
        #
        # This is useful for applications such as
        # Calculator that may create their visible
        # window through another Windows process.
        # --------------------------------------------
        if window_keywords:
            hwnd = _find_window_by_title(
                window_keywords
            )

            if hwnd:
                return _restore_and_focus_window(
                    hwnd
                )

        time.sleep(0.15)

    return False


# ============================================================
# Launch executable
# ============================================================

def launch_executable(
    path: Path,
    app_name: str,
    window_keywords=None,
):
    if not path.exists():
        return {
            "success": False,
            "message": f"{app_name} not found.",
        }

    try:
        process = subprocess.Popen(
            [str(path)]
        )

        # Give Windows a moment to create
        # the application's window.
        focused = focus_application(
            process=process,
            window_keywords=window_keywords,
        )

        if not focused:
            return {
                "success": True,
                "message": (
                    f"{app_name} opened successfully."
                ),
            }

        return {
            "success": True,
            "message": (
                f"{app_name} opened successfully."
            ),
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e),
        }


# ============================================================
# Launch command
# ============================================================

def launch_command(
    command,
    app_name: str,
    window_keywords=None,
):
    try:
        process = subprocess.Popen(
            command
        )

        focused = focus_application(
            process=process,
            window_keywords=window_keywords,
        )

        if not focused:
            return {
                "success": True,
                "message": (
                    f"{app_name} opened successfully."
                ),
            }

        return {
            "success": True,
            "message": (
                f"{app_name} opened successfully."
            ),
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e),
        }