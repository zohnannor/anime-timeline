import { Tuple } from '../types';
import { pad } from '../util';
import { Arc, Season, Timeline, TimelineData, Volume } from './';
import { getArcWidth, getChapterWidth, getVolumeWidth } from './widthHelpers';

const VOLUME_HEIGHT = 1579;
const CHAPTER_HEIGHT = 100;
const ARC_HEIGHT = VOLUME_HEIGHT * 0.8;

const ARCS_TOTAL = 5;
const VOLUMES_TOTAL = 8;

const volumeTitle = (_: TimelineData, idx: number) => `Volume ${idx + 1}`;
const volumeCover = (_: TimelineData, idx: number) => `Volume_${pad(idx + 1)}`;
const chapterTitle = (_: TimelineData, idx: number) => `Chapter ${idx + 1}`;

export const FP_TIMELINE: Timeline = {
    layout: {
        arc: {
            type: 'arc',
            height: ARC_HEIGHT,
            titleProcessor: title => `${title} arc`,
            blankfontSize: 100,
            titleFontSize: 100,
            width: getArcWidth,
            sectionLink: 'Story Arcs',
            wikiLink: title => `Story_Arcs#${title.replaceAll(' ', '_')}_Arc`,
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
            sectionLink: 'Fire_Punch_(manga)#Volumes',
            wikiLink: (_, n) => `Chapter_${n}`,
            focusable: true,
        },
        volume: {
            type: 'volume',
            height: VOLUME_HEIGHT,
            blankfontSize: 500,
            titleFontSize: 100,
            width: getVolumeWidth,
            sectionLink: 'Fire_Punch_(manga)#Volumes',
            wikiLink: (_, n) => `Volume_${n}`,
        },
    },
    data: {
        title: 'Fire Punch',
        volumes: [
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Witness A Miracle!!',
                        date: 'April 18, 2016',
                        pages: 65,
                        cover: null,
                    },
                    {
                        title: () =>
                            'The Warm Memories of The Far Distant Past',
                        date: 'April 25, 2016',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'May 02, 2016',
                        pages: 18,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'May 09, 2016',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'May 16, 2016',
                        pages: 17,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'May 23, 2016',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'May 30, 2016',
                        pages: 22,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'June 06, 2016',
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
                        title: chapterTitle,
                        date: 'June 20, 2016',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'June 27, 2016',
                        pages: 20,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'July 04, 2016',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'July 11, 2016',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'July 18, 2016',
                        pages: 22,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'July 25, 2016',
                        pages: 25,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'August 01, 2016',
                        pages: 23,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'August 08, 2016',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'August 15, 2016',
                        pages: 15,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'August 22, 2016',
                        pages: 14,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: chapterTitle,
                        date: 'September 05, 2016',
                        pages: 20,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'September 12, 2016',
                        pages: 24,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'September 19, 2016',
                        pages: 22,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'September 26, 2016',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'October 03, 2016',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'October 10, 2016',
                        pages: 23,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'October 17, 2016',
                        pages: 22,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'October 24, 2016',
                        pages: 17,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'October 31, 2016',
                        pages: 16,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'November 07, 2016',
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
                        title: chapterTitle,
                        date: 'November 21, 2016',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'November 28, 2016',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'December 05, 2016',
                        pages: 18,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'December 12, 2016',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'December 19, 2016',
                        pages: 22,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'December 26, 2016',
                        pages: 17,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'January 02, 2017',
                        pages: 18,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'January 09, 2017',
                        pages: 18,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'January 16, 2017',
                        pages: 16,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'January 23, 2017',
                        pages: 16,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'January 30, 2017',
                        pages: 14,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: chapterTitle,
                        date: 'February 13, 2017',
                        pages: 18,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'February 20, 2017',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'February 27, 2017',
                        pages: 20,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: '2017/03/06',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: '2017/03/13',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: '2017/03/20',
                        pages: 26,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: '2017/03/27',
                        pages: 20,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'April 03, 2017',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'April 10, 2017',
                        pages: 15,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'April 17, 2017',
                        pages: 25,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: chapterTitle,
                        date: 'May 01, 2017',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'May 08, 2017',
                        pages: 18,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'May 15, 2017',
                        pages: 20,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'May 22, 2017',
                        pages: 20,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'May 29, 2017',
                        pages: 16,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'June 05, 2017',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'June 12, 2017',
                        pages: 20,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'June 19, 2017',
                        pages: 20,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'June 26, 2017',
                        pages: 16,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'July 03, 2017',
                        pages: 16,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'July 10, 2017',
                        pages: 14,
                        cover: null,
                    },
                ],
            },
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: chapterTitle,
                        date: 'July 24, 2017',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'July 31, 2017',
                        pages: 18,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'August 07, 2017',
                        pages: 18,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'August 14, 2017',
                        pages: 20,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'August 21, 2017',
                        pages: 17,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'August 28, 2017',
                        pages: 16,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'September 04, 2017',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'September 11, 2017',
                        pages: 16,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'September 18, 2017',
                        pages: 17,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'September 25, 2017',
                        pages: 21,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'October 02, 2017',
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
                        title: chapterTitle,
                        date: 'October 16, 2017',
                        pages: 17,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'October 23, 2017',
                        pages: 16,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'October 30, 2017',
                        pages: 16,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'November 06, 2017',
                        pages: 17,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'November 13, 2017',
                        pages: 16,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'November 20, 2017',
                        pages: 17,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'November 27, 2017',
                        pages: 14,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'December 04, 2017',
                        pages: 19,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'December 11, 2017',
                        pages: 18,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'December 18, 2017',
                        pages: 16,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'December 25, 2017',
                        pages: 18,
                        cover: null,
                    },
                    {
                        title: chapterTitle,
                        date: 'January 01, 2018',
                        pages: 18,
                        cover: null,
                    },
                ],
            },
        ] as const satisfies Tuple<Volume, typeof VOLUMES_TOTAL>,
        arcs: [
            {
                title: 'Behemdorg',
                cover: null,
                offset: { x: 0, y: 0 },
                chapters: { from: 1, to: 33 },
            },
            {
                title: 'Catharsis',
                cover: null,
                offset: { x: 0, y: 0 },
                chapters: { from: 34, to: 52 },
            },
            {
                title: 'Amnesia',
                cover: null,
                offset: { x: 0, y: 0 },
                chapters: { from: 53, to: 62 },
            },
            {
                title: 'Fire Punch',
                cover: null,
                offset: { x: 0, y: 0 },
                chapters: { from: 63, to: 80 },
            },
            {
                title: 'Final Film',
                cover: null,
                offset: { x: 0, y: 0 },
                chapters: { from: 81, to: 83 },
            },
        ] as const satisfies Tuple<Arc, typeof ARCS_TOTAL>,
        seasons: [] as const satisfies Tuple<Season, 0>,
        splitChapters: {} as const,
        wikiBase: 'https://fire-punch.fandom.com/wiki/',
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
