#!/usr/bin/env python3

import argparse
import sys
from pathlib import Path
from dataclasses import dataclass
from typing import List, Dict, Optional
import subprocess
import logging
from concurrent.futures import ThreadPoolExecutor
import shutil


# Configuration
@dataclass
class Config:
    cpu_count: int = 32
    main_quality: int = 50
    thumb_quality: int = 10
    main_width: int = 800
    thumb_width: int = 100


SPECIAL_IMAGES: Dict[str, set[str]] = {
    "csm": {"Chainsaw_Man_Anime_Key_Visual_1.png"},
    "berserk": {
        "Berserk_Anime_Box_Art.png",
        "V3-Cover_Art-Manga.png",
        "V5-Cover_Art-Manga.png",
        "V18-Cover_Art-Manga.png",
        "V34-Cover_Art-Manga.png",
        "V38-Guts-Manga.png",
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
}


class ImageProcessor:
    def __init__(
        self, title: str, force_mode: bool = False, config: Optional[Config] = None
    ):
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

        # Check for required commands
        self._check_commands()

    def _check_commands(self):
        """Check if required commands are available"""
        for cmd in ["magick", "cwebp"]:
            if not shutil.which(cmd):
                raise RuntimeError(f"Required command not found: {cmd}")

    def is_special_image(self, path: Path) -> bool:
        """Check if an image is special (should be processed separately)"""
        return path.name in self.special_images

    def run_command(self, cmd: List[str]) -> bool:
        """Run a shell command with proper error handling"""
        try:
            result = subprocess.run(
                cmd,
                text=True,
                check=False,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            return result.returncode == 0
        except Exception as e:
            logging.error(f"Error running command {' '.join(cmd)}: {e}")
            return False

    def find_files(self, patterns: List[str]) -> List[Path]:
        """Find files matching patterns in main directory"""
        files: list[Path] = []
        for pattern in patterns:
            # Use glob with case-insensitive matching
            for ext in [pattern, pattern.upper()]:
                files.extend(self.main_dir.rglob(f"*.{ext}"))
        return list(set(files))  # Remove duplicates

    def convert_orphan_images(self):
        """Convert orphan WebP and GIF images to PNG (if no PNG/JPG/JPEG exists)"""
        logging.info("=== Converting orphan images to PNG ===")

        files = self.find_files(["webp", "gif"])
        if not files:
            logging.info("No orphan images to convert")
            return

        with ThreadPoolExecutor(max_workers=self.config.cpu_count) as executor:
            results = list(executor.map(self._convert_orphan_single, files))

        successful = sum(1 for r in results if r)
        logging.info(f"Completed converting {successful}/{len(files)} orphan images")

    def _convert_orphan_single(self, path: Path) -> bool:
        """Convert a single orphan image"""

        # Skip if already converted or has original
        if any([path.with_suffix(ext).exists() for ext in [".png", ".jpg", ".jpeg"]]):
            logging.debug(f"Skipping (has original): {path}")
            return True

        dest = path.with_suffix(".png")
        cmd = ["magick", f"{path}[0]", "-strip", str(dest)]

        if self.run_command(cmd):
            logging.debug(f"Converted orphan image: {path} -> {dest}")
            return True
        else:
            logging.error(f"Failed to convert orphan image: {path}")
            return False

    def generate_thumbnails(self):
        """Generate thumbnails from originals"""
        logging.info("=== Generating thumbnails ===")

        files = self.find_files(["png", "jpg", "jpeg"])
        if not files:
            logging.info("No images found for thumbnail generation")
            return

        with ThreadPoolExecutor(max_workers=self.config.cpu_count) as executor:
            results = list(executor.map(self._generate_thumbnail_single, files))

        successful = sum(1 for r in results if r)
        logging.info(f"Completed generating {successful}/{len(files)} thumbnails")

    def _generate_thumbnail_single(self, path: Path) -> bool:
        """Generate thumbnail for a single image"""
        rel_path = path.relative_to(self.main_dir)
        thumb_dest = self.thumb_dir / rel_path.with_suffix(".webp")

        # Skip if up to date and not force mode
        if (
            not self.force_mode
            and thumb_dest.exists()
            and thumb_dest.stat().st_mtime > path.stat().st_mtime
        ):
            logging.debug(f"Skipping thumbnail (up to date): {path}")
            return True

        thumb_dest.parent.mkdir(parents=True, exist_ok=True)

        cmd = [
            "magick",
            str(path),
            "-resize",
            f"{self.config.thumb_width}>",
            "-strip",
            "-quality",
            str(self.config.thumb_quality),
            str(thumb_dest),
        ]

        if self.run_command(cmd):
            logging.debug(f"Generated thumbnail: {path} -> {thumb_dest}")
            return True
        else:
            logging.error(f"Failed to generate thumbnail: {path}")
            return False

    def process_special_images(self):
        """Process special images with custom settings"""
        logging.info("=== Processing special images ===")

        if not self.special_images:
            logging.info(f"No special images defined for title: {self.title}")
            return

        successful = 0
        for image_name in self.special_images:
            if self._process_special_single(image_name):
                successful += 1

        logging.info(
            f"Completed processing {successful}/{len(self.special_images)} special images"
        )

    def _process_special_single(self, image_name: str) -> bool:
        """Process a single special image"""
        path = self.main_dir / image_name
        if not path.exists():
            logging.warning(f"Special image not found: {path}")
            return False

        dest = path.with_suffix(".webp")

        # Skip if up to date and not force mode
        if (
            not self.force_mode
            and dest.exists()
            and dest.stat().st_mtime > path.stat().st_mtime
        ):
            logging.debug(f"Skipping special (up to date): {path}")
            return True

        cmd = ["magick", str(path), "-strip", "-quality", "80", f"WEBP:{dest}"]

        if self.run_command(cmd):
            logging.debug(f"Processed special image: {path} -> {dest}")
            return True
        else:
            logging.error(f"Failed to process special image: {path}")
            return False

    def process_main_images(self):
        """Create optimized WebP versions (excluding special images)"""
        logging.info("=== Creating optimized WebP versions ===")

        files: list[Path] = []
        for path in self.find_files(["png", "jpg", "jpeg"]):
            # Skip special images in main processing
            if not self.is_special_image(path):
                files.append(path)

        if not files:
            logging.info("No main images to process")
            return

        with ThreadPoolExecutor(max_workers=self.config.cpu_count) as executor:
            results = list(executor.map(self._process_main_single, files))

        successful = sum(1 for r in results if r)
        logging.info(f"Completed processing {successful}/{len(files)} main images")

    def _process_main_single(self, path: Path) -> bool:
        """Process a single main image"""
        dest = path.with_suffix(".webp")

        # Skip if up to date and not force mode
        if (
            not self.force_mode
            and dest.exists()
            and dest.stat().st_mtime > path.stat().st_mtime
        ):
            logging.debug(f"Skipping (up to date): {path}")
            return True

        # Create WebP version with magick first
        cmd1 = [
            "magick",
            str(path),
            "-resize",
            f"{self.config.main_width}>",
            "-strip",
            "-quality",
            "100",
            str(dest),
        ]

        # Then optimize with cwebp (overwriting the same file)
        cmd2 = [
            "cwebp",
            "-q",
            str(self.config.main_quality),
            "-m",
            "6",
            "-sharp_yuv",
            str(dest),
            "-o",
            str(dest),
        ]

        success = False
        try:
            if self.run_command(cmd1):
                if self.run_command(cmd2):
                    success = True
                    logging.info(f"Processed image: {path} -> {dest}")
        except Exception as e:
            logging.error(f"Error processing {path}: {e}")
            # Clean up on failure
            if dest.exists():
                dest.unlink()

        if not success:
            logging.error(f"Failed to process image: {path}")

        return success

    def get_size_report(self):
        """Generate size report for WebP files"""
        logging.info("=== Size Report ===")

        main_webp_files = list(self.main_dir.rglob("*.webp"))
        thumb_webp_files = list(self.thumb_dir.rglob("*.webp"))

        main_size = sum(f.stat().st_size for f in main_webp_files)
        thumb_size = sum(f.stat().st_size for f in thumb_webp_files)

        logging.info(
            f"Main images size (WebP versions): {self._format_size(main_size)}"
        )
        logging.info(f"Thumbnails size: {self._format_size(thumb_size)}")
        logging.info(f"Main WebP files: {len(main_webp_files)}")
        logging.info(f"Thumbnail WebP files: {len(thumb_webp_files)}")

    def _format_size(self, size_bytes: int) -> str:
        """Format file size in human-readable format"""
        for unit in ["B", "KB", "MB", "GB"]:
            if size_bytes < 1024.0:
                return f"{size_bytes:.2f} {unit}"
            size_bytes //= 1024
        return f"{size_bytes:.2f} TB"

    def process_all(self):
        """Run the complete image optimization pipeline"""
        logging.info(f"Using title: {self.title}")
        logging.info(f"Force mode: {self.force_mode}")
        logging.info(f"Main directory: {self.main_dir}")
        logging.info(f"Thumbnails directory: {self.thumb_dir}")

        # Count source images and existing WebP files
        source_files = self.find_files(["png", "jpg", "jpeg"])
        webp_files = list(self.main_dir.rglob("*.webp"))

        logging.info(f"Source images found: {len(source_files)}")
        logging.info(f"Existing WebP files: {len(webp_files)}")

        self.convert_orphan_images()
        print()
        self.generate_thumbnails()
        print()
        self.process_special_images()
        print()
        self.process_main_images()
        print()

        self.get_size_report()


def find_all_titles() -> List[str]:
    """Find all anime titles in the public directory"""
    public_dir = Path("./public")
    if not public_dir.exists():
        return []

    titles: list[str] = []
    for item in public_dir.iterdir():
        if (
            item.is_dir()
            and not item.name.endswith("-thumbnails")
            and item.name not in ["index.html"]
            and not item.name.startswith(".")
        ):
            titles.append(item.name)
    return sorted(titles)


def process_single_title(title: str, force_mode: bool = False):
    """Process a single title"""
    print("=" * 80)
    print(f"Processing: {title}")
    print("=" * 80)

    try:
        processor = ImageProcessor(title, force_mode)
        processor.process_all()
        return True
    except Exception as e:
        logging.error(f"Error processing {title}: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Optimize manga/anime images")
    parser.add_argument("title", nargs="?", help="Manga/Anime title")
    parser.add_argument(
        "--force", action="store_true", help="Force reprocessing of all images"
    )
    parser.add_argument("--all", action="store_true", help="Process all anime titles")
    parser.add_argument(
        "--cpu", type=int, default=32, help="Number of parallel processes"
    )

    args = parser.parse_args()

    # Set up logging
    logging.basicConfig(
        level=logging.DEBUG,
        format="%(asctime)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    config = Config(cpu_count=args.cpu)

    if args.all:
        # Process all titles
        titles = find_all_titles()
        if not titles:
            logging.error("No anime titles found in ./public directory")
            sys.exit(1)

        logging.info("Found titles:")
        for title in titles:
            logging.info(f"  - {title}")
        logging.info(f"Force mode: {args.force}")
        logging.info(f"CPU count: {args.cpu}")

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

        logging.info(f"Source images found: {source_count}")
        logging.info(f"Existing WebP files: {webp_count}")
        print()

        success_count = 0
        for title in titles:
            if process_single_title(title, args.force):
                success_count += 1
            print()

        logging.info(f"Successfully processed {success_count}/{len(titles)} titles!")

    elif args.title:
        # Process single title
        try:
            processor = ImageProcessor(args.title, args.force, config)
            processor.process_all()
        except Exception as e:
            logging.error(f"Error: {e}")
            sys.exit(1)
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
