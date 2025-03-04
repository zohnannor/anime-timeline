import {
    getArcWidth,
    getChapterWidth,
    getEpisodeWidth,
    getSeasonWidth,
    getVolumeWidth,
} from './helpers';
import { SettingsValues } from './providers/SettingsProvider';
import { Flatten, Length, Tuple } from './types';
import { isMobileDevice, map, pad, range, sum } from './util';

export const SEASON_HEIGHT = 742;
export const EPISODE_HEIGHT = SEASON_HEIGHT * 0.33;
export const VOLUME_HEIGHT = 1579;
export const CHAPTER_HEIGHT = 100;
export const ARC_HEIGHT = VOLUME_HEIGHT * 0.8;
export const TIMELINE_HEIGHT = 200;
const MAX_HEIGHT =
    SEASON_HEIGHT +
    ARC_HEIGHT +
    TIMELINE_HEIGHT +
    CHAPTER_HEIGHT +
    VOLUME_HEIGHT;

const COEFFICIENT = MAX_HEIGHT / 100;
export const scale = (n: number) => n / COEFFICIENT;

export const SCROLLER_WIDTH = 1300;
export const HEADERS_WIDTH = 150;

export const LARGE_FONT_SIZE = 500;
export const SMALL_FONT_SIZE = 45;

