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

const SEASON_HEIGHT = 1579;
const EPISODE_HEIGHT = SEASON_HEIGHT * 0.2;
const VOLUME_HEIGHT = 1579;
const CHAPTER_HEIGHT = 100;
const ARC_HEIGHT = VOLUME_HEIGHT * 0.25;

const VOLUMES_TOTAL = 138;
const SAGAS_TOTAL = 1;
const SEASONS_TOTAL = 10;

const volumeCover = (_: TimelineData, idx: number) => `Volume_${idx + 1}`;

export const JOJO_TIMELINE: Timeline = {
    layout: {
        season: {
            type: 'season',
            height: SEASON_HEIGHT,
            width: getSeasonWidth,
            blankfontSize: 250,
            titleFontSize: 100,
            numberProcessor: n => (n - 1).toString(),
            sectionLink: "JoJo's_Bizarre_Adventure_(Season)#Phantom_Blood",
            wikiLink: title => title,
            subTimeline: {
                type: 'episode',
                height: EPISODE_HEIGHT,
                width: getEpisodeWidth,
                scale: 1.2,
                titleProcessor: (title, n) => `${title}\n(Episode ${n})`,
                blankfontSize: 42,
                titleFontSize: 42,
                sectionLink: "JoJo's_Bizarre_Adventure_(Season)#Phantom_Blood",
                wikiLink: (_, n) => `Episode_${n}`,
            },
        },
        saga: {
            type: 'saga',
            height: ARC_HEIGHT,
            width: getSagaWidth,
            blankfontSize: 0,
            titleFontSize: 0,
            sectionLink: 'Releases_(Manga)#Arcs',
            wikiLink: () => 'unused',
            subTimeline: {
                type: 'arc',
                height: ARC_HEIGHT,
                width: getArcWidth,
                sidewaysText: true,
                titleProcessor: title => `${title} arc`,
                blankfontSize: 42,
                titleFontSize: 42,
                sectionLink: 'Story Arcs',
                wikiLink: arcName => `${arcName} arc`,
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
            sectionLink: "List_of_JoJo's_Bizarre_Adventure_Chapters",
            wikiLink: (_, n) => `Chapter_${n}`,
            focusable: true,
        },
        volume: {
            type: 'volume',
            height: VOLUME_HEIGHT,
            width: getVolumeWidth,
            titleProcessor: (title, n) => `${title}\n(Volume ${n})`,
            blankfontSize: 500,
            titleFontSize: 100,
            sectionLink: "List_of_JoJo's_Bizarre_Adventure_Chapters",
            wikiLink: (_, n) => `Volume_${n}`,
        },
    },
    data: {
        title: "JoJo's Bizarre Adventure",
        volumes: [
            {
                cover: volumeCover,
                title: () => 'Dio the Invader',
                chapters: [
                    {
                        date: '1 January 1987',
                        title: () => 'Prologue',
                        pages: 31,
                        cover: null,
                    },
                    {
                        date: '8 January 1987',
                        title: () => 'Dio Brando the Invader, Part 1',
                        pages: 23,
                        cover: null,
                    },
                    {
                        date: '15 January 1987',
                        title: () => 'Dio Brando the Invader, Part 2',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '22 January 1987',
                        title: () => 'Dio Brando the Invader, Part 3',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '29 January 1987',
                        title: () => 'Dio Brando the Invader, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '2 February 1987',
                        title: () => 'A Letter from the Past, Part 1',
                        pages: 23,
                        cover: null,
                    },
                    {
                        date: '9 February 1987',
                        title: () => 'A Letter from the Past, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '16 February 1987',
                        title: () => 'The Stone Mask, Part 1',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'The Thirst for Blood!',
                chapters: [
                    {
                        date: '23 February 1987',
                        title: () => 'The Stone Mask, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '2 March 1987',
                        title: () => 'The Stone Mask, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '9 March 1987',
                        title: () => 'The Stone Mask, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '16 March 1987',
                        title: () => 'Youth with Dio, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '23 March 1987',
                        title: () => 'Youth with Dio, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '30 March 1987',
                        title: () => 'Youth with Dio, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '6 April 1987',
                        title: () => 'Youth with Dio, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '13 April 1987',
                        title: () => 'Youth with Dio, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '20 April 1987',
                        title: () => 'The Birth of DIO',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'The Dark Knights',
                chapters: [
                    {
                        date: '27 April 1987',
                        title: () =>
                            'Jack the Ripper and Zeppeli the Strange, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '4 May 1987',
                        title: () =>
                            'Jack the Ripper and Zeppeli the Strange, Part 2',
                        pages: 18,
                        cover: null,
                    },
                    {
                        date: '11 May 1987',
                        title: () =>
                            'Jack the Ripper and Zeppeli the Strange, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '18 May 1987',
                        title: () =>
                            'Jack the Ripper and Zeppeli the Strange, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '25 May 1987',
                        title: () =>
                            'Jack the Ripper and Zeppeli the Strange, Part 5',
                        pages: 18,
                        cover: null,
                    },
                    {
                        date: '1 June 1987',
                        title: () => 'Ripple Overdrive, Part 1',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '8 June 1987',
                        title: () => 'Ripple Overdrive, Part 2',
                        pages: 18,
                        cover: null,
                    },
                    {
                        date: '15 June 1987',
                        title: () => 'Ripple Overdrive, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '22 June 1987',
                        title: () =>
                            'Tarkus and the Dark Knight Bruford, Part 1',
                        pages: 18,
                        cover: null,
                    },
                    {
                        date: '29 June 1987',
                        title: () =>
                            'Tarkus and the Dark Knight Bruford, Part 2',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Chamber of the Two-Headed Dragon',
                chapters: [
                    {
                        date: '6 July 1987',
                        title: () =>
                            'Tarkus and the Dark Knight Bruford, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '13 July 1987',
                        title: () =>
                            'Tarkus and the Dark Knight Bruford, Part 4',
                        pages: 18,
                        cover: null,
                    },
                    {
                        date: '20 July 1987',
                        title: () => 'Sleep as a Hero',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '27 July 1987',
                        title: () => "The Knights' Ruins",
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '3 August 1987',
                        title: () =>
                            "The Medieval Knights' Training Ground for Murder",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '10 August 1987',
                        title: () =>
                            'Pluck for Tomorrow and the Successor, Part 1',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '17 August 1987',
                        title: () =>
                            'Pluck for Tomorrow and the Successor, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '24 August 1987',
                        title: () =>
                            'Pluck for Tomorrow and the Successor, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '31 August 1987',
                        title: () => 'The Three from a Faraway Land, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '7 September 1987',
                        title: () => 'The Three from a Faraway Land, Part 2',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'The Final Ripple!',
                chapters: [
                    {
                        date: '14 September 1987',
                        title: () => 'The Three from a Faraway Land, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '21 September 1987',
                        title: () => 'Fire and Ice, Jonathan and Dio, Part 1',
                        pages: 18,
                        cover: null,
                    },
                    {
                        date: '28 September 1987',
                        title: () => 'Fire and Ice, Jonathan and Dio, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '5 October 1987',
                        title: () => 'Fire and Ice, Jonathan and Dio, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '12 October 1987',
                        title: () => 'Fire and Ice, Jonathan and Dio, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '19 October 1987',
                        title: () => 'Fire and Ice, Jonathan and Dio, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '26 October 1987',
                        title: () => 'Fire and Ice, Jonathan and Dio, Part 6',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '2 November 1987',
                        title: () => 'Joseph Joestar of New York, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '9 November 1987',
                        title: () => 'Joseph Joestar of New York, Part 2',
                        pages: 18,
                        cover: null,
                    },
                    {
                        date: '16 November 1987',
                        title: () => 'Joseph Joestar of New York, Part 3',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'JoJo vs. the Ultimate Being',
                chapters: [
                    {
                        date: '23 November 1987',
                        title: () => 'Straizo vs. Joseph, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '30 November 1987',
                        title: () => 'Straizo vs. Joseph, Part 2',
                        pages: 18,
                        cover: null,
                    },
                    {
                        date: '7 December 1987',
                        title: () => 'Straizo vs. Joseph, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '1 January 1988',
                        title: () => 'Straizo vs. Joseph, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '8 January 1988',
                        title: () => 'Straizo vs. Joseph, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '15 January 1988',
                        title: () => 'The Pillar Man',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '22 January 1988',
                        title: () => 'The Pillar Man, Santana, Part 1',
                        pages: 18,
                        cover: null,
                    },
                    {
                        date: '29 January 1988',
                        title: () => 'The Pillar Man, Santana, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '1 February 1988',
                        title: () => 'The Pillar Man, Santana, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '8 February 1988',
                        title: () => 'The Pillar Man, Santana, Part 4',
                        pages: 20,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'The Red Stone of Aja',
                chapters: [
                    {
                        date: '15 February 1988',
                        title: () => 'The Pillar Man, Santana, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '22 February 1988',
                        title: () => 'The Pillar Man, Santana, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '29 February 1988',
                        title: () => 'The Pillar Man, Santana, Part 7',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '7 March 1988',
                        title: () => 'The Pillar Man, Santana, Part 8',
                        pages: 18,
                        cover: null,
                    },
                    {
                        date: '14 March 1988',
                        title: () => 'The Pillar Man, Santana, Part 9',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '21 March 1988',
                        title: () => 'Joseph Joestar of Rome',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '28 March 1988',
                        title: () => 'The Red Stone of Aja',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '4 April 1988',
                        title: () =>
                            'Ultimate Warriors from Ancient Times, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '11 April 1988',
                        title: () =>
                            'Ultimate Warriors from Ancient Times, Part 2',
                        pages: 18,
                        cover: null,
                    },
                    {
                        date: '18 April 1988',
                        title: () =>
                            'Ultimate Warriors from Ancient Times, Part 3',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'The Final Trial!',
                chapters: [
                    {
                        date: '25 April 1988',
                        title: () =>
                            'Ultimate Warriors from Ancient Times, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '2 May 1988',
                        title: () =>
                            'Ultimate Warriors from Ancient Times, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '9 May 1988',
                        title: () =>
                            'An Engagement with Death: The Wedding Ring',
                        pages: 18,
                        cover: null,
                    },
                    {
                        date: '16 May 1988',
                        title: () => 'Ripple Teacher Lisa Lisa, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '23 May 1988',
                        title: () => 'Ripple Teacher Lisa Lisa, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '30 May 1988',
                        title: () => 'Ripple Teacher Lisa Lisa, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '6 June 1988',
                        title: () => 'Ripple Teacher Lisa Lisa, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '13 June 1988',
                        title: () => 'Ripple Teacher Lisa Lisa, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '20 June 1988',
                        title: () => 'Ripple Teacher Lisa Lisa, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '27 June 1988',
                        title: () => 'Go! Ripple Master',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Race Toward the Cliff of Death',
                chapters: [
                    {
                        date: '4 July 1988',
                        title: () => 'Flame Mode Esidisi, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '11 July 1988',
                        title: () => 'Flame Mode Esidisi, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '18 July 1988',
                        title: () => 'Flame Mode Esidisi, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '25 July 1988',
                        title: () => 'The Remains Lurk, Part 1',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '1 August 1988',
                        title: () => 'The Remains Lurk, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '8 August 1988',
                        title: () => "Stroheim's Unit Strikes Back, Part 1",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '15 August 1988',
                        title: () => "Stroheim's Unit Strikes Back, Part 2",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '22 August 1988',
                        title: () => "Stroheim's Unit Strikes Back, Part 3",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '29 August 1988',
                        title: () => 'Light Mode Kars, Part 1',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'The Crimson Bubble',
                chapters: [
                    {
                        date: '5 September 1988',
                        title: () => 'Light Mode Kars, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '12 September 1988',
                        title: () => 'Caesar: A Lonely Youth, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '19 September 1988',
                        title: () => 'Caesar: A Lonely Youth, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '26 September 1988',
                        title: () => 'Caesar: A Lonely Youth, Part 3',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '3 October 1988',
                        title: () => 'Caesar: A Lonely Youth, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '10 October 1988',
                        title: () => 'Caesar: A Lonely Youth, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '17 October 1988',
                        title: () => 'Caesar: A Lonely Youth, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '24 October 1988',
                        title: () => 'Climb Out of the Fortified Hotel',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '31 October 1988',
                        title: () => 'The Wind, the Chariot, and Wamuu, Part 1',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'The Warrior Returns to the Wind',
                chapters: [
                    {
                        date: '7 November 1988',
                        title: () => 'The Wind, the Chariot, and Wamuu, Part 2',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '14 November 1988',
                        title: () => 'The Wind, the Chariot, and Wamuu, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '21 November 1988',
                        title: () => 'The Wind, the Chariot, and Wamuu, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '28 November 1988',
                        title: () => 'The Wind, the Chariot, and Wamuu, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '5 December 1988',
                        title: () => 'The Wind, the Chariot, and Wamuu, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '12 December 1988',
                        title: () => 'The Wind, the Chariot, and Wamuu, Part 7',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '7 January 1989',
                        title: () => 'The Wind, the Chariot, and Wamuu, Part 8',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '15 January 1989',
                        title: () => 'The Wind, the Chariot, and Wamuu, Part 9',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '22 January 1989',
                        title: () => 'The Warrior Returns to the Wind',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'The Birth of a Superbeing!!',
                chapters: [
                    {
                        date: '29 January 1989',
                        title: () =>
                            'The Bond That Binds Lisa Lisa and JoJo, Part 1',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '6 February 1989',
                        title: () =>
                            'The Bond That Binds Lisa Lisa and JoJo, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '13 February 1989',
                        title: () => 'JoJo: The Final Ripple, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '20 February 1989',
                        title: () => 'JoJo: The Final Ripple, Part 2',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '27 February 1989',
                        title: () => 'Kars the Superbeing is Born, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '6 March 1989',
                        title: () => 'Kars the Superbeing is Born, Part 2',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '13 March 1989',
                        title: () => "Joseph's Final Gamble",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '20 March 1989',
                        title: () => 'The Man Who Became a God',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '27 March 1989',
                        title: () => 'The Man Who Crossed the Atlantic',
                        pages: 23,
                        cover: null,
                    },
                    {
                        date: '3 April 1989',
                        title: () => 'Jotaro Kujo, Part 1',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => "DIO's Curse",
                chapters: [
                    {
                        date: '10 April 1989',
                        title: () => 'Jotaro Kujo, Part 2',
                        pages: 23,
                        cover: null,
                    },
                    {
                        date: '17 April 1989',
                        title: () => 'Jotaro Kujo, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '24 April 1989',
                        title: () => 'The Man with the Star Birthmark',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '1 May 1989',
                        title: () => 'Noriaki Kakyoin, Part 1',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '8 May 1989',
                        title: () => 'Noriaki Kakyoin, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '15 May 1989',
                        title: () => 'Noriaki Kakyoin, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '22 May 1989',
                        title: () => 'The Power Called a "Stand"',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '29 May 1989',
                        title: () => 'Head to Egypt',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '5 June 1989',
                        title: () => 'Tower of Gray',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'The Unmanned Ship and the Ape',
                chapters: [
                    {
                        date: '12 June 1989',
                        title: () => 'Silver Chariot, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '19 June 1989',
                        title: () => 'Silver Chariot, Part 2',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '26 June 1989',
                        title: () => 'Silver Chariot, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '3 July 1989',
                        title: () => 'Dark Blue Moon, Part 1',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '10 July 1989',
                        title: () => 'Dark Blue Moon, Part 2',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '17 July 1989',
                        title: () => 'Dark Blue Moon, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '24 July 1989',
                        title: () => 'Strength, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '31 July 1989',
                        title: () => 'Strength, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '7 August 1989',
                        title: () => 'Strength, Part 3',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'The Gun is Mightier Than the Sword',
                chapters: [
                    {
                        date: '14 August 1989',
                        title: () => 'Devil, Part 1',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '21 August 1989',
                        title: () => 'Devil, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '28 August 1989',
                        title: () => 'Devil, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '4 September 1989',
                        title: () => 'Yellow Temperance, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '11 September 1989',
                        title: () => 'Yellow Temperance, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '18 September 1989',
                        title: () => 'Yellow Temperance, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '25 September 1989',
                        title: () => 'Yellow Temperance, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '2 October 1989',
                        title: () => 'Emperor and Hanged Man, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '9 October 1989',
                        title: () => 'Emperor and Hanged Man, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '16 October 1989',
                        title: () => 'Emperor and Hanged Man, Part 3',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Battle Experience!',
                chapters: [
                    {
                        date: '23 October 1989',
                        title: () => 'Emperor and Hanged Man, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '30 October 1989',
                        title: () => 'Emperor and Hanged Man, Part 5',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '6 November 1989',
                        title: () => 'Emperor and Hanged Man, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '13 November 1989',
                        title: () => 'Empress, Part 1',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '20 November 1989',
                        title: () => 'Empress, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '27 November 1989',
                        title: () => 'Empress, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '4 December 1989',
                        title: () => 'Empress, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '11 December 1989',
                        title: () => 'Wheel of Fortune, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '1 January 1990',
                        title: () => 'Wheel of Fortune, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '8 January 1990',
                        title: () => 'Wheel of Fortune, Part 3',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'The Terrifying Lovers',
                chapters: [
                    {
                        date: '15 January 1990',
                        title: () => 'Wheel of Fortune, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '22 January 1990',
                        title: () => 'Justice, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '29 January 1990',
                        title: () => 'Justice, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '5 February 1990',
                        title: () => 'Justice, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '12 February 1990',
                        title: () => 'Justice, Part 4',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '19 February 1990',
                        title: () => 'Justice, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '26 February 1990',
                        title: () => 'Justice, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '5 March 1990',
                        title: () => 'Lovers, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '12 March 1990',
                        title: () => 'Lovers, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '19 March 1990',
                        title: () => 'Lovers, Part 3',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Death Thirteen of Dreams',
                chapters: [
                    {
                        date: '26 March 1990',
                        title: () => 'Lovers, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '2 April 1990',
                        title: () => 'Lovers, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '9 April 1990',
                        title: () => 'Lovers, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '16 April 1990',
                        title: () => 'Sun, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '23 April 1990',
                        title: () => 'Sun, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '30 April 1990',
                        title: () => 'Death Thirteen, Part 1',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '14 May 1990',
                        title: () => 'Death Thirteen, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '21 May 1990',
                        title: () => 'Death Thirteen, Part 3',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '28 May 1990',
                        title: () => 'Death Thirteen, Part 4',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'The Magic Lamp',
                chapters: [
                    {
                        date: '4 June 1990',
                        title: () => 'Death Thirteen, Part 5',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '11 June 1990',
                        title: () => 'Death Thirteen, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '18 June 1990',
                        title: () => 'Judgement, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '25 June 1990',
                        title: () => 'Judgement, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '2 July 1990',
                        title: () => 'Judgement, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '9 July 1990',
                        title: () => 'Judgement, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '16 July 1990',
                        title: () => 'Judgement, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '23 July 1990',
                        title: () => 'High Priestess, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '30 July 1990',
                        title: () => 'High Priestess, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '6 August 1990',
                        title: () => 'High Priestess, Part 3',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'A Bombwork Orange',
                chapters: [
                    {
                        date: '13 August 1990',
                        title: () => 'High Priestess, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '20 August 1990',
                        title: () =>
                            '"The Fool" Iggy and "Geb" N\'Doul, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '27 August 1990',
                        title: () =>
                            '"The Fool" Iggy and "Geb" N\'Doul, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '3 September 1990',
                        title: () =>
                            '"The Fool" Iggy and "Geb" N\'Doul, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '10 September 1990',
                        title: () =>
                            '"The Fool" Iggy and "Geb" N\'Doul, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '17 September 1990',
                        title: () =>
                            '"The Fool" Iggy and "Geb" N\'Doul, Part 5',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '24 September 1990',
                        title: () =>
                            '"The Fool" Iggy and "Geb" N\'Doul, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '1 October 1990',
                        title: () => '"Khnum" Oingo and "Tohth" Boingo, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '8 October 1990',
                        title: () => '"Khnum" Oingo and "Tohth" Boingo, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '15 October 1990',
                        title: () => '"Khnum" Oingo and "Tohth" Boingo, Part 3',
                        pages: 20,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'A Woman with Wonderful Legs',
                chapters: [
                    {
                        date: '22 October 1990',
                        title: () => '"Khnum" Oingo and "Tohth" Boingo, Part 4',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '29 October 1990',
                        title: () => 'Anubis, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '5 November 1990',
                        title: () => 'Anubis, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '12 November 1990',
                        title: () => 'Anubis, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '19 November 1990',
                        title: () => 'Anubis, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '26 November 1990',
                        title: () => 'Anubis, Part 5',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '3 December 1990',
                        title: () => 'Anubis, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '10 December 1990',
                        title: () => '"Bastet" Mariah, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '17 December 1990',
                        title: () => '"Bastet" Mariah, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '1 January 1991',
                        title: () => '"Bastet" Mariah, Part 3',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Disappearance in a Locked Room',
                chapters: [
                    {
                        date: '8 January 1991',
                        title: () => '"Bastet" Mariah, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '21 January 1991',
                        title: () => '"Bastet" Mariah, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '28 January 1991',
                        title: () => '"Bastet" Mariah, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '4 February 1991',
                        title: () => '"Sethan" Alessi, Part 1',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '11 February 1991',
                        title: () => '"Sethan" Alessi, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '18 February 1991',
                        title: () => '"Sethan" Alessi, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '25 February 1991',
                        title: () => '"Sethan" Alessi, Part 4',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '4 March 1991',
                        title: () => '"Sethan" Alessi, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '11 March 1991',
                        title: () => 'Shooting DIO?!',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => "D'Arby's Collection",
                chapters: [
                    {
                        date: '18 March 1991',
                        title: () => "D'Arby the Gambler, Part 1",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '25 March 1991',
                        title: () => "D'Arby the Gambler, Part 2",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '1 April 1991',
                        title: () => "D'Arby the Gambler, Part 3",
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '8 April 1991',
                        title: () => "D'Arby the Gambler, Part 4",
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '15 April 1991',
                        title: () => "D'Arby the Gambler, Part 5",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '22 April 1991',
                        title: () => "D'Arby the Gambler, Part 6",
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '29 April 1991',
                        title: () => 'Hol Horse and Boingo, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '6 May 1991',
                        title: () => 'Hol Horse and Boingo, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '13 May 1991',
                        title: () => 'Hol Horse and Boingo, Part 3',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'The Gatekeeper of Hell, Pet Shop',
                chapters: [
                    {
                        date: '27 May 1991',
                        title: () => 'Hol Horse and Boingo, Part 4',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '3 June 1991',
                        title: () => 'Hol Horse and Boingo, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '10 June 1991',
                        title: () => 'The Gatekeeper of Hell, Pet Shop, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '17 June 1991',
                        title: () => 'The Gatekeeper of Hell, Pet Shop, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '24 June 1991',
                        title: () => 'The Gatekeeper of Hell, Pet Shop, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '1 July 1991',
                        title: () => 'The Gatekeeper of Hell, Pet Shop, Part 4',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '8 July 1991',
                        title: () => 'The Gatekeeper of Hell, Pet Shop, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '15 July 1991',
                        title: () => "D'Arby the Player, Part 1",
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '22 July 1991',
                        title: () => "D'Arby the Player, Part 2",
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => "D'Arby the Player",
                chapters: [
                    {
                        date: '29 July 1991',
                        title: () => "D'Arby the Player, Part 3",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '5 August 1991',
                        title: () => "D'Arby the Player, Part 4",
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '12 August 1991',
                        title: () => "D'Arby the Player, Part 5",
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '19 August 1991',
                        title: () => "D'Arby the Player, Part 6",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '26 August 1991',
                        title: () => "D'Arby the Player, Part 7",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '9 September 1991',
                        title: () => "D'Arby the Player, Part 8",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '16 September 1991',
                        title: () => "D'Arby the Player, Part 9",
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '23 September 1991',
                        title: () => "D'Arby the Player, Part 10",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '30 September 1991',
                        title: () => "D'Arby the Player, Part 11",
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'The Miasma of the Void, Vanilla Ice',
                chapters: [
                    {
                        date: '7 October 1991',
                        title: () =>
                            'The Miasma of the Void, Vanilla Ice, Part 1',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '14 October 1991',
                        title: () =>
                            'The Miasma of the Void, Vanilla Ice, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '21 October 1991',
                        title: () =>
                            'The Miasma of the Void, Vanilla Ice, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '28 October 1991',
                        title: () =>
                            'The Miasma of the Void, Vanilla Ice, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '4 November 1991',
                        title: () =>
                            'The Miasma of the Void, Vanilla Ice, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '11 November 1991',
                        title: () =>
                            'The Miasma of the Void, Vanilla Ice, Part 6',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '18 November 1991',
                        title: () =>
                            'The Miasma of the Void, Vanilla Ice, Part 7',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '25 November 1991',
                        title: () =>
                            'The Miasma of the Void, Vanilla Ice, Part 8',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '2 December 1991',
                        title: () => 'Suzi Q Joestar Visits Her Daughter',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => "DIO's World",
                chapters: [
                    {
                        date: '9 December 1991',
                        title: () => "DIO's World, Part 1",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '16 December 1991',
                        title: () => "DIO's World, Part 2",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '1 January 1992',
                        title: () => "DIO's World, Part 3",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '13 January 1992',
                        title: () => "DIO's World, Part 4",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '20 January 1992',
                        title: () => "DIO's World, Part 5",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '27 January 1992',
                        title: () => "DIO's World, Part 6",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '3 February 1992',
                        title: () => "DIO's World, Part 7",
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '10 February 1992',
                        title: () => "DIO's World, Part 8",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '17 February 1992',
                        title: () => "DIO's World, Part 9",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '24 February 1992',
                        title: () => "DIO's World, Part 10",
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'The Faraway Journey, Farewell Friends',
                chapters: [
                    {
                        date: '2 March 1992',
                        title: () => "DIO's World, Part 11",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '9 March 1992',
                        title: () => "DIO's World, Part 12",
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '16 March 1992',
                        title: () => "DIO's World, Part 13",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '23 March 1992',
                        title: () => "DIO's World, Part 14",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '30 March 1992',
                        title: () => "DIO's World, Part 15",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '6 April 1992',
                        title: () => "DIO's World, Part 16",
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '13 April 1992',
                        title: () => "DIO's World, Part 17",
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '20 April 1992',
                        title: () => "DIO's World, Part 18",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '27 April 1992',
                        title: () => 'The Faraway Journey, Farewell Friends',
                        pages: 20,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Josuke Higashikata Appears',
                chapters: [
                    {
                        date: '4 May 1992',
                        title: () =>
                            'Jotaro Kujo! Meets Josuke Higashikata, Part 1',
                        pages: 23,
                        cover: null,
                    },
                    {
                        date: '18 May 1992',
                        title: () =>
                            'Jotaro Kujo! Meets Josuke Higashikata, Part 2',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '25 May 1992',
                        title: () =>
                            'Jotaro Kujo! Meets Josuke Higashikata, Part 3',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '1 June 1992',
                        title: () => 'Josuke Higashikata! Meets Angelo, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '8 June 1992',
                        title: () => 'Josuke Higashikata! Meets Angelo, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '15 June 1992',
                        title: () => 'Josuke Higashikata! Meets Angelo, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '22 June 1992',
                        title: () => 'Josuke Higashikata! Meets Angelo, Part 4',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '29 June 1992',
                        title: () => 'Josuke Higashikata! Meets Angelo, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '6 July 1992',
                        title: () => 'The Nijimura Brothers, Part 1',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Okuyasu and Keicho Nijimura',
                chapters: [
                    {
                        date: '13 July 1992',
                        title: () => 'The Nijimura Brothers, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '20 July 1992',
                        title: () => 'The Nijimura Brothers, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '27 July 1992',
                        title: () => 'The Nijimura Brothers, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '3 August 1992',
                        title: () => 'The Nijimura Brothers, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '10 August 1992',
                        title: () => 'The Nijimura Brothers, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '17 August 1992',
                        title: () => 'The Nijimura Brothers, Part 7',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '31 August 1992',
                        title: () => 'The Nijimura Brothers, Part 8',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '7 September 1992',
                        title: () => 'The Nijimura Brothers, Part 9',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '14 September 1992',
                        title: () => 'The Nijimura Brothers, Part 10',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Koichi Hirose (Echoes)',
                chapters: [
                    {
                        date: '21 September 1992',
                        title: () => 'Koichi Hirose (Echoes), Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '28 September 1992',
                        title: () => 'Koichi Hirose (Echoes), Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '5 October 1992',
                        title: () => 'Koichi Hirose (Echoes), Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '12 October 1992',
                        title: () => 'Koichi Hirose (Echoes), Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '19 October 1992',
                        title: () => 'Koichi Hirose (Echoes), Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '26 October 1992',
                        title: () => 'Toshikazu Hazamada (Surface), Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '2 November 1992',
                        title: () => 'Toshikazu Hazamada (Surface), Part 2',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '9 November 1992',
                        title: () => 'Toshikazu Hazamada (Surface), Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '16 November 1992',
                        title: () => 'Toshikazu Hazamada (Surface), Part 4',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '23 November 1992',
                        title: () => 'Toshikazu Hazamada (Surface), Part 5',
                        pages: 20,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Yukako Yamagishi Falls in Love',
                chapters: [
                    {
                        date: '30 November 1992',
                        title: () => 'Yukako Yamagishi Falls in Love, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '7 December 1992',
                        title: () => 'Yukako Yamagishi Falls in Love, Part 2',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '14 December 1992',
                        title: () => 'Yukako Yamagishi Falls in Love, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '1 January 1993',
                        title: () => 'Yukako Yamagishi Falls in Love, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '8 January 1993',
                        title: () => 'Yukako Yamagishi Falls in Love, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '15 January 1993',
                        title: () => 'Yukako Yamagishi Falls in Love, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '25 January 1993',
                        title: () => 'Yukako Yamagishi Falls in Love, Part 7',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '1 February 1993',
                        title: () => 'Yukako Yamagishi Falls in Love, Part 8',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '8 February 1993',
                        title: () => 'Yukako Yamagishi Falls in Love, Part 9',
                        pages: 20,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => "Let's Go Eat Some Italian Food",
                chapters: [
                    {
                        date: '15 February 1993',
                        title: () => "Let's Go Eat Some Italian Food, Part 1",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '22 February 1993',
                        title: () => "Let's Go Eat Some Italian Food, Part 2",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '1 March 1993',
                        title: () => "Let's Go Eat Some Italian Food, Part 3",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '8 March 1993',
                        title: () => "Let's Go Eat Some Italian Food, Part 4",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '15 March 1993',
                        title: () => 'Red Hot Chili Pepper, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '22 March 1993',
                        title: () => 'Red Hot Chili Pepper, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '29 March 1993',
                        title: () => 'Red Hot Chili Pepper, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '5 April 1993',
                        title: () => 'Red Hot Chili Pepper, Part 4',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '12 April 1993',
                        title: () => 'Red Hot Chili Pepper, Part 5',
                        pages: 18,
                        cover: null,
                    },
                    {
                        date: '19 April 1993',
                        title: () => 'Red Hot Chili Pepper, Part 6',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => "Let's Go to the Manga Artist's House",
                chapters: [
                    {
                        date: '26 April 1993',
                        title: () => 'Red Hot Chili Pepper, Part 7',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '3 May 1993',
                        title: () => 'Red Hot Chili Pepper, Part 8',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '10 May 1993',
                        title: () => 'We Picked Up Something Crazy!',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '24 May 1993',
                        title: () => 'We Picked Up Something Crazy!, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '31 May 1993',
                        title: () => 'We Picked Up Something Crazy!, Part 3',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '7 June 1993',
                        title: () =>
                            "Let's Go to the Manga Artist's House, Part 1",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '14 June 1993',
                        title: () =>
                            "Let's Go to the Manga Artist's House, Part 2",
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '21 June 1993',
                        title: () =>
                            "Let's Go to the Manga Artist's House, Part 3",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '28 June 1993',
                        title: () =>
                            "Let's Go to the Manga Artist's House, Part 4",
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => "Rohan Kishibe's Adventure",
                chapters: [
                    {
                        date: '5 July 1993',
                        title: () =>
                            "Let's Go to the Manga Artist's House, Part 5",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '12 July 1993',
                        title: () =>
                            "Let's Go to the Manga Artist's House, Part 6",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '19 July 1993',
                        title: () =>
                            "Let's Go to the Manga Artist's House, Part 7",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '26 July 1993',
                        title: () => "Let's Go Hunting!, Part 1",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '2 August 1993',
                        title: () => "Let's Go Hunting!, Part 2",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '9 August 1993',
                        title: () => "Let's Go Hunting!, Part 3",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '16 August 1993',
                        title: () => "Let's Go Hunting!, Part 4",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '23 August 1993',
                        title: () => "Let's Go Hunting!, Part 5",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '6 September 1993',
                        title: () => "Rohan Kishibe's Adventure, Part 1",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '13 September 1993',
                        title: () => "Rohan Kishibe's Adventure, Part 2",
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => "Shigechi's Harvest",
                chapters: [
                    {
                        date: '20 September 1993',
                        title: () => "Rohan Kishibe's Adventure, Part 3",
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '27 September 1993',
                        title: () => "Rohan Kishibe's Adventure, Part 4",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '4 October 1993',
                        title: () => "Rohan Kishibe's Adventure, Part 5",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '11 October 1993',
                        title: () => "Shigechi's Harvest, Part 1",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '18 October 1993',
                        title: () => "Shigechi's Harvest, Part 2",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '25 October 1993',
                        title: () => "Shigechi's Harvest, Part 3",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '1 November 1993',
                        title: () => "Shigechi's Harvest, Part 4",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '8 November 1993',
                        title: () => "Shigechi's Harvest, Part 5",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '15 November 1993',
                        title: () => "Shigechi's Harvest, Part 6",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '22 November 1993',
                        title: () => "Shigechi's Harvest, Part 7",
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Yoshikage Kira Just Wants to Live Quietly',
                chapters: [
                    {
                        date: '29 November 1993',
                        title: () =>
                            'Yoshikage Kira Just Wants to Live Quietly, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '6 December 1993',
                        title: () =>
                            'Yoshikage Kira Just Wants to Live Quietly, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '13 December 1993',
                        title: () =>
                            'Yoshikage Kira Just Wants to Live Quietly, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '1 January 1994',
                        title: () =>
                            'Yoshikage Kira Just Wants to Live Quietly, Part 4',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '8 January 1994',
                        title: () =>
                            'Yoshikage Kira Just Wants to Live Quietly, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '10 January 1994',
                        title: () => 'The People of Morioh',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '18 January 1994',
                        title: () =>
                            'Yukako Yamagishi Dreams of Cinderella, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '31 January 1994',
                        title: () =>
                            'Yukako Yamagishi Dreams of Cinderella, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '7 February 1994',
                        title: () =>
                            'Yukako Yamagishi Dreams of Cinderella, Part 3',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Sheer Heart Attack',
                chapters: [
                    {
                        date: '14 February 1994',
                        title: () =>
                            'Yukako Yamagishi Dreams of Cinderella, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '21 February 1994',
                        title: () =>
                            'Yukako Yamagishi Dreams of Cinderella, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '28 February 1994',
                        title: () =>
                            'Yukako Yamagishi Dreams of Cinderella, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '7 March 1994',
                        title: () => 'Sheer Heart Attack, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '14 March 1994',
                        title: () => 'Sheer Heart Attack, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '21 March 1994',
                        title: () => 'Sheer Heart Attack, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '28 March 1994',
                        title: () => 'Sheer Heart Attack, Part 4',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '4 April 1994',
                        title: () => 'Sheer Heart Attack, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '11 April 1994',
                        title: () => 'Sheer Heart Attack, Part 6',
                        pages: 20,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => "Father's Tears",
                chapters: [
                    {
                        date: '18 April 1994',
                        title: () => 'Sheer Heart Attack, Part 7',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '25 April 1994',
                        title: () => 'Sheer Heart Attack, Part 8',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '2 May 1994',
                        title: () => 'Sheer Heart Attack, Part 9',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '9 May 1994',
                        title: () => 'Sheer Heart Attack, Part 10',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '23 May 1994',
                        title: () => 'Sheer Heart Attack, Part 11',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '30 May 1994',
                        title: () => 'Atom Heart Father, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '6 June 1994',
                        title: () => 'Atom Heart Father, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '13 June 1994',
                        title: () => 'Atom Heart Father, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '20 June 1994',
                        title: () => 'Atom Heart Father, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '27 June 1994',
                        title: () => 'Atom Heart Father, Part 5',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Rock-Paper-Scissors Kid is Coming!',
                chapters: [
                    {
                        date: '4 July 1994',
                        title: () => "Yoshikage Kira's New Situation, Part 1",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '11 July 1994',
                        title: () =>
                            'Rock-Paper-Scissors Kid is Coming!, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '18 July 1994',
                        title: () =>
                            'Rock-Paper-Scissors Kid is Coming!, Part 2',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '25 July 1994',
                        title: () =>
                            'Rock-Paper-Scissors Kid is Coming!, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '1 August 1994',
                        title: () =>
                            'Rock-Paper-Scissors Kid is Coming!, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '8 August 1994',
                        title: () =>
                            'Rock-Paper-Scissors Kid is Coming!, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '15 August 1994',
                        title: () =>
                            'Rock-Paper-Scissors Kid is Coming!, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '22 August 1994',
                        title: () => "Yoshikage Kira's New Situation, Part 2",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '5 September 1994',
                        title: () => "I'm an Alien, Part 1",
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '12 September 1994',
                        title: () => "I'm an Alien, Part 2",
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Highway Star',
                chapters: [
                    {
                        date: '19 September 1994',
                        title: () => "I'm an Alien, Part 3",
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '26 September 1994',
                        title: () => "I'm an Alien, Part 4",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '3 October 1994',
                        title: () => "I'm an Alien, Part 5",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '10 October 1994',
                        title: () => "I'm an Alien, Part 6",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '17 October 1994',
                        title: () => 'Highway Star, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '24 October 1994',
                        title: () => 'Highway Star, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '31 October 1994',
                        title: () => 'Highway Star, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '7 November 1994',
                        title: () => 'Highway Star, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '14 November 1994',
                        title: () => 'Highway Star, Part 5',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '21 November 1994',
                        title: () => 'Highway Star, Part 6',
                        pages: 21,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Cats Love Yoshikage Kira',
                chapters: [
                    {
                        date: '28 November 1994',
                        title: () => 'Highway Star, Part 7',
                        pages: 22,
                        cover: null,
                    },
                    {
                        date: '5 December 1994',
                        title: () => 'Highway Star, Part 8',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '12 December 1994',
                        title: () => 'Cats Love Yoshikage Kira, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '1 January 1995',
                        title: () => 'Cats Love Yoshikage Kira, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '8 January 1995',
                        title: () => 'Cats Love Yoshikage Kira, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '10 January 1995',
                        title: () => 'Cats Love Yoshikage Kira, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '17 January 1995',
                        title: () => 'Cats Love Yoshikage Kira, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '30 January 1995',
                        title: () => 'Cats Love Yoshikage Kira, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '6 February 1995',
                        title: () =>
                            "Let's Live on a Transmission Tower, Part 1",
                        pages: 20,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Enigma is an Enigma!',
                chapters: [
                    {
                        date: '13 February 1995',
                        title: () =>
                            "Let's Live on a Transmission Tower, Part 2",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '20 February 1995',
                        title: () =>
                            "Let's Live on a Transmission Tower, Part 3",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '27 February 1995',
                        title: () =>
                            "Let's Live on a Transmission Tower, Part 4",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '6 March 1995',
                        title: () =>
                            "Let's Live on a Transmission Tower, Part 5",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '13 March 1995',
                        title: () =>
                            "Let's Live on a Transmission Tower, Part 6",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '20 March 1995',
                        title: () => 'Enigma Boy, Part 1',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '27 March 1995',
                        title: () => 'Enigma Boy, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '3 April 1995',
                        title: () => 'Enigma Boy, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '10 April 1995',
                        title: () => 'Enigma Boy, Part 4',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'My Dad is Not My Dad',
                chapters: [
                    {
                        date: '17 April 1995',
                        title: () => 'Enigma Boy, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '24 April 1995',
                        title: () => 'Enigma Boy, Part 6',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '1 May 1995',
                        title: () => 'My Dad is Not My Dad, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '8 May 1995',
                        title: () => 'My Dad is Not My Dad, Part 2',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '22 May 1995',
                        title: () => 'Cheap Trick, Part 1',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '29 May 1995',
                        title: () => 'Cheap Trick, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '5 June 1995',
                        title: () => 'Cheap Trick, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '12 June 1995',
                        title: () => 'Cheap Trick, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '19 June 1995',
                        title: () => 'Cheap Trick, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '26 June 1995',
                        title: () => 'Cheap Trick, Part 6',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Another One Bites the Dust',
                chapters: [
                    {
                        date: '3 July 1995',
                        title: () => 'Another One Bites the Dust, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '10 July 1995',
                        title: () => 'Another One Bites the Dust, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '17 July 1995',
                        title: () => 'Another One Bites the Dust, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '24 July 1995',
                        title: () => 'Another One Bites the Dust, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '31 July 1995',
                        title: () => 'Another One Bites the Dust, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '7 August 1995',
                        title: () => 'Another One Bites the Dust, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '14 August 1995',
                        title: () => 'Another One Bites the Dust, Part 7',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '21 August 1995',
                        title: () => 'Another One Bites the Dust, Part 8',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '4 September 1995',
                        title: () => 'Another One Bites the Dust, Part 9',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '11 September 1995',
                        title: () => 'Another One Bites the Dust, Part 10',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Crazy Diamond is Unbreakable',
                chapters: [
                    {
                        date: '18 September 1995',
                        title: () => 'Crazy Diamond is Unbreakable, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '25 September 1995',
                        title: () => 'Crazy Diamond is Unbreakable, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '2 October 1995',
                        title: () => 'Crazy Diamond is Unbreakable, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '9 October 1995',
                        title: () => 'Crazy Diamond is Unbreakable, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '16 October 1995',
                        title: () => 'Crazy Diamond is Unbreakable, Part 5',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '23 October 1995',
                        title: () => 'Crazy Diamond is Unbreakable, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '30 October 1995',
                        title: () => 'Crazy Diamond is Unbreakable, Part 7',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '6 November 1995',
                        title: () => 'Crazy Diamond is Unbreakable, Part 8',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '13 November 1995',
                        title: () => 'Crazy Diamond is Unbreakable, Part 9',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Goodbye, Morioh - The Golden Heart',
                chapters: [
                    {
                        date: '20 November 1995',
                        title: () => 'Let Me Remind You',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '27 November 1995',
                        title: () => 'Town Guardian Spirits',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '4 December 1995',
                        title: () => 'Goodbye, Morioh - The Golden Heart',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '11 December 1995',
                        title: () => 'Gold Experience, Part 1',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '1 January 1996',
                        title: () => 'Gold Experience, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '8 January 1996',
                        title: () => 'Gold Experience, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '10 January 1996',
                        title: () => 'Bucciarati is Coming, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '16 January 1996',
                        title: () => 'Bucciarati is Coming, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '5 February 1996',
                        title: () => 'Bucciarati is Coming, Part 3',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'My Dream is to Be a Gang Star',
                chapters: [
                    {
                        date: '12 February 1996',
                        title: () => 'Bucciarati is Coming, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '19 February 1996',
                        title: () => 'Bucciarati is Coming, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '26 February 1996',
                        title: () =>
                            'Meet the Gangster Behind the Wall, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '4 March 1996',
                        title: () =>
                            'Meet the Gangster Behind the Wall, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '11 March 1996',
                        title: () => 'Joining the Gang, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '18 March 1996',
                        title: () => 'Joining the Gang, Part 2',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '25 March 1996',
                        title: () => 'Joining the Gang, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '1 April 1996',
                        title: () => 'Joining the Gang, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '8 April 1996',
                        title: () => 'Joining the Gang, Part 5',
                        pages: 21,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => "Find Polpo's Fortune!",
                chapters: [
                    {
                        date: '15 April 1996',
                        title: () => 'Joining the Gang, Part 6',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '22 April 1996',
                        title: () => '5 Plus 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '29 April 1996',
                        title: () => "Find Polpo's Fortune!",
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '6 May 1996',
                        title: () => 'The Mystery of Soft Machine, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '13 May 1996',
                        title: () => 'The Mystery of Soft Machine, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '27 May 1996',
                        title: () => 'Moody Blues Strikes Back, Part 1',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '3 June 1996',
                        title: () => 'Moody Blues Strikes Back, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '10 June 1996',
                        title: () => 'Sex Pistols Appears, Part 1',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '17 June 1996',
                        title: () => 'Sex Pistols Appears, Part 2',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Capo Bucciarati: The First Order from the Boss',
                chapters: [
                    {
                        date: '24 June 1996',
                        title: () => 'Sex Pistols Appears, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '1 July 1996',
                        title: () => 'Sex Pistols Appears, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '8 July 1996',
                        title: () => 'Sex Pistols Appears, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '15 July 1996',
                        title: () => 'Sex Pistols Appears, Part 6',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '22 July 1996',
                        title: () => 'The Hidden Six-Hundred Million Yen Stash',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '29 July 1996',
                        title: () => 'Capo Bucciarati',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '5 August 1996',
                        title: () => "Narancia's Aerosmith, Part 1",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '12 August 1996',
                        title: () => "Narancia's Aerosmith, Part 2",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '19 August 1996',
                        title: () => "Narancia's Aerosmith, Part 3",
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () =>
                    'The Second Order from the Boss: "Retrieve the Key!"',
                chapters: [
                    {
                        date: '2 September 1996',
                        title: () => "Narancia's Aerosmith, Part 4",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '9 September 1996',
                        title: () => "Narancia's Aerosmith, Part 5",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '30 September 1996',
                        title: () => "Narancia's Aerosmith, Part 6",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '7 October 1996',
                        title: () => "Narancia's Aerosmith, Part 7",
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '14 October 1996',
                        title: () => "Narancia's Aerosmith, Part 8",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '21 October 1996',
                        title: () =>
                            'The Second Order from the Boss: "Retrieve the Key!"',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '28 October 1996',
                        title: () =>
                            'Man in the Mirror and Purple Haze, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '4 November 1996',
                        title: () =>
                            'Man in the Mirror and Purple Haze, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '11 November 1996',
                        title: () =>
                            'Man in the Mirror and Purple Haze, Part 3',
                        pages: 21,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Express Train to Florence',
                chapters: [
                    {
                        date: '18 November 1996',
                        title: () =>
                            'Man in the Mirror and Purple Haze, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '25 November 1996',
                        title: () =>
                            'Man in the Mirror and Purple Haze, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '2 December 1996',
                        title: () =>
                            'Man in the Mirror and Purple Haze, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '9 December 1996',
                        title: () =>
                            'Man in the Mirror and Purple Haze, Part 7',
                        pages: 18,
                        cover: null,
                    },
                    {
                        date: '1 January 1997',
                        title: () => 'Express Train to Florence, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '8 January 1997',
                        title: () => 'Express Train to Florence, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '10 January 1997',
                        title: () => 'The Grateful Dead, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '16 January 1997',
                        title: () => 'The Grateful Dead, Part 2',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '29 January 1997',
                        title: () => 'The Grateful Dead, Part 3',
                        pages: 21,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'The Grateful Dead',
                chapters: [
                    {
                        date: '3 February 1997',
                        title: () => 'The Grateful Dead, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '10 February 1997',
                        title: () => 'The Grateful Dead, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '17 February 1997',
                        title: () => 'The Grateful Dead, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '24 February 1997',
                        title: () => 'The Grateful Dead, Part 7',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '3 March 1997',
                        title: () => 'The Grateful Dead, Part 8',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '10 March 1997',
                        title: () => 'The Grateful Dead, Part 9',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '17 March 1997',
                        title: () => 'The Grateful Dead, Part 10',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '24 March 1997',
                        title: () => 'The Grateful Dead, Part 11',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '31 March 1997',
                        title: () => 'The Grateful Dead, Part 12',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Gold Experience Strikes Back',
                chapters: [
                    {
                        date: '7 April 1997',
                        title: () => 'Baby Face, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '14 April 1997',
                        title: () => 'Baby Face, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '21 April 1997',
                        title: () => 'Baby Face, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '28 April 1997',
                        title: () => 'Baby Face, Part 4',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '5 May 1997',
                        title: () => 'Baby Face, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '12 May 1997',
                        title: () => 'Baby Face, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '26 May 1997',
                        title: () => 'Baby Face, Part 7',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '2 June 1997',
                        title: () => 'Head to Venice!',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '9 June 1997',
                        title: () =>
                            'Venice\'s Santa Lucia Station - Get the "OA-DISC"!',
                        pages: 21,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'The Venice Landing Operation',
                chapters: [
                    {
                        date: '16 June 1997',
                        title: () => 'White Album, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '23 June 1997',
                        title: () => 'White Album, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '14 July 1997',
                        title: () => 'White Album, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '21 July 1997',
                        title: () => 'White Album, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '28 July 1997',
                        title: () => 'White Album, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '4 August 1997',
                        title: () => 'White Album, Part 6',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '11 August 1997',
                        title: () => 'White Album, Part 7',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '18 August 1997',
                        title: () => "The Boss's Last Orders",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '25 August 1997',
                        title: () => "Bruno Bucciarati's Childhood",
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'The "G" in Guts',
                chapters: [
                    {
                        date: '8 September 1997',
                        title: () => 'The Mystery of King Crimson, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '15 September 1997',
                        title: () => 'The Mystery of King Crimson, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '22 September 1997',
                        title: () => 'The Mystery of King Crimson, Part 3',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '29 September 1997',
                        title: () => 'The Mystery of King Crimson, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '6 October 1997',
                        title: () => 'The Mystery of King Crimson, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '13 October 1997',
                        title: () => 'The Mystery of King Crimson, Part 6',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '27 October 1997',
                        title: () => 'The "G" in Guts',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '3 November 1997',
                        title: () => 'Clash and Talking Head, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '10 November 1997',
                        title: () => 'Clash and Talking Head, Part 2',
                        pages: 21,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => "No Flightcode! Unearth the Boss's Past",
                chapters: [
                    {
                        date: '17 November 1997',
                        title: () => 'Clash and Talking Head, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '24 November 1997',
                        title: () => 'Clash and Talking Head, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '1 December 1997',
                        title: () => 'Clash and Talking Head, Part 5',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '8 December 1997',
                        title: () => 'Clash and Talking Head, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '1 January 1998',
                        title: () => 'Clash and Talking Head, Part 7',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '8 January 1998',
                        title: () => 'No Flightcode! Headed for Sardinia',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '15 January 1998',
                        title: () => 'Notorious B.I.G, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '26 January 1998',
                        title: () => 'Notorious B.I.G, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '31 January 1998',
                        title: () => 'Notorious B.I.G, Part 3',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'My Name is Doppio',
                chapters: [
                    {
                        date: '2 February 1998',
                        title: () => 'Notorious B.I.G, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '9 February 1998',
                        title: () => 'Notorious B.I.G, Part 5',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '16 February 1998',
                        title: () => 'Notorious B.I.G, Part 6',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '23 February 1998',
                        title: () => 'Spice Girl, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '2 March 1998',
                        title: () => 'Spice Girl, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '9 March 1998',
                        title: () => 'Storm Warning in Sardinia Island!',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '16 March 1998',
                        title: () => 'My Name is Doppio, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '23 March 1998',
                        title: () => 'My Name is Doppio, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '30 March 1998',
                        title: () => 'King Crimson vs. Metallica, Part 1',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Beneath a Sky on the Verge of Falling',
                chapters: [
                    {
                        date: '6 April 1998',
                        title: () => 'King Crimson vs. Metallica, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '13 April 1998',
                        title: () => 'King Crimson vs. Metallica, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '20 April 1998',
                        title: () => 'King Crimson vs. Metallica, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '27 April 1998',
                        title: () => 'King Crimson vs. Metallica, Part 5',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '4 May 1998',
                        title: () => 'King Crimson vs. Metallica, Part 6',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '11 May 1998',
                        title: () => 'Beneath a Sky on the Verge of Falling',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '25 May 1998',
                        title: () => 'Pronto! On the Phone, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '1 June 1998',
                        title: () => 'Pronto! On the Phone, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '8 June 1998',
                        title: () => 'Destination: Rome! The Colosseum',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Meet the Man at the Colosseum!',
                chapters: [
                    {
                        date: '15 June 1998',
                        title: () => '"Green Day" and "Oasis", Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '22 June 1998',
                        title: () => '"Green Day" and "Oasis", Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '29 June 1998',
                        title: () => '"Green Day" and "Oasis", Part 3',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '6 July 1998',
                        title: () => '"Green Day" and "Oasis", Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '13 July 1998',
                        title: () => '"Green Day" and "Oasis", Part 5',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '20 July 1998',
                        title: () => '"Green Day" and "Oasis", Part 6',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '27 July 1998',
                        title: () => '"Green Day" and "Oasis", Part 7',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '3 August 1998',
                        title: () => '"Green Day" and "Oasis", Part 8',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '10 August 1998',
                        title: () => '"Green Day" and "Oasis", Part 9',
                        pages: 20,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'His Name is Diavolo',
                chapters: [
                    {
                        date: '17 August 1998',
                        title: () => '"Green Day" and "Oasis", Part 10',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '24 August 1998',
                        title: () => '"Green Day" and "Oasis", Part 11',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '7 September 1998',
                        title: () => '"Green Day" and "Oasis", Part 12',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '14 September 1998',
                        title: () => '"Green Day" and "Oasis", Part 13',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '21 September 1998',
                        title: () => '"Green Day" and "Oasis", Part 14',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '28 September 1998',
                        title: () => 'His Name is Diavolo, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '5 October 1998',
                        title: () => 'A Little Story from the Past',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '12 October 1998',
                        title: () => 'His Name is Diavolo, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '19 October 1998',
                        title: () => 'What Lies Beyond the Arrow',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'The Requiem Quietly Plays',
                chapters: [
                    {
                        date: '26 October 1998',
                        title: () => 'The Requiem Quietly Plays, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '2 November 1998',
                        title: () => 'The Requiem Quietly Plays, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '9 November 1998',
                        title: () => 'The Requiem Quietly Plays, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '16 November 1998',
                        title: () => 'The Requiem Quietly Plays, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '23 November 1998',
                        title: () => 'The Requiem Quietly Plays, Part 5',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '30 November 1998',
                        title: () => 'The Requiem Quietly Plays, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '7 December 1998',
                        title: () => 'The Requiem Quietly Plays, Part 7',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '1 January 1999',
                        title: () => 'The Requiem Quietly Plays, Part 8',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '8 January 1999',
                        title: () => 'Diavolo Surfaces, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '15 January 1999',
                        title: () => 'Diavolo Surfaces, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '28 January 1999',
                        title: () => 'Diavolo Surfaces, Part 3',
                        pages: 21,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Sleeping Slaves',
                chapters: [
                    {
                        date: '31 January 1999',
                        title: () => 'Diavolo Surfaces, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '1 February 1999',
                        title: () => 'Diavolo Surfaces, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '8 February 1999',
                        title: () => 'King of Kings',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '15 February 1999',
                        title: () => 'Gold Experience Requiem, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '22 February 1999',
                        title: () => 'Gold Experience Requiem, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '1 March 1999',
                        title: () => 'Gold Experience Requiem, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '8 March 1999',
                        title: () => 'Gold Experience Requiem, Part 4',
                        pages: 6,
                        cover: null,
                    },
                    {
                        date: '8 March 1999',
                        title: () => 'Epilogue: "Sleeping Slaves"',
                        pages: 13,
                        cover: null,
                    },
                    {
                        date: '15 March 1999',
                        title: () => 'Sleeping Slaves, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '22 March 1999',
                        title: () => 'Sleeping Slaves, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '29 March 1999',
                        title: () => 'Sleeping Slaves, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '5 April 1999',
                        title: () => 'Sleeping Slaves, Part 5',
                        pages: 21,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Prisoner FE40536: Jolyne Cujoh',
                chapters: [
                    {
                        date: '1 January 2000',
                        title: () => 'Stone Ocean, Part 1',
                        pages: 49,
                        cover: null,
                    },
                    {
                        date: '8 January 2000',
                        title: () => 'Stone Ocean, Part 2',
                        pages: 27,
                        cover: null,
                    },
                    {
                        date: '17 January 2000',
                        title: () => 'Stone Ocean, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '18 January 2000',
                        title: () => 'Prisoner FE40536: Jolyne Cujoh, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '31 January 2000',
                        title: () => 'Prisoner FE40536: Jolyne Cujoh, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '7 February 2000',
                        title: () => 'Prisoner FE40536: Jolyne Cujoh, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '14 February 2000',
                        title: () => 'Goo Goo Dolls',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '21 February 2000',
                        title: () => 'Stone Free, Part 1',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'The Visitor to Green Dolphin Street Prison',
                chapters: [
                    {
                        date: '28 February 2000',
                        title: () => 'Stone Free, Part 2',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '6 March 2000',
                        title: () => 'Green Dolphin Street Prison',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '13 March 2000',
                        title: () => 'The Visitor, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '20 March 2000',
                        title: () => 'The Visitor, Part 2',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '27 March 2000',
                        title: () => 'The Visitor, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '3 April 2000',
                        title: () => 'The Visitor, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '10 April 2000',
                        title: () => 'The Visitor, Part 5',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '17 April 2000',
                        title: () => 'The Visitor, Part 6',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '24 April 2000',
                        title: () => 'The Visitor, Part 7',
                        pages: 21,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Prisoner of Love',
                chapters: [
                    {
                        date: '1 May 2000',
                        title: () => 'The Visitor, Part 8',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '8 May 2000',
                        title: () => 'The Visitor, Part 9',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '22 May 2000',
                        title: () => 'Prisoner of Love',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '29 May 2000',
                        title: () => "Ermes's Sticker, Part 1",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '5 June 2000',
                        title: () => "Ermes's Sticker, Part 2",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '12 June 2000',
                        title: () => "Ermes's Sticker, Part 3",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '19 June 2000',
                        title: () => "Ermes's Sticker, Part 4",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '26 June 2000',
                        title: () => "Ermes's Sticker, Part 5",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '3 July 2000',
                        title: () => "There's Six of Us!, Part 1",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '10 July 2000',
                        title: () => "There's Six of Us!, Part 2",
                        pages: 21,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Go! Foo Fighters',
                chapters: [
                    {
                        date: '17 July 2000',
                        title: () => "There's Six of Us!, Part 3",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '24 July 2000',
                        title: () => "There's Six of Us!, Part 4",
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '31 July 2000',
                        title: () => "There's Six of Us!, Part 5",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '7 August 2000',
                        title: () => 'Foo Fighters, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '14 August 2000',
                        title: () => 'Foo Fighters, Part 2',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '21 August 2000',
                        title: () => 'Foo Fighters, Part 3',
                        pages: 18,
                        cover: null,
                    },
                    {
                        date: '4 September 2000',
                        title: () => 'Debt Collector Marilyn Manson, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '11 September 2000',
                        title: () => 'Debt Collector Marilyn Manson, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '18 September 2000',
                        title: () => 'Debt Collector Marilyn Manson, Part 3',
                        pages: 21,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Operation Savage Garden (Head to the Courtyard!)',
                chapters: [
                    {
                        date: '25 September 2000',
                        title: () => 'Debt Collector Marilyn Manson, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '2 October 2000',
                        title: () => 'Debt Collector Marilyn Manson, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '9 October 2000',
                        title: () => 'Debt Collector Marilyn Manson, Part 6',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '16 October 2000',
                        title: () =>
                            'Operation Savage Garden (Head to the Courtyard!), Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '23 October 2000',
                        title: () => 'Operation Savage Garden, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '30 October 2000',
                        title: () => 'Operation Savage Garden, Part 3',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '6 November 2000',
                        title: () => 'Operation Savage Garden, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '13 November 2000',
                        title: () => 'Operation Savage Garden, Part 5',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '20 November 2000',
                        title: () => 'Operation Savage Garden, Part 6',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Torrential Downpour Warning',
                chapters: [
                    {
                        date: '27 November 2000',
                        title: () => 'Operation Savage Garden, Part 7',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '4 December 2000',
                        title: () => 'Operation Savage Garden, Part 8',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '11 December 2000',
                        title: () => 'Torrential Downpour Warning, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '1 January 2001',
                        title: () => 'Torrential Downpour Warning, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '8 January 2001',
                        title: () => 'Torrential Downpour Warning, Part 3',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '10 January 2001',
                        title: () => 'Kiss of Love and Revenge, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '17 January 2001',
                        title: () => 'Kiss of Love and Revenge, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '29 January 2001',
                        title: () => 'Kiss of Love and Revenge, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '5 February 2001',
                        title: () => 'Kiss of Love and Revenge, Part 4',
                        pages: 21,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Ultra Security House Unit',
                chapters: [
                    {
                        date: '12 February 2001',
                        title: () => 'Kiss of Love and Revenge, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '19 February 2001',
                        title: () => 'Kiss of Love and Revenge, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '26 February 2001',
                        title: () => 'Kiss of Love and Revenge, Part 7',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '5 March 2001',
                        title: () => 'Ultra Security House Unit',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '12 March 2001',
                        title: () => 'His Name is Anasui',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '19 March 2001',
                        title: () => 'The Secret of Guard Westwood, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '26 March 2001',
                        title: () => 'The Secret of Guard Westwood, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '2 April 2001',
                        title: () => 'The Secret of Guard Westwood, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '9 April 2001',
                        title: () => 'The Secret of Guard Westwood, Part 4',
                        pages: 21,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => "Enter the Dragon's Dream",
                chapters: [
                    {
                        date: '16 April 2001',
                        title: () => 'The Secret of Guard Westwood, Part 5',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '23 April 2001',
                        title: () => 'The Secret of Guard Westwood, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '30 April 2001',
                        title: () => 'The Secret of Guard Westwood, Part 7',
                        pages: 20,
                        cover: null,
                    },
                    {
                        date: '7 May 2001',
                        title: () => "Enter the Dragon's Dream, Part 1",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '21 May 2001',
                        title: () => "Enter the Dragon's Dream, Part 2",
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '28 May 2001',
                        title: () => "Enter the Dragon's Dream, Part 3",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '4 June 2001',
                        title: () => "Enter the Dragon's Dream, Part 4",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '11 June 2001',
                        title: () => "Enter the Dragon's Dream, Part 5",
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '18 June 2001',
                        title: () => 'Enter the Foo Fighters',
                        pages: 22,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Birth of the Green',
                chapters: [
                    {
                        date: '25 June 2001',
                        title: () => "Enter the Dragon's Dream, Part 6",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '2 July 2001',
                        title: () => "Enter the Dragon's Dream, Part 7",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '9 July 2001',
                        title: () =>
                            'Father: Jotaro Kujo, Daughter: Jolyne Cujoh',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '16 July 2001',
                        title: () => 'Birth of the "Green", Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '23 July 2001',
                        title: () => 'Birth of the "Green", Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '30 July 2001',
                        title: () => 'Yo-Yo Ma is Coming!, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '6 August 2001',
                        title: () => 'Yo-Yo Ma is Coming!, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '13 August 2001',
                        title: () => 'Yo-Yo Ma is Coming!, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '20 August 2001',
                        title: () => 'Yo-Yo Ma is Coming!, Part 4',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'AWAKEN',
                chapters: [
                    {
                        date: '3 September 2001',
                        title: () => 'Yo-Yo Ma is Coming!, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '10 September 2001',
                        title: () => 'F.F. - The Witness, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '17 September 2001',
                        title: () => 'F.F. - The Witness, Part 2',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '24 September 2001',
                        title: () => 'Awaken, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '1 October 2001',
                        title: () => 'Awaken, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '15 October 2001',
                        title: () => 'Awaken, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '22 October 2001',
                        title: () => 'Awaken, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '29 October 2001',
                        title: () => 'Whitesnake - The Pursuer, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '5 November 2001',
                        title: () => 'Whitesnake - The Pursuer, Part 2',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Head Out! Time for Heaven',
                chapters: [
                    {
                        date: '12 November 2001',
                        title: () => 'Whitesnake - The Pursuer, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '19 November 2001',
                        title: () => 'Whitesnake - The Pursuer, Part 4',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '26 November 2001',
                        title: () => 'Whitesnake - The Pursuer, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '3 December 2001',
                        title: () => 'Time for Heaven',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '10 December 2001',
                        title: () => 'New Moon! New Priest',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '1 January 2002',
                        title: () => 'Jail House Lock!, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '8 January 2002',
                        title: () => 'Jail House Lock!, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '15 January 2002',
                        title: () => 'Jail House Lock!, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '17 January 2002',
                        title: () => 'Jail House Lock!, Part 4',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Jailbreak...',
                chapters: [
                    {
                        date: '23 January 2002',
                        title: () => 'Jail House Lock!, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '4 February 2002',
                        title: () => 'Jail House Lock!, Part 6',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '11 February 2002',
                        title: () => 'Jailbreak...',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '25 February 2002',
                        title: () => 'Three Men Taken to the Hospital',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '4 March 2002',
                        title: () => 'Bohemian Rhapsody, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '11 March 2002',
                        title: () => 'Bohemian Rhapsody, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '18 March 2002',
                        title: () => 'Bohemian Rhapsody, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '25 March 2002',
                        title: () => 'Bohemian Rhapsody, Part 4',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '1 April 2002',
                        title: () => 'Bohemian Rhapsody, Part 5',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Sky-High Sky High!',
                chapters: [
                    {
                        date: '8 April 2002',
                        title: () => 'Bohemian Rhapsody, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '15 April 2002',
                        title: () => 'Bohemian Rhapsody, Part 7',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '22 April 2002',
                        title: () => "It's Been a While, Romeo",
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '29 April 2002',
                        title: () => 'Sky High, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '6 May 2002',
                        title: () => 'Sky High, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '27 May 2002',
                        title: () => 'Sky High, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '27 May 2002',
                        title: () => 'Sky High, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '3 June 2002',
                        title: () => 'Sky High, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '10 June 2002',
                        title: () => 'Sky High, Part 6',
                        pages: 23,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Time for Heaven: Three Days Until the New Moon',
                chapters: [
                    {
                        date: '17 June 2002',
                        title: () =>
                            'Time for Heaven: Three Days Until the New Moon',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '24 June 2002',
                        title: () => 'Under World, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '1 July 2002',
                        title: () => 'Under World, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '8 July 2002',
                        title: () => 'Under World, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '15 July 2002',
                        title: () => 'Under World, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '22 July 2002',
                        title: () => 'Under World, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '29 July 2002',
                        title: () => 'Under World, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '5 August 2002',
                        title: () => 'Heavy Weather, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '19 August 2002',
                        title: () => 'Heavy Weather, Part 2',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Heavy Weather',
                chapters: [
                    {
                        date: '26 August 2002',
                        title: () => 'Heavy Weather, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '9 September 2002',
                        title: () => 'Heavy Weather, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '16 September 2002',
                        title: () => 'Heavy Weather, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '23 September 2002',
                        title: () => 'Heavy Weather, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '30 September 2002',
                        title: () => 'Heavy Weather, Part 7',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '7 October 2002',
                        title: () => 'Heavy Weather, Part 8',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '14 October 2002',
                        title: () => 'Heavy Weather, Part 9',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '21 October 2002',
                        title: () => 'Heavy Weather, Part 10',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '28 October 2002',
                        title: () => 'Heavy Weather, Part 11',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'At Cape Canaveral',
                chapters: [
                    {
                        date: '4 November 2002',
                        title: () => 'Heavy Weather, Part 12',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '11 November 2002',
                        title: () => 'Heavy Weather, Part 13',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '18 November 2002',
                        title: () => 'At Cape Canaveral',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '25 November 2002',
                        title: () => 'Gravity of the New Moon, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '2 December 2002',
                        title: () => 'Gravity of the New Moon, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '9 December 2002',
                        title: () => 'C-MOON, Part 1',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '1 January 2003',
                        title: () => 'C-MOON, Part 2',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '8 January 2003',
                        title: () => 'C-MOON, Part 3',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '10 January 2003',
                        title: () => 'C-MOON, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '22 January 2003',
                        title: () => 'C-MOON, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '23 January 2003',
                        title: () => 'C-MOON, Part 6',
                        pages: 19,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Made in Heaven',
                chapters: [
                    {
                        date: '3 February 2003',
                        title: () => 'C-MOON, Part 7',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '10 February 2003',
                        title: () => 'C-MOON, Part 8',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '17 February 2003',
                        title: () => 'Made in Heaven, Part 1',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '24 February 2003',
                        title: () => 'Made in Heaven, Part 2',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '3 March 2003',
                        title: () => 'Made in Heaven, Part 3',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '10 March 2003',
                        title: () => 'Made in Heaven, Part 4',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '17 March 2003',
                        title: () => 'Made in Heaven, Part 5',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '24 March 2003',
                        title: () => 'Made in Heaven, Part 6',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '31 March 2003',
                        title: () => 'Made in Heaven, Part 7',
                        pages: 21,
                        cover: null,
                    },
                    {
                        date: '7 April 2003',
                        title: () => 'Made in Heaven, Part 8',
                        pages: 19,
                        cover: null,
                    },
                    {
                        date: '14 April 2003',
                        title: () => 'Made in Heaven, Part 9',
                        pages: 22,
                        cover: null,
                    },
                    {
                        date: '21 April 2003',
                        title: () => 'What a Wonderful World',
                        pages: 27,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'September 25, 1890: San Diego Beach',
                chapters: [
                    {
                        date: '2 February 2004',
                        title: () => 'The Steel Ball Run Press Conference',
                        pages: 53,
                        cover: null,
                    },
                    {
                        date: '9 February 2004',
                        title: () => 'Gyro Zeppeli',
                        pages: 31,
                        cover: null,
                    },
                    {
                        date: '16 February 2004',
                        title: () => 'Johnny Joestar',
                        pages: 31,
                        cover: null,
                    },
                    {
                        date: '23 February 2004',
                        title: () => 'September 25, 1890 - 3 Hours to Start',
                        pages: 31,
                        cover: null,
                    },
                    {
                        date: '1 March 2004',
                        title: () => '1st Stage: 15,000 Meters',
                        pages: 31,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => '1st Stage: 15,000 Meters',
                chapters: [
                    {
                        date: '1 March 2004',
                        title: () => 'The Dried-Up River',
                        pages: 31,
                        cover: null,
                    },
                    {
                        date: '8 March 2004',
                        title: () => 'Pocoloco and Sandman',
                        pages: 31,
                        cover: null,
                    },
                    {
                        date: '15 March 2004',
                        title: () => 'Crossing the Forest',
                        pages: 31,
                        cover: null,
                    },
                    {
                        date: '22 March 2004',
                        title: () => 'Long, Long Downhill',
                        pages: 31,
                        cover: null,
                    },
                    {
                        date: '29 March 2004',
                        title: () => 'The Final Stretch: 2,000 Meters Left',
                        pages: 31,
                        cover: null,
                    },
                    {
                        date: '5 April 2004',
                        title: () => 'The Final Stretch: 1,000 Meters Left',
                        pages: 31,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => '2nd Stage: Across the Arizona Desert',
                chapters: [
                    {
                        date: '28 June 2004',
                        title: () => '1st Stage: Disqualified Victory',
                        pages: 37,
                        cover: null,
                    },
                    {
                        date: '5 July 2004',
                        title: () => "The Sheriff's Request to Mountain Tim",
                        pages: 31,
                        cover: null,
                    },
                    {
                        date: '12 July 2004',
                        title: () =>
                            'Across the Arizona Desert: Continuing Along the Shortest Route',
                        pages: 31,
                        cover: null,
                    },
                    {
                        date: '19 July 2004',
                        title: () => 'The Desert-Born Outlaws, Part 1',
                        pages: 31,
                        cover: null,
                    },
                    {
                        date: '26 July 2004',
                        title: () => 'The Desert-Born Outlaws, Part 2',
                        pages: 31,
                        cover: null,
                    },
                    {
                        date: '2 August 2004',
                        title: () => 'The Desert-Born Outlaws, Part 3',
                        pages: 31,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => "Gyro Zeppeli's Destiny",
                chapters: [
                    {
                        date: '9 August 2004',
                        title: () => "The Devil's Palm, Part 1",
                        pages: 31,
                        cover: null,
                    },
                    {
                        date: '16 August 2004',
                        title: () => "The Devil's Palm, Part 2",
                        pages: 31,
                        cover: null,
                    },
                    {
                        date: '23 August 2004',
                        title: () => "Gyro Zeppeli's Destiny, Part 1",
                        pages: 31,
                        cover: null,
                    },
                    {
                        date: '6 September 2004',
                        title: () => "Gyro Zeppeli's Destiny, Part 2",
                        pages: 31,
                        cover: null,
                    },
                    {
                        date: '25 October 2004',
                        title: () =>
                            'The Terrorist from a Faraway Country, Part 1',
                        pages: 37,
                        cover: null,
                    },
                    {
                        date: '1 November 2004',
                        title: () =>
                            'The Terrorist from a Faraway Country, Part 2',
                        pages: 37,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => "All the President's Men",
                chapters: [
                    {
                        date: '19 March 2005',
                        title: () => 'Interlude',
                        pages: 23,
                        cover: null,
                    },
                    {
                        date: '19 April 2005',
                        title: () => 'Tusk, Part 1',
                        pages: 65,
                        cover: null,
                    },
                    {
                        date: '19 May 2005',
                        title: () => 'Tusk, Part 2',
                        pages: 61,
                        cover: null,
                    },
                    {
                        date: '19 June 2005',
                        title: () => 'Tusk, Part 3',
                        pages: 61,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Scary Monsters',
                chapters: [
                    {
                        date: '19 July 2005',
                        title: () => 'Scary Monsters, Part 1',
                        pages: 61,
                        cover: null,
                    },
                    {
                        date: '19 August 2005',
                        title: () => 'Scary Monsters, Part 2',
                        pages: 37,
                        cover: null,
                    },
                    {
                        date: '17 September 2005',
                        title: () => 'Scary Monsters, Part 3',
                        pages: 65,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Little Tomb on the Wide, Wide Prairie',
                chapters: [
                    {
                        date: '19 October 2005',
                        title: () => 'Scary Monsters, Part 4',
                        pages: 63,
                        cover: null,
                    },
                    {
                        date: '19 November 2005',
                        title: () => '3rd Stage Goal: Ca',
                        pages: 55,
                        cover: null,
                    },
                    {
                        date: '19 December 2005',
                        title: () => 'The World of Man, Part 1',
                        pages: 63,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'To the World of Man',
                chapters: [
                    {
                        date: '19 January 2006',
                        title: () => 'The World of Man, Part 2',
                        pages: 63,
                        cover: null,
                    },
                    {
                        date: '19 February 2006',
                        title: () => 'The World of Man, Part 3',
                        pages: 61,
                        cover: null,
                    },
                    {
                        date: '18 March 2006',
                        title: () => 'The Green Tomb, Part 1',
                        pages: 63,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'A Stormy Night is Coming',
                chapters: [
                    {
                        date: '19 April 2006',
                        title: () => 'The Green Tomb, Part 2',
                        pages: 63,
                        cover: null,
                    },
                    {
                        date: '19 May 2006',
                        title: () =>
                            'Catch the Rainbow (On a Stormy Night...), Part 1',
                        pages: 63,
                        cover: null,
                    },
                    {
                        date: '19 June 2006',
                        title: () =>
                            'Catch the Rainbow (On a Stormy Night...), Part 2',
                        pages: 63,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Illinois Skyline, Michigan Lakeline',
                chapters: [
                    {
                        date: '19 July 2006',
                        title: () => 'Silent Way, Part 1',
                        pages: 61,
                        cover: null,
                    },
                    {
                        date: '19 August 2006',
                        title: () => 'Silent Way, Part 2',
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '19 September 2006',
                        title: () => 'Silent Way, Part 3',
                        pages: 51,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Make the Golden Rectangle!',
                chapters: [
                    {
                        date: '19 October 2006',
                        title: () => 'Silent Way, Part 4',
                        pages: 63,
                        cover: null,
                    },
                    {
                        date: '18 November 2006',
                        title: () => 'Silent Way, Part 5',
                        pages: 61,
                        cover: null,
                    },
                    {
                        date: '19 December 2006',
                        title: () => 'The Promised Land:',
                        pages: 63,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () =>
                    'Conditions for the Corpse, Conditions for Friendship',
                chapters: [
                    {
                        date: '19 January 2007',
                        title: () => 'The Promised Land:',
                        pages: 63,
                        cover: null,
                    },
                    {
                        date: '19 February 2007',
                        title: () => 'The Promised Land:',
                        pages: 53,
                        cover: null,
                    },
                    {
                        date: '19 March 2007',
                        title: () => 'Tubular Bells, Part 1',
                        pages: 61,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Wrecking Ball',
                chapters: [
                    {
                        date: '19 April 2007',
                        title: () => 'Tubular Bells, Part 2',
                        pages: 61,
                        cover: null,
                    },
                    {
                        date: '19 May 2007',
                        title: () => 'Tubular Bells, Part 3',
                        pages: 63,
                        cover: null,
                    },
                    {
                        date: '19 June 2007',
                        title: () => 'Wrecking Ball, Part 1',
                        pages: 61,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => "The Victor's Qualifications",
                chapters: [
                    {
                        date: '19 July 2007',
                        title: () => 'Wrecking Ball, Part 2',
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '19 August 2007',
                        title: () => 'Wrecking Ball, Part 3',
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '19 September 2007',
                        title: () => 'Wrecking Ball, Part 4',
                        pages: 61,
                        cover: null,
                    },
                    {
                        date: '19 October 2007',
                        title: () => "The Victor's Qualifications",
                        pages: 37,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'A Dream of Gettysburg',
                chapters: [
                    {
                        date: '19 November 2007',
                        title: () => 'Civil War, Part 1',
                        pages: 33,
                        cover: null,
                    },
                    {
                        date: '19 December 2007',
                        title: () => 'Civil War, Part 2',
                        pages: 61,
                        cover: null,
                    },
                    {
                        date: '19 January 2008',
                        title: () => 'Civil War, Part 3',
                        pages: 51,
                        cover: null,
                    },
                    {
                        date: '19 March 2008',
                        title: () => 'A Dream of Gettysburg',
                        pages: 61,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Dirty Deeds Done Dirt Cheap',
                chapters: [
                    {
                        date: '19 April 2008',
                        title: () => 'Both Sides Now, Part 1',
                        pages: 53,
                        cover: null,
                    },
                    {
                        date: '19 May 2008',
                        title: () => 'Both Sides Now, Part 2',
                        pages: 61,
                        cover: null,
                    },
                    {
                        date: '19 June 2008',
                        title: () => 'Dirty Deeds Done Dirt Cheap',
                        pages: 61,
                        cover: null,
                    },
                    {
                        date: '4 September 2008',
                        title: () => 'Seven Days in a Week',
                        pages: 5,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'D4C',
                chapters: [
                    {
                        date: '19 July 2008',
                        title: () => 'Chocolate Disco, Part 1',
                        pages: 33,
                        cover: null,
                    },
                    {
                        date: '19 August 2008',
                        title: () => 'Chocolate Disco, Part 2',
                        pages: 33,
                        cover: null,
                    },
                    {
                        date: '19 September 2008',
                        title: () => 'D4C, Part 1',
                        pages: 43,
                        cover: null,
                    },
                    {
                        date: '19 October 2008',
                        title: () => 'D4C, Part 2',
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '19 November 2008',
                        title: () => 'D4C, Part 3',
                        pages: 47,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Ticket to Ride',
                chapters: [
                    {
                        date: '19 December 2008',
                        title: () => 'D4C, Part 4',
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '19 February 2009',
                        title: () => 'D4C, Part 5',
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '19 March 2009',
                        title: () => 'Ticket to Ride, Part 1',
                        pages: 29,
                        cover: null,
                    },
                    {
                        date: '19 April 2009',
                        title: () => 'Ticket to Ride, Part 2',
                        pages: 47,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => "You Can't Get Rich",
                chapters: [
                    {
                        date: '19 May 2009',
                        title: () => 'D4C, Part 6',
                        pages: 49,
                        cover: null,
                    },
                    {
                        date: '19 July 2009',
                        title: () => 'D4C, Part 7',
                        pages: 53,
                        cover: null,
                    },
                    {
                        date: '19 August 2009',
                        title: () => 'D4C, Part 8',
                        pages: 49,
                        cover: null,
                    },
                    {
                        date: '19 September 2009',
                        title: () => 'D4C, Part 9',
                        pages: 31,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Love Train – The World is One',
                chapters: [
                    {
                        date: '19 October 2009',
                        title: () => 'D4C, Part 10',
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '19 November 2009',
                        title: () => 'D4C, Part 11 -Love Train-',
                        pages: 49,
                        cover: null,
                    },
                    {
                        date: '19 December 2009',
                        title: () => 'D4C, Part 12 -Love Train-',
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '19 January 2010',
                        title: () => 'D4C, Part 13 -Love Train-',
                        pages: 39,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Ball Breaker',
                chapters: [
                    {
                        date: '19 February 2010',
                        title: () => 'D4C, Part 14 -Love Train-',
                        pages: 49,
                        cover: null,
                    },
                    {
                        date: '19 March 2010',
                        title: () => 'D4C, Part 15 -Love Train-',
                        pages: 35,
                        cover: null,
                    },
                    {
                        date: '19 April 2010',
                        title: () => 'Ball Breaker, Part 1',
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '19 May 2010',
                        title: () => 'Ball Breaker, Part 2',
                        pages: 47,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Break My Heart, Break Your Heart',
                chapters: [
                    {
                        date: '19 June 2010',
                        title: () => 'Ball Breaker, Part 3',
                        pages: 51,
                        cover: null,
                    },
                    {
                        date: '17 July 2010',
                        title: () => 'Ball Breaker, Part 4',
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '19 August 2010',
                        title: () => 'Ball Breaker, Part 5',
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '18 September 2010',
                        title: () => 'Break My Heart, Break Your Heart, Part 1',
                        pages: 33,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'High Voltage',
                chapters: [
                    {
                        date: '19 October 2010',
                        title: () => 'Break My Heart, Break Your Heart, Part 2',
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '19 November 2010',
                        title: () => 'High Voltage, Part 1',
                        pages: 49,
                        cover: null,
                    },
                    {
                        date: '19 December 2010',
                        title: () => 'High Voltage, Part 2',
                        pages: 49,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Stars and Stripes Forever',
                chapters: [
                    {
                        date: '19 January 2011',
                        title: () => 'High Voltage, Part 3',
                        pages: 33,
                        cover: null,
                    },
                    {
                        date: '19 February 2011',
                        title: () => 'High Voltage, Part 4',
                        pages: 33,
                        cover: null,
                    },
                    {
                        date: '19 March 2011',
                        title: () => 'The World of Stars and Stripes',
                        pages: 51,
                        cover: null,
                    },
                    {
                        date: '19 April 2011',
                        title: () => 'The World of Stars and Stripes - Outro',
                        pages: 49,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Welcome to Morioh',
                chapters: [
                    {
                        date: '19 May 2011',
                        title: () => 'Welcome to Morioh',
                        pages: 43,
                        cover: null,
                    },
                    {
                        date: '18 June 2011',
                        title: () => 'Soft &amp',
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '19 July 2011',
                        title: () => 'Soft &amp',
                        pages: 33,
                        cover: null,
                    },
                    {
                        date: '17 September 2011',
                        title: () => 'Soft &amp',
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '19 October 2011',
                        title: () => 'Soft &amp',
                        pages: 49,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'The Name "Josuke Higashikata"',
                chapters: [
                    {
                        date: '19 November 2011',
                        title: () => 'Soft &amp',
                        pages: 49,
                        cover: null,
                    },
                    {
                        date: '19 December 2011',
                        title: () => 'Josuke, Go to the Higashikata Family',
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '19 January 2012',
                        title: () => 'California King Bed, Part 1',
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '18 February 2012',
                        title: () => 'California King Bed, Part 2',
                        pages: 33,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'That Family Tree',
                chapters: [
                    {
                        date: '19 March 2012',
                        title: () => 'California King Bed, Part 3',
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '19 April 2012',
                        title: () => 'Family Tree',
                        pages: 33,
                        cover: null,
                    },
                    {
                        date: '19 May 2012',
                        title: () =>
                            '"Paisley Park" and "Born This Way", Part 1',
                        pages: 49,
                        cover: null,
                    },
                    {
                        date: '19 July 2012',
                        title: () =>
                            '"Paisley Park" and "Born This Way", Part 2',
                        pages: 35,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'The Lemon and the Tangerine',
                chapters: [
                    {
                        date: '18 September 2012',
                        title: () =>
                            '"Paisley Park" and "Born This Way", Part 3',
                        pages: 49,
                        cover: null,
                    },
                    {
                        date: '19 October 2012',
                        title: () =>
                            '"Paisley Park" and "Born This Way", Part 4',
                        pages: 25,
                        cover: null,
                    },
                    {
                        date: '19 November 2012',
                        title: () =>
                            '"Paisley Park" and "Born This Way", Part 5',
                        pages: 33,
                        cover: null,
                    },
                    {
                        date: '19 December 2012',
                        title: () => 'The Lemon and the Tangerine',
                        pages: 33,
                        cover: null,
                    },
                    {
                        date: '19 January 2013',
                        title: () => '"Shakedown Road", Part 1',
                        pages: 51,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Morioh 1901',
                chapters: [
                    {
                        date: '19 March 2013',
                        title: () => '"Shakedown Road", Part 2',
                        pages: 35,
                        cover: null,
                    },
                    {
                        date: '19 April 2013',
                        title: () => '"Shakedown Road", Part 3',
                        pages: 49,
                        cover: null,
                    },
                    {
                        date: '19 May 2013',
                        title: () => '"Shakedown Road", Part 4',
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '19 June 2013',
                        title: () => 'Morioh 1901',
                        pages: 33,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => "Tsurugi Higashikata's Goal, and the Architect",
                chapters: [
                    {
                        date: '19 July 2013',
                        title: () => 'Paper Moon Deception, Part 1',
                        pages: 33,
                        cover: null,
                    },
                    {
                        date: '19 September 2013',
                        title: () => 'Paper Moon Deception, Part 2',
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '19 October 2013',
                        title: () => 'Paper Moon Deception, Part 3',
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '19 November 2013',
                        title: () =>
                            "Tsurugi Higashikata's Goal, and the Architect",
                        pages: 45,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'King Nothing',
                chapters: [
                    {
                        date: '19 December 2013',
                        title: () =>
                            'Norisuke Higashikata, Tsurugi Higashikata, and Yotsuyu Yagiyama, Part 1',
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '18 January 2014',
                        title: () =>
                            'Norisuke Higashikata, Tsurugi Higashikata, and Yotsuyu Yagiyama, Part 2',
                        pages: 43,
                        cover: null,
                    },
                    {
                        date: '19 February 2014',
                        title: () =>
                            'Norisuke Higashikata, Tsurugi Higashikata, and Yotsuyu Yagiyama, Part 3',
                        pages: 31,
                        cover: null,
                    },
                    {
                        date: '19 March 2014',
                        title: () => 'King Nothing',
                        pages: 47,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => "It's a Summer Vacation Everyday",
                chapters: [
                    {
                        date: '19 April 2014',
                        title: () => '"I Am a Rock", Part 1',
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '19 May 2014',
                        title: () => '"I Am a Rock", Part 2',
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '19 June 2014',
                        title: () =>
                            'Josuke! Go to the Higashikata Fruit Parlor',
                        pages: 49,
                        cover: null,
                    },
                    {
                        date: '19 July 2014',
                        title: () => "It's a Summer Vacation Everyday, Part 1",
                        pages: 45,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Eldest Son: Jobin Higashikata',
                chapters: [
                    {
                        date: '19 August 2014',
                        title: () => "It's a Summer Vacation Everyday, Part 2",
                        pages: 31,
                        cover: null,
                    },
                    {
                        date: '18 October 2014',
                        title: () => "It's a Summer Vacation Everyday, Part 3",
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '19 November 2014',
                        title: () => "It's a Summer Vacation Everyday, Part 4",
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '19 December 2014',
                        title: () => 'Jobin Higashikata is a Stand User',
                        pages: 45,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Follow the Locacaca Tree!',
                chapters: [
                    {
                        date: '19 January 2015',
                        title: () => 'Doobie Wah, Part 1',
                        pages: 31,
                        cover: null,
                    },
                    {
                        date: '19 February 2015',
                        title: () => 'Doobie Wah, Part 2',
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '19 March 2015',
                        title: () => 'Doobie Wah, Part 3',
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '18 April 2015',
                        title: () => 'Doobie Wah, Part 4',
                        pages: 45,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'The Twins Are Coming to Town',
                chapters: [
                    {
                        date: '19 May 2015',
                        title: () => 'Love Love Deluxe, Part 1',
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '19 June 2015',
                        title: () => 'Love Love Deluxe, Part 2',
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '18 July 2015',
                        title: () => 'Love Love Deluxe, Part 3',
                        pages: 41,
                        cover: null,
                    },
                    {
                        date: '19 August 2015',
                        title: () => 'Love Love Deluxe, Part 4',
                        pages: 45,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => "Hato's Boyfriend",
                chapters: [
                    {
                        date: '19 September 2015',
                        title: () => 'Hato Brought Her Boyfriend Home, Part 1',
                        pages: 25,
                        cover: null,
                    },
                    {
                        date: '19 October 2015',
                        title: () => 'Hato Brought Her Boyfriend Home, Part 2',
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '19 December 2015',
                        title: () => 'Hato Brought Her Boyfriend Home, Part 3',
                        pages: 46,
                        cover: null,
                    },
                    {
                        date: '19 January 2016',
                        title: () => 'Vitamin C and Killer Queen, Part 1',
                        pages: 33,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Walking Heart',
                chapters: [
                    {
                        date: '19 February 2016',
                        title: () => 'Vitamin C and Killer Queen, Part 2',
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '19 March 2016',
                        title: () => 'Vitamin C and Killer Queen, Part 3',
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '19 April 2016',
                        title: () => 'Vitamin C and Killer Queen, Part 4',
                        pages: 46,
                        cover: null,
                    },
                    {
                        date: '19 May 2016',
                        title: () => 'Walking Heart',
                        pages: 47,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Dawn of the Higashikata Family',
                chapters: [
                    {
                        date: '18 June 2016',
                        title: () => 'Walking Heart, Breaking Heart',
                        pages: 43,
                        cover: null,
                    },
                    {
                        date: '19 July 2016',
                        title: () => 'Milagroman, Part 1',
                        pages: 46,
                        cover: null,
                    },
                    {
                        date: '19 August 2016',
                        title: () => 'Milagroman, Part 2',
                        pages: 49,
                        cover: null,
                    },
                    {
                        date: '17 September 2016',
                        title: () => 'Dawn of the Higashikata Family',
                        pages: 41,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => "Dolomite's Blue Lagoon",
                chapters: [
                    {
                        date: '19 October 2016',
                        title: () => "Dolomite's Blue Lagoon, Part 1",
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '19 December 2016',
                        title: () => "Dolomite's Blue Lagoon, Part 2",
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '19 January 2017',
                        title: () => "Dolomite's Blue Lagoon, Part 3",
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '18 February 2017',
                        title: () => "Dolomite's Blue Lagoon, Part 4",
                        pages: 45,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Mother and Child',
                chapters: [
                    {
                        date: '18 March 2017',
                        title: () => "Dolomite's Blue Lagoon, Part 5",
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '19 April 2017',
                        title: () => 'Mother and Child',
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '19 May 2017',
                        title: () =>
                            'The Plant Appraiser - Rai Mamezuku (31), Part 1',
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '19 June 2017',
                        title: () =>
                            'The Plant Appraiser - Rai Mamezuku (31), Part 2',
                        pages: 43,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Escape from Mount Hanarero',
                chapters: [
                    {
                        date: '19 July 2017',
                        title: () =>
                            'The Plant Appraiser - Rai Mamezuku (31), Part 3',
                        pages: 33,
                        cover: null,
                    },
                    {
                        date: '19 August 2017',
                        title: () =>
                            'Urban Guerrilla and Doremifasolati Do, Part 1',
                        pages: 43,
                        cover: null,
                    },
                    {
                        date: '19 September 2017',
                        title: () =>
                            'Urban Guerrilla and Doremifasolati Do, Part 2',
                        pages: 33,
                        cover: null,
                    },
                    {
                        date: '19 October 2017',
                        title: () =>
                            'Urban Guerrilla and Doremifasolati Do, Part 3',
                        pages: 43,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'North of the Higashikata House. The Orchard',
                chapters: [
                    {
                        date: '17 November 2017',
                        title: () => 'The Qing Dynasty Hair Clip',
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '19 December 2017',
                        title: () =>
                            'North of the Higashikata House. The Orchard',
                        pages: 41,
                        cover: null,
                    },
                    {
                        date: '19 February 2018',
                        title: () => "Ozon Baby's Pressure, Part 1",
                        pages: 31,
                        cover: null,
                    },
                    {
                        date: '19 March 2018',
                        title: () => "Ozon Baby's Pressure, Part 2",
                        pages: 47,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Orthopedic Surgeon - Dr. Wu Tomoki',
                chapters: [
                    {
                        date: '19 April 2018',
                        title: () => "Ozon Baby's Pressure, Part 3",
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '19 June 2018',
                        title: () => "Ozon Baby's Pressure, Part 4",
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '19 July 2018',
                        title: () => 'Head to TG University Hospital',
                        pages: 39,
                        cover: null,
                    },
                    {
                        date: '18 August 2018',
                        title: () => 'Orthopedic Surgeon - Dr. Wu Tomoki',
                        pages: 43,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Please Come With Me. Doctor Wu',
                chapters: [
                    {
                        date: '19 September 2018',
                        title: () => 'Doctor Wu and Awaking 3 Leaves, Part 1',
                        pages: 43,
                        cover: null,
                    },
                    {
                        date: '19 October 2018',
                        title: () => 'Doctor Wu and Awaking 3 Leaves, Part 2',
                        pages: 39,
                        cover: null,
                    },
                    {
                        date: '19 November 2018',
                        title: () => 'Doctor Wu and Awaking 3 Leaves, Part 3',
                        pages: 43,
                        cover: null,
                    },
                    {
                        date: '19 December 2018',
                        title: () => 'Doctor Wu and Awaking 3 Leaves, Part 4',
                        pages: 43,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'The Wonder of You',
                chapters: [
                    {
                        date: '19 January 2019',
                        title: () => 'The New Locacaca',
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '19 March 2019',
                        title: () => 'The Wonder of You, Part 1',
                        pages: 49,
                        cover: null,
                    },
                    {
                        date: '19 April 2019',
                        title: () => 'The Wonder of You, Part 2',
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '17 May 2019',
                        title: () => 'The Wonder of You, Part 3',
                        pages: 47,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () =>
                    'The Head of TG University Hospital — Satoru Akefu',
                chapters: [
                    {
                        date: '19 June 2019',
                        title: () => 'The Wonder of You, Part 4',
                        pages: 41,
                        cover: null,
                    },
                    {
                        date: '19 July 2019',
                        title: () => 'The Wonder of You, Part 5',
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '19 August 2019',
                        title: () => 'The Wonder of You, Part 6',
                        pages: 35,
                        cover: null,
                    },
                    {
                        date: '19 September 2019',
                        title: () => 'The Wonder of You, Part 7',
                        pages: 35,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Whole Lotta Love',
                chapters: [
                    {
                        date: '19 October 2019',
                        title: () => 'The Wonder of You, Part 8',
                        pages: 41,
                        cover: null,
                    },
                    {
                        date: '19 November 2019',
                        title: () => 'The Wonder of You, Part 9',
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '19 December 2019',
                        title: () => 'The Wonder of You, Part 10',
                        pages: 31,
                        cover: null,
                    },
                    {
                        date: '18 January 2020',
                        title: () => 'The Wonder of You, Part 11',
                        pages: 41,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => "Just Don't Move",
                chapters: [
                    {
                        date: '19 March 2020',
                        title: () => 'The Wonder of You, Part 12',
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '17 April 2020',
                        title: () => "Just Don't Move",
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '19 May 2020',
                        title: () => 'The Wonder of You, Part 14',
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '19 June 2020',
                        title: () => 'The Wonder of You, Part 15',
                        pages: 45,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'The Ultimate Dilemma',
                chapters: [
                    {
                        date: '18 July 2020',
                        title: () => 'The Wonder of You, Part 16',
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '19 August 2020',
                        title: () => 'The Wonder of You, Part 17',
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '17 October 2020',
                        title: () => 'The Wonder of You, Part 18',
                        pages: 31,
                        cover: null,
                    },
                    {
                        date: '19 November 2020',
                        title: () => 'The Wonder of You, Part 19',
                        pages: 45,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Go Beyond',
                chapters: [
                    {
                        date: '19 December 2020',
                        title: () => 'The Wonder of You, Part 20',
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '19 January 2021',
                        title: () => 'The Wonder of You, Part 21',
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '19 February 2021',
                        title: () => 'Safety First',
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '19 April 2021',
                        title: () => 'Go Beyond',
                        pages: 45,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'When All Curses Are Broken',
                chapters: [
                    {
                        date: '19 May 2021',
                        title: () => 'When All Curses Are Broken',
                        pages: 49,
                        cover: null,
                    },
                    {
                        date: '18 June 2021',
                        title: () => 'Go Beyond, Part 2',
                        pages: 49,
                        cover: null,
                    },
                    {
                        date: '16 July 2021',
                        title: () => 'The Radio Gaga Incident (1941)',
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '19 August 2021',
                        title: () => 'Higashikata Fruit Parlor',
                        pages: 51,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => 'Departure',
                chapters: [
                    {
                        date: '17 February 2023',
                        title: () => 'Departure',
                        pages: 69,
                        cover: null,
                    },
                    {
                        date: '17 March 2023',
                        title: () => 'South King Street',
                        pages: 51,
                        cover: null,
                    },
                    {
                        date: '19 April 2023',
                        title: () => 'The Villa on Hawaii Island, Part 1',
                        pages: 43,
                        cover: null,
                    },
                    {
                        date: '19 May 2023',
                        title: () => 'The Villa on Hawaii Island, Part 2',
                        pages: 43,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => '"Rise Up"',
                chapters: [
                    {
                        date: '19 June 2023',
                        title: () => '"Rise Up"',
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '19 July 2023',
                        title: () => 'Hualālai - Cat Size, Part 1',
                        pages: 35,
                        cover: null,
                    },
                    {
                        date: '19 August 2023',
                        title: () => 'Hualālai - Cat Size, Part 2',
                        pages: 47,
                        cover: null,
                    },
                    {
                        date: '19 September 2023',
                        title: () => 'Hualālai - Cat Size, Part 3',
                        pages: 39,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => '"Money-Making Time"',
                chapters: [
                    {
                        date: '17 November 2023',
                        title: () =>
                            'Kailua-Kona - Flight Waiting Time, Part 1',
                        pages: 43,
                        cover: null,
                    },
                    {
                        date: '19 December 2023',
                        title: () =>
                            'Kailua-Kona - Flight Waiting Time, Part 2',
                        pages: 49,
                        cover: null,
                    },
                    {
                        date: '18 January 2024',
                        title: () =>
                            'Kailua-Kona - Flight Waiting Time, Part 3',
                        pages: 51,
                        cover: null,
                    },
                    {
                        date: '19 February 2024',
                        title: () => 'Charming Man',
                        pages: 37,
                        cover: null,
                    },
                ],
            },
            {
                cover: volumeCover,
                title: () => '"Joestar Brothers"',
                chapters: [
                    {
                        date: '19 March 2024',
                        title: () => 'Joestar Brothers',
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '19 April 2024',
                        title: () =>
                            'Aim for That Fifty Billion Dollars, Part 1',
                        pages: 41,
                        cover: null,
                    },
                    {
                        date: '17 May 2024',
                        title: () =>
                            'Aim for That Fifty Billion Dollars, Part 2',
                        pages: 41,
                        cover: null,
                    },
                    {
                        date: '19 June 2024',
                        title: () => "Lulu's Bags' Groove, Part 1",
                        pages: 43,
                        cover: null,
                    },
                ],
            },
            {
                cover: () => 'Volume_136',
                title: () => '"Deed"',
                chapters: [
                    {
                        date: '19 July 2024',
                        title: () => "Lulu's Bags' Groove, Part 2",
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '19 August 2024',
                        title: () => 'Lulu and Bobby Jean, Part 1',
                        pages: 41,
                        cover: null,
                    },
                    {
                        date: '19 September 2024',
                        title: () => 'Lulu and Bobby Jean, Part 2',
                        pages: 41,
                        cover: null,
                    },
                    {
                        date: '19 October 2024',
                        title: () => 'Lulu and Bobby Jean, Part 3',
                        pages: 43,
                        cover: null,
                    },
                ],
            },
            {
                cover: () => 'Volume_137',
                title: () => '"Board the Megayacht"',
                chapters: [
                    {
                        date: '19 December 2024',
                        title: () => 'Dolphin Bank Sales Manager Yokohama',
                        pages: 43,
                        cover: null,
                    },
                    {
                        date: '18 January 2025',
                        title: () => 'Board the Megayacht',
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '18 February 2025',
                        title: () => "200 Balloons and Lyin' Eyes, Part 1",
                        pages: 45,
                        cover: null,
                    },
                    {
                        date: '18 March 2025',
                        title: () => "200 Balloons and Lyin' Eyes, Part 2",
                        pages: 45,
                        cover: null,
                    },
                ],
            },
            {
                title: () => 'Volume 138',
                cover: () => 'Volume_138',
                chapters: [
                    {
                        date: '19 May 2025',
                        title: () => "Laem Chabang's Investigation",
                        pages: 31,
                        cover: null,
                    },
                    {
                        date: '18 June 2025',
                        title: () => 'Paco vs. Ningbo, Part 1',
                        pages: 43,
                        cover: null,
                    },
                    {
                        date: '17 July 2025',
                        title: () => 'Paco vs. Ningbo, Part 2',
                        pages: 35,
                        cover: null,
                    },
                    {
                        date: '19 August 2025',
                        title: () => 'Dignity and Instruction',
                        pages: 43,
                        cover: null,
                    },
                ],
            },
        ] as const satisfies Tuple<Volume, typeof VOLUMES_TOTAL>,
        sagas: [
            {
                title: 'Chainsaw Man',
                cover: null,
                chapters: { from: 1 },
                arcs: [
                    {
                        title: 'Dio Brando the Invader',
                        cover: 'Chapter_4_Cover_B',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 1, to: 5 },
                    },
                    {
                        title: 'A Letter from the Past',
                        cover: 'Jonathan_Letter_From_the_Past_Manga',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 6, to: 7 },
                    },
                ],
            },
        ] as const satisfies Tuple<Saga, typeof SAGAS_TOTAL>,
        seasons: [
            {
                title: 'Phantom Blood',
                cover: () => 'Season_1_1',
                offset: { x: 0, y: 2200 },
                chapters: { from: 1, to: 44 },
                episodes: [
                    {
                        title: () => 'Dio the Invader',
                        cover: () => 'Episode_1',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 1, to: 5 },
                    },
                    {
                        title: () => 'A Letter from the Past',
                        cover: () => 'Episode_2',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 6, to: 11 },
                    },
                    {
                        title: () => 'Youth with Dio',
                        cover: () => 'Episode_3',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 11, to: 17 },
                    },
                    {
                        title: () => 'Overdrive',
                        cover: () => 'Episode_4',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 17, to: 23 },
                    },
                    {
                        title: () => 'The Dark Knights',
                        cover: () => 'Episode_5',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 24, to: 28 },
                    },
                    {
                        title: () => 'Pluck for Tomorrow',
                        cover: () => 'Episode_6',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 29, to: 34 },
                    },
                    {
                        title: () => 'The Successor',
                        cover: () => 'Episode_7',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 34, to: 36 },
                    },
                    {
                        title: () => 'Bloody Battle! JoJo & Dio',
                        cover: () => 'Episode_8',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 37, to: 41 },
                    },
                    {
                        title: () => 'The Final Ripple!',
                        cover: () => 'Episode_9',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 41, to: 44 },
                    },
                ],
            },
            {
                title: 'Battle Tendency',
                cover: () => 'Season_1_2',
                offset: { x: 0, y: 1300 },
                chapters: { from: 45, to: 113 },
                episodes: [],
            },
            {
                title: 'Stardust Crusaders - Road to Egypt',
                cover: () => 'Season_2_1',
                offset: { x: 0, y: 1100 },
                chapters: { from: 114, to: 182 },
                episodes: [],
            },
            {
                title: 'Stardust Crusaders - Battle in Egypt',
                cover: () => 'Season_2_2',
                offset: { x: 0, y: 1000 },
                chapters: { from: 183, to: 265 },
                episodes: [],
            },
            {
                title: 'Diamond is Unbreakable',
                cover: () => 'Season_3',
                offset: { x: 0, y: 7500 },
                chapters: { from: 266, to: 439 },
                episodes: [],
            },
            {
                title: 'Golden Wind',
                cover: () => 'Season_4',
                offset: { x: 0, y: 1000 },
                chapters: { from: 440, to: 594 },
                episodes: [],
            },
            {
                title: 'Stone Ocean',
                cover: () => 'Season_5',
                offset: { x: 0, y: 4100 },
                chapters: { from: 595, to: 752 },
                episodes: [],
            },
            {
                title: 'Steel Ball Run',
                cover: () => 'Season_6',
                offset: { x: 0, y: 21500 },
                chapters: { from: 753, to: 847 },
                episodes: [],
            },
            {
                chapters: { from: 848, to: 953 },
            },
            {
                chapters: { from: 954, to: 985 },
            },
        ] as const satisfies Tuple<Season, typeof SEASONS_TOTAL>,
        splitChapters: {
            11: 5,
            17: 15,
            34: 3,
            41: 10,
        } as const,
        wikiBase: 'https://jojowiki.com/',
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
