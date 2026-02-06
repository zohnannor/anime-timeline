#!/usr/bin/env python3

import argparse
import enum
import os
import sys
import subprocess
import logging
import shutil
from pathlib import Path
from dataclasses import dataclass
from typing import Callable, List, Dict, Optional, Final
from concurrent.futures import ThreadPoolExecutor


# Color codes for logging
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


class ColorFormatter(logging.Formatter):
    """Custom formatter with colors for different log levels"""

    LEVEL_COLORS: Final[dict[int, str]] = {
        logging.DEBUG: Color.BRIGHT_BLUE,
        logging.INFO: Color.BRIGHT_GREEN,
        logging.WARNING: Color.BRIGHT_YELLOW,
        logging.ERROR: Color.BRIGHT_RED,
        logging.CRITICAL: f"{Color.BRIGHT_RED}{Color.BOLD}",
    }

    def __init__(self, fmt: Optional[str] = None, datefmt: Optional[str] = None):
        # Default format if none provided
        fmt = fmt or "%(asctime)s - %(levelname)s - %(message)s"
        super().__init__(fmt, datefmt)
        self.colors_enabled = ColorContext.get_enabled()

    def format(self, record: logging.LogRecord) -> str:
        orig_levelname = record.levelname
        color_code = self.LEVEL_COLORS.get(record.levelno)

        if color_code and self.colors_enabled:
            record.levelname = colored(orig_levelname, color_code)

        # Use super().format to handle the logic efficiently
        result = super().format(record)

        # Restore original levelname for other potential handlers
        record.levelname = orig_levelname
        return result


@dataclass
class Config:
    cpu_count: int = 32
    main_quality: int = 50
    thumb_quality: int = 10
    main_width: int = 800
    thumb_width: int = 100


SPECIAL_IMAGES: Final[Dict[str, set[str]]] = {
    "csm": {
        "Chainsaw_Man_Anime_Key_Visual_1.png",
        "Volume_01_Pochita_Sketch_2.png",
        "Denji_fighting_zombies.png",
        "Denji_attacking_the_Bat_Devil.png",
        "Denji_fighting_the_Eternity_Devil.png",
        "Denji_engaging_the_Katana_Man.png",
        "Denji_engaging_Reze.png",
        "Denji_engaging_Santa_Claus.png",
        "Chainsaw_vs_Gun_Fiend.png",
        "Hybrids_attacking_Chainsaw.png",
        "Asa_vs_Yuko_as_Justice_Devil.png",
        "Dating_Denji_arc_infobox_picture.png",
        "Denji_tears_through_the_Falling_Devil.png",
        "Denji_and_Miri_impale_each_other.png",
        "Chainsaw_vs_Aging.png",
        "Pochita_surrounded_by_Yoru's_Devil_Army.png",
        "Chainsaw_Man_TV_Anime_Key_Visual_2.png",
    },
    "berserk": {
        "Berserk_Anime_Box_Art.png",
        "V3-Cover_Art-Manga.png",
        "V5-Cover_Art-Manga.png",
        "V18-Cover_Art-Manga.png",
        "V34-Cover_Art-Manga.png",
        "V38-Guts-Manga.png",
        "Berserk_2016_Premier_visual_art_version_2.png",
        "Berserk_2017_Anime_Key_Visual.png",
    },
    "frieren": {"Season_1_key_visual_3.png", "Season_2_key_visual_3.png"},
    "eva": {"End_of_Evangelion_poster.jpg", "Neon_Genesis_Evangelion_logo.jpg"},
    "aot": {
        "Attack_on_Titan_Season_1.png",
        "Attack_on_Titan_Season_2_Official_Poster.png",
        "Attack_on_Titan_Season_3.png",
        "Attack_on_Titan_Season_3_sixth_key_visual_(clean).png",
        "Attack_on_Titan_The_Final_Season.jpg",
        "Attack_on_Titan_The_Final_Season_Part_2_-_Key_Visual_6.png",
        "Attack_on_Titan_Final_Season_Part_3_key_visual_8_(textless).png",
        "Attack_on_Titan_Final_Season_Part_4_key_visual_9_(no_quotation).png",
        "The_Female_Titan_battle.png",
        "Clash_of_the_Titans.png",
        "Erwin_and_Pixis_speaking.png",
        "Eren_returns_home.png",
        "Volume_23_Cover_-_Clean_Version.png",
        "Volume_29_Cover_-_Clean_Version.png",
    },
    "opm": {
        "Heroes_Spread.png",
        "One-Punch_Man_TV_Anime_Key_Visual.png",
        "One-Punch_Man_Anime_Season_2_Key_Visual.png",
        "One-Punch_Man_Season_3_Key_Visual_2.png",
    },
    "deathnote": {"DEATH_NOTE_anime.png"},
}