const CHAPTERS_TOTAL = 195;
const EPISODES_TOTAL = 12;
const ARCS_TOTAL = 14;
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
    [
        18, 16, 17, 17, 18, 17, 16, 15, 15, 15, 17, 15, 14, 16, 15, 17, 15, 13,
        15, 15,
    ],
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
    Length<typeof CHAPTERS_PER_EPISODE>,
    Length<typeof CHAPTER_DATES>,
    Length<typeof CHAPTER_NAMES>,
    Length<typeof EPISODE_TITLES>,
    Length<typeof SEASON_TITLES>,
    Length<typeof VOLUME_TITLES>
] = [
    VOLUMES_TOTAL,
    CHAPTERS_TOTAL,
    CHAPTERS_TOTAL,
    ARCS_TOTAL,
    ARCS_TOTAL,
    VOLUMES_TOTAL,
    4,
    EPISODES_TOTAL,
    EPISODES_TOTAL,
    CHAPTERS_TOTAL,
    CHAPTERS_TOTAL,
    EPISODES_TOTAL,
    2,
    VOLUMES_TOTAL,
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
    map(range(2, 9), n => `Volume_01_Pochita_Sketch_${n}` as const),
    map(range(1, 10), n => `Volume_02_Pochita_Sketch_${n}` as const),
    map(range(1, 10), n => `Volume_03_Pochita_Sketch_${n}` as const),
    [
        'Volume_04_Pochita_Sketch_1',
        'Volume_04_Pochita_Sketch_2',
        'Volume_04_Pochita_Sketch_3',
        'Volume_04_Pochita_Sketch_4',
        'Volume_04_Pochita_Sketch_5',
        'Volume_04_Pochita_Sketch_6',
        'Volume_04_Pochita_Sketch_7',
        'Volume_04_Pochita_Sketch_9',
        'Volume_04_Pochita_Sketch_10',
    ],
    [
        'Volume_05_Pochita_Sketch_1',
        'Volume_05_Pochita_Sketch_2',
        'Volume_05_Pochita_Sketch_3',
        null,
        'Volume_05_Pochita_Sketch_4',
        'Volume_05_Pochita_Sketch_5',
        'Volume_05_Pochita_Sketch_6',
        'Volume_05_Pochita_Sketch_7',
        'Volume_05_Pochita_Sketch_8',
    ],
    map(range(1, 10), n => `Volume_06_Pochita_Sketch_${n}` as const),
    map(range(1, 10), n => `Volume_07_Pochita_Sketch_${n}` as const),
    map(range(1, 10), n => `Volume_08_Pochita_Sketch_${n}` as const),
    [
        'Volume_09_Pochita_Sketch_1',
        'Volume_09_Pochita_Sketch_2',
        'Volume_09_Pochita_Sketch_3',
        'Volume_09_Pochita_Sketch_4',
        'Volume_09_Pochita_Sketch_5',
        'Volume_09_Pochita_Sketch_6',
        'Volume_09_Pochita_Sketch_7',
        'Volume_09_Pochita_Sketch_8',
        null,
    ],
    [
        'Volume_10_Pochita_Sketch',
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        'Volume_10_Denji_Sketch',
    ],
    [
        null,
        null,
        'Volume_11_Pochita_Sketch_1',
        'Volume_11_Pochita_Sketch_2',
        'Volume_11_Pochita_Sketch_3',
        'Volume_11_Pochita_Sketch_4',
        'Volume_11_Pochita_Sketch_5',
        'Volume_11_Pochita_Sketch_6',
        null,
    ],
    [
        'Volume_12_Pochita_Sketch_1',
        'Volume_12_Pochita_Sketch_2',
        'Volume_12_Pochita_Sketch_3',
        'Volume_12_Pochita_Sketch_4',
        null,
        'Volume_12_Pochita_Sketch_5',
    ],
    [
        null,
        null,
        'Volume_13_Pochita_Sketch_1',
        null,
        null,
        null,
        null,
        'Volume_13_Pochita_Sketch_2',
        'Volume_13_Pochita_Sketch_3',
    ],
    [
        'Volume_14_Pochita_Sketch_1',
        'Volume_14_Pochita_Sketch_2',
        'Volume_14_Pochita_Sketch_3',
        null,
        null,
        'Volume_14_Pochita_Sketch_4',
        null,
        'Volume_14_Pochita_Sketch_5',
        'Volume_14_Pochita_Sketch_6',
        null,
    ],
    [
        null,
        'Volume_15_Pochita_Sketch_1',
        null,
        null,
        null,
        'Volume_15_Pochita_Sketch_2',
        null,
        null,
        'Volume_15_Pochita_Sketch_3',
        'Volume_15_Pochita_Sketch_4',
        'Volume_15_Pochita_Sketch_5',
    ],
    [
        'Volume_16_Pochita_Sketch_1',
        'Volume_16_Pochita_Sketch_2',
        null,
        null,
        'Volume_16_Pochita_Sketch_3',
        'Volume_16_Pochita_Sketch_4',
        'Volume_16_Pochita_Sketch_5',
        null,
        null,
        'Volume_16_Pochita_Sketch_6',
    ],
    [
        'Volume_17_Pochita_Sketch_1',
        null,
        null,
        null,
        null,
        'Volume_17_Pochita_Sketch_2',
        null,
        null,
        null,
        'Volume_17_Pochita_Sketch_3',
    ],
    [
        null,
        'Volume_18_Pochita_Sketch_1',
        null,
        null,
        null,
        null,
        'Volume_18_Pochita_Sketch_2',
        null,
        'Volume_18_Pochita_Sketch_3',
        null,
        null,
    ],
    [
        null,
        null,
        null,
        'Volume_19_Pochita_Sketch_1',
        null,
        'Volume_19_Pochita_Sketch_2',
        null,
        null,
        'Volume_19_Pochita_Sketch_3',
        null,
        'Volume_19_Pochita_Sketch_4',
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
        null,
        null,
    ],
] as const;

export const CHAPTER_PICTURES_FLAT = CHAPTER_PICTURES.flat() as Flatten<
    typeof CHAPTER_PICTURES
>;

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
    'Denji_fighting_zombies',
    'Denji_attacking_the_Bat_Devil',
    'Denji_fighting_the_Eternity_Devil',
    'Denji_engaging_the_Katana_Man',
    'Denji_engaging_Reze',
    'Denji_engaging_Santa_Claus',
    'Chainsaw_vs_Gun_Fiend',
    'Hybrids_attacking_Chainsaw',
    'Asa_vs_Yuko_as_Justice_Devil',
    'Dating_Denji_arc_infobox_picture',
    'Denji_tears_through_the_Falling_Devil',
    'Denji_and_Miri_impale_each_other',
    'Chainsaw_vs_Aging',
    null,
] as const;

