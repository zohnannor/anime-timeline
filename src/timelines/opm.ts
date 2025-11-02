import { Saga, Season, Timeline, TimelineData, Volume } from '../constants';
import {
    getArcWidth,
    getChapterWidth,
    getEpisodeWidth,
    getSagaWidth,
    getSeasonWidth,
    getVolumeWidth,
} from '../helpers';
import { Tuple } from '../util';

const SEASON_HEIGHT = 1200;
const EPISODE_HEIGHT = SEASON_HEIGHT * 0.2;
const VOLUME_HEIGHT = 1500;
const CHAPTER_HEIGHT = 100;
const ARC_HEIGHT = VOLUME_HEIGHT * 0.7;
const SAGA_HEIGHT = 150 + ARC_HEIGHT;

const SEASONS_TOTAL = 4;
const CHAPTERS_TOTAL = 222;
const VOLUMES_TOTAL = 49;
const SAGAS_TOTAL = 4;

const volumeTitle = (_: TimelineData, idx: number) => `Volume ${idx + 1}`;
const volumeCover = (_: TimelineData, idx: number) =>
    idx <= 19
        ? `Volume_${idx + 1}`
        : idx <= 26
        ? `Volume_${idx + 1}_Cover`
        : idx <= 27
        ? `Vol.${idx + 1}`
        : `Volume_${idx + 1}_Front_Cover`;
const episodeCover = (_: TimelineData, idx: number) =>
    idx <= 11
        ? `Episode${idx + 1}_Pics`
        : idx <= 23
        ? `Season2Ep${idx - 11}pics`
        : `OPMS3Ep${idx - 11 - 11 - 1}`;
const chapterLink = (title: string, n: number): string =>
    n <= 118
        ? `Chapter_${n}`
        : n <= 126
        ? `Chapter_${n - 4}_(Online)`
        : n <= 129
        ? `Chapter_${n - 3}_(Online)`
        : n <= 130
        ? `Chapter_${n}`
        : n <= 138
        ? `Chapter_${n - 4}_(Online)`
        : n <= 139
        ? `Chapter_${n}`
        : n <= CHAPTERS_TOTAL
        ? `Chapter_${n - 5}_(Online)`
        : title;

