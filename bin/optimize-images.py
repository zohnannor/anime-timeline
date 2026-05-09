#!/usr/bin/env python3

import argparse
import os
import sys
import subprocess
import logging
import shutil
import time
from pathlib import Path
from dataclasses import dataclass
from typing import Callable, Final, final, override
from concurrent.futures import ThreadPoolExecutor

if not __package__:
    from colors import (  # pyright: ignore[reportImplicitRelativeImport]
        Color,
        ColorContext,
        colored,
        should_use_colors,
    )
else:
    from .colors import Color, ColorContext, colored, should_use_colors


class Args(argparse.Namespace):
    """CLI Arguments"""

    TITLE: str | None = None
    force: bool = False
    all: bool = False
    cpu: int = 32
    color: str = "auto"
    log_level: str | None = None


LOG_LEVELS: Final[dict[str, int]] = {
    "debug": logging.DEBUG,
    "info": logging.INFO,
    "warning": logging.WARNING,
    "error": logging.ERROR,
    "critical": logging.CRITICAL,
}


@final
class ColorFormatter(logging.Formatter):
    """Custom formatter with colors for different log levels"""

    LEVEL_COLORS: Final[dict[int, str]] = {
        logging.DEBUG: Color.BRIGHT_BLUE,
        logging.INFO: Color.BRIGHT_GREEN,
        logging.WARNING: Color.BRIGHT_YELLOW,
        logging.ERROR: Color.BRIGHT_RED,
        logging.CRITICAL: f"{Color.BRIGHT_RED}{Color.BOLD}",
    }

    def __init__(
        self, fmt: str | None = None, datefmt: str | None = None
    ) -> None:
        # Default format if none provided
        fmt = fmt or "%(asctime)s - %(levelname)s - %(message)s"
        super().__init__(fmt, datefmt)
        self.colors_enabled = ColorContext.get_enabled()

    @override
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


def resolve_log_level(args: Args, parser: argparse.ArgumentParser) -> int:
    """Resolve the log level from the command line arguments or environment"""

    level_name = args.log_level or os.environ.get("LOG_LEVEL")
    if level_name is None:
        level_name = "debug"

    level = LOG_LEVELS.get(level_name.lower())
    if level is None:
        valid_levels = ", ".join(LOG_LEVELS)
        parser.error(
            f"Invalid log level: {level_name}. Expected one of: {valid_levels}"
        )

    return level


SPECIAL_IMAGES: Final[dict[str, set[str]]] = {
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
    "frieren": {
        "Season_1_key_visual_3.png",
        "Season_2_key_visual_3.png",
        "Season_3_key_visual.png",
        "Chapter_87.png",
    },
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
    "jr": {
        "Jigokuraku_Key_Visual.png",
        "Jigokuraku_Season_2_Key_Visual_2.png",
        "The_vanguard_sailing_to_Kotaku.png",
        "Lord_Tensen_Arc_Infobox.png",
        "Horai_flower_setting.png",
        "The_Survivors_on_Rien's_ship.png",
    },
    "hxh": {
        "Hunter_Exam_Poster.png",
        "2011_Volume_9_Textless.png",
        "Yorknew_City_arc.png",
        "GI_poster_2011.png",
        "Chimera_ant_arc_poster.png",
        "13th_Hunter_Chairman_Election_arc_2011.png",
        "Hunter_x_Hunter_Succession_Contest_arc.png",
    },
    "jojo": {
        "Season_1_1.jpg",
        "Season_1_2.jpg",
        "Season_2_1.jpg",
        "Season_2_2.png",
        "Season_3_1.jpg",
        "Season_3_2.jpg",
        "Season_4_1.png",
        "Season_4_2.jpg",
        "Season_5_1.png",
        "Season_5_2.png",
        "Season_5_3.jpeg",
        "Season_6.jpg",
    },
    "dhd": {
        "Season_1.png",
        "Season_2.png",
    },
}