export const CHAPTER_NAMES = [
    'Dog & Chainsaw',
    'The Place Where Pochita Is',
    'Arrival in Tokyo',
    'Power',
    'A Way to Touch Some Boobs',
    'Service',
    "Meowy's Whereabouts",
    'Chainsaw vs. Bat',
    'Rescue',
    'Kon',
    'Compromise',
    'Squeeze',
    'Gun Devil',
    'French Kiss',
    'Endless 8th Floor',
    'The First Taste',
    'Kill Denji',
    'Chainsaw vs Eternity',
    'Nobel Prize',
    'Drinking',
    'Taste of a Kiss',
    'Cola-Flavor Chupa Chups',
    'Gunfire',
    'Curse',
    'Ghost, Snake, Chainsaw',
    'The Gun is Mightier',
    'From Kyoto',
    'Secrets & Lies',
    'Perfect Score',
    'Bruised & Battered',
    'The Future Rules',
    'Over and Over Again',
    'Mission Start',
    'Full Team',
    'Minor',
    'Katana vs. Chainsaw',
    'Train, Head, Chainsaw',
    'Easy Revenge!',
    'Tearjerker',
    'Love, Flower, Chainsaw',
    'Before the Storm',
    'Teach Me How To Swim',
    'Jane Fell Asleep in the Church',
    'Boom Boom Boom',
    'A Fine Day for Explosions',
    'Massacre Melody',
    'Luck with Women',
    'Kaboom Kaboom Kaboom',
    'Shark Hurricane',
    'Sharknado',
    'Dark Diving',
    'Lost Love, Flower, Chainsaw',
    'In a Dream',
    'To Go to Enoshima',
    "Let's Go",
    'A Curse and A First',
    'Suddenly',
    'Yutaro Kurose',
    'Mess',
    "Quanxi and Fiends' 49-Person Massacre",
    'News Reporter',
    'Super Mess',
    'Trip to Hell',
    'Welcome to Hell',
    'The Darkness Devil',
    'Woof!',
    'The First Devil Hunter',
    'Dark Power',
    'Shining Power',
    'Pinch',
    'Bath',
    'All Together',
    'Everyday Life No More',
    'What the Waves Say',
    '9, 12',
    "Don't Open It",
    'Ring Ring Ring',
    'Snowball Fight',
    'Play Catch',
    "A Dog's Feeling",
    'Paw',
    'Always Eat a Hearty Breakfast',
    'Death, Resurrection, Chainsaw',
    'Hero of Hell',
    'Bloody Good Gut Feeling',
    'Date Chainsaw',
    'Chainsaw Man Vs. the Horrifying Weapon Humans',
    'Star Chainsaw',
    "Go Get 'Em, Chainsaw Man",
    'Super Power',
    'Power, Power, Power',
    'Vanilla Sky',
    'You & Crappy Movies',
    'Chainsaw Man vs. the Weapon Humans',
    'Chainsaw Man vs. Control Devil',
    'This Kind of Taste',
    'I, Love, Chainsaw',
    'Bird and War',
    'Two Birds',
    'How to Walk Shoeless',
    'After School Devil Hunters',
    'Save the Cat',
    'Denji Dream',
    'Spoiler',
    'Red Hot',
    'Bonfire',
    'School Attacker',
    'Something Important to Asa',
    'The Easy Way to Stop Bullying',
    'A Ring in the Night',
    'Aha Ha Ha Ha',
    'Between Cat and Criminal',
    'I Wanna See Penguins!',
    'Endless Aquarium',
    'High Schoolers These Days',
    'Taste of Starfish',
    'Penguin and Weapon',
    'Saying Goodbye',
    'Thief',
    'Triangle',
    'Theory of Happiness',
    'The Prophecies',
    "Hors D'oeuvre",
    'Soup',
    'Apple Thief',
    'Food Fight',
    'Save the Asa',
    'Main Dish',
    'Save Me, Chainsaw Man',
    'Kill Building',
    'Taste of Crap',
    'Protection',
    'Chainsaw Man Protest',
    'Ordinary Happiness',
    'Sentimental Drive',
    'Normal Life',
    'Chu Chu Lovely Muni Muni Mura Mura',
    'Sword Man',
    "A Chair's Feelings",
    'Scales',
    'Normal Life Plus',
    'Denji Fan Club',
    'Rawr',
    'Guns, Nails, Katana',
    'Kumbaya',
    'Chainsaw Man War',
    'Cremation',
    'Room 606 Sword',
    "Devil's Choice",
    "Dream's Next Stage",
    'The Return of Chainsaw Man',
    'Massage',
    'Chainsaw Man Hunters',
    'All Pets',
    'The Old Me',
    'Whup Whup Whup Whup Bzzz Split Split',
    'College Fund',
    'Gyohnee Guillotine',
    'Attack on Samurai',
    'That For Which The Heart Beats',
    'Chainsaw Man Puzzle',
    'Fearsome',
    'Dream Balls',
    'Charred Remains',
    'Everyday Scenery',
    'Rain, Brothel, Removal',
    'Super Smooch',
    'Kiss, Love, Sperm',
    'Hands and Adaptation',
    'How to Eat Sushi',
    'Special Division 5',
    'Bzzz! Boom! Chomp!',
    'Hard of Hearing',
    'Ayyy, Aging',
    'Both Hands',
    'Two Children',
    'Trigger Finger',
    'Gun Goddess',
    'Vamvagah',
    "Aging's World",
    'Trees on the Mind',
    'Cute',
    'Barf, Head, Perv',
    'Run, Denji!',
    'Stomach in Another World',
    'Yank, Blorsh, Bdroom',
    'Barf!',
    'Octopus, War, Chainsaw',
    'Heart Pass, Octopus',
    'To Their Respective Worlds',
    "Cuz I'm a Devil",
    'How Devils Play',
    'Burning Kiss',
    'Fun School Festival',
    'Kill Me Tears',
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
    ...map(range(1, VOLUMES_TOTAL), n => `Volume_${pad(n)}` as const),
    null,
] as const;