class ImageProcessor:
    def __init__(self, title: str, config: Config, force_mode: bool = False):
        """Initialize the ImageProcessor class"""

        self.title = title
        self.force_mode = force_mode
        self.config = config or Config()

        self.main_dir = Path(f"./public/{title}")
        self.thumb_dir = Path(f"./public/{title}-thumbnails")

        if not self.main_dir.exists():
            raise FileNotFoundError(
                f"Directory for '{title}' does not exist: {self.main_dir}"
            )

        self.thumb_dir.mkdir(parents=True, exist_ok=True)
        self.special_images = SPECIAL_IMAGES.get(title, set())

        self._check_commands()

    def _check_commands(self):
        """Check if required commands are available"""
        for cmd in ["magick", "cwebp"]:
            if not shutil.which(cmd):
                raise RuntimeError(
                    colored(f"Required command not found: {cmd}", Color.BRIGHT_RED)
                )

    def is_special_image(self, path: Path) -> bool:
        """Check if an image is special (should be processed separately)"""
        return path.name in self.special_images

    def run_command(self, cmd: List[str]) -> bool:
        """Run a shell command and handle errors"""
        try:
            result = subprocess.run(cmd, text=True, capture_output=True, check=False)
            return result.returncode == 0
        except Exception as e:
            logging.error(f"Error running command `{' '.join(cmd)}`: {e}")
            return False

    def find_files(self, patterns: List[str]) -> List[Path]:
        """Find files matching patterns in main directory"""
        return sorted(
            list({file for ext in patterns for file in self.main_dir.rglob(f"*.{ext}")})
        )

    def process_files(
        self,
        *,
        header: str,
        files: List[Path],
        no_files_message: str,
        process_single: Callable[[Path], bool],
        image_kind: str,
    ):
        """Process a list of files"""

        style = f"{Color.BRIGHT_MAGENTA}{Color.BOLD}"
        logging.info(colored("=" * 60, style))
        logging.info(colored(f"  {header}", style))
        logging.info(colored("=" * 60, style))

        if not files:
            logging.info(colored(no_files_message, Color.BRIGHT_YELLOW))
            return

        with ThreadPoolExecutor(max_workers=self.config.cpu_count) as executor:
            results = list(executor.map(process_single, files))

        successful = sum(1 for r in results if r)
        status_color = (
            Color.BRIGHT_GREEN if successful == len(files) else Color.BRIGHT_YELLOW
        )
        logging.info(
            colored(
                f"Completed converting {successful}/{len(files)} {image_kind}",
                status_color,
            )
        )

    def process_single_file(
        self,
        *,
        path: Path,
        dest: Path,
        should_skip: Callable[[], bool],
        skip_reason: str,
        commands: List[List[str]],
        on_failure: Optional[Callable[[], None]] = None,
        error_message: Optional[str] = None,
        success_message: str,
        fail_message: str,
    ) -> bool:
        """Process a single file"""

        if should_skip():
            logging.debug(
                colored(f"Skipping {skip_reason}: {path.name}", Color.BRIGHT_BLACK)
            )
            return True

        success = True
        try:
            for cmd in commands:
                if not self.run_command(cmd):
                    success = False
                    break
        except Exception as e:
            logging.error(
                colored(f"{error_message or 'Error'} {path}: {e}", Color.BRIGHT_RED)
            )
            success = False

        if success:
            logging.debug(
                f"{colored(success_message, Color.BRIGHT_GREEN)}: {path.name} {colored('->', Color.BRIGHT_MAGENTA)} {dest.name}"
            )
            return True
        else:
            logging.error(f"{colored(fail_message, Color.BRIGHT_RED)}: {path.name}")
            if on_failure and dest.exists():
                on_failure()
            return False

    def convert_orphan_images(self):
        """Convert orphan WebP and GIF images to PNG (if no PNG/JPG/JPEG exists)"""

        def _convert_orphan_single(path: Path) -> bool:
            dest = path.with_suffix(".png")
            return self.process_single_file(
                path=path,
                dest=dest,
                # Skip if already converted or has original
                should_skip=lambda: any(
                    path.with_suffix(ext).exists() for ext in [".png", ".jpg", ".jpeg"]
                ),
                skip_reason="(has original)",
                commands=[["magick", f"{path}[0]", "-strip", str(dest)]],
                success_message="✅ Converted orphan image",
                fail_message="❌ Failed to convert orphan image",
            )

        self.process_files(
            header="Converting orphan images to PNG",
            files=self.find_files(["webp", "gif"]),
            no_files_message="No orphan images to convert",
            process_single=_convert_orphan_single,
            image_kind="orphan images",
        )

    def generate_thumbnails(self):
        """Generate thumbnails from originals"""

        def _generate_thumbnail_single(path: Path) -> bool:
            dest = self.thumb_dir / path.relative_to(self.main_dir).with_suffix(".webp")
            return self.process_single_file(
                path=path,
                dest=dest,
                # Skip if up to date and not force mode
                should_skip=lambda: not self.force_mode
                and dest.exists()
                and dest.stat().st_mtime > path.stat().st_mtime,
                skip_reason="thumbnail (up to date)",
                commands=[
                    [
                        "magick",
                        str(path),
                        "-resize",
                        f"{self.config.thumb_width}>",
                        "-strip",
                        "-quality",
                        str(self.config.thumb_quality),
                        str(dest),
                    ]
                ],
                success_message="✅ Generated thumbnail",
                fail_message="❌ Failed to generate thumbnail",
            )

        self.process_files(
            header="Generating thumbnails",
            files=self.find_files(["png", "jpg", "jpeg"]),
            no_files_message="No images found for thumbnail generation",
            process_single=_generate_thumbnail_single,
            image_kind="thumbnails",
        )

    def process_special_images(self):
        """Process special images with custom settings"""

        if not self.special_images:
            logging.info(
                colored(
                    f"No special images for title: {self.title}", Color.BRIGHT_YELLOW
                )
            )
            return

        def _process_special_single(image_name: Path) -> bool:
            path = self.main_dir / image_name
            dest = path.with_suffix(".webp")
            return self.process_single_file(
                path=path,
                dest=dest,
                # Skip if up to date and not force mode
                should_skip=lambda: not self.force_mode
                and dest.exists()
                and dest.stat().st_mtime > path.stat().st_mtime,
                skip_reason="special (up to date)",
                commands=[
                    ["magick", str(path), "-strip", "-quality", "80", f"WEBP:{dest}"]
                ],
                success_message="✨ Processed special image",
                fail_message="❌ Failed to process special image",
            )

        self.process_files(
            header="Processing special images",
            files=sorted([Path(p) for p in self.special_images]),
            no_files_message=f'No special images defined for title "{self.title}"',
            process_single=_process_special_single,
            image_kind="special images",
        )

    def process_main_images(self):
        """Create optimized WebP versions (excluding special images)"""

        def _process_main_single(path: Path) -> bool:
            dest = path.with_suffix(".webp")
            return self.process_single_file(
                path=path,
                dest=dest,
                # Skip if up to date and not force mode
                should_skip=lambda: not self.force_mode
                and dest.exists()
                and dest.stat().st_mtime > path.stat().st_mtime,
                skip_reason="(up to date)",
                commands=[
                    # Create WebP version with magick first
                    [
                        "magick",
                        str(path),
                        "-resize",
                        f"{self.config.main_width}>",
                        "-strip",
                        "-quality",
                        "100",
                        str(dest),
                    ],
                    # Then optimize with cwebp (overwriting the same file)
                    [
                        "cwebp",
                        "-q",
                        str(self.config.main_quality),
                        "-m",
                        "6",
                        "-sharp_yuv",
                        str(dest),
                        "-o",
                        str(dest),
                    ],
                ],
                on_failure=lambda: dest.unlink(missing_ok=True),
                error_message="Error optimizing",
                success_message="✅ Optimized main image",
                fail_message="❌ Failed to optimize main image",
            )

        self.process_files(
            header="Creating optimized WebP versions",
            files=[
                p
                for p in self.find_files(["png", "jpg", "jpeg"])
                if not self.is_special_image(p)
            ],
            no_files_message="No main images to process",
            process_single=_process_main_single,
            image_kind="main images",
        )

    def get_size_report(self):
        style = f"{Color.BRIGHT_BLUE}{Color.BOLD}"
        logging.info(colored("=" * 60, style))
        logging.info(colored("  Size Report", style))
        logging.info(colored("=" * 60, style))

        main_webp_files = list(self.main_dir.rglob("*.webp"))
        thumb_webp_files = list(self.thumb_dir.rglob("*.webp"))

        main_size = sum(f.stat().st_size for f in main_webp_files)
        thumb_size = sum(f.stat().st_size for f in thumb_webp_files)

        logging.info(
            f"📦 Main images size (WebP versions): {colored(self._format_size(main_size), Color.BRIGHT_GREEN)}"
        )
        logging.info(
            f"🖼️  Thumbnails size (WebP): {colored(self._format_size(thumb_size), Color.BRIGHT_GREEN)}"
        )
        logging.info(
            f"📊 Main WebP files count: {colored(str(len(main_webp_files)), Color.BRIGHT_CYAN)}"
        )
        logging.info(
            f"📊 Thumbnail WebP files count: {colored(str(len(thumb_webp_files)), Color.BRIGHT_CYAN)}"
        )

    def _format_size(self, size_bytes: int) -> str:
        """Format file size in human-readable format"""

        size = float(size_bytes)
        for unit in ["B", "KB", "MB", "GB"]:
            if size < 1024.0:
                return f"{size:.2f} {unit}"
            size /= 1024.0
        return f"{size:.2f} TB"

    def process_all(self):
        """Run the complete image optimization pipeline"""

        style = f"{Color.BRIGHT_GREEN}{Color.BOLD}"
        logging.info(colored("=" * 80, style))
        logging.info(colored(f"  Processing: {self.title}", style))
        logging.info(colored("=" * 80, style))

        logging.info(f"📂 Title: {colored(self.title, Color.BRIGHT_CYAN)}")
        logging.info(f"⚡ Force: {colored(str(self.force_mode), Color.BRIGHT_YELLOW)}")
        logging.info(
            f"📁 Main directory: {colored(str(self.main_dir), Color.BRIGHT_BLUE)}"
        )
        logging.info(
            f"📁 Thumbnails directory: {colored(str(self.thumb_dir), Color.BRIGHT_BLUE)}"
        )

        # Count source images and existing WebP files
        source_files = self.find_files(["png", "jpg", "jpeg"])
        webp_files = list(self.main_dir.rglob("*.webp"))

        logging.info(
            f"Source images found: {colored(str(len(source_files)), Color.BRIGHT_CYAN)}"
        )
        logging.info(
            f"Existing WebP files: {colored(str(len(webp_files)), Color.BRIGHT_CYAN)}"
        )

        self.convert_orphan_images()
        logging.info("")
        self.generate_thumbnails()
        logging.info("")
        self.process_special_images()
        logging.info("")
        self.process_main_images()
        logging.info("")

        self.get_size_report()