@final
class ImageProcessor:
    def __init__(
        self,
        title: str,
        config: Config | None = None,
        force_mode: bool = False,
    ) -> None:
        """Initialize the ImageProcessor class for a given title using the
        specified config"""

        self.title = title
        self.force_mode = force_mode
        self.config = config or Config()

        self.source_dir = Path(f"./assets/{title}")
        self.out_dir = Path(f"./public/{title}")
        self.thumb_out_dir = Path(f"./public/{title}-thumbnails")

        if not self.source_dir.is_dir():
            raise FileNotFoundError(
                f"Source directory for '{title}' does not exist: {self.source_dir}"
            )

        self.out_dir.mkdir(parents=True, exist_ok=True)
        self.thumb_out_dir.mkdir(parents=True, exist_ok=True)
        self.special_images = SPECIAL_IMAGES.get(title, set())
        self.errors: list[str] = []
        self.warnings: list[str] = []

        self._check_commands()

    def _check_commands(self) -> None:
        """Check if required commands are available"""
        for cmd in ["magick", "cwebp"]:
            if not shutil.which(cmd):
                raise RuntimeError(
                    colored(
                        f"Required command not found: {cmd}", Color.BRIGHT_RED
                    )
                )

    def is_special_image(self, path: Path) -> bool:
        """Check if an image is special (should be processed separately)"""
        return path.name in self.special_images

    def run_command(self, cmd: list[str]) -> bool:
        """Run a shell command and handle errors"""
        try:
            result = subprocess.run(
                cmd, text=True, capture_output=True, check=False
            )
            return result.returncode == 0
        except Exception as e:
            logging.error(f"Error running command `{' '.join(cmd)}`: {e}")
            return False

    def process_files(
        self,
        *,
        header: str,
        files: list[Path],
        no_files_message: str,
        process_single: Callable[[Path], bool],
        image_kind: str,
        no_files_is_warning: bool = False,
    ) -> bool:
        """Process a list of files, returns `True` if all succeeded"""

        style = f"{Color.BRIGHT_MAGENTA}{Color.BOLD}"
        logging.info(colored("=" * 60, style))
        logging.info(colored(f"  {header}", style))
        logging.info(colored("=" * 60, style))

        if not files:
            if no_files_is_warning:
                logging.warning(colored(no_files_message, Color.BRIGHT_YELLOW))
                self.warnings.append(no_files_message)
            else:
                logging.info(colored(no_files_message, Color.BRIGHT_YELLOW))
            return True

        start = time.perf_counter()
        with ThreadPoolExecutor(max_workers=self.config.cpu_count) as executor:
            results = list(executor.map(process_single, files))
        elapsed = time.perf_counter() - start

        successful = sum(1 for r in results if r)
        status_color = (
            Color.BRIGHT_GREEN
            if successful == len(files)
            else Color.BRIGHT_YELLOW
        )
        logging.info(
            colored(
                f"Completed converting {successful}/{len(files)} {image_kind}",
                status_color,
            )
            + colored(
                f" (took {_format_duration(elapsed)})", Color.BRIGHT_BLACK
            )
        )

        return successful == len(files)

    def process_single_file(
        self,
        *,
        path: str | os.PathLike[str],
        dest: str | os.PathLike[str],
        should_skip: Callable[[], bool],
        skip_reason: str,
        commands: list[list[str]],
        on_failure: Callable[[], None] | None = None,
        error_message: str | None = None,
        success_message: str,
        fail_message: str,
    ) -> bool:
        """Process a single file"""

        path = Path(path)
        dest = Path(dest)

        if should_skip():
            logging.debug(
                colored(
                    f"Skipping {skip_reason}: {path.name}", Color.BRIGHT_BLACK
                )
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
                colored(
                    f"{error_message or 'Error'} {path}: {e}", Color.BRIGHT_RED
                )
            )
            success = False

        if success:
            logging.debug(
                f"{colored(success_message, Color.BRIGHT_GREEN)}: {path.name} "
                + f"{colored('->', Color.BRIGHT_MAGENTA)} {dest.name}"
            )
            return True
        else:
            error_msg = f"{fail_message}: {path.name}"
            logging.error(f"{colored(error_msg, Color.BRIGHT_RED)}")
            self.errors.append(error_msg)
            if on_failure and dest.exists():
                on_failure()
            return False

    @staticmethod
    def _has_original(path: Path) -> bool:
        """Check if the original image exists for a given WebP/GIF path"""
        return any(
            path.with_suffix(ext).exists() for ext in [".png", ".jpg", ".jpeg"]
        )

    def convert_orphan_images(self) -> bool:
        """
        Handle orphan WebP/GIF in the source directory.
        - Local: losslessly convert to PNG, then delete the original orphan.
        - CI (GitHub Actions): delete the orphan to avoid cache pollution.
        """

        orphan_files = find_files(self.source_dir, ["webp", "gif"])

        if os.environ.get("GITHUB_ACTIONS"):
            logging.debug(
                colored(
                    "Running in CI (GitHub Actions) -  deleting orphan sources",
                    Color.BRIGHT_YELLOW,
                )
            )

            # CI: delete orphan images
            def _delete_orphan_single(path: Path) -> bool:
                # Skip if a proper original already exists (not an orphan)
                if self._has_original(path):
                    return True  # Not an orphan - skip gracefully
                try:
                    path.unlink()
                    logging.debug(
                        colored(f"Deleted orphan: {path}", Color.BRIGHT_YELLOW)
                    )
                    return True
                except Exception as e:
                    error_msg = f"Failed to delete orphan {path}: {e}"
                    logging.error(colored(error_msg, Color.BRIGHT_RED))
                    self.errors.append(error_msg)
                    return False

            return self.process_files(
                header="Deleting orphan source images (CI)",
                files=orphan_files,
                no_files_message="No orphan sources to delete",
                process_single=_delete_orphan_single,
                image_kind="orphan images",
            )

        # Local: convert orphans to PNG and remove them from the source dir
        def _convert_orphan_single(path: Path) -> bool:
            dest = path.with_suffix(".png")
            success = self.process_single_file(
                path=path,
                dest=dest,
                # Skip if already converted or has original
                should_skip=lambda: self._has_original(path),
                skip_reason="(has original)",
                commands=[["magick", f"{path}[0]", "-strip", str(dest)]],
                success_message="✅ Converted orphan image",
                fail_message="❌ Failed to convert orphan",
            )
            if success:
                # Remove the orphan source so only the PNG remains
                try:
                    path.unlink()
                    logging.debug(
                        colored(
                            f"Removed orphan source after conversion: {path}",
                            Color.BRIGHT_YELLOW,
                        )
                    )
                except Exception as e:
                    logging.error(
                        colored(
                            f"Could not remove orphan source {path}: {e}",
                            Color.BRIGHT_RED,
                        )
                    )
            return success

        return self.process_files(
            header="Converting orphan source images to PNG",
            files=orphan_files,
            no_files_message="No orphan source images to convert",
            process_single=_convert_orphan_single,
            image_kind="orphan images",
        )

    def generate_thumbnails(self) -> bool:
        """Generate thumbnails from originals"""

        def _generate_thumbnail_single(path: Path) -> bool:
            filename = path.relative_to(self.source_dir)
            dest = self.thumb_out_dir / filename.with_suffix(".webp")
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

        return self.process_files(
            header="Generating thumbnails",
            files=find_files(self.source_dir, ["png", "jpg", "jpeg"]),
            no_files_message="No source images found for thumbnail generation",
            process_single=_generate_thumbnail_single,
            image_kind="thumbnails",
            no_files_is_warning=True,
        )

    def process_special_images(self) -> bool:
        """Process special images with custom settings"""

        if not self.special_images:
            logging.info(
                colored(
                    f"No special images for title: {self.title}",
                    Color.BRIGHT_YELLOW,
                )
            )
            return True

        def _process_special_single(filename: Path) -> bool:
            path = self.source_dir / filename
            dest = self.out_dir / filename.with_suffix(".webp")
            return self.process_single_file(
                path=path,
                dest=dest,
                # Skip if up to date and not force mode
                should_skip=lambda: not self.force_mode
                and dest.exists()
                and dest.stat().st_mtime > path.stat().st_mtime,
                skip_reason="special (up to date)",
                commands=[
                    [
                        "magick",
                        str(path),
                        "-strip",
                        "-quality",
                        "80",
                        f"WEBP:{dest}",
                    ]
                ],
                success_message="✨ Processed special image",
                fail_message="❌ Failed to process special image",
            )

        return self.process_files(
            header="Processing special images",
            files=sorted([Path(p) for p in self.special_images]),
            no_files_message=f'No special images defined for title "{self.title}"',
            process_single=_process_special_single,
            image_kind="special images",
        )

    def process_main_images(self) -> bool:
        """Create optimized WebP versions (excluding special images)"""

        def _process_main_single(path: Path) -> bool:
            filename = path.relative_to(self.source_dir)
            dest = self.out_dir / filename.with_suffix(".webp")

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

        return self.process_files(
            header="Creating optimized WebP versions",
            files=[
                p
                for p in find_files(self.source_dir, ["png", "jpg", "jpeg"])
                if not self.is_special_image(p)
            ],
            no_files_message="No main images to process",
            process_single=_process_main_single,
            image_kind="main images",
            no_files_is_warning=True,
        )

    def get_size_report(self) -> None:
        style = f"{Color.BRIGHT_BLUE}{Color.BOLD}"
        logging.info(colored("=" * 60, style))
        logging.info(colored("  Size Report", style))
        logging.info(colored("=" * 60, style))

        main_webp_files = find_files(self.out_dir, ["webp"])
        thumb_webp_files = find_files(self.thumb_out_dir, ["webp"])

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

    def _format_size(self, size_bytes: int | float) -> str:
        """Format file size in human-readable format"""

        size = float(size_bytes)
        for unit in ["B", "KB", "MB", "GB"]:
            if size < 1024.0:
                return f"{size:.2f} {unit}"
            size /= 1024.0
        return f"{size:.2f} TB"

    def process_all(self) -> str | None:
        """Run the complete image optimization pipeline, returns name of first
        failed step or `None`"""

        logging.info(f"📂 Title: {colored(self.title, Color.BRIGHT_CYAN)}")
        logging.info(
            f"⚡ Force: {colored(str(self.force_mode), Color.BRIGHT_YELLOW)}"
        )
        logging.info(
            f"📁 Source directory: {colored(str(self.source_dir), Color.BRIGHT_BLUE)}"
        )
        logging.info(
            f"📁 Output directory: {colored(str(self.out_dir), Color.BRIGHT_BLUE)}"
        )
        logging.info(
            f"📁 Thumbnails directory: {colored(str(self.thumb_out_dir), Color.BRIGHT_BLUE)}"
        )

        # Count source images and existing WebP files
        source_files = len(find_files(self.source_dir, ["png", "jpg", "jpeg"]))
        webp_files = len(find_files(self.out_dir, ["webp"]))

        logging.info(
            f"Source images found: {colored(str(source_files), Color.BRIGHT_CYAN)}"
        )
        logging.info(
            f"Existing WebP files: {colored(str(webp_files), Color.BRIGHT_CYAN)}"
        )

        steps: list[tuple[str, Callable[[], bool]]] = [
            ("orphan conversion", self.convert_orphan_images),
            ("thumbnail generation", self.generate_thumbnails),
            ("special image processing", self.process_special_images),
            ("main image optimization", self.process_main_images),
        ]

        for step_name, step_fn in steps:
            if not step_fn():
                return step_name
            logging.info("")

        self.get_size_report()
        return None