export const OPM_TIMELINE: Timeline = {
    layout: {
        season: {
            type: 'season',
            height: SEASON_HEIGHT,
            blankfontSize: 250,
            titleFontSize: 100,
            width: getSeasonWidth,
            sectionLink: 'One-Punch Man (anime)',
            wikiLink: title => `Animated_Media#${title.replaceAll(' ', '_')}`,
            subTimeline: {
                type: 'episode',
                height: EPISODE_HEIGHT,
                scale: 1.2,
                titleProcessor: (title, n) => `${title}\n(Episode ${n})`,
                blankfontSize: 42,
                titleFontSize: 42,
                width: getEpisodeWidth,
                sectionLink: 'Episodes',
                wikiLink: (_, n) => `Episode_${n}`,
            },
        },
        saga: {
            type: 'saga',
            height: SAGA_HEIGHT,
            titleProcessor: title => `${title} Saga`,
            blankfontSize: 100,
            titleFontSize: 100,
            width: getSagaWidth,
            sectionLink: 'Story Arcs',
            wikiLink: title => `${title} Saga`,
            subTimeline: {
                type: 'arc',
                height: ARC_HEIGHT,
                sidewaysText: true,
                titleProcessor: title => `${title} arc`,
                blankfontSize: 100,
                titleFontSize: 100,
                width: getArcWidth,
                sectionLink: 'Story Arcs',
                wikiLink: title => `${title} Arc`,
            },
        },
        timeline: {
            type: 'timeline',
        },
        chapter: {
            type: 'chapter',
            height: CHAPTER_HEIGHT,
            fit: 'contain',
            backgroundColor: 'white',
            blankfontSize: 45,
            titleFontSize: 45,
            width: getChapterWidth,
            sectionLink: 'Chapters_and_Volumes#Volume_List',
            wikiLink: chapterLink,
            focusable: true,
        },
        volume: {
            type: 'volume',
            height: VOLUME_HEIGHT,
            blankfontSize: 500,
            titleFontSize: 100,
            width: getVolumeWidth,
            defaultCoverPosition: 'top',
            sectionLink: 'Chapters_and_Volumes#Volume_List',
            wikiLink: (_, n) => `Volume_${n}`,
        },
    },
    data: {
        title: 'One-Punch Man',
        volumes: [
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'One Punch',
                        date: 'June 14, 2012',
                        pages: 18,
                        cover: null,
                    },
                    {
                        title: () => 'Crab and Job Hunting',
                        date: 'June 18, 2012',
                        pages: 16,
                        cover: null,
                    },
                    {
                        title: () => 'A Dangerous Being',
                        date: 'June 21, 2012',
                        pages: 20,
                        cover: null,
                    },
                    {
                        title: () => 'Dark Undergrounders',
                        date: 'June 25, 2012',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Itch Explosion',
                        date: 'June 28, 2012',
                        pages: 20,
                        cover: null,
                    },
                    {
                        title: () => 'Saitama',
                        date: 'July 19, 2012',
                        pages: 24,
                        cover: null,
                    },
                    {
                        title: () => 'Mysterious Raid',
                        date: 'July 26, 2012',
                        pages: 16,
                        cover: null,
                    },
                    {
                        title: () => 'You Mean This Guy?',
                        date: 'August 1, 2012',
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
                        title: () => 'House of Evolution',
                        date: 'August 8, 2012',
                        pages: 26,
                        cover: null,
                    },
                    {
                        title: () => 'Modern Art',
                        date: 'August 15, 2012',
                        pages: 31,
                        cover: null,
                    },
                    {
                        title: () => 'The Key to His Power',
                        date: 'August 22, 2012',
                        pages: 22,
                        cover: null,
                    },
                    {
                        title: () => 'Paradise Group',
                        date: 'August 29, 2012',
                        pages: 28,
                        cover: null,
                    },
                    {
                        title: () => 'Speed',
                        date: 'September 5, 2012',
                        pages: 28,
                        cover: null,
                    },
                    {
                        title: () => "Don't Know You",
                        date: 'September 12, 2012',
                        pages: 24,
                        cover: null,
                    },
                    {
                        title: () => 'Hobby and Work',
                        date: 'September 29, 2012',
                        pages: 35,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Passed the Exam',
                        date: 'October 4, 2012',
                        pages: 23,
                        cover: null,
                    },
                    {
                        title: () => 'Sparring',
                        date: 'October 26, 2012',
                        pages: 74,
                        cover: null,
                    },
                    {
                        title: () => 'Business Activity',
                        date: 'December 10, 2012',
                        pages: 22,
                        cover: null,
                    },
                    {
                        title: () => 'No Time for This',
                        date: 'December 21, 2012',
                        pages: 27,
                        cover: null,
                    },
                    {
                        title: () => 'Rumor',
                        date: 'December 28, 2012',
                        pages: 40,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Giant Meteor',
                        date: 'February 1, 2013',
                        pages: 183,
                        cover: null,
                    },
                    {
                        title: () => 'Voices',
                        date: 'April 4, 2013',
                        pages: 41,
                        cover: null,
                    },
                    {
                        title: () => 'Threat from the Sea',
                        date: 'April 19, 2013',
                        pages: 27,
                        cover: null,
                    },
                    {
                        title: () => 'Deep Sea King',
                        date: 'May 16, 2013',
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
                        title: () => 'Deep Sea King 2',
                        date: 'June 13, 2013',
                        pages: 68,
                        cover: null,
                    },
                    {
                        title: () => 'Glimmer of Hope',
                        date: 'June 13, 2013',
                        pages: 29,
                        cover: null,
                    },
                    {
                        title: () => 'Beat-Up But Shining',
                        date: 'August 3, 2013',
                        pages: 30,
                        cover: null,
                    },
                    {
                        title: () => "Since It's Raining",
                        date: 'August 29, 2013',
                        pages: 24,
                        cover: null,
                    },
                    {
                        title: () => 'B-Class',
                        date: 'September 19, 2013',
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
                        title: () => 'S-Class',
                        date: 'October 3, 2013',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Great Prophecy',
                        date: 'November 21, 2013',
                        pages: 29,
                        cover: null,
                    },
                    {
                        title: () => 'From Space...',
                        date: 'December 6, 2013',
                        pages: 69,
                        cover: null,
                    },
                    {
                        title: () => "Guys Who Don't Listen",
                        date: 'February 14, 2014',
                        pages: 45,
                        cover: null,
                    },
                    {
                        title: () => 'Are You Stupid?',
                        date: 'February 28, 2014',
                        pages: 29,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'The Fight',
                        date: 'March 13, 2014',
                        pages: 35,
                        cover: null,
                    },
                    {
                        title: () => 'The Power of Boros',
                        date: 'May 29, 2014',
                        pages: 71,
                        cover: null,
                    },
                    {
                        title: () => 'Crash',
                        date: 'July 25, 2014',
                        pages: 29,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'King',
                        date: 'August 14, 2014',
                        pages: 81,
                        cover: null,
                    },
                    {
                        title: () => 'That Person',
                        date: 'October 16, 2014',
                        pages: 22,
                        cover: null,
                    },
                    {
                        title: () => 'Outlaw',
                        date: 'October 24, 2014',
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
                        title: () => 'The Man Who Wants to Be a Monster',
                        date: 'December 4, 2014',
                        pages: 25,
                        cover: null,
                    },
                    {
                        title: () => 'Blizzard Group',
                        date: 'January 5, 2015',
                        pages: 18,
                        cover: null,
                    },
                    {
                        title: () => "Don't Look Down On Heroes!",
                        date: 'January 23, 2015',
                        pages: 28,
                        cover: null,
                    },
                    {
                        title: () => 'Accelerate',
                        date: 'February 6, 2015',
                        pages: 41,
                        cover: null,
                    },
                    {
                        title: () => 'Hero Name',
                        date: 'March 31, 2015',
                        pages: 26,
                        cover: null,
                    },
                    {
                        title: () => 'Hero Hunt',
                        date: 'May 8, 2015',
                        pages: 23,
                        cover: null,
                    },
                    {
                        title: () => 'Technique',
                        date: 'May 15, 2015',
                        pages: 24,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Banana',
                        date: 'May 29, 2015',
                        pages: 12,
                        cover: null,
                    },
                    {
                        title: () => "I'm Bored Anyway",
                        date: 'June 5, 2015',
                        pages: 12,
                        cover: null,
                    },
                    {
                        title: () => 'Getting Cocky!',
                        date: 'June 20, 2015',
                        pages: 24,
                        cover: null,
                    },
                    {
                        title: () => 'Headgear',
                        date: 'July 4, 2015',
                        pages: 17,
                        cover: null,
                    },
                    {
                        title: () => "Don't Put It Back!",
                        date: 'July 11, 2015',
                        pages: 13,
                        cover: null,
                    },
                    {
                        title: () => 'Waiting Room',
                        date: 'August 1, 2015',
                        pages: 13,
                        cover: null,
                    },
                    {
                        title: () => 'Centipede',
                        date: 'September 7, 2015',
                        pages: 11,
                        cover: null,
                    },
                    {
                        title: () => 'Fighting Spirit',
                        date: 'October 3, 2015',
                        pages: 20,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Head-On',
                        date: 'October 30, 2015',
                        pages: 10,
                        cover: null,
                    },
                    {
                        title: () => 'Meddling',
                        date: 'November 13, 2015',
                        pages: 17,
                        cover: null,
                    },
                    {
                        title: () => 'Giant Insect',
                        date: 'November 27, 2015',
                        pages: 52,
                        cover: null,
                    },
                    {
                        title: () => 'Only You',
                        date: 'January 7, 2016',
                        pages: 26,
                        cover: null,
                    },
                    {
                        title: () => 'Admission',
                        date: 'February 4, 2016',
                        pages: 27,
                        cover: null,
                    },
                    {
                        title: () => 'Dark Horse',
                        date: 'February 26, 2016',
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
                        title: () => 'Reason For Seeking',
                        date: 'May 6, 2016',
                        pages: 23,
                        cover: null,
                    },
                    {
                        title: () => 'Games and Combat',
                        date: 'June 4, 2016',
                        pages: 39,
                        cover: null,
                    },
                    {
                        title: () => 'Limit',
                        date: 'July 7, 2016',
                        pages: 37,
                        cover: null,
                    },
                    {
                        title: () => 'Sisters',
                        date: 'August 5, 2016',
                        pages: 25,
                        cover: null,
                    },
                    {
                        title: () => 'The Strong',
                        date: 'September 20, 2016',
                        pages: 27,
                        cover: null,
                    },
                    {
                        title: () => 'Outside the Norm',
                        date: 'October 11, 2016',
                        pages: 30,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Great Battle Power',
                        date: 'November 15, 2016',
                        pages: 45,
                        cover: null,
                    },
                    {
                        title: () => 'Monster Cells',
                        date: 'December 10, 2016',
                        pages: 42,
                        cover: null,
                    },
                    {
                        title: () => 'Being Strong Is Fun',
                        date: 'December 23, 2016',
                        pages: 56,
                        cover: null,
                    },
                    {
                        title: () => 'Martial Arts Means...!!',
                        date: 'January 31, 2017',
                        pages: 43,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Monsterization',
                        date: 'February 10, 2017',
                        pages: 60,
                        cover: null,
                    },
                    {
                        title: () => 'Resistance of the Strong',
                        date: 'April 4, 2017',
                        pages: 45,
                        cover: null,
                    },
                    {
                        title: () => 'Depths of Despair',
                        date: 'April 22, 2017',
                        pages: 46,
                        cover: null,
                    },
                    {
                        title: () => 'Foul Play',
                        date: 'May 25, 2017',
                        pages: 42,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Bored As Usual',
                        date: 'June 7, 2017',
                        pages: 17,
                        cover: null,
                    },
                    {
                        title: () => 'Stagnation and Growth',
                        date: 'June 22, 2017',
                        pages: 32,
                        cover: null,
                    },
                    {
                        title: () => 'Those Who Move In The Dark',
                        date: 'July 20, 2017',
                        pages: 41,
                        cover: null,
                    },
                    {
                        title: () => 'Infinite Combo',
                        date: 'August 5, 2017',
                        pages: 47,
                        cover: null,
                    },
                    {
                        title: () => 'Surrounded',
                        date: 'August 26, 2017',
                        pages: 34,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Willpower',
                        date: 'September 21, 2017',
                        pages: 49,
                        cover: null,
                    },
                    {
                        title: () => 'To The Limit',
                        date: 'October 12, 2017',
                        pages: 61,
                        cover: null,
                    },
                    {
                        title: () => 'The Cruel Staircase',
                        date: 'November 3, 2017',
                        pages: 58,
                        cover: null,
                    },
                    {
                        title: () => 'Escalation',
                        date: 'December 7, 2017',
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
                        title: () => 'Power',
                        date: 'December 7, 2017',
                        pages: 121 - 23,
                        cover: null,
                    },
                    {
                        title: () => "Is it Because I'm Caped Baldy?",
                        date: 'December 28, 2017',
                        pages: 44,
                        cover: null,
                    },
                    {
                        title: () => 'Hideout',
                        date: 'January 19, 2018',
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
                        title: () => 'Monster Nature',
                        date: 'February 1, 2018',
                        pages: 45,
                        cover: null,
                    },
                    {
                        title: () => 'Limiter',
                        date: 'February 19, 2018',
                        pages: 58,
                        cover: null,
                    },
                    {
                        title: () => 'Hot Pot',
                        date: 'March 24, 2018',
                        pages: 76,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Cabbage Finished',
                        date: 'March 24, 2018',
                        pages: 24,
                        cover: null,
                    },
                    {
                        title: () => "Because I'm a Monster",
                        date: 'April 9, 2018',
                        pages: 49,
                        cover: null,
                    },
                    {
                        title: () => 'Rover',
                        date: 'April 26, 2018',
                        pages: 62,
                        cover: null,
                    },
                    {
                        title: () => 'Manhole',
                        date: 'May 24, 2018',
                        pages: 74,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => "Let's Go!",
                        date: 'June 22, 2018',
                        pages: 71,
                        cover: null,
                    },
                    {
                        title: () => "I'll dispatch them!",
                        date: 'August 10, 2018',
                        pages: 114,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'The Decision Is?',
                        date: 'August 10, 2018',
                        pages: 37,
                        cover: null,
                    },
                    {
                        title: () => 'Speedster',
                        date: 'September 10, 2018',
                        pages: 57,
                        cover: null,
                    },
                    {
                        title: () => 'Instant',
                        date: 'September 22, 2018',
                        pages: 42,
                        cover: null,
                    },
                    {
                        title: () => 'Backpack',
                        date: 'October 5, 2018',
                        pages: 32,
                        cover: null,
                    },
                    {
                        title: () => 'Tears of Regret',
                        date: 'October 19, 2018',
                        pages: 49,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Boy Hero',
                        date: 'November 2, 2018',
                        pages: 37,
                        cover: null,
                    },
                    {
                        title: () => 'Light',
                        date: 'December 17, 2018',
                        pages: 58,
                        cover: null,
                    },
                    {
                        title: () => 'An Immortal Battle of Attrition',
                        date: 'January 18, 2019',
                        pages: 51,
                        cover: null,
                    },
                    {
                        title: () => 'Sweet Mask',
                        date: 'January 26, 2019',
                        pages: 23,
                        cover: null,
                    },
                    {
                        title: () => 'Things That Must Not Be Seen',
                        date: 'February 12, 2019',
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
                        title: () => 'Back',
                        date: 'February 22, 2019',
                        pages: 35,
                        cover: null,
                    },
                    {
                        title: () => 'Authenticity',
                        date: 'March 9, 2019',
                        pages: 29,
                        cover: null,
                    },
                    {
                        title: () => 'Terrible Multiplying Bastard',
                        date: 'March 16, 2019',
                        pages: 73,
                        cover: null,
                    },
                    {
                        title: () => 'Love Evolution',
                        date: 'March 16, 2019',
                        pages: 43,
                        cover: null,
                    },
                    {
                        title: () => 'Gluttony',
                        date: 'March 23, 2019',
                        pages: 11,
                        cover: null,
                    },
                    {
                        title: () => 'Superalloy Darkshine',
                        date: 'April 6, 2019',
                        pages: 16,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Terrible Luck',
                        date: 'July 26, 2019',
                        pages: 46,
                        cover: null,
                    },
                    {
                        title: () => 'Strong Enemy',
                        date: 'April 18, 2019',
                        pages: 20,
                        cover: null,
                    },
                    {
                        title: () => 'Sacrifice',
                        date: 'July 29, 2021',
                        pages: 43,
                        cover: null,
                    },
                    {
                        title: () => 'Fake',
                        date: 'June 1, 2019',
                        pages: 28,
                        cover: null,
                    },
                    {
                        title: () => 'Rematch',
                        date: 'August 24, 2021',
                        pages: 35,
                        cover: null,
                    },
                    {
                        title: () => 'Mirror',
                        date: 'July 27, 2019',
                        pages: 17,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Encounter',
                        date: 'August 23, 2019',
                        pages: 28,
                        cover: null,
                    },
                    {
                        title: () => 'Playtime',
                        date: 'September 6, 2019',
                        pages: 22,
                        cover: null,
                    },
                    {
                        title: () => 'Cornered Rat',
                        date: 'September 20, 2019',
                        pages: 22,
                        cover: null,
                    },
                    {
                        title: () => 'Drive Knight',
                        date: 'October 5, 2019',
                        pages: 27,
                        cover: null,
                    },
                    {
                        title: () => 'A Glimpse Behind The Scenes',
                        date: 'October 17, 2019',
                        pages: 28,
                        cover: null,
                    },
                    {
                        title: () => 'The Only Necessary Thing Is Strength',
                        date: 'November 2, 2019',
                        pages: 24,
                        cover: null,
                    },
                    {
                        title: () => 'Broken',
                        date: 'November 16, 2019',
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
                        title: () => 'Unknown',
                        date: 'November 29, 2019',
                        pages: 22,
                        cover: null,
                    },
                    {
                        title: () => 'New Fubuki Group',
                        date: 'December 27, 2019',
                        pages: 17,
                        cover: null,
                    },
                    {
                        title: () => 'Sit!',
                        date: 'January 10, 2020',
                        pages: 13,
                        cover: null,
                    },
                    {
                        title: () => 'Psykos',
                        date: 'January 25, 2020',
                        pages: 19 + 39,
                        cover: null,
                    },
                    {
                        title: () => 'Monster Tag',
                        date: 'February 8, 2020',
                        pages: 39,
                        cover: null,
                    },
                    {
                        title: () => 'Demons Combined!',
                        date: 'February 22, 2020',
                        pages: 33,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Invasive Touch',
                        date: 'March 10, 2020',
                        pages: 24,
                        cover: null,
                    },
                    {
                        title: () => 'Turn Over!',
                        date: 'March 24, 2020',
                        pages: 29,
                        cover: null,
                    },
                    {
                        title: () => 'Tatsumaki Full Power',
                        date: 'April 4, 2020',
                        pages: 26,
                        cover: null,
                    },
                    {
                        title: () => "Won't Lose!",
                        date: 'April 23, 2020',
                        pages: 23,
                        cover: null,
                    },
                    {
                        title: () => 'Something Huge',
                        date: 'July 7, 2020',
                        pages: 27,
                        cover: null,
                    },
                    {
                        title: () => 'The Ultimate Mind!',
                        date: 'July 31, 2020',
                        pages: 45,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Twist',
                        date: 'September 8, 2020',
                        pages: 27 + 37,
                        cover: null,
                    },
                    {
                        title: () => 'Giant Barrier',
                        date: 'September 26, 2020',
                        pages: 37,
                        cover: null,
                    },
                    {
                        title: () => 'Disgrace and Fundamentals',
                        date: 'October 1st, 2020',
                        pages: 13,
                        cover: null,
                    },
                    {
                        title: () => 'Indomitable',
                        date: 'December 1st, 2020',
                        pages: 35,
                        cover: null,
                    },
                    {
                        title: () => 'Resonance',
                        date: 'December 24th, 2020',
                        pages: 35,
                        cover: null,
                    },
                    {
                        title: () => 'Into the Abyss',
                        date: 'January 13th, 2021',
                        pages: 45,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Abyss',
                        date: 'January 25, 2021',
                        pages: 27,
                        cover: null,
                    },
                    {
                        title: () => 'Stones and Diamonds',
                        date: 'March 3rd, 2021',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Rejuvenated Offence',
                        date: 'March 22nd, 2021',
                        pages: 32,
                        cover: null,
                    },
                    {
                        title: () => 'How To Behave',
                        date: 'April 2nd, 2021',
                        pages: 13,
                        cover: null,
                    },
                    {
                        title: () => 'Jupiter, the Bringer of Jollity',
                        date: 'April 20, 2021',
                        pages: 37,
                        cover: null,
                    },
                    {
                        title: () => 'Silver Fang',
                        date: 'May 1, 2021',
                        pages: 25,
                        cover: null,
                    },
                    {
                        title: () => 'Superalloy Darkshine',
                        date: 'May 15, 2021',
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
                        title: () => 'Backup',
                        date: 'May 29, 2021',
                        pages: 29,
                        cover: null,
                    },
                    {
                        title: () => 'Toxic Substance',
                        date: 'June 15, 2021',
                        pages: 33,
                        cover: null,
                    },
                    {
                        title: () => 'The Line',
                        date: 'June 26, 2021',
                        pages: 29,
                        cover: null,
                    },
                    {
                        title: () => 'Ambush',
                        date: 'July 9, 2021',
                        pages: 28,
                        cover: null,
                    },
                    {
                        title: () => 'Master and Disciple',
                        date: 'October 9, 2021',
                        pages: 37,
                        cover: null,
                    },
                    {
                        title: () => 'The Greatest Obstacle',
                        date: 'October 30, 2021',
                        pages: 27,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Check',
                        date: 'November 13, 2021',
                        pages: 41,
                        cover: null,
                    },
                    {
                        title: () => 'Forfeit',
                        date: 'November 27, 2021',
                        pages: 37,
                        cover: null,
                    },
                    {
                        title: () =>
                            'Ultimate Hellfire Burst Wave Motion Cannon',
                        date: 'December 3, 2021',
                        pages: 36,
                        cover: null,
                    },
                    {
                        title: () => 'Results',
                        date: 'December 18, 2021',
                        pages: 49,
                        cover: null,
                    },
                    {
                        title: () => 'Divine Retribution',
                        date: 'January 14, 2022',
                        pages: 49,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Bad Boys',
                        date: 'January 28, 2022',
                        pages: 45,
                        cover: null,
                    },
                    {
                        title: () => '2Bad',
                        date: 'February 10, 2022',
                        pages: 45,
                        cover: null,
                    },
                    {
                        title: () => 'Blessing',
                        date: 'February 24, 2022',
                        pages: 26,
                        cover: null,
                    },
                    {
                        title: () => 'Divide',
                        date: 'March 10, 2022',
                        pages: 28,
                        cover: null,
                    },
                    {
                        title: () => 'Sinking Feeling',
                        date: 'March 24, 2022',
                        pages: 24,
                        cover: null,
                    },
                    {
                        title: () => 'Greatest Hero',
                        date: 'April 7, 2022',
                        pages: 43,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Tougher Than a Mountain',
                        date: 'April 28, 2022',
                        pages: 41,
                        cover: null,
                    },
                    {
                        title: () =>
                            'The Abominable Fist That Turned Against God',
                        date: 'May 12, 2022',
                        pages: 55,
                        cover: null,
                    },
                    {
                        title: () => 'Absolute Evil',
                        date: 'June 9, 2022',
                        pages: 52,
                        cover: null,
                    },
                    {
                        title: () => 'Squared',
                        date: 'June 23, 2022',
                        pages: 52,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'I.o.',
                        date: 'July 7, 2022',
                        pages: 57,
                        cover: null,
                    },
                    {
                        title: () => 'Awakening of the Gods',
                        date: 'July 21, 2022',
                        pages: 79,
                        cover: null,
                    },
                    {
                        title: () => 'Daybreak',
                        date: 'August 4, 2022',
                        pages: 46,
                        cover: null,
                    },
                    {
                        title: () => 'What Was Gained',
                        date: 'August 18, 2022',
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
                        title: () => 'The Last Guy I Wanna Run Into',
                        date: 'September 22, 2022',
                        pages: 29,
                        cover: null,
                    },
                    {
                        title: () => 'New Home',
                        date: 'October 20, 2022',
                        pages: 37,
                        cover: null,
                    },
                    {
                        title: () => 'Secret Intel',
                        date: 'November 3, 2022',
                        pages: 34,
                        cover: null,
                    },
                    {
                        title: () => 'Beauty',
                        date: 'November 17, 2022',
                        pages: 27,
                        cover: null,
                    },
                    {
                        title: () => 'Visitor',
                        date: 'December 1, 2022',
                        pages: 29,
                        cover: null,
                    },
                    {
                        title: () => 'Hypocenter',
                        date: 'December 15, 2022',
                        pages: 27,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: null,
                chapters: [
                    {
                        title: () => 'The Supernatural and Risks',
                        date: 'January 12, 2023',
                        pages: 36,
                        cover: null,
                    },
                    {
                        title: () => 'Do it Outside!',
                        date: 'January 26, 2023',
                        pages: 28,
                        cover: null,
                    },
                    {
                        title: () => 'Witnesses',
                        date: 'February 9, 2023',
                        pages: 35,
                        cover: null,
                    },
                    {
                        title: () => 'In the Middle of Something',
                        date: 'February 23, 2023',
                        pages: 33,
                        cover: null,
                    },
                    {
                        title: () => 'Scalp Friction',
                        date: 'March 9, 2023',
                        pages: 29,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: null,
                chapters: [
                    {
                        title: () => 'Unascertained',
                        date: 'March 23, 2023',
                        pages: 38,
                        cover: null,
                    },
                    {
                        title: () => 'Trade-Off',
                        date: 'April 20, 2023',
                        pages: 26,
                        cover: null,
                    },
                    {
                        title: () => 'Scout',
                        date: 'May 4, 2023',
                        pages: 27,
                        cover: null,
                    },
                    {
                        title: () => 'Updates',
                        date: 'June 1, 2023',
                        pages: 28,
                        cover: null,
                    },
                    {
                        title: () => 'Turning Point',
                        date: 'June 15, 2023',
                        pages: 33,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: null,
                chapters: [
                    {
                        title: () => 'The Butterfly and the Back',
                        date: 'June 29, 2023',
                        pages: 41,
                        cover: null,
                    },
                    {
                        title: () => 'Appraisal',
                        date: 'July 13, 2023',
                        pages: 29,
                        cover: null,
                    },
                    {
                        title: () => 'Blade Test',
                        date: 'July 27, 2023',
                        pages: 31,
                        cover: null,
                    },
                    {
                        title: () => 'Scheme',
                        date: 'August 10, 2023',
                        pages: 35,
                        cover: null,
                    },
                    {
                        title: () => 'Heroes',
                        date: 'September 7, 2023',
                        pages: 32,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: null,
                chapters: [
                    {
                        title: () => 'Level Up',
                        date: 'September 21, 2023',
                        pages: 35,
                        cover: null,
                    },
                    {
                        title: () => 'Worlds I Know Nothing About',
                        date: 'October 5, 2023',
                        pages: 32,
                        cover: null,
                    },
                    {
                        title: () => 'Right Away',
                        date: 'October 19, 2023',
                        pages: 37,
                        cover: null,
                    },
                    {
                        title: () => 'That Man',
                        date: 'January 23, 2025',
                        pages: 27,
                        cover: null,
                    },
                    {
                        title: () => 'Ninja Village',
                        date: 'January 30, 2025',
                        pages: 23,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: null,
                chapters: [
                    {
                        title: () => 'Karma',
                        date: 'February 13, 2025',
                        pages: 16,
                        cover: null,
                    },
                    {
                        title: () => 'The Way You Are Now',
                        date: 'February 27, 2025',
                        pages: 23,
                        cover: null,
                    },
                    {
                        title: () => 'Close Call',
                        date: 'March 13, 2025',
                        pages: 16,
                        cover: null,
                    },
                    {
                        title: () => 'Where Is It?',
                        date: 'March 27, 2025',
                        pages: 20,
                        cover: null,
                    },
                    {
                        title: () => 'Lights Out',
                        date: 'April 10, 2025',
                        pages: 15,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: null,
                chapters: [
                    {
                        title: () => 'Divine Beasts',
                        date: 'April 24, 2025',
                        pages: 15,
                        cover: null,
                    },
                    {
                        title: () => 'Fever',
                        date: 'May 8, 2025',
                        pages: 22,
                        cover: null,
                    },
                    {
                        title: () => 'Fully Recovered',
                        date: 'August 22, 2024',
                        pages: 14,
                        cover: null,
                    },
                    {
                        title: () => 'Neo Leaders',
                        date: 'September 5, 2024',
                        pages: 16,
                        cover: null,
                    },
                    {
                        title: () => 'Tough Guy',
                        date: 'September 19, 2024',
                        pages: 15,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: null,
                chapters: [
                    {
                        title: () => 'Presence',
                        date: 'October 3, 2024',
                        pages: 15,
                        cover: null,
                    },
                    {
                        title: () => 'Special',
                        date: 'October 17, 2024',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: () => 'Shopping',
                        date: 'June 19, 2025',
                        pages: 6,
                        cover: null,
                    },
                    {
                        title: () => 'Intensive Training Camp',
                        date: 'July 17, 2025',
                        pages: 17,
                        cover: null,
                    },
                    {
                        title: () => 'Handsomely Masked Sweet Mask',
                        date: 'July 31, 2025',
                        pages: 17,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: null,
                chapters: [
                    {
                        title: () => "After All, We're Human",
                        date: 'August 14, 2025',
                        pages: 17,
                        cover: null,
                    },
                    {
                        title: () => 'Public Eye',
                        date: 'August 28, 2025',
                        pages: 15,
                        cover: null,
                    },
                    {
                        title: () => 'Fanatics',
                        date: 'September 11, 2025',
                        pages: 17,
                        cover: null,
                    },
                    {
                        title: () => 'What You Are',
                        date: 'September 25, 2025',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Monster',
                        date: 'October 9, 2025',
                        pages: 18,
                        cover: null,
                    },
                    {
                        title: () => 'A Stone',
                        date: 'October 23, 2025',
                        pages: 21,
                        cover: null,
                    },
                ],
            },
            {
                title: () => 'Volume 1-5 Extras',
                cover: () => 'Volume_1',
                chapters: [
                    {
                        title: () => '200 Yen',
                        date: 'December 4, 2012',
                        pages: 23,
                        cover: null,
                    },
                    {
                        title: () => 'Brushing Up',
                        date: 'December 4, 2012',
                        pages: 14,
                        cover: null,
                    },
                    {
                        title: () => 'Summer',
                        date: 'February 1, 2013',
                        pages: 23,
                        cover: null,
                    },
                    {
                        title: () => 'A New Wind Blows',
                        date: 'December 6, 2012',
                        pages: 28,
                        cover: null,
                    },
                    {
                        title: () => 'Prison',
                        date: 'June 13, 2013',
                        pages: 29,
                        cover: null,
                    },
                    {
                        title: () => "What Can't Be Bought",
                        date: 'October 3, 2013',
                        pages: 27,
                        cover: null,
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
                        cover: null,
                    },
                    {
                        title: () => 'Big Construction',
                        date: 'February 22, 2015',
                        pages: 18,
                        cover: null,
                    },
                    {
                        title: () =>
                            'Recollection Of A Most Sincere Apprentice',
                        date: 'Jul 31, 2014',
                        pages: 4,
                        cover: null,
                    },
                    {
                        title: () => 'Pork Cutlet Bowl',
                        date: 'Jul 31, 2014',
                        pages: 27,
                        cover: null,
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
                        cover: null,
                    },
                    {
                        title: () => 'Lobster',
                        date: 'December 1, 2014',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: () => 'Struggle of the Blizzard Group',
                        date: 'August 16, 2014',
                        pages: 7,
                        cover: null,
                    },
                    {
                        title: () => "Tatsumaki's Day Off",
                        date: 'December 8, 2015',
                        pages: 13,
                        cover: null,
                    },
                    {
                        title: () => 'Sense',
                        date: 'April 23, 2015',
                        pages: 20,
                        cover: null,
                    },
                    {
                        title: () => 'Numbers',
                        date: 'September 28, 2015',
                        pages: 32,
                        cover: null,
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
                        cover: null,
                    },
                    {
                        title: () => "King's Weekend-like Weekday",
                        date: 'December 2, 2016',
                        pages: 16,
                        cover: null,
                    },
                    {
                        title: () => 'Star',
                        date: 'April 2, 2017',
                        pages: 13,
                        cover: null,
                    },
                    {
                        title: () => 'Disaster Level',
                        date: 'April 1, 2017',
                        pages: 16,
                        cover: null,
                    },
                    {
                        title: () => 'Witness',
                        date: 'December 4, 2017',
                        pages: 9,
                        cover: null,
                    },
                    {
                        title: () => 'Growth Process',
                        date: 'April 4, 2018',
                        pages: 6,
                        cover: null,
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
                        cover: null,
                    },
                    {
                        title: () => 'Reality Punch',
                        date: 'April 4, 2019',
                        pages: 5,
                        cover: null,
                    },
                    {
                        title: () => 'Owned Items',
                        date: 'July 4, 2019',
                        pages: 7,
                        cover: null,
                    },
                    {
                        title: () => 'Cannot Wait',
                        date: 'December 4, 2019',
                        pages: 4,
                        cover: null,
                    },
                    {
                        title: () => 'Coffee',
                        date: 'September 4, 2020',
                        pages: 2,
                        cover: null,
                    },
                    {
                        title: () => 'Example',
                        date: 'January 4, 2021',
                        pages: 5,
                        cover: null,
                    },
                ],
            },
            {
                title: () => 'Volume 24-35 Extras',
                cover: () => 'Volume_24_Cover',
                chapters: [
                    {
                        title: () => 'The Strong Among the Ordinary',
                        date: 'December 3, 2021',
                        pages: 5,
                        cover: null,
                    },
                    {
                        title: () => 'Back of My Head',
                        date: 'May 2, 2022',
                        pages: 3,
                        cover: null,
                    },
                    {
                        title: () => 'Big Promotion',
                        date: 'June 3, 2022',
                        pages: 8,
                        cover: null,
                    },
                    {
                        title: () => 'Olfaction',
                        date: 'June 2, 2023',
                        pages: 4,
                        cover: null,
                    },
                    {
                        title: () => 'The Style of a King',
                        date: 'March 4, 2024',
                        pages: 6,
                        cover: null,
                    },
                    {
                        title: () => 'Reflection',
                        date: 'November 1, 2024',
                        pages: 2,
                        cover: null,
                    },
                    {
                        title: () => 'Rumors of Drive Knight',
                        date: 'April 4, 2025',
                        pages: 5,
                        cover: null,
                    },
                    {
                        title: () => 'Sewing',
                        date: 'August 4, 2025',
                        pages: 3,
                        cover: null,
                    },
                    {
                        title: () => "Don't Be Scared",
                        date: 'August 4, 2025', // unknown yet
                        pages: 0, // unknown yet
                        cover: null,
                    },
                ],
            },
        ] as const satisfies Tuple<Volume, typeof VOLUMES_TOTAL>,
        sagas: [
            {
                title: 'Introduction',
                cover: null,
                chapters: { from: 1, to: 15 },
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
                cover: null,
                chapters: { from: 16, to: 44 },
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
                cover: null,
                chapters: { from: 45, to: 94 },
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
                cover: null,
                chapters: { from: 95 },
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
                        chapters: { from: 204 + 5, to: 217 + 5 },
                    },
                    // {
                    //     title: 'Neo Heroes Uprising',
                    //     cover: '',
                    //     offset: { x: 0, y: 0 },
                    //     chapters: { from: 1, to: 2 },
                    // },
                    // {
                    //     title: 'Robot Invasion',
                    //     cover: '',
                    //     offset: { x: 0, y: 0 },
                    //     chapters: { from: 1, to: 2 },
                    // },
                ],
            },
        ] as const satisfies Tuple<Saga, typeof SAGAS_TOTAL>,
        seasons: [
            {
                title: 'Season One',
                cover: () => 'One-Punch_Man_TV_Anime_Key_Visual',
                offset: { x: 0, y: 2700 },
                chapters: { from: 1, to: 37 },
                episodes: [
                    {
                        title: () => 'The Strongest Man',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 1, to: 4 },
                    },
                    {
                        title: () => 'The Lone Cyborg',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 5, to: 8 },
                    },
                    {
                        title: () => 'The Obsessive Scientist',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 9, to: 11 },
                    },
                    {
                        title: () => 'The Modern Ninja',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 12, to: 15 },
                    },
                    {
                        title: () => 'The Ultimate Master',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 16, to: 18 },
                    },
                    {
                        title: () => 'The Terrifying City',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 18, to: 20 },
                    },
                    {
                        title: () => 'The Ultimate Disciple',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 21, to: 22 },
                    },
                    {
                        title: () => 'The Deep Sea King',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 23, to: 26 },
                    },
                    {
                        title: () => 'Unyielding Justice',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 26, to: 29 },
                    },
                    {
                        title: () => 'Unparalleled Peril',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 30, to: 32 },
                    },
                    {
                        title: () => 'The Dominator of the Universe',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 33, to: 34 },
                    },
                    {
                        title: () => 'The Strongest Hero',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 34, to: 37 },
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
                        title: () => 'Return of the Hero',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 38, to: 41 },
                    },
                    {
                        title: () => 'The Human Monster',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 42, to: 45 },
                    },
                    {
                        title: () => 'The Hunt Begins',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 46, to: 51 },
                    },
                    {
                        title: () => 'The Metal Bat',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 52, to: 57 },
                    },
                    {
                        title: () => 'The Martial Arts Tournament',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 58, to: 61 },
                    },
                    {
                        title: () => 'The Monster Uprising',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 62, to: 66 },
                    },
                    {
                        title: () => 'The S Class Heroes',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 67, to: 71 },
                    },
                    {
                        title: () => 'The Resistance of the Strong',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 71, to: 74 },
                    },
                    {
                        title: () => 'The Troubles of the Strongest',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 75, to: 79 },
                    },
                    {
                        title: () => 'Justice Under Siege',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 79, to: 81 },
                    },
                    {
                        title: () => 'The Varieties of Pride',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 81, to: 83 },
                    },
                    {
                        title: () => "The Wiping of the Disciple's Butt",
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 83, to: 85 },
                    },
                ],
            },
            {
                title: 'Season Three',
                cover: () => 'One-Punch_Man_Season_3_Key_Visual_2',
                offset: { x: 0, y: 0 },
                chapters: { from: 86, to: 141 },
                episodes: [
                    {
                        title: () => 'The Strategy Meeting',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 86, to: 87 },
                    },
                    {
                        title: () => 'Monster Traits',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 88, to: 89 },
                    },
                ],
            },
            {
                chapters: { from: 142, to: CHAPTERS_TOTAL },
            },
        ] as const satisfies Tuple<Season, typeof SEASONS_TOTAL>,
        splitChapters: {
            18: 5,
            26: 10,
            34: 12,
            71: 32,
            79: 7,
            81: 41,
            83: 57,
        },
        wikiBase: 'https://onepunchman.fandom.com/wiki/',
        smallImages: {
            'scroller-or-favicon': 'circle',
            'read-info': 'circle',
            'toggle-unbounded-chapter-width': 'circle',
            'toggle-cross-lines': 'circle',
            'open-chapter-calendar': 'circle',
            'toggle-always-show-titles': 'circle',
            'capture-timeline': 'circle',
        },
        socialLinks: [],
    },
};
