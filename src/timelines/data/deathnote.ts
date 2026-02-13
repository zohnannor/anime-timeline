import {
    getArcWidth,
    getChapterWidth,
    getEpisodeWidth,
    getSagaWidth,
    getSeasonWidth,
    getVolumeWidth,
} from '@shared/lib/helpers';
import { pad, Tuple } from '@shared/lib/util';
import { Arc, Season, Timeline, TimelineData, Volume } from '../types';

const SEASON_HEIGHT = 1600;
const EPISODE_HEIGHT = SEASON_HEIGHT * 0.2;
const VOLUME_HEIGHT = 1576;
const CHAPTER_HEIGHT = 100;
const ARC_HEIGHT = 200;
const SAGA_HEIGHT = ARC_HEIGHT;

const VOLUMES_TOTAL = 13;
const ARCS_TOTAL = 2;
const SEASONS_TOTAL = 1;

const volumeTitleChapters = [0, 2, 6, 1, 0, 4, 6, 1, 0, 3, 0, 9];
const volumeTitle = (timeline: TimelineData, idx: number) =>
    timeline.volumes[idx]!.chapters[volumeTitleChapters[idx]!]!.title(
        timeline,
        idx,
    );
const volumeCover = (timeline: TimelineData, idx: number) =>
    `Volume_${idx + 1}.-_${timeline.volumes[idx]!.title(
        timeline,
        idx,
    ).replaceAll(' ', '_')}`;
const chapterLinkExceptions = [
    'Matsuda',
    'Give-and-Take',
    'Confluence',
    'Hard Run',
    'Love',
    'Whiteout',
    'Zero',
    'Yotsuba',
    'Contact',
    'Kindred Spirits',
];
const chapterLink = (title: string, n: number): string =>
    n <= 21 ? `Chapter_${n}`
    : chapterLinkExceptions.includes(title) ? `${title} (chapter)`
    : (
        title === 'Target' // first one is in 0..21
    ) ?
        'Target (chapter 63)'
    : n === 62 ? 'The Decision'
    : title;
const episodeCover = (_: TimelineData, idx: number) => pad(idx + 1);
const episodeLinkExceptions = ['Love', 'Decision', 'New World', 'Matsuda'];