export const SEASON_COVERS = [
    'Chainsaw_Man_Anime_Key_Visual_1',
    'Chainsaw_Man_Movie_-_Reze_Arc_Key_Visual_1',
    null,
    null,
] as const;

export const CHAPTERS_PER_SEASON: [number, number][] = [
    [1, 38],
    [39, 52],
    [53, 97],
    [98, CHAPTERS_TOTAL],
];

export const EPISODE_THUMBNAILS = map(range(1, 13), n => n.toString());

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

export const CHAPTER_DATES = map(
    [
        'December 3, 2018',
        'December 10, 2018',
        'December 17, 2018',
        'December 22, 2018',
        'January 7, 2019',
        'January 21, 2019',
        'January 28, 2019',
        'February 4, 2019',
        'February 11, 2019',
        'February 18, 2019',
        'February 25, 2019',
        'March 4, 2019',
        'March 11, 2019',
        'March 18, 2019',
        'March 25, 2019',
        'April 1, 2019',
        'April 8, 2019',
        'April 15, 2019',
        'April 22, 2019',
        'April 27, 2019',
        'May 13, 2019',
        'May 20, 2019',
        'May 27, 2019',
        'June 3, 2019',
        'June 10, 2019',
        'June 17, 2019',
        'June 24, 2019',
        'July 1, 2019',
        'July 8, 2019',
        'July 13, 2019',
        'July 22, 2019',
        'July 29, 2019',
        'August 5, 2019',
        'August 18, 2019',
        'August 26, 2019',
        'September 2, 2019',
        'September 9, 2019',
        'September 14, 2019',
        'September 21, 2019',
        'September 30, 2019',
        'October 7, 2019',
        'October 12, 2019',
        'October 21, 2019',
        'October 28, 2019',
        'November 2, 2019',
        'November 11, 2019',
        'November 18, 2019',
        'November 25, 2019',
        'December 2, 2019',
        'December 9, 2019',
        'December 15, 2019',
        'December 23, 2019',
        'January 3, 2020',
        'January 20, 2020',
        'January 27, 2020',
        'February 3, 2020',
        'February 10, 2020',
        'February 17, 2020',
        'February 22, 2020',
        'March 2, 2020',
        'March 9, 2020',
        'March 16, 2020',
        'March 23, 2020',
        'March 30, 2020',
        'April 6, 2020',
        'April 13, 2020',
        'April 27, 2020',
        'May 11, 2020',
        'May 18, 2020',
        'May 25, 2020',
        'June 1, 2020',
        'June 7, 2020',
        'June 15, 2020',
        'June 22, 2020',
        'June 26, 2020',
        'July 5, 2020',
        'July 12, 2020',
        'July 19, 2020',
        'August 2, 2020',
        'August 10, 2020',
        'August 23, 2020',
        'August 30, 2020',
        'September 6, 2020',
        'September 13, 2020',
        'September 20, 2020',
        'September 27, 2020',
        'October 4, 2020',
        'October 11, 2020',
        'October 16, 2020',
        'October 26, 2020',
        'November 2, 2020',
        'November 9, 2020',
        'November 16, 2020',
        'November 21, 2020',
        'November 30, 2020',
        'December 7, 2020',
        'December 14, 2020',
        'July 13, 2022',
        'July 20, 2022',
        'July 27, 2022',
        'August 3, 2022',
        'August 17, 2022',
        'August 31, 2022',
        'September 14, 2022',
        'September 28, 2022',
        'October 12, 2022',
        'October 19, 2022',
        'October 26, 2022',
        'November 2, 2022',
        'November 9, 2022',
        'November 16, 2022',
        'November 23, 2022',
        'December 7, 2022',
        'December 21, 2022',
        'December 28, 2022',
        'January 4, 2023',
        'January 11, 2023',
        'January 18, 2023',
        'February 1, 2023',
        'February 15, 2023',
        'February 22, 2023',
        'March 8, 2023',
        'March 15, 2023',
        'March 29, 2023',
        'April 5, 2023',
        'April 12, 2023',
        'April 19, 2023',
        'April 26, 2023',
        'May 10, 2023',
        'May 24, 2023',
        'May 31, 2023',
        'June 14, 2023',
        'June 21, 2023',
        'June 28, 2023',
        'July 12, 2023',
        'July 19, 2023',
        'July 26, 2023',
        'August 9, 2023',
        'August 16, 2023',
        'August 23, 2023',
        'August 30, 2023',
        'September 13, 2023',
        'September 20, 2023',
        'September 27, 2023',
        'October 11, 2023',
        'October 18, 2023',
        'November 1, 2023',
        'November 15, 2023',
        'November 22, 2023',
        'December 6, 2023',
        'December 20, 2023',
        'January 10, 2024',
        'January 24, 2024',
        'January 31, 2024',
        'February 14, 2024',
        'February 28, 2024',
        'March 6, 2024',
        'March 13, 2024',
        'March 20, 2024',
        'March 27, 2024',
        'April 3, 2024',
        'April 10, 2024',
        'April 24, 2024',
        'May 1, 2024',
        'May 15, 2024',
        'May 22, 2024',
        'June 5, 2024',
        'June 12, 2024',
        'June 26, 2024',
        'July 3, 2024',
        'July 17, 2024',
        'July 24, 2024',
        'August 7, 2024',
        'August 14, 2024',
        'August 21, 2024',
        'September 4, 2024',
        'September 18, 2024',
        'September 25, 2024',
        'October 2, 2024',
        'October 16, 2024',
        'October 23, 2024',
        'November 6, 2024',
        'November 13, 2024',
        'November 20, 2024',
        'November 27, 2024',
        'December 11, 2024',
        'December 18, 2024',
        'January 1, 2025',
        'January 8, 2025',
        'January 15, 2025',
        'January 29, 2025',
        'February 5, 2025',
        'February 12, 2025',
        'February 26, 2025',
        'March 5, 2025',
    ] as const,
    d => new Date(`${d} GMT+9`) // Tokyo timezone
);

