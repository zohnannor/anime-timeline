/* eslint-disable max-lines */ // a lot of data for a title
import { pad, Tuple } from '@shared/lib/util';
import { Arc, Season, Timeline, Volume } from '@timelines/types';

const SEASON_HEIGHT = 742;
const EPISODE_HEIGHT = SEASON_HEIGHT * 0.33;
const VOLUME_HEIGHT = 1579;
const CHAPTER_HEIGHT = 100;
const ARC_HEIGHT = VOLUME_HEIGHT * 0.8;

type VolumesTotal = 39;
type ArcsTotal = 7;
type SeasonsTotal = 2;

const volumeTitle = (n: number) => `Volume ${n}`;
const volumeCover = (n: number) => `Volume_${pad(n)}`;
const chapterTitle = (n: number) => `Chapter ${n}`;
const episodeCover = (n: number) => n.toString();

export const HXH_TIMELINE: Timeline = {
    layout: {
        season: {
                type: 'season',
                height: SEASON_HEIGHT,
                blankfontSize: 250,
                titleFontSize: 100,
                numberProcessor: n => (n - 1).toString(),
                sectionLink: 'Hunter × Hunter (Anime)',
                wikiLink: title => title,
                subTimeline: {
                    type: 'episode',
                    height: EPISODE_HEIGHT,
                    scale: 1.2,
                    titleProcessor: (title, n) => `${title}\n(Episode ${n})`,
                    blankfontSize: 42,
                    titleFontSize: 42,
                    sectionLink: 'Hunter_×_Hunter_(Anime)#Episodes',
                    wikiLink: (_, n) => `Episode_${n}`,
                    focusable: true,
                },
            },
        arc: {
            type: 'arc',
            height: ARC_HEIGHT,
            titleProcessor: title => `${title} arc`,
            blankfontSize: 100,
            titleFontSize: 100,
            sectionLink: 'Story Arcs',
            wikiLink: title => title,
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
            sectionLink: 'Hunter_×_Hunter_(Manga)#Chapters',
            wikiLink: (_, n) => `Chapter_${n}`,
            focusable: true,
        },
        volume: {
            type: 'volume',
            height: VOLUME_HEIGHT,
            defaultCoverPosition: 'top',
            titleProcessor: (title, n) => `${title}\n(Volume ${n})`,
            blankfontSize: 500,
            titleFontSize: 100,
            sectionLink: 'Hunter_×_Hunter_(Manga)#Chapters',
            wikiLink: (_, n) => `Volume_${n}`,
        },
    },
    data: {
        title: 'Hunter × Hunter',
        volumes: [
            {
                title: volumeTitle,
                cover: volumeCover,
                chapters: [
                    {
                        title: chapterTitle,
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
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
                        date: 'January 1, 1970',
                        pages: 100,
                        cover: null,
                    },
                ],
            },
        ] as const satisfies Tuple<Volume, VolumesTotal>,
        arcs: [
            {
                title: 'Name...',
                cover: 'filename',
                offset: { x: 0, y: 0 },
                chapters: { from: 1, },
            },
            {
                title: 'Name...',
                cover: 'filename',
                offset: { x: 0, y: 0 },
                chapters: { from: 1, },
            },
            {
                title: 'Name...',
                cover: 'filename',
                offset: { x: 0, y: 0 },
                chapters: { from: 1, },
            },
            {
                title: 'Name...',
                cover: 'filename',
                offset: { x: 0, y: 0 },
                chapters: { from: 1, },
            },
            {
                title: 'Name...',
                cover: 'filename',
                offset: { x: 0, y: 0 },
                chapters: { from: 1, },
            },
            {
                title: 'Name...',
                cover: 'filename',
                offset: { x: 0, y: 0 },
                chapters: { from: 1, },
            },
            {
                title: 'Name...',
                cover: 'filename',
                offset: { x: 0, y: 0 },
                chapters: { from: 1, },
            },
        ] as const satisfies Tuple<Arc, ArcsTotal>,
        seasons: [
            {
                title: 'Hunter × Hunter (Anime)',
                cover: () => 'filename',
                offset: { x: 0, y: 0 },
                chapters: { from: 1, to: 1 },
                episodes: [
                    {
                        title: 'Name...',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'January 1, 1970',
                        chapters: { from: 1, to: 1 },
                    },
                ],
            },
            {
                title: 'Hunter × Hunter (Anime)',
                cover: () => 'filename',
                offset: { x: 0, y: 0 },
                chapters: { from: 1, to: 1 },
                episodes: [
                    {
                        title: 'Name...',
                        cover: episodeCover,
                        offset: { x: 0, y: 0 },
                        date: 'January 1, 1970',
                        chapters: { from: 1, to: 1 },
                    },
                ],
            },
            ] as const satisfies Tuple<Season, SeasonsTotal>,
        splitChapters: {},
        wikiBase: 'https://hunterxhunter.fandom.com/wiki/',
        smallImages: {
            'scroller-or-favicon': 'circle',
            'read-info': 'circle',
            'toggle-unbound-chapter-width': 'circle',
            'toggle-cross-lines': 'circle',
            'open-chapter-calendar': 'circle',
            'toggle-always-show-titles': 'circle',
            'capture-timeline': 'circle',
        },
        socialLinks: [],
    },
};