export const DEATHNOTE_TIMELINE: Timeline = {
    layout: {
        season: {
            type: 'season',
            height: SEASON_HEIGHT,
            width: getSeasonWidth,
            blankfontSize: 250,
            titleFontSize: 100,
            numberProcessor: n => (n - 1).toString(),
            sectionLink: 'Death Note (anime)',
            wikiLink: title => title,
            subTimeline: {
                type: 'episode',
                height: EPISODE_HEIGHT,
                width: getEpisodeWidth,
                scale: 1.2,
                titleProcessor: (title, n) => `${title}\n(Episode ${n})`,
                blankfontSize: 42,
                titleFontSize: 42,
                sectionLink: 'Death Note (anime)',
                wikiLink: title =>
                    episodeLinkExceptions.includes(title) ?
                        `${title} (episode)`
                    :   title,
            },
        },
        saga: {
            type: 'saga',
            height: SAGA_HEIGHT,
            width: getSagaWidth,
            blankfontSize: 100,
            titleFontSize: 100,
            sectionLink: 'Part I',
            wikiLink: () => 'unused',
            subTimeline: {
                type: 'arc',
                height: ARC_HEIGHT,
                width: getArcWidth,
                titleProcessor: title => title,
                blankfontSize: 100,
                titleFontSize: 100,
                sectionLink: 'Part I',
                wikiLink: title => title,
            },
        },
        timeline: {
            type: 'timeline',
        },
        chapter: {
            type: 'chapter',
            height: CHAPTER_HEIGHT,
            width: getChapterWidth,
            fit: 'contain',
            backgroundColor: 'white',
            blankfontSize: 45,
            titleFontSize: 45,
            sectionLink: 'List_of_Death_Note_chapters#List_of_volumes',
            wikiLink: chapterLink,
            focusable: true,
        },
        volume: {
            type: 'volume',
            height: VOLUME_HEIGHT,
            width: getVolumeWidth,
            defaultCoverPosition: 'top',
            titleProcessor: (title, n) => `${title}\n(Volume ${n})`,
            blankfontSize: 500,
            titleFontSize: 100,
            sectionLink: 'List_of_Death_Note_chapters#List_of_volumes',
            wikiLink: title =>
                chapterLinkExceptions.includes(title) ? `${title} (volume)`
                : title === 'Target' ? 'Target (volume)'
                : title === 'Boredom' ? 'Boredom (volume)'
                : title === 'Finis' ? 'Finis (volume)'
                : title,
        },
    },
    data: {
        title: 'Death Note',
        volumes: [
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Boredom',
                        date: 'February 2, 2004',
                        pages: 50,
                        cover: null,
                    },
                    {
                        title: () => 'L',
                        date: 'February 2, 2004',
                        pages: 29,
                        cover: null,
                    },
                    {
                        title: () => 'Family',
                        date: 'February 2, 2004',
                        pages: 25,
                        cover: null,
                    },
                    {
                        title: () => 'Current',
                        date: 'February 2, 2004',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Eyeballs',
                        date: 'February 2, 2004',
                        pages: 18,
                        cover: null,
                    },
                    {
                        title: () => 'Manipulation',
                        date: 'February 2, 2004',
                        pages: 23,
                        cover: null,
                    },
                    {
                        title: () => 'Target',
                        date: 'February 2, 2004',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Woman',
                        date: 'July 2, 2004',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Slots',
                        date: 'July 2, 2004',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Confluence',
                        date: 'July 2, 2004',
                        pages: 23,
                        cover: null,
                    },
                    {
                        title: () => 'One',
                        date: 'July 2, 2004',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'God',
                        date: 'July 2, 2004',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Countdown',
                        date: 'July 2, 2004',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Temptation',
                        date: 'July 2, 2004',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Phone Call',
                        date: 'July 2, 2004',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Handstand',
                        date: 'July 2, 2004',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Trash',
                        date: 'September 3, 2004',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Gaze',
                        date: 'September 3, 2004',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Humiliation',
                        date: 'September 3, 2004',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'First Move',
                        date: 'September 3, 2004',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Duplicity',
                        date: 'September 3, 2004',
                        pages: 23,
                        cover: null,
                    },
                    {
                        title: () => 'Misfortune',
                        date: 'September 3, 2004',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Hard Run',
                        date: 'September 3, 2004',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Shield',
                        date: 'September 3, 2004',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Fool',
                        date: 'September 3, 2004',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Reversal',
                        date: 'November 11, 2004',
                        pages: 23,
                        cover: null,
                    },
                    {
                        title: () => 'Love',
                        date: 'November 11, 2004',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Judgment',
                        date: 'November 11, 2004',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Weapon',
                        date: 'November 11, 2004',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Bomb',
                        date: 'November 11, 2004',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Easy',
                        date: 'November 11, 2004',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Gamble',
                        date: 'November 11, 2004',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Removal',
                        date: 'November 11, 2004',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Imprisonment',
                        date: 'November 11, 2004',
                        pages: 21,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Whiteout',
                        date: 'February 4, 2005',
                        pages: 23,
                        cover: null,
                    },
                    {
                        title: () => 'Father and Son',
                        date: 'February 4, 2005',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'The Eight',
                        date: 'February 4, 2005',
                        pages: 22,
                        cover: null,
                    },
                    {
                        title: () => 'Strike',
                        date: 'February 4, 2005',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Separation',
                        date: 'February 04, 2005',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Allies',
                        date: 'February 4, 2005',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Matsuda',
                        date: 'February 4, 2005',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Heaven',
                        date: 'February 4, 2005',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Black',
                        date: 'February 4, 2005',
                        pages: 23,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Successor',
                        date: 'April 4, 2005',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Crazy',
                        date: 'April 4, 2005',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Ill-Suited',
                        date: 'April 4, 2005',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Impertinence',
                        date: 'April 4, 2005',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Give-and-Take',
                        date: 'April 4, 2005',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Potted Plant',
                        date: 'April 4, 2005',
                        pages: 22,
                        cover: null,
                    },
                    {
                        title: () => 'Yotsuba',
                        date: 'April 4, 2005',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Misunderstanding',
                        date: 'April 4, 2005',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Split-Second',
                        date: 'April 4, 2005',
                        pages: 31,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Scream',
                        date: 'July 4, 2005',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Inside',
                        date: 'July 4, 2005',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Creation',
                        date: 'July 4, 2005',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Embrace',
                        date: 'July 4, 2005',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Two Choices',
                        date: 'July 4, 2005',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Feelings Within',
                        date: 'July 4, 2005',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Zero',
                        date: 'July 4, 2005',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Kidnapping',
                        date: 'July 4, 2005',
                        pages: 36,
                        cover: null,
                    },
                    {
                        title: () => 'Number Two',
                        date: 'July 4, 2005',
                        pages: 21,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Decision',
                        date: 'September 2, 2005',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Target',
                        date: 'September 2, 2005',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Right Angle',
                        date: 'September 2, 2005',
                        pages: 27,
                        cover: null,
                    },
                    {
                        title: () => 'Responsibility',
                        date: 'September 2, 2005',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Death',
                        date: 'September 2, 2005',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Button',
                        date: 'September 2, 2005',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Discovery',
                        date: 'September 2, 2005',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Flight',
                        date: 'September 2, 2005',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Tremble',
                        date: 'September 2, 2005',
                        pages: 22,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Contact',
                        date: 'December 2, 2005',
                        pages: 20,
                        cover: null,
                    },
                    {
                        title: () => 'Verification',
                        date: 'December 2, 2005',
                        pages: 20,
                        cover: null,
                    },
                    {
                        title: () => 'Cornered',
                        date: 'December 2, 2005',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'A Fine Performance',
                        date: 'December 2, 2005',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Acknowledgement',
                        date: 'December 2, 2005',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Greetings',
                        date: 'December 2, 2005',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Use',
                        date: 'December 2, 2005',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Prediction',
                        date: 'December 2, 2005',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Lies',
                        date: 'December 2, 2005',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                title: () => 'Deletion',
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Clean-Up',
                        date: 'February 3, 2006',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Warning',
                        date: 'February 3, 2006',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Himself',
                        date: 'February 3, 2006',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Delete',
                        date: 'February 3, 2006',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Coincidence',
                        date: 'February 3, 2006',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Election',
                        date: 'February 3, 2006',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Japan',
                        date: 'February 3, 2006',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Tomorrow',
                        date: 'February 3, 2006',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Conversation',
                        date: 'February 3, 2006',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Kindred Spirits',
                        date: 'May 2, 2006',
                        pages: 20,
                        cover: null,
                    },
                    {
                        title: () => 'Preview',
                        date: 'May 2, 2006',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Standstill',
                        date: 'May 2, 2006',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Night',
                        date: 'May 2, 2006',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Decision',
                        date: 'May 2, 2006',
                        pages: 20,
                        cover: null,
                    },
                    {
                        title: () => 'Outside',
                        date: 'May 2, 2006',
                        pages: 20,
                        cover: null,
                    },
                    {
                        title: () => 'Convinced',
                        date: 'May 2, 2006',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Meanwhile',
                        date: 'May 2, 2006',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Miscellaneous',
                        date: 'May 2, 2006',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Everybody',
                        date: 'May 2, 2006',
                        pages: 22,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Two',
                        date: 'July 4, 2006',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Face to Face',
                        date: 'July 4, 2006',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Inducement',
                        date: 'July 4, 2006',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Patience',
                        date: 'July 4, 2006',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Declaration',
                        date: 'July 4, 2006',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Answer',
                        date: 'July 4, 2006',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Impossible',
                        date: 'July 4, 2006',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Intent to Kill',
                        date: 'July 4, 2006',
                        pages: 20,
                        cover: null,
                    },
                    {
                        title: () => 'Curtain',
                        date: 'July 4, 2006',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Finis',
                        date: 'July 4, 2006',
                        pages: 22,
                        cover: null,
                    },
                ],
            },
            {
                title: () => 'How to Read',
                cover: () => 'How_to_Read_13',
                chapters: [
                    {
                        title: () => 'The Taro Kagami Story',
                        date: 'October 13, 2006',
                        pages: 55,
                        cover: null,
                    },
                    {
                        title: () => 'The C-Kira Story',
                        date: 'October 2, 2016',
                        pages: 44,
                        cover: null,
                    },
                    {
                        title: () => 'The a-Kira Story',
                        date: 'February 4, 2021',
                        pages: 87,
                        cover: null,
                    },
                ],
            },
        ] as const satisfies Tuple<Volume, typeof VOLUMES_TOTAL>,
        sagas: [
            {
                title: 'unused',
                cover: null,
                chapters: { from: 1, to: 108 },
                arcs: [
                    {
                        title: 'Part I',
                        cover: null,
                        chapters: { from: 1, to: 59 },
                    },
                    {
                        title: 'Part II',
                        cover: null,
                        chapters: { from: 60, to: 108 },
                    },
                ] as const satisfies Tuple<Arc, typeof ARCS_TOTAL>,
            },
        ],
        seasons: [
            {
                title: 'Death Note (anime)',
                cover: () => 'DEATH_NOTE_anime',
                offset: { x: 0, y: 3075 },
                chapters: { from: 1, to: 107 }, // not a typo
                episodes: [
                    // https://discord.com/channels/349085232521150474
                    {
                        title: () => 'Rebirth',
                        cover: () => 'Light_Holding_Death_Note',
                        offset: { x: 50, y: 0 },
                        chapters: { from: 1, to: 1 },
                    },
                    {
                        title: () => 'Confrontation',
                        cover: () => 'L_on_Screen',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 2, to: 3 },
                    },
                    {
                        title: () => 'Dealings',
                        cover: () => "Light's_Lifetime",
                        offset: { x: 0, y: 0 },
                        chapters: { from: 4, to: 5 },
                    },
                    {
                        title: () => 'Pursuit',
                        cover: () => 'Light_and_Ryuk.PNG',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 6, to: 7 },
                    },
                    {
                        title: () => 'Tactics',
                        cover: () => 'Light_and_Pember',
                        offset: { x: 1, y: 0 },
                        chapters: { from: 8, to: 10 },
                    },
                    {
                        title: () => 'Unraveling',
                        cover: episodeCover,
                        offset: { x: 250, y: 0 },
                        chapters: { from: 11, to: 12 },
                    },
                    {
                        title: () => 'Overcast',
                        cover: () => 'Naomi_Controlled',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 13, to: 14 },
                    },
                    {
                        title: () => 'Glare',
                        cover: () => 'Potato_Chips',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 15, to: 17 },
                    },
                    {
                        title: () => 'Encounter',
                        cover: () => 'Death-Note-death-note-16391560-701-386',
                        offset: { x: 1, y: 0 },
                        chapters: { from: 18, to: 19 },
                    },
                    {
                        title: () => 'Doubt',
                        cover: () => 'L_and_Ligth_Tennis',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 20, to: 22 },
                    },
                    {
                        title: () => 'Assault',
                        cover: () => 'Kira_on_screen',
                        offset: { x: 100, y: 0 },
                        chapters: { from: 23, to: 25 },
                    },
                    {
                        title: () => 'Love',
                        cover: () => 'Gealus_death',
                        offset: { x: 200, y: 0 },
                        chapters: { from: 26, to: 27 },
                    },
                    {
                        title: () => 'Confession',
                        cover: episodeCover,
                        offset: { x: 200, y: 0 },
                        chapters: { from: 28, to: 29 },
                    },
                    {
                        title: () => 'Friend',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 30, to: 31 },
                    },
                    {
                        title: () => 'Wager',
                        cover: episodeCover,
                        offset: { x: 200, y: 0 },
                        chapters: { from: 32, to: 33 },
                    },
                    {
                        title: () => 'Decision',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 34, to: 35 },
                    },
                    {
                        title: () => 'Execution',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 36, to: 37 },
                    },
                    {
                        title: () => 'Ally',
                        cover: episodeCover,
                        offset: { x: 50, y: 0 },
                        chapters: { from: 38, to: 40 },
                    },
                    {
                        title: () => 'Matsuda',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 41, to: 43 },
                    },
                    {
                        title: () => 'Makeshift',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 44, to: 45 },
                    },
                    {
                        title: () => 'Performance',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 46, to: 48 },
                    },
                    {
                        title: () => 'Guidance',
                        cover: episodeCover,
                        offset: { x: 250, y: 0 },
                        chapters: { from: 49, to: 50 },
                    },
                    {
                        title: () => 'Frenzy',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 51, to: 52 },
                    },
                    {
                        title: () => 'Revival',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 53, to: 56 },
                    },
                    {
                        title: () => 'Silence',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 57, to: 58 },
                    },
                    {
                        title: () => 'Renewal',
                        cover: () => 'Mellonear',
                        offset: { x: 300, y: 0 },
                        chapters: { from: 59, to: 59 },
                    },
                    {
                        title: () => 'Abduction',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 60, to: 63 },
                    },
                    {
                        title: () => 'Impatience',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 64, to: 68 },
                    },
                    // 67-70 are unused
                    {
                        title: () => 'Father',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 69, to: 74 },
                    },
                    {
                        title: () => 'Justice',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 75, to: 79 },
                    },
                    {
                        title: () => 'Transfer',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 80, to: 83 },
                    },
                    {
                        title: () => 'Selection',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 84, to: 88 },
                    },
                    {
                        title: () => 'Scorn',
                        cover: episodeCover,
                        offset: { x: 1, y: 0 },
                        chapters: { from: 89, to: 92 },
                    },
                    {
                        title: () => 'Vigilance',
                        cover: episodeCover,
                        offset: { x: 75, y: 0 },
                        chapters: { from: 93, to: 96 },
                    },
                    {
                        title: () => 'Malice',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 97, to: 99 },
                    },
                    {
                        title: () => '1.28',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 100, to: 102 },
                    },
                    {
                        title: () => 'New World',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 103, to: 107 }, // not a typo
                    },
                ],
            },
        ] as const satisfies Tuple<Season, typeof SEASONS_TOTAL>,
        splitChapters: {},
        wikiBase: 'https://deathnote.fandom.com/wiki/',
        smallImages: {
            'scroller-or-favicon': 'circle',
            'read-info': 'circle',
            'toggle-unbounded-chapter-width': 'circle',
            'toggle-cross-lines': 'circle',
            'open-chapter-calendar': 'circle',
            'toggle-always-show-titles': 'circle',
            'capture-timeline': 'circle',
        },
        socialLinks: [
            {
                name: 'Manga (Japanese)',
                url: 'https://j-deathnote.com/',
            },
            {
                name: 'Manga (English)',
                url: 'https://deathnote.viz.com/',
            },
            {
                name: 'Anime (Japanese)',
                url: 'https://ntv.co.jp/deathnote/',
            },
            {
                name: 'Anime (English)',
                url: 'https://deathnote.viz.com/',
            },
        ],
    },
};