const groupBy = <T>(array: T[], getKey: (el: T) => number) =>
    array.reduce<[[number, T][][], number | null]>(
        ([groups, previous], date, idx) => {
            const key = getKey(date);
            if (key === previous) {
                groups[groups.length - 1]!.push([idx, date]);
            } else {
                groups.push([[idx, date]]);
            }
            return [groups, key];
        },
        [[], null]
    )[0];

export const CHAPTER_DATES_BY_MONTH = groupBy(
    CHAPTER_DATES,
    date => date.getMonth() + 1
);

export const CHAPTER_DATES_BY_YEAR = groupBy(
    CHAPTER_DATES,
    date => date.getFullYear() + 1
);

type Offset = { x: number; y: number };

export const ARC_OFFSETS: Tuple<Offset, typeof ARCS_TOTAL> = [
    { x: 130, y: 0 },
    { x: 220, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 150 },
    { x: 0, y: 90 },
    { x: 0, y: 750 },
    { x: 0, y: 250 },
    { x: 0, y: 120 },
    { x: 0, y: 0 },
    { x: 150, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 430 },
    { x: 0, y: 250 },
    { x: 0, y: 0 },
];

export const EPISODE_OFFSETS: Tuple<Offset, typeof EPISODES_TOTAL> = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 20, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
];