def find_all_titles() -> list[str]:
    """Find all titles in the assets directory"""

    assets_dir = Path("./assets")
    if not assets_dir.exists():
        return []
    return sorted(
        [
            item.name
            for item in assets_dir.iterdir()
            if item.is_dir()
            and not item.name.endswith("-thumbnails")
            and not item.name.startswith(".")
        ]
    )


def find_files(path: str | os.PathLike[str], patterns: list[str]) -> list[Path]:
    """Find files matching patterns in specified directory"""
    return sorted(
        list(
            {file for ext in patterns for file in Path(path).rglob(f"*.{ext}")}
        )
    )


def _format_duration(seconds: float) -> str:
    """Format duration in seconds as "XXs" or "XXm XXs" if longer than 60
    seconds"""
    if seconds < 60:
        return f"{seconds:.1f}s"
    return f"{seconds // 60:.0f}m {seconds % 60:.0f}s"


def process_single_title(
    title: str, config: Config, force_mode: bool = False
) -> tuple[bool, list[str], list[str]]:
    """Process a single title, returns `(success, error_messages, warnings)`"""

    style = f"{Color.BRIGHT_CYAN}{Color.BOLD}"
    logging.info(colored("=" * 80, style))
    logging.info(colored(f'  Processing Title: "{title}"', style))
    logging.info(colored("=" * 80, style))
    try:
        processor = ImageProcessor(title, config, force_mode)
        title_start = time.perf_counter()
        failed_step = processor.process_all()
        title_elapsed = time.perf_counter() - title_start

        logging.info(
            colored(
                f"Processed {title} in {_format_duration(title_elapsed)}",
                Color.BRIGHT_BLACK,
            )
        )

        if failed_step:
            logging.error(
                colored(
                    f'❌ Error processing "{title}" during step: {failed_step}',
                    Color.BRIGHT_RED,
                )
            )
            return False, processor.errors, processor.warnings
        return True, [], processor.warnings
    except Exception as e:
        msg = f'Error processing "{title}": {e}'
        logging.error(colored(f"❌ {msg}", Color.BRIGHT_RED))
        return False, [msg], []


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Optimize manga/anime images",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    _ = parser.add_argument(
        "TITLE", nargs="?", help="Manga/Anime title (e.g. `csm`)"
    )
    _ = parser.add_argument(
        "--force",
        action="store_true",
        help="Force reprocessing of all images (default: false)",
    )
    _ = parser.add_argument(
        "--all",
        action="store_true",
        help="Process all anime titles (default: false)",
    )
    _ = parser.add_argument(
        "--cpu",
        type=int,
        default=os.cpu_count(),
        help="Number of parallel processes (default: number of CPUs)",
    )
    _ = parser.add_argument(
        "--color",
        choices=["auto", "always", "never"],
        default="auto",
        help="Control color output (auto, always, never). "
        + "This program respects the NO_COLOR environment variable. "
        + "(default: auto)",
    )
    _ = parser.add_argument(
        "--log-level",
        choices=LOG_LEVELS.keys(),
        help="Minimum log level to show. Can also be set with LOG_LEVEL.",
    )

    args = parser.parse_args(namespace=Args())

    colors_enabled = should_use_colors(args.color)
    ColorContext.set_enabled(colors_enabled)

    # Logger setup
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(
        ColorFormatter(datefmt=colored("%Y-%m-%d %H:%M:%S", Color.BRIGHT_BLACK))
    )
    logging.basicConfig(
        level=resolve_log_level(args, parser),
        handlers=[handler],
    )

    config = Config(cpu_count=args.cpu)

    if args.all:
        titles = find_all_titles()
        if not titles:
            logging.error(
                colored(
                    "No anime titles found in ./assets directory",
                    Color.BRIGHT_RED,
                )
            )
            sys.exit(1)

        logging.info(colored("Found titles:", Color.BRIGHT_CYAN))
        for title in titles:
            logging.info(colored(f"  - {title}", Color.BRIGHT_CYAN))
        logging.info(colored(f"Force mode: {args.force}", Color.BRIGHT_YELLOW))
        logging.info(colored(f"CPU count: {args.cpu}", Color.BRIGHT_YELLOW))

        overall_start = time.perf_counter()

        source_count = 0
        webp_count = 0
        for title in titles:
            source_dir = Path(f"./assets/{title}")
            main_dir = Path(f"./public/{title}")
            if main_dir.exists():
                source_count += len(
                    find_files(source_dir, ["png", "jpg", "jpeg"])
                )
                webp_count += len(find_files(main_dir, ["webp"]))

        logging.info(
            colored(f"Source images found: {source_count}", Color.BRIGHT_CYAN)
        )
        logging.info(
            colored(f"Existing WebP files: {webp_count}", Color.BRIGHT_CYAN)
        )
        logging.info("")

        successes = 0
        all_errors: dict[str, list[str]] = {}
        all_warnings: dict[str, list[str]] = {}
        for title in titles:
            ok, errors, warnings = process_single_title(
                title, config, args.force
            )
            if ok:
                successes += 1
            else:
                all_errors[title] = errors
            if warnings:
                all_warnings[title] = warnings
            logging.info("")

        final_color = (
            Color.BRIGHT_GREEN
            if successes == len(titles)
            else Color.BRIGHT_YELLOW
        )

        overall_elapsed = time.perf_counter() - overall_start
        logging.info(
            colored(
                f"✅ Successfully processed {successes}/{len(titles)} titles!",
                final_color,
            )
            + colored(
                f" (took {_format_duration(overall_elapsed)})",
                Color.BRIGHT_BLACK,
            )
        )

        if all_warnings:
            logging.warning(colored("⚠️  Warnings:", Color.BRIGHT_YELLOW))
            for title, title_warnings in all_warnings.items():
                for w in title_warnings:
                    logging.warning(
                        colored(f"  {title}: {w}", Color.BRIGHT_YELLOW)
                    )

        if successes < len(titles):
            logging.error(
                colored(
                    "❌ Errors encountered:",
                    Color.BRIGHT_RED,
                )
            )
            for title, title_errors in all_errors.items():
                for err in title_errors:
                    logging.error(
                        colored(f"  {title}: {err}", Color.BRIGHT_RED)
                    )
            sys.exit(1)

    elif args.TITLE:
        ok, errors, warnings = process_single_title(
            args.TITLE, config, args.force
        )
        if warnings:
            logging.warning(colored("⚠️  Warnings:", Color.BRIGHT_YELLOW))
            for w in warnings:
                logging.warning(
                    colored(f"  {args.TITLE}: {w}", Color.BRIGHT_YELLOW)
                )
        if not ok:
            logging.error(colored("❌ Errors encountered:", Color.BRIGHT_RED))
            for err in errors:
                logging.error(
                    colored(f"  {args.TITLE}: {err}", Color.BRIGHT_RED)
                )
            sys.exit(1)
    else:
        parser.print_help()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(colored("\nOperation cancelled by user.", Color.BRIGHT_RED))
        sys.exit(1)
