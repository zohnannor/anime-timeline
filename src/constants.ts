import { Flatten, Length } from './types';
import { map, pad, path, range, sum } from './util';

export const scale = (n: number) => n / 40;
export const SCROLLER_SIZE = 400;

const CHAPTERS_TOTAL = 193;
const VOLUMES_TOTAL = 20; // last = unreleased

export const PAGES_PER_CHAPTER_PER_VOLUME = [
    [54, 25, 23, 19, 19, 19, 19],
    [19, 19, 19, 19, 19, 19, 19, 21, 19],
    [19, 19, 19, 19, 19, 19, 21, 19, 19],
    [19, 19, 19, 21, 19, 19, 19, 20, 19],
    [19, 19, 19, 25, 19, 19, 19, 19, 22],
    [19, 19, 21, 19, 19, 21, 19, 19, 19],
    [21, 19, 19, 19, 19, 19, 22, 21, 21],
    [19, 19, 19, 19, 19, 21, 19, 19, 19],
    [22, 19, 21, 19, 19, 19, 19, 19, 21],
    [19, 19, 19, 19, 19, 23, 19, 19, 19],
    [19, 21, 19, 21, 19, 19, 19, 19, 23],
    [54, 24, 19, 19, 48, 21],
    [19, 21, 17, 19, 17, 18, 18, 17, 27],
    [19, 24, 11, 20, 19, 19, 16, 16, 16, 18],
    [19, 17, 16, 16, 16, 15, 18, 18, 19, 15, 16],
    [18, 22, 14, 17, 19, 17, 19, 15, 14, 15],
    [15, 16, 17, 15, 17, 20, 17, 16, 19, 19],
    [17, 16, 15, 15, 16, 16, 16, 16, 17, 17, 16],
    [14, 16, 16, 15, 16, 15, 15, 16, 15, 17, 16],
    [18, 16, 17, 17, 18, 17, 16, 15, 15, 15, 17, 15, 14, 16, 15, 17, 15, 13],
] as const;

const _ASSERT_LEGNTHS: [
    Length<typeof PAGES_PER_CHAPTER_PER_VOLUME>,
    Length<typeof PAGES_PER_CHAPTER_FLAT>,
    Length<Flatten<typeof CHAPTER_PICTURES>>,
    Length<typeof ARC_IMAGES>,
    Length<typeof ARC_NAMES>,
    Length<typeof VOLUME_COVERS>,
    Length<typeof SEASON_COVERS>,
    Length<typeof EPISODE_THUMBNAILS>,
    Length<typeof CHAPTERS_PER_EPISODE>
] = [
    VOLUMES_TOTAL,
    CHAPTERS_TOTAL,
    CHAPTERS_TOTAL,
    14,
    14,
    VOLUMES_TOTAL,
    4,
    12,
    12,
] as const;

void _ASSERT_LEGNTHS; // to ignore error

export const PAGES_PER_CHAPTER_FLAT =
    PAGES_PER_CHAPTER_PER_VOLUME.flat() as Flatten<
        typeof PAGES_PER_CHAPTER_PER_VOLUME
    >;

export const CHAPTERS_PER_VOLUME = map(
    PAGES_PER_CHAPTER_PER_VOLUME,
    volume => volume.length
);

export const PAGES_PER_VOLUME = map(PAGES_PER_CHAPTER_PER_VOLUME, volume =>
    sum(volume)
);