export const SEASON_OFFSETS: Tuple<Offset, 2> = [
    { x: 0, y: 1900 },
    { x: 0, y: 800 },
];

export const EPISODE_TITLES = [
    'Dog & Chainsaw',
    'Arrival in Tokyo',
    "Meowy's Whereabouts",
    'Rescue',
    'Gun Devil',
    'Kill Denji',
    'The Taste of a Kiss',
    'Gunfire',
    'From Kyoto',
    'Bruised & Battered',
    'Mission Start',
    'Katana vs. Chainsaw',
] as const;

export const SEASON_TITLES = [
    'Chainsaw Man (Anime)',
    'Chainsaw Man – The Movie: Reze Arc',
] as const;

export const VOLUME_TITLES = [
    'Dog & Chainsaw',
    'Chainsaw vs. Bat',
    'Kill Denji',
    'The Gun is Mightier',
    'Minor',
    'Boom Boom Boom',
    'In a Dream',
    'Super Mess',
    'Bath',
    "A Dog's Feeling",
    "Go Get 'Em, Chainsaw Man",
    'Bird and War',
    'Spoiler',
    'I Wanna See Penguins!',
    "Hors D'oeuvre",
    'Ordinary Happiness',
    'Guns, Nails, Katana',
    'All Pets',
    'Everyday Scenery',
    'Two Children',
] as const;

type Covers = {
    season: typeof SEASON_COVERS;
    episode: typeof EPISODE_THUMBNAILS;
    arc: typeof ARC_IMAGES;
    chapter: typeof CHAPTER_PICTURES_FLAT;
    volume: typeof VOLUME_COVERS;
};

type Titles = {
    season: typeof SEASON_TITLES;
    episode: typeof EPISODE_TITLES;
    arc: typeof ARC_NAMES;
    chapter: typeof CHAPTER_NAMES;
    volume: typeof VOLUME_TITLES;
};

type Offsets = {
    season: typeof SEASON_OFFSETS;
    episode: typeof EPISODE_OFFSETS;
    arc: typeof ARC_OFFSETS;
};

export type TimelineInfoType =
    | 'season'
    | 'episode'
    | 'arc'
    | 'chapter'
    | 'volume';

