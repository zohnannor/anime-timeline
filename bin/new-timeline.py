#!/usr/bin/env python3

import argparse
import re
import sys
import readline  # pyright: ignore[reportUnusedImport]
from pathlib import Path

if not __package__:
    from colors import (  # pyright: ignore[reportImplicitRelativeImport]
        Color,
        ColorContext,
        bold,
        colored,
        should_use_colors,
    )
else:
    from .colors import Color, ColorContext, bold, colored, should_use_colors


class Args(argparse.Namespace):
    """CLI Arguments"""

    TITLE: str | None = None
    color: str = "auto"


def get_root() -> Path:
    """Find the first parent directory that contains an `src` folder"""
    current = Path(__file__).resolve().parent
    for parent in [current] + list(current.parents):
        if (parent / "src").is_dir():
            return parent

    print(colored("Error: Could not find project root", Color.RED))
    sys.exit(1)


def slugify(text: str) -> str:
    """Convert 'Anime Title' to 'animetitle'"""
    return re.sub(r"[\W_]+", "", text).lower()


def update_registry(path: Path, slug: str, root: Path) -> None:
    if not path.exists():
        print(
            colored(f"✘ Error: {path.relative_to(root)} not found", Color.RED)
        )
        return

    lines = path.read_text().splitlines()

    # Find the LOADERS object and insert a new entry
    new_entry = f"    {slug}: () => import('@timelines/{slug}'),"
    inserted = False

    for i, line in enumerate(lines):
        if re.match(r"^};", line) and not inserted:
            lines.insert(i, new_entry)
            inserted = True
            break

    if not inserted:
        print(
            colored(
                f"✘ Error: Could not find LOADERS object in {path.relative_to(root)}",
                Color.RED,
            )
        )
        return

    _ = path.write_text("\n".join(lines) + "\n")
    print(colored(f"✔ Updated registry: {path.relative_to(root)}", Color.GREEN))


def ask(question: str) -> str:
    try:
        return input(bold(f"{question}: ")).strip()
    except EOFError:
        return ""


