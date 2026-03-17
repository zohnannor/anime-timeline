# Color codes for logging
import enum
import os
import sys


class Color(enum.StrEnum):
    """ANSI color codes for terminal output"""

    RESET = "\033[0m"
    BOLD = "\033[1m"
    BLACK = "\033[30m"
    RED = "\033[31m"
    GREEN = "\033[32m"
    YELLOW = "\033[33m"
    BLUE = "\033[34m"
    MAGENTA = "\033[35m"
    CYAN = "\033[36m"
    WHITE = "\033[37m"
    BRIGHT_BLACK = "\033[90m"
    BRIGHT_RED = "\033[91m"
    BRIGHT_GREEN = "\033[92m"
    BRIGHT_YELLOW = "\033[93m"
    BRIGHT_BLUE = "\033[94m"
    BRIGHT_MAGENTA = "\033[95m"
    BRIGHT_CYAN = "\033[96m"
    BRIGHT_WHITE = "\033[97m"


def should_use_colors(color_arg: str) -> bool:
    """Determine if colors should be used based on args and environment"""

    if color_arg == "always":
        return True
    elif color_arg == "never":
        return False
    elif color_arg == "auto":
        # Auto mode: check TTY and NO_COLOR environment variable
        is_tty = sys.stdout.isatty()
        no_color_env = os.environ.get("NO_COLOR")
        return is_tty and (no_color_env is None)
    return False


class ColorContext:
    """Global color configuration"""

    _enabled: bool = True

    @classmethod
    def set_enabled(cls, enabled: bool):
        cls._enabled = enabled

    @classmethod
    def get_enabled(cls):
        return cls._enabled


def colored(text: str, color_code: str) -> str:
    """Color text if colors are enabled globally"""
    if not ColorContext.get_enabled():
        return text
    return f"{color_code}{text}{Color.RESET}"


def bold(text: str) -> str:
    """Bold text if colors are enabled globally"""
    if not ColorContext.get_enabled():
        return text
    return f"{Color.BOLD}{text}{Color.RESET}"


def main():
    print(colored("Don't run this file", Color.BRIGHT_GREEN))


if __name__ == "__main__":
    main()