export type TimelineInfoMap = {
    [K in TimelineInfoType]: {
        type: K;
        covers: Covers[K];
        fit?: 'contain' | 'cover';
        backgroundColor?: 'black' | 'white';
        scale?: number;
        titles: Titles[K];
        sidewaysText?: boolean;
        blankfontSize: number;
        titleFontSize: number;
        titleProcessor?: (title: string, n: number) => string;
        height: number;
        widthHandler: (
            itemNumber: number,
            unboundedChapterWidth: boolean
        ) => number;
        wikiLink: (name: string, n: number) => string;
        offsets?: K extends keyof Offsets ? Offsets[K] : undefined;
        focusable?: boolean;
        timeline?: TimelineInfoItem;
    };
}[TimelineInfoType];

export type TimelineInfoItem = { type: 'timeline' } | TimelineInfoMap;

export const TIMELINE_INFO: TimelineInfoItem[] = [
    {
        type: 'season',
        height: SEASON_HEIGHT,
        covers: SEASON_COVERS,
        titles: SEASON_TITLES,
        blankfontSize: 250,
        titleFontSize: 100,
        widthHandler: getSeasonWidth,
        wikiLink: season => `https://chainsaw-man.fandom.com/wiki/${season}`,
        offsets: SEASON_OFFSETS,
        timeline: {
            type: 'episode',
            height: EPISODE_HEIGHT,
            covers: EPISODE_THUMBNAILS,
            scale: 1.2,
            titles: EPISODE_TITLES,
            titleProcessor: (title, idx) => `${title}\n(Episode ${idx})`,
            blankfontSize: 42,
            titleFontSize: 42,
            widthHandler: getEpisodeWidth,
            wikiLink: (_, n) =>
                `https://chainsaw-man.fandom.com/wiki/Episode_${n}`,
            offsets: EPISODE_OFFSETS,
        },
    },
    {
        type: 'arc',
        height: ARC_HEIGHT,
        covers: ARC_IMAGES,
        titles: ARC_NAMES,
        sidewaysText: true,
        titleProcessor: title => `${title} arc`,
        blankfontSize: 100,
        titleFontSize: 100,
        widthHandler: getArcWidth,
        wikiLink: arcName =>
            `https://chainsaw-man.fandom.com/wiki/${arcName}_arc`,
        offsets: ARC_OFFSETS,
    },
    {
        type: 'timeline',
    },
    {
        type: 'chapter',
        height: CHAPTER_HEIGHT,
        covers: CHAPTER_PICTURES_FLAT,
        fit: 'contain',
        backgroundColor: 'white',
        titles: CHAPTER_NAMES,
        titleProcessor: title => title,
        blankfontSize: 45,
        titleFontSize: 45,
        widthHandler: getChapterWidth,
        wikiLink: (_, n) => `https://chainsaw-man.fandom.com/wiki/Chapter_${n}`,
        focusable: true,
    },
    {
        type: 'volume',
        height: VOLUME_HEIGHT,
        covers: VOLUME_COVERS,
        titles: VOLUME_TITLES,
        titleProcessor: (title, n) => `${title}\n(Volume ${n})`,
        blankfontSize: 500,
        titleFontSize: 100,
        widthHandler: getVolumeWidth,
        wikiLink: (_, n) => `https://chainsaw-man.fandom.com/wiki/Volume_${n}`,
    },
];

export const FLOATING_BUTTONS: {
    filename: string;
    title: string;
    option: keyof SettingsValues;
}[] = [
    { filename: 'pochita2', title: 'Read info', option: 'infoBoxOpen' },

    {
        filename: 'pochita3',
        title: 'Toggle unbounded chapter width',
        option: 'unboundedChapterWidth',
    },
    ...(!isMobileDevice() // include cross-lines button only on desktop
        ? [
              {
                  filename: 'pochita6',
                  title: 'Toggle cross-lines',
                  option: 'showCrosslines',
              } as const,
          ]
        : []),
    {
        filename: 'pochita4',
        title: 'Open chapter calendar',
        option: 'calendarOpen',
    },
    {
        filename: 'pochita5',
        title: 'Toggle always show titles',
        option: 'showTitles',
    },
];