def find_all_titles() -> List[str]:
    """Find all anime titles in the public directory"""

    public_dir = Path("./public")
    if not public_dir.exists():
        return []

    return sorted(
        [
            item.name
            for item in public_dir.iterdir()
            if item.is_dir()
            and not item.name.endswith("-thumbnails")
            and item.name not in ["index.html"]
            and not item.name.startswith(".")
        ]
    )


def process_single_title(title: str, config: Config, force_mode: bool = False) -> bool:
    """Process a single title"""

    style = f"{Color.BRIGHT_CYAN}{Color.BOLD}"
    logging.info(colored("=" * 80, style))
    logging.info(colored(f'  Processing Title: "{title}"', style))
    logging.info(colored("=" * 80, style))
    try:
        processor = ImageProcessor(title, config, force_mode)
        processor.process_all()
        return True
    except Exception as e:
        logging.error(colored(f'❌ Error processing "{title}": {e}', Color.BRIGHT_RED))
        return False


def main():
    parser = argparse.ArgumentParser(
        description="Optimize manga/anime images",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("TITLE", nargs="?", help="Manga/Anime title")
    parser.add_argument(
        "--force",
        action="store_true",
        help="Force reprocessing of all images (default: false)",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Process all anime titles (default: false)",
    )
    parser.add_argument(
        "--cpu",
        type=int,
        default=os.cpu_count(),
        help="Number of parallel processes (default: number of CPUs)",
    )
    parser.add_argument(
        "--color",
        choices=["auto", "always", "never"],
        default="auto",
        help="Control color output (auto, always, never). "
        + "This program respects the NO_COLOR environment variable. "
        + "(default: auto)",
    )

    args = parser.parse_args()

    colors_enabled = should_use_colors(args.color)
    ColorContext.set_enabled(colors_enabled)

    # Logger setup
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(
        ColorFormatter(datefmt=colored("%Y-%m-%d %H:%M:%S", Color.BRIGHT_BLACK))
    )
    logging.basicConfig(
        level=logging.DEBUG,
        handlers=[handler],
    )

    config = Config(cpu_count=args.cpu)

    if args.all:
        titles = find_all_titles()
        if not titles:
            logging.error(
                colored("No anime titles found in ./public directory", Color.BRIGHT_RED)
            )
            sys.exit(1)

        logging.info(colored("Found titles:", Color.BRIGHT_CYAN))
        for title in titles:
            logging.info(colored(f"  - {title}", Color.BRIGHT_CYAN))
        logging.info(colored(f"Force mode: {args.force}", Color.BRIGHT_YELLOW))
        logging.info(colored(f"CPU count: {args.cpu}", Color.BRIGHT_YELLOW))

        source_count = 0
        webp_count = 0
        for title in titles:
            main_dir = Path(f"./public/{title}")
            if main_dir.exists():
                source_count += (
                    len(list(main_dir.rglob("*.png")))
                    + len(list(main_dir.rglob("*.jpg")))
                    + len(list(main_dir.rglob("*.jpeg")))
                )
                webp_count += len(list(main_dir.rglob("*.webp")))

        logging.info(colored(f"Source images found: {source_count}", Color.BRIGHT_CYAN))
        logging.info(colored(f"Existing WebP files: {webp_count}", Color.BRIGHT_CYAN))
        logging.info("")

        success_count = 0
        for title in titles:
            if process_single_title(title, config, args.force):
                success_count += 1
            logging.info("")

        final_color = (
            Color.BRIGHT_GREEN if success_count == len(titles) else Color.BRIGHT_YELLOW
        )
        logging.info(
            colored(
                f"✅ Successfully processed {success_count}/{len(titles)} titles!",
                final_color,
            )
        )
    elif args.TITLE:
        process_single_title(args.TITLE, config, args.force)
    else:
        parser.print_help()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(colored("\nOperation cancelled by user.", Color.BRIGHT_RED))
        sys.exit(1)