def create_new_timeline(title: str | None = None) -> None:
    try:
        root = get_root()

        if not title:
            print(colored("--- Timeline Creator Wizard ---", Color.CYAN))
            title = ask("Enter Anime/Manga Title (e.g. Naruto)")

        if not title:
            print(colored("Error: Title is required.", Color.RED))
            sys.exit(1)

        title_urlsafe = title.replace(" ", "_")
        suggested_slug = slugify(title)
        slug_input = ask(f"Enter URL slug [{suggested_slug}]")
        slug = slug_input if slug_input else suggested_slug
        const_name = f"{slug.upper()}_TIMELINE"

        assets_dir = root / "assets" / slug
        ts_file = root / "src" / "timelines" / f"{slug}.ts"
        registry_file = root / "src" / "timelines" / "registry.ts"

        wiki_base = ask(f"Enter wiki base")

        if not wiki_base:
            print(colored("Error: Wiki base is required.", Color.RED))
            sys.exit(1)

        suggested_volumes = 1
        number_of_volumes = ask(
            f"Enter number of volumes [{suggested_volumes}]"
        )
        volumes = (
            int(number_of_volumes) if number_of_volumes else suggested_volumes
        )

        suggested_arcs = 1
        number_of_arcs = ask(f"Enter number of arcs [{suggested_arcs}]")
        arcs = int(number_of_arcs) if number_of_arcs else suggested_arcs

        suggested_seasons = 1
        number_of_seasons = ask(
            f"Enter number of seasons [{suggested_seasons}]"
        )
        seasons = (
            int(number_of_seasons) if number_of_seasons else suggested_seasons
        )

        # File Operations
        assets_dir.mkdir(parents=True, exist_ok=True)
        print(
            colored(
                f"✔ Created folder: {assets_dir.relative_to(root)}", Color.GREEN
            )
        )

        volumes_objects = "\n".join(
            [
                f"""
            {{
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {{
                        title: chapterTitle,
                        date: 'January 1, 1970',
                        pages: 100,
                        cover: null,
                    }},
                ],
            }},""".strip(
                    "\n"
                )
            ]
            * volumes
        )
        arc_objects = "\n".join(
            [
                f"""
            {{
                title: 'Name...',
                cover: 'filename',
                offset: {{ x: 0, y: 0 }},
                chapters: {{ from: 1, }},
            }},""".strip(
                    "\n"
                )
            ]
            * arcs
        )
        season_objects = (
            "\n".join(
                [
                    f"""
            {{
                title: '{title} (Anime)',
                cover: () => 'filename',
                offset: {{ x: 0, y: 0 }},
                chapters: {{ from: 1, to: 1 }},
                episodes: [
                    {{
                        title: 'Name...',
                        cover: episodeCover,
                        offset: {{ x: 0, y: 0 }},
                        date: 'January 1, 1970',
                        chapters: {{ from: 1, to: 1 }},
                    }},
                ],
            }},""".strip(
                        "\n"
                    )
                ]
                * seasons
            )
            if seasons != 0
            else ""
        )
        seasons_data = (
            f"""seasons: [
{season_objects}
            ] as const satisfies Tuple<Season, SeasonsTotal>,"""
            if seasons != 0
            else ""
        )
        season_layout = (
            f"""season: {{
                type: 'season',
                height: SEASON_HEIGHT,
                blankfontSize: 250,
                titleFontSize: 100,
                numberProcessor: n => (n - 1).toString(),
                sectionLink: '{title} (Anime)',
                wikiLink: title => title,
                subTimeline: {{
                    type: 'episode',
                    height: EPISODE_HEIGHT,
                    scale: 1.2,
                    titleProcessor: (title, n) => `${{title}}\\n(Episode ${{n}})`,
                    blankfontSize: 42,
                    titleFontSize: 42,
                    sectionLink: '{title_urlsafe}_(Anime)#Episodes',
                    wikiLink: (_, n) => `Episode ${{n}}`,
                    focusable: true,
                }},
            }},\n       """
            if seasons != 0
            else ""
        )

        ts_content = f"""
/* eslint-disable max-lines */ // a lot of data for a title
import {{ pad, Tuple }} from '@shared/lib/util';
import {{
    ArrowRangeIcon,
    CalendarIcon,
    CameraIcon,
    EmptyIcon,
    ExpandIcon,
    FitIcon,
    InfoIcon,
    ListIcon,
    TitleIcon,
}} from '@shared/ui/icons';
import {{ Arc, Season, Timeline, Volume }} from '@timelines/types';

const SEASON_HEIGHT = 742;
const EPISODE_HEIGHT = SEASON_HEIGHT * 0.33;
const VOLUME_HEIGHT = 1579;
const CHAPTER_HEIGHT = 100;
const ARC_HEIGHT = VOLUME_HEIGHT * 0.8;

type VolumesTotal = {volumes};
type ArcsTotal = {arcs};
type SeasonsTotal = {seasons};

const volumeTitle = (n: number) => `Volume ${{n}}`;
const volumeCover = (n: number) => `Volume_${{pad(n)}}`;
const chapterTitle = (n: number) => `Chapter ${{n}}`;
const episodeCover = (n: number) => n.toString();

export const {const_name}: Timeline = {{
    layout: {{
        {season_layout}arc: {{
            type: 'arc',
            height: ARC_HEIGHT,
            titleProcessor: title => `${{title}} arc`,
            blankfontSize: 100,
            titleFontSize: 100,
            sectionLink: 'Story Arcs',
            wikiLink: title => title,
        }},
        timeline: {{
            type: 'timeline',
        }},
        chapter: {{
            type: 'chapter',
            height: CHAPTER_HEIGHT,
            fit: 'contain',
            backgroundColor: 'white',
            blankfontSize: 45,
            titleFontSize: 45,
            sectionLink: '{title_urlsafe}_(Manga)#Chapters',
            wikiLink: (_, n) => `Chapter ${{n}}`,
            focusable: true,
        }},
        volume: {{
            type: 'volume',
            height: VOLUME_HEIGHT,
            defaultCoverPosition: 'top',
            titleProcessor: (title, n) => `${{title}}\\n(Volume ${{n}})`,
            blankfontSize: 500,
            titleFontSize: 100,
            sectionLink: '{title_urlsafe}_(Manga)#Chapters',
            wikiLink: (_, n) => `Volume ${{n}}`,
        }},
    }},
    data: {{
        title: '{title}',
        volumes: [
{volumes_objects}
        ] as const satisfies Tuple<Volume, VolumesTotal>,
        arcs: [
{arc_objects}
        ] as const satisfies Tuple<Arc, ArcsTotal>,
        {seasons_data}
        splitChapters: {{}},
        wikiBase: '{wiki_base}',
        icons: {{
            favicon: EmptyIcon,
            scroller: ArrowRangeIcon,
            'select-title': ListIcon,
            'read-info': InfoIcon,
            'toggle-unbound-chapter-width': ExpandIcon,
            'toggle-cross-lines': FitIcon,
            'open-chapter-calendar': CalendarIcon,
            'toggle-always-show-titles': TitleIcon,
            'capture-timeline': CameraIcon,
        }},
        socialLinks: [],
    }},
}};
"""
        if not ts_file.exists():
            ts_file.parent.mkdir(parents=True, exist_ok=True)
            _ = ts_file.write_text(ts_content.strip() + "\n")
            print(
                colored(
                    f"✔ Created file: {ts_file.relative_to(root)}", Color.GREEN
                )
            )
        else:
            print(
                colored(
                    f"⚠ Skip: {ts_file.relative_to(root)} already exists",
                    Color.YELLOW,
                )
            )

        update_registry(registry_file, slug, root)
        print(colored("✨ Done!", Color.BRIGHT_GREEN))

    except KeyboardInterrupt:
        # Handle Ctrl-C cleanly
        print(colored("\n\nAborted by user.", Color.YELLOW))
        sys.exit(130)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Create boilerplate files for a new anime timeline",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    # Using _ as a hint that we aren't using the Action object returned
    _ = parser.add_argument(
        "TITLE", nargs="?", help="Manga/Anime title codeword (e.g. `csm` text)"
    )
    _ = parser.add_argument(
        "--color",
        choices=["auto", "always", "never"],
        default="auto",
        help="Control color output (auto, always, never). "
        + "This program respects the NO_COLOR environment variable. "
        + "(default: auto)",
    )

    args = parser.parse_args(namespace=Args())

    colors_enabled = should_use_colors(args.color)
    ColorContext.set_enabled(colors_enabled)

    # If no TITLE provided, `create_new_timeline` handles the Wizard prompts
    create_new_timeline(args.TITLE)


if __name__ == "__main__":
    main()
