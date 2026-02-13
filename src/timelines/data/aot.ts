import {
    getArcWidth,
    getChapterWidth,
    getEpisodeWidth,
    getSagaWidth,
    getSeasonWidth,
    getVolumeWidth,
} from '../../shared/lib/helpers';
import { Tuple } from '../../shared/lib/util';
import { Arc, Season, Timeline, TimelineData, Volume } from '../types';

const SEASON_HEIGHT = 1511;
const EPISODE_HEIGHT = SEASON_HEIGHT * 0.2;
const VOLUME_HEIGHT = 1511;
const CHAPTER_HEIGHT = 100;
const ARC_HEIGHT = VOLUME_HEIGHT * 0.7;

const VOLUMES_TOTAL = 35;
const ARCS_TOTAL = 9;
const SEASONS_TOTAL = 8;

const volumeTitle = (_: TimelineData, idx: number) => `Volume ${idx + 1}`;
const volumeCover = (_: TimelineData, idx: number) =>
    idx === 0 ? `Volume_${idx + 1}_Cover` : `SnK_-_Manga_Volume_${idx + 1}`;
const episodeCover = (_: TimelineData, idx: number) =>
    `Attack_on_Titan_-_Episode_${idx + 1}_Title_Card`;

export const AOT_TIMELINE: Timeline = {
    layout: {
        season: {
            type: 'season',
            height: SEASON_HEIGHT,
            width: getSeasonWidth,
            blankfontSize: 250,
            titleFontSize: 100,
            sectionLink: 'Attack on Titan (Anime)',
            wikiLink: (title, n) =>
                n === 1 ?
                    'List of Attack on Titan episodes'
                :   `List of Attack on Titan episodes/${title.replace(
                        /Part.+/g,
                        '',
                    )}`,
            subTimeline: {
                type: 'episode',
                height: EPISODE_HEIGHT,
                width: getEpisodeWidth,
                scale: 1.2,
                titleProcessor: (title, n) => `${title}\n(Episode ${n})`,
                blankfontSize: 42,
                titleFontSize: 42,
                sectionLink: 'List of Attack on Titan episodes',
                wikiLink: title => `${title.replaceAll(' ', '_')}_(Episode)`,
            },
        },
        saga: {
            type: 'saga',
            height: ARC_HEIGHT,
            width: getSagaWidth,
            blankfontSize: 0,
            titleFontSize: 0,
            sectionLink: 'Story Arcs',
            wikiLink: () => 'unused',
            subTimeline: {
                type: 'arc',
                height: ARC_HEIGHT,
                width: getArcWidth,
                titleProcessor: title => `${title} arc`,
                blankfontSize: 100,
                titleFontSize: 100,
                sectionLink: 'Story Arcs',
                wikiLink: title => `${title} arc`,
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
            sectionLink: 'List of Attack on Titan chapters',
            wikiLink: (_, n) => `Chapter_${n}`,
            focusable: true,
        },
        volume: {
            type: 'volume',
            height: VOLUME_HEIGHT,
            width: getVolumeWidth,
            defaultCoverPosition: 'top',
            blankfontSize: 500,
            titleFontSize: 100,
            sectionLink: 'List of Attack on Titan chapters',
            wikiLink: () => `List of Attack on Titan chapters`,
        },
    },
    data: {
        title: 'Attack on Titan',
        volumes: [
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'To You, 2,000 Years From Now',
                        date: 'September 9, 2009',
                        pages: 53,
                        cover: null,
                    },
                    {
                        title: () => 'That Day',
                        date: 'October 9, 2009',
                        pages: 41,
                        cover: null,
                    },
                    {
                        title: () => 'Night of the Disbanding Ceremony',
                        date: 'November 9, 2009',
                        pages: 44,
                        cover: null,
                    },
                    {
                        title: () => 'First Battle',
                        date: 'December 9, 2009',
                        pages: 64,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'A Dull Glow in the Midst of Despair',
                        date: 'January 9, 2010',
                        pages: 39,
                        cover: null,
                    },
                    {
                        title: () => 'The World that the Girl Saw',
                        date: 'February 9, 2010',
                        pages: 38,
                        cover: null,
                    },
                    {
                        title: () => 'Small Blade',
                        date: 'March 9, 2010',
                        pages: 35,
                        cover: null,
                    },
                    {
                        title: () => 'Roar',
                        date: 'April 9, 2010',
                        pages: 36,
                        cover: null,
                    },
                    {
                        title: () => 'The Beating of a Heart Can Be Heard',
                        date: 'May 9, 2010',
                        pages: 37,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => "Where's the Left Arm?",
                        date: 'June 9, 2010',
                        pages: 43,
                        cover: null,
                    },
                    {
                        title: () => 'Response',
                        date: 'July 9, 2010',
                        pages: 41,
                        cover: null,
                    },
                    {
                        title: () => 'Icon',
                        date: 'August 9, 2010',
                        pages: 44,
                        cover: null,
                    },
                    {
                        title: () => 'Wound',
                        date: 'September 9, 2010',
                        pages: 48,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Primitive Desire',
                        date: 'October 9, 2010',
                        pages: 47,
                        cover: null,
                    },
                    {
                        title: () => 'One by One',
                        date: 'November 9, 2010',
                        pages: 38,
                        cover: null,
                    },
                    {
                        title: () => 'Necessity',
                        date: 'December 9, 2010',
                        pages: 32,
                        cover: null,
                    },
                    {
                        title: () => 'Delusions of Strength',
                        date: 'January 9, 2011',
                        pages: 34,
                        cover: null,
                    },
                    {
                        title: () => 'What Should I Do Now?',
                        date: 'February 9, 2011',
                        pages: 39,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => "Still Can't See",
                        date: 'March 9, 2011',
                        pages: 46,
                        cover: null,
                    },
                    {
                        title: () => 'Special Operations Squad',
                        date: 'April 9, 2011',
                        pages: 32,
                        cover: null,
                    },
                    {
                        title: () => 'Opening the Gate',
                        date: 'May 9, 2011',
                        pages: 40,
                        cover: null,
                    },
                    {
                        title: () => 'Long-Distance Enemy Scouting Formation',
                        date: 'June 9, 2011',
                        pages: 47,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'The Female Titan',
                        date: 'July 9, 2011',
                        pages: 50,
                        cover: null,
                    },
                    {
                        title: () => 'The Titan Forest',
                        date: 'August 9, 2011',
                        pages: 44,
                        cover: null,
                    },
                    {
                        title: () => 'Bite',
                        date: 'September 9, 2011',
                        pages: 44,
                        cover: null,
                    },
                    {
                        title: () => 'The Easy Path',
                        date: 'October 9, 2011',
                        pages: 44,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Erwin Smith',
                        date: 'November 9, 2011',
                        pages: 51,
                        cover: null,
                    },
                    {
                        title: () => 'Choices and Consequences',
                        date: 'December 9, 2011',
                        pages: 45,
                        cover: null,
                    },
                    {
                        title: () => 'Crushing Blow',
                        date: 'January 9, 2012',
                        pages: 41,
                        cover: null,
                    },
                    {
                        title: () => 'Losers',
                        date: 'February 9, 2012',
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
                        title: () => 'Grin',
                        date: 'March 9, 2012',
                        pages: 50,
                        cover: null,
                    },
                    {
                        title: () => 'Mercy',
                        date: 'April 9, 2012',
                        pages: 44,
                        cover: null,
                    },
                    {
                        title: () => 'Wall',
                        date: 'May 9, 2012',
                        pages: 45,
                        cover: null,
                    },
                    {
                        title: () => 'Soldiers Dance',
                        date: 'June 9, 2012',
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
                        title: () => 'The Beast Titan',
                        date: 'July 9, 2012',
                        pages: 49,
                        cover: null,
                    },
                    {
                        title: () => "I'm Home",
                        date: 'August 9, 2012',
                        pages: 46,
                        cover: null,
                    },
                    {
                        title: () => 'Southwestward',
                        date: 'September 9, 2012',
                        pages: 45,
                        cover: null,
                    },
                    {
                        title: () => 'Utgard Castle',
                        date: 'October 9, 2012',
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
                        title: () => 'Soldier',
                        date: 'November 9, 2012',
                        pages: 50,
                        cover: null,
                    },
                    {
                        title: () => 'Ymir',
                        date: 'December 9, 2012',
                        pages: 50,
                        cover: null,
                    },
                    {
                        title: () => 'Historia',
                        date: 'January 9, 2013',
                        pages: 45,
                        cover: null,
                    },
                    {
                        title: () => 'Warrior',
                        date: 'February 9, 2013',
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
                        title: () => 'The Armored Titan',
                        date: 'March 9, 2013',
                        pages: 44,
                        cover: null,
                    },
                    {
                        title: () => 'Strike, Throw, Submit',
                        date: 'April 9, 2013',
                        pages: 45,
                        cover: null,
                    },
                    {
                        title: () => 'The Hunters',
                        date: 'May 9, 2013',
                        pages: 45,
                        cover: null,
                    },
                    {
                        title: () => 'Opening',
                        date: 'June 9, 2013',
                        pages: 48,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Children',
                        date: 'July 9, 2013',
                        pages: 48,
                        cover: null,
                    },
                    {
                        title: () => 'Someone',
                        date: 'August 9, 2013',
                        pages: 46,
                        cover: null,
                    },
                    {
                        title: () => 'Charge',
                        date: 'September 9, 2013',
                        pages: 44,
                        cover: null,
                    },
                    {
                        title: () => 'Scream',
                        date: 'October 9, 2013',
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
                        title: () => 'Squad Levi',
                        date: 'November 9, 2013',
                        pages: 55,
                        cover: null,
                    },
                    {
                        title: () => 'Krista Lenz',
                        date: 'December 9, 2013',
                        pages: 46,
                        cover: null,
                    },
                    {
                        title: () => 'Smoke Signal',
                        date: 'January 9, 2014',
                        pages: 46,
                        cover: null,
                    },
                    {
                        title: () => 'Location of the Counterattack',
                        date: 'February 9, 2014',
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
                        title: () => 'Pain',
                        date: 'March 9, 2014',
                        pages: 51,
                        cover: null,
                    },
                    {
                        title: () => 'Actors',
                        date: 'April 9, 2014',
                        pages: 46,
                        cover: null,
                    },
                    {
                        title: () => 'Kenny the Ripper',
                        date: 'May 9, 2014',
                        pages: 46,
                        cover: null,
                    },
                    {
                        title: () => 'Gunshots',
                        date: 'June 9, 2014',
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
                        title: () => 'Soul of a Heretic',
                        date: 'July 9, 2014',
                        pages: 51,
                        cover: null,
                    },
                    {
                        title: () => 'Trust',
                        date: 'August 9, 2014',
                        pages: 46,
                        cover: null,
                    },
                    {
                        title: () => 'Reply',
                        date: 'September 9, 2014',
                        pages: 46,
                        cover: null,
                    },
                    {
                        title: () => 'Sin',
                        date: 'October 9, 2014',
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
                        title: () => 'Chains',
                        date: 'November 7, 2014',
                        pages: 47,
                        cover: null,
                    },
                    {
                        title: () => 'Welcome Party',
                        date: 'December 9, 2014',
                        pages: 46,
                        cover: null,
                    },
                    {
                        title: () => 'Dreams and Curses',
                        date: 'January 9, 2015',
                        pages: 45,
                        cover: null,
                    },
                    {
                        title: () => 'Wish',
                        date: 'February 9, 2015',
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
                        title: () => 'Outside the Walls of Orvud District',
                        date: 'March 6, 2015',
                        pages: 48,
                        cover: null,
                    },
                    {
                        title: () => 'Ruler of the Walls',
                        date: 'April 9, 2015',
                        pages: 41,
                        cover: null,
                    },
                    {
                        title: () => 'Friends',
                        date: 'May 9, 2015',
                        pages: 46,
                        cover: null,
                    },
                    {
                        title: () => 'A Dream I Once Had',
                        date: 'June 9, 2015',
                        pages: 47,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Bystander',
                        date: 'July 9, 2015',
                        pages: 51,
                        cover: null,
                    },
                    {
                        title: () => 'Night of the Battle to Retake the Wall',
                        date: 'August 9, 2015',
                        pages: 45,
                        cover: null,
                    },
                    {
                        title: () => 'The Town Where Everything Began',
                        date: 'September 9, 2015',
                        pages: 42,
                        cover: null,
                    },
                    {
                        title: () => 'Mission Objectives',
                        date: 'October 9, 2015',
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
                        title: () => 'War on Two Fronts',
                        date: 'November 9, 2015',
                        pages: 49,
                        cover: null,
                    },
                    {
                        title: () => 'The Thunder Spears',
                        date: 'December 9, 2015',
                        pages: 45,
                        cover: null,
                    },
                    {
                        title: () => 'The World They Saw',
                        date: 'January 9, 2016',
                        pages: 46,
                        cover: null,
                    },
                    {
                        title: () => 'Descent',
                        date: 'February 9, 2016',
                        pages: 46,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Perfect Game',
                        date: 'March 9, 2016',
                        pages: 46,
                        cover: null,
                    },
                    {
                        title: () => 'The Nameless Soldiers',
                        date: 'April 9, 2016',
                        pages: 48,
                        cover: null,
                    },
                    {
                        title: () => 'Promise',
                        date: 'May 9, 2016',
                        pages: 45,
                        cover: null,
                    },
                    {
                        title: () => 'Hero',
                        date: 'June 9, 2016',
                        pages: 44,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Cleaver',
                        date: 'July 9, 2016',
                        pages: 50,
                        cover: null,
                    },
                    {
                        title: () => 'Midnight Sun',
                        date: 'August 9, 2016',
                        pages: 46,
                        cover: null,
                    },
                    {
                        title: () => 'The Basement',
                        date: 'September 9, 2016',
                        pages: 45,
                        cover: null,
                    },
                    {
                        title: () => 'That Day',
                        date: 'October 8, 2016',
                        pages: 47,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Borderline',
                        date: 'November 8, 2016',
                        pages: 50,
                        cover: null,
                    },
                    {
                        title: () => 'The Attack Titan',
                        date: 'December 8, 2016',
                        pages: 46,
                        cover: null,
                    },
                    {
                        title: () => 'Meeting',
                        date: 'January 6, 2017',
                        pages: 46,
                        cover: null,
                    },
                    {
                        title: () => 'To the Other Side of the Wall',
                        date: 'February 9, 2017',
                        pages: 46,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'The Other Side of the Ocean',
                        date: 'March 9, 2017',
                        pages: 47,
                        cover: null,
                    },
                    {
                        title: () => "Marley's Soldiers",
                        date: 'April 8, 2017',
                        pages: 41,
                        cover: null,
                    },
                    {
                        title: () => 'Midnight Train',
                        date: 'May 9, 2017',
                        pages: 47,
                        cover: null,
                    },
                    {
                        title: () => 'The Boy Inside the Walls',
                        date: 'June 9, 2017',
                        pages: 47,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Liar',
                        date: 'July 7, 2017',
                        pages: 49,
                        cover: null,
                    },
                    {
                        title: () => 'The Door of Hope',
                        date: 'August 9, 2017',
                        pages: 43,
                        cover: null,
                    },
                    {
                        title: () => 'From One Hand to Another',
                        date: 'September 8, 2017',
                        pages: 46,
                        cover: null,
                    },
                    {
                        title: () => 'Good to See',
                        date: 'October 7, 2017',
                        pages: 48,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Guilty Shadow',
                        date: 'November 9th, 2017',
                        pages: 50,
                        cover: null,
                    },
                    {
                        title: () => 'Declaration of War',
                        date: 'December 9th, 2017',
                        pages: 42,
                        cover: null,
                    },
                    {
                        title: () => 'The War Hammer Titan',
                        date: 'January 9th, 2018',
                        pages: 41,
                        cover: null,
                    },
                    {
                        title: () => 'Too Little, Too Late',
                        date: 'February 9th, 2018',
                        pages: 48,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Assault',
                        date: 'March 9th, 2018',
                        pages: 47,
                        cover: null,
                    },
                    {
                        title: () => 'Victors',
                        date: 'April 9th, 2018',
                        pages: 43,
                        cover: null,
                    },
                    {
                        title: () => "Assassin's Bullet",
                        date: 'May 9th, 2018',
                        pages: 46,
                        cover: null,
                    },
                    {
                        title: () => 'Brave Volunteers',
                        date: 'June 9th, 2018',
                        pages: 48,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Visitor',
                        date: 'July 9th, 2018',
                        pages: 50,
                        cover: null,
                    },
                    {
                        title: () => 'A Sound Argument',
                        date: 'August 9th, 2018',
                        pages: 46,
                        cover: null,
                    },
                    {
                        title: () => 'Guides',
                        date: 'September 7th, 2018',
                        pages: 47,
                        cover: null,
                    },
                    {
                        title: () => 'Counterfeit',
                        date: 'October 9th, 2018',
                        pages: 48,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Children of the Forest',
                        date: 'November 9th, 2018',
                        pages: 51,
                        cover: null,
                    },
                    {
                        title: () => 'Ignorance',
                        date: 'December 7th, 2018',
                        pages: 45,
                        cover: null,
                    },
                    {
                        title: () => 'Savagery',
                        date: 'January 9th, 2019',
                        pages: 47,
                        cover: null,
                    },
                    {
                        title: () => 'Sole Salvation',
                        date: 'February 9th, 2019',
                        pages: 48,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Support',
                        date: 'March 9th, 2019',
                        pages: 51,
                        cover: null,
                    },
                    {
                        title: () => 'Above and Below',
                        date: 'April 9th, 2019',
                        pages: 47,
                        cover: null,
                    },
                    {
                        title: () => 'Judgment',
                        date: 'May 9th, 2019',
                        pages: 47,
                        cover: null,
                    },
                    {
                        title: () => 'Sneak Attack',
                        date: 'June 8th, 2019',
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
                        title: () => 'Two Brothers',
                        date: 'July 9th, 2019',
                        pages: 48,
                        cover: null,
                    },
                    {
                        title: () => 'A Fleeting Moment',
                        date: 'August 9th, 2019',
                        pages: 44,
                        cover: null,
                    },
                    {
                        title: () => 'Memories of the Future',
                        date: 'September 9th, 2019',
                        pages: 46,
                        cover: null,
                    },
                    {
                        title: () => 'From You, 2,000 Years Ago',
                        date: 'October 9th, 2019',
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
                        title: () => 'Island Devils',
                        date: 'November 9th, 2019',
                        pages: 47,
                        cover: null,
                    },
                    {
                        title: () => 'Thaw',
                        date: 'December 9th, 2019',
                        pages: 46,
                        cover: null,
                    },
                    {
                        title: () => 'Sunset',
                        date: 'January 9th, 2020',
                        pages: 46,
                        cover: null,
                    },
                    {
                        title: () => 'Pride',
                        date: 'February 7th, 2020',
                        pages: 50,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Night of The End',
                        date: 'March 9th, 2020',
                        pages: 49,
                        cover: null,
                    },
                    {
                        title: () => 'Traitor',
                        date: 'April 9th, 2020',
                        pages: 46,
                        cover: null,
                    },
                    {
                        title: () => 'Retrospective',
                        date: 'June 9th, 2020',
                        pages: 46,
                        cover: null,
                    },
                    {
                        title: () => 'The Dawn of Humanity',
                        date: 'July 9th, 2020',
                        pages: 39,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'The Rumbling',
                        date: 'August 7th, 2020',
                        pages: 44,
                        cover: null,
                    },
                    {
                        title: () => 'The Wings of Freedom',
                        date: 'September 9th, 2020',
                        pages: 45,
                        cover: null,
                    },
                    {
                        title: () => 'Sinners',
                        date: 'October 9th, 2020',
                        pages: 44,
                        cover: null,
                    },
                    {
                        title: () => 'In the Depths of Despair',
                        date: 'November 9th, 2020',
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
                        title: () => 'The Battle of Heaven and Earth',
                        date: 'December 9th, 2020',
                        pages: 47,
                        cover: null,
                    },
                    {
                        title: () => 'Dedicate Your Heart',
                        date: 'January 9th, 2021',
                        pages: 46,
                        cover: null,
                    },
                    {
                        title: () => 'Titans',
                        date: 'February 9th, 2021',
                        pages: 45,
                        cover: null,
                    },
                    {
                        title: () => 'A Long Dream',
                        date: 'March 9th, 2021',
                        pages: 47,
                        cover: null,
                    },
                    {
                        title: () => 'Toward the Tree on That Hill',
                        date: 'April 9th, 2021',
                        pages: 59,
                        cover: null,
                    },
                ],
            },
            {
                title: (title, idx) =>
                    `${volumeTitle(
                        title,
                        idx,
                    )}\n(Side Stories grouped together)`,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Captain Levi',
                        date: 'February 17, 2010',
                        pages: 25,
                        cover: null,
                    },
                    {
                        title: () => "Ilse's Notebook",
                        date: 'January 5, 2011',
                        pages: 23,
                        cover: null,
                    },
                    {
                        title: () => 'Bad Boy',
                        date: 'May 1, 2024',
                        pages: 18,
                        cover: null,
                    },
                ],
            },
        ] as const satisfies Tuple<Volume, typeof VOLUMES_TOTAL>,
        sagas: [
            {
                title: '',
                cover: '',
                offset: { x: 0, y: 0 },
                chapters: { from: 1 },
                arcs: [
                    {
                        title: 'Prologue',
                        cover: 'The_Colossus_Titan_appears',
                        offset: { x: 100, y: 0 },
                        chapters: { from: 1, to: 2 },
                    },
                    {
                        title: 'Wall Sealing',
                        cover: 'Battle_of_Trost_District',
                        offset: { x: 0, y: 700 },
                        chapters: { from: 3, to: 14 },
                    },
                    {
                        title: '104th Training Corps',
                        cover: '104th_Training_Corps',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 15, to: 18 },
                    },
                    {
                        title: 'The Female Titan',
                        cover: 'The_Female_Titan_battle',
                        offset: { x: 0, y: 1500 },
                        chapters: { from: 19, to: 34 },
                    },
                    {
                        title: 'Clash of the Titans',
                        cover: 'Clash_of_the_Titans',
                        offset: { x: 0, y: 1 },
                        chapters: { from: 35, to: 50 },
                    },
                    {
                        title: 'Royal Government',
                        cover: 'Erwin_and_Pixis_speaking',
                        offset: { x: 0, y: 1000 },
                        chapters: { from: 51, to: 70 },
                    },
                    {
                        title: 'Return to Shiganshina',
                        cover: 'Eren_returns_home',
                        offset: { x: 0, y: 1000 },
                        chapters: { from: 71, to: 90 },
                    },
                    {
                        title: 'Marley',
                        cover: 'Volume_23_Cover_-_Clean_Version',
                        offset: { x: 0, y: 2000 },
                        chapters: { from: 91, to: 106 },
                    },
                    {
                        title: 'War for Paradis ',
                        cover: 'Volume_29_Cover_-_Clean_Version',
                        offset: { x: 0, y: 2200 },
                        chapters: { from: 107, to: 139 },
                    },
                ] as const satisfies Tuple<Arc, typeof ARCS_TOTAL>,
            },
        ],
        seasons: [
            // https://imgur.com/a/attack-on-titan-chapter-coverage-guide-AsZ683p
            {
                title: 'Season 1',
                cover: () => 'Attack_on_Titan_Season_1',
                offset: { x: 0, y: 6740 },
                chapters: { from: 1, to: 34 },
                episodes: [
                    {
                        title: () =>
                            'To You, in 2000 Years: The Fall of Shiganshina, Part 1',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 1, to: 2 },
                    },
                    {
                        title: () =>
                            'That Day: The Fall of Shiganshina, Part 2',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 2, to: 3 },
                    },
                    {
                        title: () =>
                            "A Dim Light Amid Despair: Humanity's Comeback, Part 1",
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 15, to: 16 },
                    },
                    {
                        title: () =>
                            "The Night of the Closing Ceremony: Humanity's Comeback, Part 2",
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 17, to: 18 },
                    },
                    {
                        title: () =>
                            'First Battle: The Struggle for Trost, Part 1',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 4, to: 4 },
                    },
                    {
                        title: () =>
                            'The World the Girl Saw: The Struggle for Trost, Part 2',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 5, to: 6 },
                    },
                    {
                        title: () =>
                            'Small Blade: The Struggle for Trost, Part 3',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 7, to: 8 },
                    },
                    {
                        title: () =>
                            'I Can Hear His Heartbeat: The Struggle for Trost, Part 4',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 8, to: 9 },
                    },
                    {
                        title: () =>
                            'Whereabouts of His Left Arm: The Struggle for Trost, Part 5',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 10, to: 10 },
                    },
                    {
                        title: () => 'Response: The Struggle for Trost, Part 6',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 11, to: 12 },
                    },
                    {
                        title: () => 'Idol: The Struggle for Trost, Part 7',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 11, to: 12 },
                    },
                    {
                        title: () => 'Wound: The Struggle for Trost, Part 8',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 13, to: 14 },
                    },
                    {
                        title: () =>
                            'Primal Desire: The Struggle for Trost, Part 9',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 17, to: 18 },
                    },
                    {
                        title: () =>
                            "Can't Look into His Eyes Yet: Eve of the Counterattack, Part 1",
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 19, to: 19 },
                    },
                    {
                        title: () =>
                            'Special Operations Squad: Eve of the Counterattack, Part 2',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 20, to: 21 },
                    },
                    {
                        title: () =>
                            'What Needs to be Done Now: Eve of the Counterattack, Part 3',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 21, to: 22 },
                    },
                    {
                        title: () =>
                            'Female Titan: The 57th Exterior Scouting Mission, Part 1',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 22, to: 23 },
                    },
                    {
                        title: () =>
                            'Forest of Giant Trees: The 57th Exterior Scouting Mission, Part 2',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 24, to: 25 },
                    },
                    {
                        title: () =>
                            'Bite: The 57th Exterior Scouting Mission, Part 3',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 25, to: 26 },
                    },
                    {
                        title: () =>
                            'Erwin Smith: The 57th Exterior Scouting Mission, Part 4',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 27, to: 28 },
                    },
                    {
                        title: () =>
                            'Crushing Blow: The 57th Exterior Scouting Mission, Part 5',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 28, to: 30 },
                    },
                    {
                        title: () =>
                            'The Defeated: The 57th Exterior Scouting Mission, Part 6',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 30, to: 31 },
                    },
                    {
                        title: () => 'Smile: Assault on Stohess, Part 1',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 31, to: 32 },
                    },
                    {
                        title: () => 'Mercy: Assault on Stohess, Part 2',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 32, to: 33 },
                    },
                    {
                        title: () => 'Wall: Assault on Stohess, Part 3',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 33, to: 34 },
                    },
                ],
            },
            {
                title: 'Season 2',
                cover: () => 'Attack_on_Titan_Season_2_Official_Poster',
                offset: { x: 0, y: 1080 },
                chapters: { from: 34, to: 51 },
                episodes: [
                    {
                        title: () => 'Beast Titan',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 34, to: 35 },
                    },
                    {
                        title: () => "I'm Home",
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 36, to: 37 },
                    },
                    {
                        title: () => 'Southwestward',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 37, to: 38 },
                    },
                    {
                        title: () => 'Soldier',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 39, to: 40 },
                    },
                    {
                        title: () => 'Historia',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 40, to: 41 },
                    },
                    {
                        title: () => 'Warrior',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 42, to: 42 },
                    },
                    {
                        title: () => 'Close Combat',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 43, to: 45 },
                    },
                    {
                        title: () => 'The Hunters',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 45, to: 46 },
                    },
                    {
                        title: () => 'Opening',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 46, to: 47 },
                    },
                    {
                        title: () => 'Children',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 47, to: 48 },
                    },
                    {
                        title: () => 'Charge',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 48, to: 49 },
                    },
                    {
                        title: () => 'Scream',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 50, to: 51 },
                    },
                ],
            },
            {
                title: 'Season 3 Part 1',
                cover: () => 'Attack_on_Titan_Season_3',
                offset: { x: 0, y: 1780 },
                chapters: { from: 51, to: 72 },
                episodes: [
                    {
                        title: () => 'Smoke Signal',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 51, to: 53 },
                    },
                    {
                        title: () => 'Pain',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 54, to: 57 },
                    },
                    {
                        title: () => 'Old Story',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 58, to: 59 },
                    },
                    {
                        title: () => 'Trust',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 59, to: 61 },
                    },
                    {
                        title: () => 'Reply',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 61, to: 62 },
                    },
                    {
                        title: () => 'Sin',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 62, to: 63 },
                    },
                    {
                        title: () => 'Wish',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 63, to: 66 },
                    },
                    {
                        title: () => 'Outside the Walls of Orvud District',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 66, to: 67 },
                    },
                    {
                        title: () => 'Ruler of the Walls',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 67, to: 68 },
                    },
                    {
                        title: () => 'Friends',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 69, to: 69 },
                    },
                    {
                        title: () => 'Bystander',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 70, to: 71 },
                    },
                    {
                        title: () => 'Night of the Battle to Retake the Wall',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 72, to: 72 },
                    },
                ],
            },
            {
                title: 'Season 3 Part 2',
                cover: () =>
                    'Attack_on_Titan_Season_3_sixth_key_visual_(clean)',
                offset: { x: 0, y: 1740 },
                chapters: { from: 73, to: 90 },
                episodes: [
                    {
                        title: () => 'The Town Where Everything Began',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 73, to: 74 },
                    },
                    {
                        title: () => 'Thunder Spears',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 75, to: 76 },
                    },
                    {
                        title: () => 'Descent',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 77, to: 78 },
                    },
                    {
                        title: () => 'Perfect Game',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 79, to: 80 },
                    },
                    {
                        title: () => 'Hero',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 81, to: 82 },
                    },
                    {
                        title: () => 'Midnight Sun',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 83, to: 84 },
                    },
                    {
                        title: () => 'The Basement',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 85, to: 86 },
                    },
                    {
                        title: () => 'That Day',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 86, to: 87 },
                    },
                    {
                        title: () => 'Attack Titan',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 88, to: 89 },
                    },
                    {
                        title: () => 'The Other Side of the Wall',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 90, to: 90 },
                    },
                ],
            },
            {
                title: 'The Final Season Part 1',
                cover: () => 'Attack_on_Titan_The_Final_Season',
                offset: { x: 0, y: 850 },
                chapters: { from: 91, to: 116 },
                episodes: [
                    {
                        title: () => 'The Other Side of the Sea',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 91, to: 92 },
                    },
                    {
                        title: () => 'Midnight Train',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 93, to: 94 },
                    },
                    {
                        title: () => 'The Door of Hope',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 95, to: 97 },
                    },
                    {
                        title: () => 'From One Hand to Another',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 97, to: 98 },
                    },
                    {
                        title: () => 'Declaration of War',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 99, to: 100 },
                    },
                    {
                        title: () => 'The War Hammer Titan',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 101, to: 102 },
                    },
                    {
                        title: () => 'Assault',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 102, to: 104 },
                    },
                    {
                        title: () => "Assassin's Bullet",
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 104, to: 105 },
                    },
                    {
                        title: () => 'Brave Volunteers',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 106, to: 107 },
                    },
                    {
                        title: () => 'A Sound Argument',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 107, to: 108 },
                    },
                    {
                        title: () => 'Deceiver',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 108, to: 109 },
                    },
                    {
                        title: () => 'Guides',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 110, to: 111 },
                    },
                    {
                        title: () => 'Children of the Forest',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 111, to: 112 },
                    },
                    {
                        title: () => 'Savagery',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 112, to: 113 },
                    },
                    {
                        title: () => 'Sole Salvation',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 114, to: 115 },
                    },
                    {
                        title: () => 'Above and Below',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 116, to: 116 },
                    },
                ],
            },
            {
                title: 'The Final Season Part 2',
                cover: () =>
                    'Attack_on_Titan_The_Final_Season_Part_2_-_Key_Visual_6',
                offset: { x: 0, y: 1230 },
                chapters: { from: 117, to: 130 },
                episodes: [
                    {
                        title: () => 'Judgment',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 117, to: 118 },
                    },
                    {
                        title: () => 'Sneak Attack',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 118, to: 119 },
                    },
                    {
                        title: () => 'Two Brothers',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 119, to: 120 },
                    },
                    {
                        title: () => 'Memories of the Future',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 120, to: 121 },
                    },
                    {
                        title: () => 'From You, 2,000 Years Ago',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 121, to: 123 },
                    },
                    {
                        title: () => 'Thaw',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 124, to: 124 },
                    },
                    {
                        title: () => 'Sunset',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 125, to: 125 },
                    },
                    {
                        title: () => 'Pride',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 126, to: 126 },
                    },
                    {
                        title: () => 'Night of the End',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 127, to: 127 },
                    },
                    {
                        title: () => 'Traitor',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 128, to: 128 },
                    },
                    {
                        title: () => 'Retrospective',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 129, to: 129 },
                    },
                    {
                        title: () => 'The Dawn of Humanity',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 130, to: 130 },
                    },
                ],
            },
            {
                title: 'The Final Season Part 3',
                cover: () =>
                    'Attack_on_Titan_Final_Season_Part_3_key_visual_8_(textless)',
                offset: { x: 0, y: 100 },
                chapters: { from: 131, to: 134 },
                episodes: [
                    {
                        title: () => 'The Rumbling',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 131, to: 131 },
                    },
                    {
                        title: () => 'The Wings of Freedom',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 132, to: 132 },
                    },
                    {
                        title: () => 'In the Depths of Despair',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 133, to: 134 },
                    },
                ],
            },
            {
                title: 'The Final Season Part 4',
                cover: () =>
                    'Attack_on_Titan_Final_Season_Part_4_key_visual_9_(no_quotation)',
                offset: { x: 0, y: 200 },
                chapters: { from: 135, to: 139 },
                episodes: [
                    {
                        title: () => 'The Battle of Heaven and Earth',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 135, to: 136 },
                    },
                    {
                        title: () => 'Dedicate Your Heart',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 136, to: 137 },
                    },
                    {
                        title: () => 'A Long Dream',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 137, to: 138 },
                    },
                    {
                        title: () => 'Toward the Tree on That Hill',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        chapters: { from: 138, to: 139 },
                    },
                ],
            },
        ] as const satisfies Tuple<Season, typeof SEASONS_TOTAL>,
        splitChapters: {
            2: 22,
            8: 14,
            15: 4,
            12: 8,
            14: 11,
            22: 13,
            25: 17,
            28: 16,
            30: 12,
            32: 6,
            34: 5,
            37: 7,
            40: 17,
            45: 6,
            47: 1,
            51: 43,
            57: 23,
            59: 15,
            62: 27,
            63: 27,
            66: 27,
            67: 29,
            86: 6,
            107: 9,
            108: 33,
            111: 16,
            112: 16,
            118: 8,
            120: 29,
            121: 37,
        },
        wikiBase: 'https://attackontitan.fandom.com/wiki/',
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
            { name: 'Anime website', url: 'http://shingeki.tv/' },
            { name: 'Manga website', url: 'http://shingeki.net/' },
            {
                name: 'Bessatsu Shōnen Magazine',
                url: 'http://www.shonenmagazine.com/bmaga/index.html',
            },
            {
                name: "Author's Blog",
                url: 'http://blog.livedoor.jp/isayamahazime/',
            },
        ],
    },
};