export const CHAPTER_PICTURES = [
    [
        path(`Volume_01_Pochita_Sketch_1.png`),
        path(`Volume_01_Pochita_Sketch_3.png`),
        path(`Volume_01_Pochita_Sketch_4.png`),
        path(`Volume_01_Pochita_Sketch_5.png`),
        path(`Volume_01_Pochita_Sketch_6.png`),
        path(`Volume_01_Pochita_Sketch_7.png`),
        path(`Volume_01_Pochita_Sketch_8.png`),
    ],
    map(range(1, 10), n => path(`Volume_02_Pochita_Sketch_${n}.png`)),
    map(range(1, 10), n => path(`Volume_03_Pochita_Sketch_${n}.png`)),
    [
        path(`Volume_04_Pochita_Sketch_1.png`),
        path(`Volume_04_Pochita_Sketch_2.png`),
        path(`Volume_04_Pochita_Sketch_3.png`),
        path(`Volume_04_Pochita_Sketch_4.png`),
        path(`Volume_04_Pochita_Sketch_5.png`),
        path(`Volume_04_Pochita_Sketch_6.png`),
        path(`Volume_04_Pochita_Sketch_7.png`),
        path(`Volume_04_Pochita_Sketch_8.png`),
        path(`Volume_04_Pochita_Sketch_10.png`),
    ],
    [
        path(`Volume_05_Pochita_Sketch_1.png`),
        path(`Volume_05_Pochita_Sketch_2.png`),
        path(`Volume_05_Pochita_Sketch_3.png`),
        null,
        path(`Volume_05_Pochita_Sketch_4.png`),
        path(`Volume_05_Pochita_Sketch_5.png`),
        path(`Volume_05_Pochita_Sketch_6.png`),
        path(`Volume_05_Pochita_Sketch_7.png`),
        path(`Volume_05_Pochita_Sketch_8.png`),
    ],
    map(range(1, 10), n => path(`Volume_06_Pochita_Sketch_${n}.png`)),
    map(range(1, 10), n => path(`Volume_07_Pochita_Sketch_${n}.png`)),
    map(range(1, 10), n => path(`Volume_08_Pochita_Sketch_${n}.png`)),
    [
        path(`Volume_09_Pochita_Sketch_1.png`),
        path(`Volume_09_Pochita_Sketch_2.png`),
        path(`Volume_09_Pochita_Sketch_3.png`),
        path(`Volume_09_Pochita_Sketch_4.png`),
        path(`Volume_09_Pochita_Sketch_5.png`),
        path(`Volume_09_Pochita_Sketch_6.png`),
        path(`Volume_09_Pochita_Sketch_7.png`),
        path(`Volume_09_Pochita_Sketch_8.png`),
        null,
    ],
    [
        path(`Volume_10_Pochita_Sketch.png`),
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        path(`Volume_10_Denji_Sketch.png`),
    ],
    [
        null,
        null,
        path(`Volume_11_Pochita_Sketch_1.png`),
        path(`Volume_11_Pochita_Sketch_2.png`),
        path(`Volume_11_Pochita_Sketch_3.png`),
        path(`Volume_11_Pochita_Sketch_4.png`),
        path(`Volume_11_Pochita_Sketch_5.png`),
        path(`Volume_11_Pochita_Sketch_6.png`),
        null,
    ],
    [
        path(`Volume_12_Pochita_Sketch_1.png`),
        path(`Volume_12_Pochita_Sketch_2.png`),
        path(`Volume_12_Pochita_Sketch_3.png`),
        path(`Volume_12_Pochita_Sketch_4.png`),
        null,
        path(`Volume_12_Pochita_Sketch_5.png`),
    ],
    [
        null,
        null,
        path(`Volume_13_Pochita_Sketch_1.png`),
        null,
        null,
        null,
        null,
        path(`Volume_13_Pochita_Sketch_2.png`),
        path(`Volume_13_Pochita_Sketch_3.png`),
    ],
    [
        path(`Volume_14_Pochita_Sketch_1.png`),
        path(`Volume_14_Pochita_Sketch_2.png`),
        path(`Volume_14_Pochita_Sketch_3.png`),
        null,
        null,
        path(`Volume_14_Pochita_Sketch_4.png`),
        null,
        path(`Volume_14_Pochita_Sketch_5.png`),
        path(`Volume_14_Pochita_Sketch_6.png`),
        null,
    ],
    [
        null,
        path(`Volume_15_Pochita_Sketch_1.png`),
        null,
        null,
        null,
        path(`Volume_15_Pochita_Sketch_2.png`),
        null,
        null,
        path(`Volume_15_Pochita_Sketch_3.png`),
        path(`Volume_15_Pochita_Sketch_4.png`),
        path(`Volume_15_Pochita_Sketch_5.png`),
    ],
    [
        path(`Volume_16_Pochita_Sketch_1.png`),
        path(`Volume_16_Pochita_Sketch_2.png`),
        null,
        null,
        path(`Volume_16_Pochita_Sketch_3.png`),
        path(`Volume_16_Pochita_Sketch_4.png`),
        path(`Volume_16_Pochita_Sketch_5.png`),
        null,
        null,
        path(`Volume_16_Pochita_Sketch_6.png`),
    ],
    [
        path(`Volume_17_Pochita_Sketch_1.png`),
        null,
        null,
        null,
        null,
        path(`Volume_17_Pochita_Sketch_2.png`),
        null,
        null,
        null,
        path(`Volume_17_Pochita_Sketch_3.png`),
    ],
    [
        null,
        path(`Volume_18_Pochita_Sketch_1.png`),
        null,
        null,
        null,
        null,
        path(`Volume_18_Pochita_Sketch_2.png`),
        null,
        path(`Volume_18_Pochita_Sketch_3.png`),
        null,
        null,
    ],
    [
        null,
        null,
        null,
        path(`Volume_19_Pochita_Sketch_1.png`),
        null,
        path(`Volume_19_Pochita_Sketch_2.png`),
        null,
        null,
        path(`Volume_19_Pochita_Sketch_3.png`),
        null,
        path(`Volume_19_Pochita_Sketch_4.png`),
    ],
    [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    ],
] as const;

