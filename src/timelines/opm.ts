// a lot of data for a title
/* eslint-disable max-lines */
import { Tuple } from '@shared/lib/util';
import {
    ArrowRangeIcon,
    CalendarIcon,
    CameraIcon,
    EmptyIcon,
    ExpandIcon,
    ExtraIcon,
    FitIcon,
    InfoIcon,
    ListIcon,
    TitleIcon,
} from '@shared/ui/icons';
import { Saga, Season, Timeline, Volume } from '@timelines/types';

const SEASON_HEIGHT = 1200;
const EPISODE_HEIGHT = SEASON_HEIGHT * 0.2;
const VOLUME_HEIGHT = 1500;
const CHAPTER_HEIGHT = 100;
const ARC_HEIGHT = VOLUME_HEIGHT * 0.7;
const SAGA_HEIGHT = 150 + ARC_HEIGHT;

type SeasonsTotal = 5;
type VolumesTotal = 42;
type VolumesExtra = 6;
type SagasTotal = 4;

const volumeCover = (n: number) =>
    n <= 20 ? `Volume_${n}`
    : n <= 27 ? `Volume_${n}_Cover`
    : n <= 28 ? `Vol.${n}`
    : `Volume_${n}_Front_Cover`;
const episodeCover = (n: number) =>
    n <= 12 ? `Episode${n}_Pics`
    : n <= 24 ? `Season2Ep${n - 12}pics`
    : n <= 29 ? `OPMS3Ep${n - 24}`
    : `One-Punch_Man_Episode_${n}`;
const chapterLink = (title: string, n: number, extra: boolean): string =>
    !extra ?
        n <= 118 ? `Chapter ${n}`
        : n <= 126 ? `Chapter ${n - 4} (Online)`
        : n <= 129 ? `Chapter ${n - 3} (Online)`
        : n <= 130 ? `Chapter ${n}`
        : n <= 138 ? `Chapter ${n - 4} (Online)`
        : n <= 139 ? `Chapter ${n}`
        : `Chapter ${n - 5} (Online)`
    :   title;
const VOLUME_RELEASE_SPLIT_CHAPTERS = [84, 90, 96, 117, 138] as const;