export const CHAPTERS_PER_ARC: [number, number][] = [
    [1, 4],
    [5, 13],
    [14, 22],
    [23, 38],
    [39, 52],
    [53, 70],
    [71, 79],
    [80, 97],
    [98, 111],
    [112, 120],
    [121, 131],
    [132, 155],
    [156, 190],
    [191, CHAPTERS_TOTAL],
];

export const ARC_IMAGES = [
    path(`Denji_fighting_zombies.png`),
    path(`Denji_attacking_the_Bat_Devil.png`),
    path(`Denji_fighting_the_Eternity_Devil.png`),
    path(`Denji_engaging_the_Katana_Man.png`),
    path(`Denji_engaging_Reze.png`),
    path(`Denji_engaging_Santa_Claus.png`),
    path(`Chainsaw_vs_Gun_Fiend.png`),
    path(`Hybrids_attacking_Chainsaw.png`),
    path(`Asa_vs_Yuko_as_Justice_Devil.png`),
    path(`Dating_Denji_arc_infobox_picture.png`),
    path(`Denji_tears_through_the_Falling_Devil.png`),
    path(`Denji_and_Miri_impale_each_other.png`),
    path(`Chainsaw_vs_Aging.png`),
    null,
] as const;

export const ARC_NAMES = [
    'Introduction',
    'Bat Devil',
    'Eternity Devil',
    'Katana Man',
    'Bomb Girl',
    'International Assassins',
    'Gun Devil',
    'Control Devil',
    'Justice Devil',
    'Dating Denji',
    'Falling Devil',
    'Chainsaw Man Church',
    'Aging Devil',
    'Current',
] as const;

export const VOLUME_COVERS = [
    ...map(range(1, VOLUMES_TOTAL), n => path(`Volume_${pad(n)}.png`)),
    null,
] as const;

export const SEASON_COVERS = [
    path(`Chainsaw_Man_Anime_Key_Visual_1.png`),
    path(`Chainsaw_Man_Movie_-_Reze_Arc_Key_Visual_1.png`),
    null,
    null,
] as const;

export const CHAPTERS_PER_SEASON: [number, number][] = [
    [1, 38],
    [39, 52],
    [53, 97],
    [98, CHAPTERS_TOTAL],
];

export const EPISODE_THUMBNAILS = map(range(1, 13), n => path(`${n}.jpg`));

const CHAPTERS_WITH_PAGES = map(
    PAGES_PER_CHAPTER_FLAT,
    (pages, chapterIdx) => [chapterIdx + 1, pages] as const
);

const SPLIT_CHAPTERS: Record<number, number> = {
    5: 10,
    12: 1,
    15: 10,
    18: 12,
    25: 14,
    31: 18,
} as const;

const CHAPTERS_PER_EPISODE = [1, 4, 4, 4, 4, 4, 4, 4, 4, 3, 4, 4] as const;

const CHAPTERS_SPLIT_FOR_EPISODES = CHAPTERS_WITH_PAGES.slice(0, 38 + 1).reduce(
    (a, [chapter = 0, pages = 0]) => [
        ...a,
        // make two of the same "chapter" if it needs to be split
        ...(chapter in SPLIT_CHAPTERS
            ? [
                  [chapter, SPLIT_CHAPTERS[chapter]!],
                  [chapter, pages - SPLIT_CHAPTERS[chapter]!],
              ]
            : // leave as is
              [[chapter, pages]]),
    ],
    [] as number[][]
);

export const PAGES_PER_EPISODE_WITH_CHAPTERS = CHAPTERS_PER_EPISODE.reduce<
    [number[][][], number]
>(
    ([groups, cursor], chapterCount) => {
        const episodeChapters = CHAPTERS_SPLIT_FOR_EPISODES.slice(
            cursor,
            cursor + chapterCount
        );
        return [[...groups, episodeChapters], cursor + chapterCount];
    },
    [[], 0]
)[0];