export const OPM_TIMELINE: Timeline = {
    layout: {
        season: {
            type: 'season',
            height: SEASON_HEIGHT,
            blankfontSize: 250,
            titleFontSize: 100,
            sectionLink: 'One-Punch Man (anime)',
            wikiLink: title => `Animated Media#${title.replaceAll(' ', '_')}`,
            subTimeline: {
                type: 'episode',
                height: EPISODE_HEIGHT,
                scale: 1.2,
                titleProcessor: (title, n) =>
                    `${title}\n(Episode ${
                        n <= 12 ? n
                        : n <= 12 + 12 ? n - 12
                        : n - 12 - 12
                    })`,
                blankfontSize: 42,
                titleFontSize: 42,
                sectionLink: 'Episodes',
                wikiLink: (_, n) => `Episode ${n}`,
                focusable: true,
            },
        },
        saga: {
            type: 'saga',
            height: SAGA_HEIGHT,
            titleProcessor: title => `${title} Saga`,
            blankfontSize: 100,
            titleFontSize: 100,
            sectionLink: 'Story Arcs',
            wikiLink: title => `${title} Saga`,
            subTimeline: {
                type: 'arc',
                height: ARC_HEIGHT,
                sidewaysText: true,
                titleProcessor: title => `${title} Arc`,
                blankfontSize: 100,
                titleFontSize: 100,
                sectionLink: 'Story Arcs',
                wikiLink: title => title,
            },
        },
        timeline: {
            type: 'timeline',
        },
        chapter: {
            type: 'chapter',
            height: CHAPTER_HEIGHT,
            numberProcessor: (n, _, extra) =>
                !extra ?
                    `${n}\n(${
                        n -
                        VOLUME_RELEASE_SPLIT_CHAPTERS.findLastIndex(
                            ch => n >= ch + 1,
                        ) -
                        1
                    })`
                :   `X${n}`,
            fit: 'contain',
            backgroundColor: 'white',
            blankfontSize: 40,
            titleFontSize: 40,
            sectionLink: 'Chapters and Volumes#Volume_List',
            wikiLink: chapterLink,
            focusable: true,
        },
        volume: {
            type: 'volume',
            height: VOLUME_HEIGHT,
            blankfontSize: 500,
            titleFontSize: 100,
            defaultCoverPosition: 'top',
            titleProcessor: (title, n) => `${title}\n(Volume ${n})`,
            sectionLink: 'Chapters and Volumes#Volume_List',
            wikiLink: (_, n, extra) =>
                !extra ? `Volume ${n}` : 'Chapters and Volumes#Volume_List',
        },
    },
    data: {
        title: 'One-Punch Man',
        volumes: [
            {
                title: 1,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'One Punch',
                        date: 'June 14, 2012',
                        pages: 18,
                        cover: undefined,
                    },
                    {
                        title: () => 'Crab and Job Hunting',
                        date: 'June 18, 2012',
                        pages: 16,
                        cover: undefined,
                    },
                    {
                        title: () => 'A Dangerous Being',
                        date: 'June 21, 2012',
                        pages: 20,
                        cover: undefined,
                    },
                    {
                        title: () => 'Dark Undergrounders',
                        date: 'June 25, 2012',
                        pages: 19,
                        cover: undefined,
                    },
                    {
                        title: () => 'Itch Explosion',
                        date: 'June 28, 2012',
                        pages: 20,
                        cover: undefined,
                    },
                    {
                        title: () => 'Saitama',
                        date: 'July 19, 2012',
                        pages: 24,
                        cover: undefined,
                    },
                    {
                        title: () => 'Mysterious Raid',
                        date: 'July 26, 2012',
                        pages: 16,
                        cover: undefined,
                    },
                    {
                        title: () => 'You Mean This Guy?',
                        date: 'August 1, 2012',
                        pages: 22,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 3,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'House of Evolution',
                        date: 'August 8, 2012',
                        pages: 26,
                        cover: undefined,
                    },
                    {
                        title: () => 'Modern Art',
                        date: 'August 15, 2012',
                        pages: 31,
                        cover: undefined,
                    },
                    {
                        title: () => 'The Key to His Power',
                        date: 'August 22, 2012',
                        pages: 22,
                        cover: undefined,
                    },
                    {
                        title: () => 'Paradise Group',
                        date: 'August 29, 2012',
                        pages: 28,
                        cover: undefined,
                    },
                    {
                        title: () => 'Speed',
                        date: 'September 5, 2012',
                        pages: 28,
                        cover: undefined,
                    },
                    {
                        title: () => "Don't Know You",
                        date: 'September 12, 2012',
                        pages: 24,
                        cover: undefined,
                    },
                    {
                        title: () => 'Hobby and Work',
                        date: 'September 29, 2012',
                        pages: 35,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 5,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Passed the Exam',
                        date: 'October 4, 2012',
                        pages: 23,
                        cover: undefined,
                    },
                    {
                        title: () => 'Sparring',
                        date: 'October 26, 2012',
                        pages: 74,
                        cover: undefined,
                    },
                    {
                        title: () => 'Business Activity',
                        date: 'December 10, 2012',
                        pages: 22,
                        cover: undefined,
                    },
                    {
                        title: () => 'No Time for This',
                        date: 'December 21, 2012',
                        pages: 27,
                        cover: undefined,
                    },
                    {
                        title: () => 'Rumor',
                        date: 'December 28, 2012',
                        pages: 40,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 1,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Giant Meteor',
                        date: 'February 1, 2013',
                        pages: 183,
                        cover: undefined,
                    },
                    {
                        title: () => 'Voices',
                        date: 'April 4, 2013',
                        pages: 41,
                        cover: undefined,
                    },
                    {
                        title: () => 'Threat from the Sea',
                        date: 'April 19, 2013',
                        pages: 27,
                        cover: undefined,
                    },
                    {
                        title: () => 'Deep Sea King',
                        date: 'May 16, 2013',
                        pages: 22,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 3,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Deep Sea King 2',
                        date: 'June 13, 2013',
                        pages: 68,
                        cover: undefined,
                    },
                    {
                        title: () => 'Glimmer of Hope',
                        date: 'June 13, 2013',
                        pages: 29,
                        cover: undefined,
                    },
                    {
                        title: () => 'Beat-Up But Shining',
                        date: 'August 3, 2013',
                        pages: 30,
                        cover: undefined,
                    },
                    {
                        title: () => "Since It's Raining",
                        date: 'August 29, 2013',
                        pages: 24,
                        cover: undefined,
                    },
                    {
                        title: () => 'B-Class',
                        date: 'September 19, 2013',
                        pages: 19,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 2,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'S-Class',
                        date: 'October 3, 2013',
                        pages: 21,
                        cover: undefined,
                    },
                    {
                        title: () => 'Great Prophecy',
                        date: 'November 21, 2013',
                        pages: 29,
                        cover: undefined,
                    },
                    {
                        title: () => 'From Space...',
                        date: 'December 6, 2013',
                        pages: 69,
                        cover: undefined,
                    },
                    {
                        title: () => "Guys Who Don't Listen",
                        date: 'February 14, 2014',
                        pages: 45,
                        cover: undefined,
                    },
                    {
                        title: () => 'Are You Stupid?',
                        date: 'February 28, 2014',
                        pages: 29,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 1,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'The Fight',
                        date: 'March 13, 2014',
                        pages: 35,
                        cover: undefined,
                    },
                    {
                        title: () => 'The Power of Boros',
                        date: 'May 29, 2014',
                        pages: 71,
                        cover: undefined,
                    },
                    {
                        title: () => 'Crash',
                        date: 'July 25, 2014',
                        pages: 29,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 2,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'King',
                        date: 'August 14, 2014',
                        pages: 81,
                        cover: undefined,
                    },
                    {
                        title: () => 'That Person',
                        date: 'October 16, 2014',
                        pages: 22,
                        cover: undefined,
                    },
                    {
                        title: () => 'Outlaw',
                        date: 'October 24, 2014',
                        pages: 22,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 3,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'The Man Who Wants to Be a Monster',
                        date: 'December 4, 2014',
                        pages: 25,
                        cover: undefined,
                    },
                    {
                        title: () => 'Blizzard Group',
                        date: 'January 5, 2015',
                        pages: 18,
                        cover: undefined,
                    },
                    {
                        title: () => "Don't Look Down On Heroes!",
                        date: 'January 23, 2015',
                        pages: 28,
                        cover: undefined,
                    },
                    {
                        title: () => 'Accelerate',
                        date: 'February 6, 2015',
                        pages: 41,
                        cover: undefined,
                    },
                    {
                        title: () => 'Hero Name',
                        date: 'March 31, 2015',
                        pages: 26,
                        cover: undefined,
                    },
                    {
                        title: () => 'Hero Hunt',
                        date: 'May 8, 2015',
                        pages: 23,
                        cover: undefined,
                    },
                    {
                        title: () => 'Technique',
                        date: 'May 15, 2015',
                        pages: 24,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 8,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Banana',
                        date: 'May 29, 2015',
                        pages: 12,
                        cover: undefined,
                    },
                    {
                        title: () => "I'm Bored Anyway",
                        date: 'June 5, 2015',
                        pages: 12,
                        cover: undefined,
                    },
                    {
                        title: () => 'Getting Cocky!',
                        date: 'June 20, 2015',
                        pages: 24,
                        cover: undefined,
                    },
                    {
                        title: () => 'Headgear',
                        date: 'July 4, 2015',
                        pages: 17,
                        cover: undefined,
                    },
                    {
                        title: () => "Don't Put It Back!",
                        date: 'July 11, 2015',
                        pages: 13,
                        cover: undefined,
                    },
                    {
                        title: () => 'Waiting Room',
                        date: 'August 1, 2015',
                        pages: 13,
                        cover: undefined,
                    },
                    {
                        title: () => 'Centipede',
                        date: 'September 7, 2015',
                        pages: 11,
                        cover: undefined,
                    },
                    {
                        title: () => 'Fighting Spirit',
                        date: 'October 3, 2015',
                        pages: 20,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 3,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Head-On',
                        date: 'October 30, 2015',
                        pages: 10,
                        cover: undefined,
                    },
                    {
                        title: () => 'Meddling',
                        date: 'November 13, 2015',
                        pages: 17,
                        cover: undefined,
                    },
                    {
                        title: () => 'Giant Insect',
                        date: 'November 27, 2015',
                        pages: 52,
                        cover: undefined,
                    },
                    {
                        title: () => 'Only You',
                        date: 'January 7, 2016',
                        pages: 26,
                        cover: undefined,
                    },
                    {
                        title: () => 'Admission',
                        date: 'February 4, 2016',
                        pages: 27,
                        cover: undefined,
                    },
                    {
                        title: () => 'Dark Horse',
                        date: 'February 26, 2016',
                        pages: 31,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 5,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Reason For Seeking',
                        date: 'May 6, 2016',
                        pages: 23,
                        cover: undefined,
                    },
                    {
                        title: () => 'Games and Combat',
                        date: 'June 4, 2016',
                        pages: 39,
                        cover: undefined,
                    },
                    {
                        title: () => 'Limit',
                        date: 'July 7, 2016',
                        pages: 37,
                        cover: undefined,
                    },
                    {
                        title: () => 'Sisters',
                        date: 'August 5, 2016',
                        pages: 25,
                        cover: undefined,
                    },
                    {
                        title: () => 'The Strong',
                        date: 'September 20, 2016',
                        pages: 27,
                        cover: undefined,
                    },
                    {
                        title: () => 'Outside the Norm',
                        date: 'October 11, 2016',
                        pages: 30,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 2,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Great Battle Power',
                        date: 'November 15, 2016',
                        pages: 45,
                        cover: undefined,
                    },
                    {
                        title: () => 'Monster Cells',
                        date: 'December 10, 2016',
                        pages: 42,
                        cover: undefined,
                    },
                    {
                        title: () => 'Being Strong Is Fun',
                        date: 'December 23, 2016',
                        pages: 56,
                        cover: undefined,
                    },
                    {
                        title: () => 'Martial Arts Means...!!',
                        date: 'January 31, 2017',
                        pages: 43,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 3,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Monsterization',
                        date: 'February 10, 2017',
                        pages: 60,
                        cover: undefined,
                    },
                    {
                        title: () => 'Resistance of the Strong',
                        date: 'April 4, 2017',
                        pages: 45,
                        cover: undefined,
                    },
                    {
                        title: () => 'Depths of Despair',
                        date: 'April 22, 2017',
                        pages: 46,
                        cover: undefined,
                    },
                    {
                        title: () => 'Foul Play',
                        date: 'May 25, 2017',
                        pages: 42,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 3,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Bored As Usual',
                        date: 'June 7, 2017',
                        pages: 17,
                        cover: undefined,
                    },
                    {
                        title: () => 'Stagnation and Growth',
                        date: 'June 22, 2017',
                        pages: 32,
                        cover: undefined,
                    },
                    {
                        title: () => 'Those Who Move In The Dark',
                        date: 'July 20, 2017',
                        pages: 41,
                        cover: undefined,
                    },
                    {
                        title: () => 'Infinite Combo',
                        date: 'August 5, 2017',
                        pages: 47,
                        cover: undefined,
                    },
                    {
                        title: () => 'Surrounded',
                        date: 'August 26, 2017',
                        pages: 34,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 2,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Willpower',
                        date: 'September 21, 2017',
                        pages: 49,
                        cover: undefined,
                    },
                    {
                        title: () => 'To The Limit',
                        date: 'October 12, 2017',
                        pages: 61,
                        cover: undefined,
                    },
                    {
                        title: () => 'The Cruel Staircase',
                        date: 'November 3, 2017',
                        pages: 58,
                        cover: undefined,
                    },
                    {
                        title: () => 'Escalation',
                        date: 'December 7, 2017',
                        pages: 23,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 2,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Power',
                        date: 'December 7, 2017',
                        pages: 121 - 23,
                        cover: undefined,
                    },
                    {
                        title: () => "Is it Because I'm Caped Baldy?",
                        date: 'December 28, 2017',
                        pages: 44,
                        cover: undefined,
                    },
                    {
                        title: () => 'Hideout',
                        date: 'January 19, 2018',
                        pages: 31,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 2,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Monster Nature',
                        date: 'February 1, 2018',
                        pages: 45,
                        cover: undefined,
                    },
                    {
                        title: () => 'Limiter',
                        date: 'February 19, 2018',
                        pages: 58,
                        cover: undefined,
                    },
                    {
                        title: () => 'Hot Pot',
                        date: 'March 24, 2018',
                        pages: 76,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 1,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Cabbage Finished',
                        date: 'March 24, 2018',
                        pages: 24,
                        cover: undefined,
                    },
                    {
                        title: () => "Because I'm a Monster",
                        date: 'April 9, 2018',
                        pages: 49,
                        cover: undefined,
                    },
                    {
                        title: () => 'Rover',
                        date: 'April 26, 2018',
                        pages: 62,
                        cover: undefined,
                    },
                    {
                        title: () => 'Manhole',
                        date: 'May 24, 2018',
                        pages: 74,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 1,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => "Let's Go!",
                        date: 'June 22, 2018',
                        pages: 71,
                        cover: undefined,
                    },
                    {
                        title: () => "I'll dispatch them!",
                        date: 'August 10, 2018',
                        pages: 114,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 3,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'The Decision Is?',
                        date: 'August 10, 2018',
                        pages: 37,
                        cover: undefined,
                    },
                    {
                        title: () => 'Speedster',
                        date: 'September 10, 2018',
                        pages: 57,
                        cover: undefined,
                    },
                    {
                        title: () => 'Instant',
                        date: 'September 22, 2018',
                        pages: 42,
                        cover: undefined,
                    },
                    {
                        title: () => 'Backpack',
                        date: 'October 5, 2018',
                        pages: 32,
                        cover: undefined,
                    },
                    {
                        title: () => 'Tears of Regret',
                        date: 'October 19, 2018',
                        pages: 49,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 2,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Boy Hero',
                        date: 'November 2, 2018',
                        pages: 37,
                        cover: undefined,
                    },
                    {
                        title: () => 'Light',
                        date: 'December 17, 2018',
                        pages: 58,
                        cover: undefined,
                    },
                    {
                        title: () => 'An Immortal Battle of Attrition',
                        date: 'January 18, 2019',
                        pages: 51,
                        cover: undefined,
                    },
                    {
                        title: () => 'Sweet Mask',
                        date: 'January 26, 2019',
                        pages: 23,
                        cover: undefined,
                    },
                    {
                        title: () => 'Things That Must Not Be Seen',
                        date: 'February 12, 2019',
                        pages: 19,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 2,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Back',
                        date: 'February 22, 2019',
                        pages: 35,
                        cover: undefined,
                    },
                    {
                        title: () => 'Authenticity',
                        date: 'March 9, 2019',
                        pages: 29,
                        cover: undefined,
                    },
                    {
                        title: () => 'Terrible Multiplying Bastard',
                        date: 'March 16, 2019',
                        pages: 73,
                        cover: undefined,
                    },
                    {
                        title: () => 'Love Evolution',
                        date: 'March 16, 2019',
                        pages: 43,
                        cover: undefined,
                    },
                    {
                        title: () => 'Gluttony',
                        date: 'March 23, 2019',
                        pages: 11,
                        cover: undefined,
                    },
                    {
                        title: () => 'Superalloy Darkshine',
                        date: 'April 6, 2019',
                        pages: 16,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 3,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Terrible Luck',
                        date: 'July 26, 2019',
                        pages: 46,
                        cover: undefined,
                    },
                    {
                        title: () => 'Strong Enemy',
                        date: 'April 18, 2019',
                        pages: 20,
                        cover: undefined,
                    },
                    {
                        title: () => 'Sacrifice',
                        date: 'July 29, 2021',
                        pages: 43,
                        cover: undefined,
                    },
                    {
                        title: () => 'Fake',
                        date: 'June 1, 2019',
                        pages: 28,
                        cover: undefined,
                    },
                    {
                        title: () => 'Rematch',
                        date: 'August 24, 2021',
                        pages: 35,
                        cover: undefined,
                    },
                    {
                        title: () => 'Mirror',
                        date: 'July 27, 2019',
                        pages: 17,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 4,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Encounter',
                        date: 'August 23, 2019',
                        pages: 28,
                        cover: undefined,
                    },
                    {
                        title: () => 'Playtime',
                        date: 'September 6, 2019',
                        pages: 22,
                        cover: undefined,
                    },
                    {
                        title: () => 'Cornered Rat',
                        date: 'September 20, 2019',
                        pages: 22,
                        cover: undefined,
                    },
                    {
                        title: () => 'Drive Knight',
                        date: 'October 5, 2019',
                        pages: 27,
                        cover: undefined,
                    },
                    {
                        title: () => 'A Glimpse Behind The Scenes',
                        date: 'October 17, 2019',
                        pages: 28,
                        cover: undefined,
                    },
                    {
                        title: () => 'The Only Necessary Thing Is Strength',
                        date: 'November 2, 2019',
                        pages: 24,
                        cover: undefined,
                    },
                    {
                        title: () => 'Broken',
                        date: 'November 16, 2019',
                        pages: 21,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 1,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Unknown',
                        date: 'November 29, 2019',
                        pages: 22,
                        cover: undefined,
                    },
                    {
                        title: () => 'New Fubuki Group',
                        date: 'December 27, 2019',
                        pages: 17,
                        cover: undefined,
                    },
                    {
                        title: () => 'Sit!',
                        date: 'January 10, 2020',
                        pages: 13,
                        cover: undefined,
                    },
                    {
                        title: () => 'Psykos',
                        date: 'January 25, 2020',
                        pages: 19 + 39,
                        cover: undefined,
                    },
                    {
                        title: () => 'Monster Tag',
                        date: 'February 8, 2020',
                        pages: 39,
                        cover: undefined,
                    },
                    {
                        title: () => 'Demons Combined!',
                        date: 'February 22, 2020',
                        pages: 33,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 3,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Invasive Touch',
                        date: 'March 10, 2020',
                        pages: 24,
                        cover: undefined,
                    },
                    {
                        title: () => 'Turn Over!',
                        date: 'March 24, 2020',
                        pages: 29,
                        cover: undefined,
                    },
                    {
                        title: () => 'Tatsumaki Full Power',
                        date: 'April 4, 2020',
                        pages: 26,
                        cover: undefined,
                    },
                    {
                        title: () => "Won't Lose!",
                        date: 'April 23, 2020',
                        pages: 23,
                        cover: undefined,
                    },
                    {
                        title: () => 'Something Huge',
                        date: 'July 7, 2020',
                        pages: 27,
                        cover: undefined,
                    },
                    {
                        title: () => 'The Ultimate Mind!',
                        date: 'July 31, 2020',
                        pages: 45,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 6,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Twist',
                        date: 'September 8, 2020',
                        pages: 27 + 37,
                        cover: undefined,
                    },
                    {
                        title: () => 'Giant Barrier',
                        date: 'September 26, 2020',
                        pages: 37,
                        cover: undefined,
                    },
                    {
                        title: () => 'Disgrace and Fundamentals',
                        date: 'October 1st, 2020',
                        pages: 13,
                        cover: undefined,
                    },
                    {
                        title: () => 'Indomitable',
                        date: 'December 1st, 2020',
                        pages: 35,
                        cover: undefined,
                    },
                    {
                        title: () => 'Resonance',
                        date: 'December 24th, 2020',
                        pages: 35,
                        cover: undefined,
                    },
                    {
                        title: () => 'Into the Abyss',
                        date: 'January 13th, 2021',
                        pages: 45,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 3,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Abyss',
                        date: 'January 25, 2021',
                        pages: 27,
                        cover: undefined,
                    },
                    {
                        title: () => 'Stones and Diamonds',
                        date: 'March 3rd, 2021',
                        pages: 19,
                        cover: undefined,
                    },
                    {
                        title: () => 'Rejuvenated Offence',
                        date: 'March 22nd, 2021',
                        pages: 32,
                        cover: undefined,
                    },
                    {
                        title: () => 'How To Behave',
                        date: 'April 2nd, 2021',
                        pages: 13,
                        cover: undefined,
                    },
                    {
                        title: () => 'Jupiter, the Bringer of Jollity',
                        date: 'April 20, 2021',
                        pages: 37,
                        cover: undefined,
                    },
                    {
                        title: () => 'Silver Fang',
                        date: 'May 1, 2021',
                        pages: 25,
                        cover: undefined,
                    },
                    {
                        title: () => 'Superalloy Darkshine',
                        date: 'May 15, 2021',
                        pages: 21,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 6,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Backup',
                        date: 'May 29, 2021',
                        pages: 29,
                        cover: undefined,
                    },
                    {
                        title: () => 'Toxic Substance',
                        date: 'June 15, 2021',
                        pages: 33,
                        cover: undefined,
                    },
                    {
                        title: () => 'The Line',
                        date: 'June 26, 2021',
                        pages: 29,
                        cover: undefined,
                    },
                    {
                        title: () => 'Ambush',
                        date: 'July 9, 2021',
                        pages: 28,
                        cover: undefined,
                    },
                    {
                        title: () => 'Master and Disciple',
                        date: 'October 9, 2021',
                        pages: 37,
                        cover: undefined,
                    },
                    {
                        title: () => 'The Greatest Obstacle',
                        date: 'October 30, 2021',
                        pages: 27,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 3,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Check',
                        date: 'November 13, 2021',
                        pages: 41,
                        cover: undefined,
                    },
                    {
                        title: () => 'Forfeit',
                        date: 'November 27, 2021',
                        pages: 37,
                        cover: undefined,
                    },
                    {
                        title: () =>
                            'Ultimate Hellfire Burst Wave Motion Cannon',
                        date: 'December 3, 2021',
                        pages: 36,
                        cover: undefined,
                    },
                    {
                        title: () => 'Results',
                        date: 'December 18, 2021',
                        pages: 49,
                        cover: undefined,
                    },
                    {
                        title: () => 'Divine Retribution',
                        date: 'January 14, 2022',
                        pages: 49,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 3,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Bad Boys',
                        date: 'January 28, 2022',
                        pages: 45,
                        cover: undefined,
                    },
                    {
                        title: () => '2Bad',
                        date: 'February 10, 2022',
                        pages: 45,
                        cover: undefined,
                    },
                    {
                        title: () => 'Blessing',
                        date: 'February 24, 2022',
                        pages: 26,
                        cover: undefined,
                    },
                    {
                        title: () => 'Divide',
                        date: 'March 10, 2022',
                        pages: 28,
                        cover: undefined,
                    },
                    {
                        title: () => 'Sinking Feeling',
                        date: 'March 24, 2022',
                        pages: 24,
                        cover: undefined,
                    },
                    {
                        title: () => 'Greatest Hero',
                        date: 'April 7, 2022',
                        pages: 43,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 4,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Tougher Than a Mountain',
                        date: 'April 28, 2022',
                        pages: 41,
                        cover: undefined,
                    },
                    {
                        title: () =>
                            'The Abominable Fist That Turned Against God',
                        date: 'May 12, 2022',
                        pages: 55,
                        cover: undefined,
                    },
                    {
                        title: () => 'Absolute Evil',
                        date: 'June 9, 2022',
                        pages: 52,
                        cover: undefined,
                    },
                    {
                        title: () => 'Squared',
                        date: 'June 23, 2022',
                        pages: 52,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 3,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'I.o.',
                        date: 'July 7, 2022',
                        pages: 57,
                        cover: undefined,
                    },
                    {
                        title: () => 'Awakening of the Gods',
                        date: 'July 21, 2022',
                        pages: 79,
                        cover: undefined,
                    },
                    {
                        title: () => 'Daybreak',
                        date: 'August 4, 2022',
                        pages: 46,
                        cover: undefined,
                    },
                    {
                        title: () => 'What Was Gained',
                        date: 'August 18, 2022',
                        pages: 22,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 1,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'The Last Guy I Wanna Run Into',
                        date: 'September 22, 2022',
                        pages: 29,
                        cover: undefined,
                    },
                    {
                        title: () => 'New Home',
                        date: 'October 20, 2022',
                        pages: 37,
                        cover: undefined,
                    },
                    {
                        title: () => 'Secret Intel',
                        date: 'November 3, 2022',
                        pages: 34,
                        cover: undefined,
                    },
                    {
                        title: () => 'Beauty',
                        date: 'November 17, 2022',
                        pages: 27,
                        cover: undefined,
                    },
                    {
                        title: () => 'Visitor',
                        date: 'December 1, 2022',
                        pages: 29,
                        cover: undefined,
                    },
                    {
                        title: () => 'Hypocenter',
                        date: 'December 15, 2022',
                        pages: 27,
                        cover: undefined,
                    },
                ],
            },
            {
                title: 6,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'The Supernatural and Risks',
                        date: 'January 12, 2023',
                        pages: 36,
                        cover: undefined,
                    },
                    {
                        title: () => 'Do it Outside!',
                        date: 'January 26, 2023',
                        pages: 28,
                        cover: undefined,
                    },
                    {
                        title: () => 'Witnesses',
                        date: 'February 9, 2023',
                        pages: 35,
                        cover: undefined,
                    },
                    {
                        title: () => 'In the Middle of Something',
                        date: 'February 23, 2023',
                        pages: 33,
                        cover: undefined,
                    },
                    {
                        title: () => 'Scalp Friction',
                        date: 'March 9, 2023',
                        pages: 29,
                        cover: undefined,
                    },
                    {
                        title: () => 'Unascertained',
                        date: 'March 23, 2023',
                        pages: 38,
                        cover: undefined,
                    },
                    {
                        title: () => 'Trade-Off',
                        date: 'April 20, 2023',
                        pages: 26,
                        cover: undefined,
                    },
                ],
            },
            {
                cover: undefined,
                chapters: [
                    {
                        title: () => 'Scout',
                        date: 'May 4, 2023',
                        pages: 27,
                        cover: undefined,
                    },
                    {
                        title: () => 'Updates',
                        date: 'June 1, 2023',
                        pages: 28,
                        cover: undefined,
                    },
                    {
                        title: () => 'Turning Point',
                        date: 'June 15, 2023',
                        pages: 33,
                        cover: undefined,
                    },
                    {
                        title: () => 'The Butterfly and the Back',
                        date: 'June 29, 2023',
                        pages: 41,
                        cover: undefined,
                    },
                    {
                        title: () => 'Appraisal',
                        date: 'July 13, 2023',
                        pages: 29,
                        cover: undefined,
                    },
                    {
                        title: () => 'Blade Test',
                        date: 'July 27, 2023',
                        pages: 31,
                        cover: undefined,
                    },
                ],
            },
            {
                cover: undefined,
                chapters: [
                    {
                        title: () => 'Scheme',
                        date: 'August 10, 2023',
                        pages: 35,
                        cover: undefined,
                    },
                    {
                        title: () => 'Heroes',
                        date: 'September 7, 2023',
                        pages: 32,
                        cover: undefined,
                    },
                    {
                        title: () => 'Level Up',
                        date: 'September 21, 2023',
                        pages: 35,
                        cover: undefined,
                    },
                    {
                        title: () => 'Worlds I Know Nothing About',
                        date: 'October 5, 2023',
                        pages: 32,
                        cover: undefined,
                    },
                    {
                        title: () => 'Right Away',
                        date: 'October 19, 2023',
                        pages: 37,
                        cover: undefined,
                    },
                ],
            },
            {
                cover: undefined,
                chapters: [
                    {
                        title: () => 'That Man',
                        date: 'January 23, 2025',
                        pages: 27,
                        cover: undefined,
                    },
                    {
                        title: () => 'Ninja Village',
                        date: 'January 30, 2025',
                        pages: 23,
                        cover: undefined,
                    },
                    {
                        title: () => 'Karma',
                        date: 'February 13, 2025',
                        pages: 16,
                        cover: undefined,
                    },
                    {
                        title: () => 'The Way You Are Now',
                        date: 'February 27, 2025',
                        pages: 23,
                        cover: undefined,
                    },
                    {
                        title: () => 'Close Call',
                        date: 'March 13, 2025',
                        pages: 16,
                        cover: undefined,
                    },
                    {
                        title: () => 'Where Is It?',
                        date: 'March 27, 2025',
                        pages: 20,
                        cover: undefined,
                    },
                    {
                        title: () => 'Lights Out',
                        date: 'April 10, 2025',
                        pages: 15,
                        cover: undefined,
                    },
                    {
                        title: () => 'Divine Beasts',
                        date: 'April 24, 2025',
                        pages: 15,
                        cover: undefined,
                    },
                    {
                        title: () => 'Fever',
                        date: 'May 8, 2025',
                        pages: 22,
                        cover: undefined,
                    },
                ],
            },
            {
                cover: undefined,
                chapters: [
                    {
                        title: () => 'Fully Recovered',
                        date: 'August 22, 2024',
                        pages: 14,
                        cover: undefined,
                    },
                    {
                        title: () => 'Neo Leaders',
                        date: 'September 5, 2024',
                        pages: 16,
                        cover: undefined,
                    },
                    {
                        title: () => 'Tough Guy',
                        date: 'September 19, 2024',
                        pages: 15,
                        cover: undefined,
                    },
                    {
                        title: () => 'Presence',
                        date: 'October 3, 2024',
                        pages: 15,
                        cover: undefined,
                    },
                    {
                        title: () => 'Special',
                        date: 'October 17, 2024',
                        pages: 19,
                        cover: undefined,
                    },
                    {
                        title: () => 'Shopping',
                        date: 'June 19, 2025',
                        pages: 6,
                        cover: undefined,
                    },
                    {
                        title: () => 'Intensive Training Camp',
                        date: 'July 17, 2025',
                        pages: 17,
                        cover: undefined,
                    },
                    {
                        title: () => 'Handsomely Masked Sweet Mask',
                        date: 'July 31, 2025',
                        pages: 17,
                        cover: undefined,
                    },
                    {
                        title: () => "After All, We're Human",
                        date: 'August 14, 2025',
                        pages: 17,
                        cover: undefined,
                    },
                    {
                        title: () => 'Public Eye',
                        date: 'August 28, 2025',
                        pages: 15,
                        cover: undefined,
                    },
                    {
                        title: () => 'Fanatics',
                        date: 'September 11, 2025',
                        pages: 17,
                        cover: undefined,
                    },
                ],
            },
            {
                cover: undefined,
                chapters: [
                    {
                        title: () => 'What You Are',
                        date: 'September 25, 2025',
                        pages: 21,
                        cover: undefined,
                    },
                    {
                        title: () => 'Monster',
                        date: 'October 9, 2025',
                        pages: 18,
                        cover: undefined,
                    },
                    {
                        title: () => 'A Stone',
                        date: 'October 23, 2025',
                        pages: 21,
                        cover: undefined,
                    },
                    {
                        title: () => 'Just Getting Started',
                        date: 'November 6, 2025',
                        pages: 21,
                        cover: undefined,
                    },
                    {
                        title: () => 'New...',
                        date: 'November 20, 2025',
                        pages: 14,
                        cover: undefined,
                    },
                    {
                        title: () => 'Major Promotion',
                        date: 'December 4, 2025',
                        pages: 20,
                        cover: undefined,
                    },
                    {
                        title: () => 'Emerging Power',
                        date: 'December 18, 2025',
                        pages: 17,
                        cover: undefined,
                    },
                    {
                        title: () => 'Wavygyaza',
                        date: 'January 15, 2026',
                        pages: 16,
                        cover: undefined,
                    },
                    {
                        title: () => 'New Blood',
                        date: 'January 29, 2026',
                        pages: 19,
                        cover: undefined,
                    },
                    {
                        title: () => 'New Blood 2',
                        date: 'February 12, 2026',
                        pages: 18,
                        cover: undefined,
                    },
                ],
            },
            {
                cover: undefined,
                chapters: [
                    {
                        title: () => 'New Blood 3',
                        date: 'February 26, 2026',
                        pages: 16,
                        cover: undefined,
                    },
                    {
                        title: () => 'Fury',
                        date: 'March 12, 2026',
                        pages: 20,
                        cover: undefined,
                    },
                    {
                        title: () => 'Life or Death',
                        date: 'March 26, 2026',
                        pages: 17,
                        cover: undefined,
                    },
                    {
                        title: () => 'Life or Death 2',
                        date: 'April 9, 2026',
                        pages: 15,
                        cover: undefined,
                    },
                    {
                        title: () => 'Interception',
                        date: 'April 23, 2026',
                        pages: 16,
                        cover: undefined,
                    },
                    {
                        title: () => 'Suiko',
                        date: 'May 7, 2026',
                        pages: 16,
                        cover: undefined,
                    },
                    {
                        title: () => 'Cover',
                        date: 'May 21, 2026',
                        pages: 18,
                        cover: undefined,
                    },
                ],
            },
        ] as const satisfies Tuple<Volume, VolumesTotal>,
        extraChapters: [
            {
                title: () => 'Volume 1-5 Extras',
                cover: () => 'Volume_1',
                chapters: [
                    {
                        title: () => '200 Yen',
                        date: 'December 4, 2012',
                        pages: 23,
                        cover: undefined,
                    },
                    {
                        title: () => 'Brushing Up',
                        date: 'December 4, 2012',
                        pages: 14,
                        cover: undefined,
                    },
                    {
                        title: () => 'Summer',
                        date: 'February 1, 2013',
                        pages: 23,
                        cover: undefined,
                    },
                    {
                        title: () => 'A New Wind Blows',
                        date: 'December 6, 2012',
                        pages: 28,
                        cover: undefined,
                    },
                    {
                        title: () => 'Prison',
                        date: 'June 13, 2013',
                        pages: 29,
                        cover: undefined,
                    },
                    {
                        title: () => "What Can't Be Bought",
                        date: 'October 3, 2013',
                        pages: 27,
                        cover: undefined,
                    },
                ],
            },
            {
                title: () => 'Volume 6-7 Extras',
                cover: () => 'Volume_6',
                chapters: [
                    {
                        title: () => 'Salmon',
                        date: 'March 13, 2014',
                        pages: 19,
                        cover: undefined,
                    },
                    {
                        title: () => 'Big Construction',
                        date: 'February 22, 2015',
                        pages: 18,
                        cover: undefined,
                    },
                    {
                        title: () =>
                            'Recollection Of A Most Sincere Apprentice',
                        date: 'Jul 31, 2014',
                        pages: 4,
                        cover: undefined,
                    },
                    {
                        title: () => 'Pork Cutlet Bowl',
                        date: 'Jul 31, 2014',
                        pages: 27,
                        cover: undefined,
                    },
                ],
            },
            {
                title: () => 'Volume 8-10 Extras',
                cover: () => 'Volume_8',
                chapters: [
                    {
                        title: () => 'Lost Cat',
                        date: 'March 29, 2015',
                        pages: 32,
                        cover: undefined,
                    },
                    {
                        title: () => 'Lobster',
                        date: 'December 1, 2014',
                        pages: 21,
                        cover: undefined,
                    },
                    {
                        title: () => 'Struggle of the Blizzard Group',
                        date: 'August 16, 2014',
                        pages: 7,
                        cover: undefined,
                    },
                    {
                        title: () => "Tatsumaki's Day Off",
                        date: 'December 8, 2015',
                        pages: 13,
                        cover: undefined,
                    },
                    {
                        title: () => 'Sense',
                        date: 'April 23, 2015',
                        pages: 20,
                        cover: undefined,
                    },
                    {
                        title: () => 'Numbers',
                        date: 'September 28, 2015',
                        pages: 32,
                        cover: undefined,
                    },
                ],
            },
            {
                title: () => 'Volume 11-16 Extras',
                cover: () => 'Volume_11',
                chapters: [
                    {
                        title: () => 'Squadron',
                        date: 'April 21, 2016',
                        pages: 30,
                        cover: undefined,
                    },
                    {
                        title: () => "King's Weekend-like Weekday",
                        date: 'December 2, 2016',
                        pages: 16,
                        cover: undefined,
                    },
                    {
                        title: () => 'Star',
                        date: 'April 2, 2017',
                        pages: 13,
                        cover: undefined,
                    },
                    {
                        title: () => 'Disaster Level',
                        date: 'April 1, 2017',
                        pages: 16,
                        cover: undefined,
                    },
                    {
                        title: () => 'Witness',
                        date: 'December 4, 2017',
                        pages: 9,
                        cover: undefined,
                    },
                    {
                        title: () => 'Growth Process',
                        date: 'April 4, 2018',
                        pages: 6,
                        cover: undefined,
                    },
                ],
            },
            {
                title: () => 'Volume 17-23 Extras',
                cover: () => 'Volume_17',
                chapters: [
                    {
                        title: () => 'Confidence',
                        date: 'August 3, 2018',
                        pages: 4,
                        cover: undefined,
                    },
                    {
                        title: () => 'Reality Punch',
                        date: 'April 4, 2019',
                        pages: 5,
                        cover: undefined,
                    },
                    {
                        title: () => 'Owned Items',
                        date: 'July 4, 2019',
                        pages: 7,
                        cover: undefined,
                    },
                    {
                        title: () => 'Cannot Wait',
                        date: 'December 4, 2019',
                        pages: 4,
                        cover: undefined,
                    },
                    {
                        title: () => 'Coffee',
                        date: 'September 4, 2020',
                        pages: 2,
                        cover: undefined,
                    },
                    {
                        title: () => 'Example',
                        date: 'January 4, 2021',
                        pages: 5,
                        cover: undefined,
                    },
                ],
            },
            {
                title: () => 'Volume 24-36 Extras',
                cover: () => 'Volume_24_Cover',
                chapters: [
                    {
                        title: () => 'The Strong Among the Ordinary',
                        date: 'December 3, 2021',
                        pages: 5,
                        cover: undefined,
                    },
                    {
                        title: () => 'Back of My Head',
                        date: 'May 2, 2022',
                        pages: 3,
                        cover: undefined,
                    },
                    {
                        title: () => 'Big Promotion',
                        date: 'June 3, 2022',
                        pages: 8,
                        cover: undefined,
                    },
                    {
                        title: () => 'Olfaction',
                        date: 'June 2, 2023',
                        pages: 4,
                        cover: undefined,
                    },
                    {
                        title: () => 'The Style of a King',
                        date: 'March 4, 2024',
                        pages: 6,
                        cover: undefined,
                    },
                    {
                        title: () => 'Reflection',
                        date: 'November 1, 2024',
                        pages: 2,
                        cover: undefined,
                    },
                    {
                        title: () => 'Rumors of Drive Knight',
                        date: 'April 4, 2025',
                        pages: 5,
                        cover: undefined,
                    },
                    {
                        title: () => 'Sewing',
                        date: 'August 4, 2025',
                        pages: 3,
                        cover: undefined,
                    },
                    {
                        title: () => "Don't Be Scared",
                        date: 'October 3, 2025',
                        pages: 6,
                        cover: undefined,
                    },
                    {
                        title: () => 'First Courage',
                        date: 'March 4, 2026',
                        pages: 5,
                        cover: undefined,
                    },
                ],
            },
        ] as const satisfies Tuple<Volume, VolumesExtra>,
        sagas: [
            {
                title: 'Introduction',
                arcs: [
                    {
                        title: 'Saitama Introduction',
                        cover: 'Saitama_kills_Vaccine_Man',
                        offset: { x: 1100, y: 0 },
                        chapters: { from: 1, to: 4 },
                    },
                    {
                        title: 'House of Evolution',
                        cover: 'House_of_Evolution_Anime',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 5, to: 11 },
                    },
                    {
                        title: 'Paradise Group',
                        cover: 'The_Paradisers',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 12, to: 15 },
                    },
                ],
            },
            {
                title: 'Hero Association',
                arcs: [
                    {
                        title: 'National Superhero Registry',
                        cover: 'Results',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 16, to: 19 },
                    },
                    {
                        title: 'Rumored Monster',
                        cover: 'Rumored_Monster_Arc',
                        offset: { x: 730, y: 0 },
                        chapters: { from: 20, to: 20 },
                    },
                    {
                        title: 'Giant Meteor',
                        cover: 'SaitamaPunchingThroughTheMeteorite',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 21, to: 22 },
                    },
                    {
                        title: 'Sea Monster',
                        cover: 'Saitama_kills_the_Deep_Sea_King',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 23, to: 29 },
                    },
                    {
                        title: 'Alien Conquerors',
                        cover: 'Saitama_looking_at_Boros_Ship',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 30, to: 37 },
                    },
                    {
                        title: 'King',
                        cover: 'King_faceoff',
                        offset: { x: 1000, y: 0 },
                        chapters: { from: 38, to: 39 },
                    },
                ],
            },
            {
                title: 'Human Monster',
                arcs: [
                    {
                        title: 'Garou Introduction',
                        cover: 'Garou_exits',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 40, to: 41 },
                    },
                    {
                        title: 'The Blizzard Group',
                        cover: 'Fubuki_walkin',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 42, to: 45 },
                    },
                    {
                        title: 'Hero Hunt',
                        cover: 'Ttm_vs._garou',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 46, to: 51 },
                    },
                    {
                        title: 'Monster Raid',
                        cover: 'Elder_vs_Metal',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 52, to: 65 },
                    },
                    {
                        title: 'Super Fight',
                        cover: '22nd_Super_Fight_contestants',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 66, to: 77 },
                    },
                    {
                        title: 'Monster Association',
                        cover: 'Heroes_Spread',
                        offset: { x: 0, y: 1200 },
                        chapters: { from: 78, to: 175 },
                    },
                ],
            },
            {
                title: 'Neo Heroes',
                arcs: [
                    {
                        title: 'Psychic Sisters',
                        cover: 'Psychic_Sisters_Arc_Manga',
                        offset: { x: 0, y: 700 },
                        chapters: { from: 171 + 5, to: 183 + 5 },
                    },
                    {
                        title: 'Neo Heroes Introduction',
                        cover: 'Neo_Heroes_Introduction_Arc_Manga',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 184 + 5, to: 192 + 5 },
                    },
                    {
                        title: 'Ninjas',
                        cover: 'The_Tenninto_assembled_to_fight_Flash',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 193 + 5, to: 203 + 5 },
                    },
                    {
                        title: 'Supreme Hero',
                        cover: 'Supreme_Hero_Arc_Manga',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 204 + 5, to: 218 + 5 },
                    },
                    {
                        title: 'Neo Heroes Uprising',
                        cover: 'Neo_Heroes_Uprising_Arc',
                        offset: { x: 0, y: 550 },
                        chapters: { from: 219 + 5 },
                    },
                    // {
                    //     title: 'Robot Invasion',
                    //     cover: '',
                    //     offset: { x: 0, y: 0 },
                    //     chapters: { from: 1, to: 2 },
                    // },
                ],
            },
        ] as const satisfies Tuple<Saga, SagasTotal>,
        seasons: [
            {
                title: 'Season One',
                cover: () => 'One-Punch_Man_TV_Anime_Key_Visual',
                offset: { x: 0, y: 3200 },
                chapters: { from: 1, to: 37 },
                episodes: [
                    {
                        title: 'The Strongest Man',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'October 4, 2015',
                        chapters: { from: 1, to: 4 },
                    },
                    {
                        title: 'The Lone Cyborg',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'October 11, 2015',
                        chapters: { from: 5, to: 8 },
                    },
                    {
                        title: 'The Obsessive Scientist',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'October 18, 2015',
                        chapters: { from: 9, to: 11 },
                    },
                    {
                        title: 'The Modern Ninja',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'October 25, 2015',
                        chapters: { from: 12, to: 15 },
                    },
                    {
                        title: 'The Ultimate Master',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'November 1, 2015',
                        chapters: { from: 16, to: 18 },
                    },
                    {
                        title: 'The Terrifying City',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'November 8, 2015',
                        chapters: { from: 18, to: 20 },
                    },
                    {
                        title: 'The Ultimate Disciple',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'November 15, 2015',
                        chapters: { from: 21, to: 22 },
                    },
                    {
                        title: 'The Deep Sea King',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'November 22, 2015',
                        chapters: { from: 23, to: 26 },
                    },
                    {
                        title: 'Unyielding Justice',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'November 29, 2015',
                        chapters: { from: 26, to: 29 },
                    },
                    {
                        title: 'Unparalleled Peril',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'December 6, 2015',
                        chapters: { from: 30, to: 32 },
                    },
                    {
                        title: 'The Dominator of the Universe',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'December 13, 2015',
                        chapters: { from: 33, to: 35 },
                    },
                    {
                        title: 'The Strongest Hero',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'December 20, 2015',
                        chapters: { from: 35, to: 37 },
                    },
                ],
            },
            {
                title: 'Season Two',
                cover: () => 'One-Punch_Man_Anime_Season_2_Key_Visual',
                offset: { x: 0, y: 4000 },
                chapters: { from: 38, to: 85 },
                episodes: [
                    {
                        title: 'Return of the Hero',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'April 9, 2019',
                        chapters: { from: 38, to: 41 },
                    },
                    {
                        title: 'The Human Monster',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'April 16, 2019',
                        chapters: { from: 42, to: 45 },
                    },
                    {
                        title: 'The Hunt Begins',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'April 23, 2019',
                        chapters: { from: 46, to: 51 },
                    },
                    {
                        title: 'The Metal Bat',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'April 30, 2019',
                        chapters: { from: 52, to: 57 },
                    },
                    {
                        title: 'The Martial Arts Tournament',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'May 7, 2019',
                        chapters: { from: 58, to: 61 },
                    },
                    {
                        title: 'The Monster Uprising',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'May 14, 2019',
                        chapters: { from: 62, to: 66 },
                    },
                    {
                        title: 'The S Class Heroes',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'May 21, 2019',
                        chapters: { from: 67, to: 71 },
                    },
                    {
                        title: 'The Resistance of the Strong',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'May 28, 2019',
                        chapters: { from: 71, to: 74 },
                    },
                    {
                        title: 'The Troubles of the Strongest',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'June 11, 2019',
                        chapters: { from: 75, to: 79 },
                    },
                    {
                        title: 'Justice Under Siege',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'June 18, 2019',
                        chapters: { from: 79, to: 81 },
                    },
                    {
                        title: 'The Varieties of Pride',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'June 25, 2019',
                        chapters: { from: 81, to: 83 },
                    },
                    {
                        title: "The Wiping of the Disciple's Butt",
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'July 2, 2019',
                        chapters: { from: 83, to: 85 },
                    },
                ],
            },
            {
                title: 'Season Three - Part 1',
                cover: () => 'One-Punch_Man_Season_3_Key_Visual_2',
                offset: { x: 0, y: 0 },
                chapters: { from: 86, to: 116 },
                episodes: [
                    {
                        title: 'The Strategy Meeting',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'October 12, 2025',
                        chapters: { from: 86, to: 87 },
                    },
                    {
                        title: 'Monster Traits',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'October 19, 2025',
                        chapters: { from: 88, to: 89 },
                    },
                    {
                        title: 'Organism Limits',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'October 26, 2025',
                        chapters: { from: 89, to: 90 },
                    },
                    {
                        title: 'Counterattack Signal',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'November 2, 2025',
                        chapters: { from: 90, to: 92 },
                    },
                    {
                        title: 'Monster King',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'November 9, 2025',
                        chapters: { from: 92, to: 94 },
                    },
                    {
                        title: 'Motley Heroes',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'November 16, 2025',
                        chapters: { from: 95, to: 96 },
                    },
                    {
                        title: 'Counterstrike',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'November 23, 2025',
                        chapters: { from: 96, to: 98 },
                    },
                    {
                        title: 'Ninja Tale',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'November 30, 2025',
                        chapters: { from: 98, to: 101 },
                    },
                    {
                        title: 'Brave Child',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'December 7, 2025',
                        chapters: { from: 101, to: 103 },
                    },
                    {
                        title: 'Immortal Bloodbath',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'December 14, 2025',
                        chapters: { from: 104, to: 108 },
                    },
                    {
                        title: 'Top Dragons',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'December 21, 2025',
                        chapters: { from: 109, to: 111 },
                    },
                    {
                        title: 'Ultimate Lifeform',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'December 28, 2025',
                        chapters: { from: 112, to: 116 },
                    },
                ],
            },
            { chapters: { from: 117, to: 161 } },
            { chapters: { from: 162 } },
        ] as const satisfies Tuple<Season, SeasonsTotal>,
        splitChapters: {
            18: 5,
            26: 10,
            35: 30,
            71: 32,
            79: 7,
            81: 41,
            83: 57,
            89: 30,
            90: 71,
            92: 36,
            96: 91,
            98: 15,
            101: 11,
        },
        wikiBase: 'https://onepunchman.fandom.com/wiki/',
        icons: {
            favicon: EmptyIcon,
            scroller: ArrowRangeIcon,
            'select-title': ListIcon,
            'read-info': InfoIcon,
            'toggle-unbound-chapter-width': ExpandIcon,
            'toggle-cross-lines': FitIcon,
            'open-chapter-calendar': CalendarIcon,
            'toggle-always-show-titles': TitleIcon,
            'toggle-extra-chapters': ExtraIcon,
            'capture-timeline': CameraIcon,
        },
        socialLinks: [
            {
                name: 'Young Jump',
                url: 'https://tonarinoyj.jp/episode/13932016480028985383',
            },
            {
                name: 'VIZ Media',
                url: 'https://www.viz.com/one-punch-man',
            },
            {
                name: "Murata's Twitter",
                url: 'https://x.com/NEBU_KURO',
            },
            {
                name: "ONE's Twitter",
                url: 'https://x.com/ONE_rakugaki',
            },
            {
                name: 'Manga',
                url: 'https://cubari.moe/read/gist/OPM/',
            },
            {
                name: 'Webcomic',
                url: 'https://cubari.moe/read/gist/JYHJU/',
            },
            {
                name: 'Anime',
                url: 'https://onepunchman-anime.net/',
            },
        ],
    },
};
