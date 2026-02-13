import {
    getArcWidth,
    getChapterWidth,
    getEpisodeWidth,
    getSagaWidth,
    getSeasonWidth,
    getVolumeByChapter,
    getVolumeWidth,
} from '@shared/lib/helpers';
import { pad, Tuple } from '@shared/lib/util';
import { Arc, Season, Timeline, TimelineData, Volume } from '../types';

const SEASON_HEIGHT = 1500;
const EPISODE_HEIGHT = SEASON_HEIGHT * 0.33;
const VOLUME_HEIGHT = 1417;
const CHAPTER_HEIGHT = 75;
const ARC_HEIGHT = VOLUME_HEIGHT * 0.25;

const SEASONS_TOTAL = 2;
const ARCS_TOTAL = 6;
const VOLUMES_TOTAL = 14;

const volumeCover = (_: TimelineData, idx: number) =>
    idx === 2 ?
        `Volume${idx + 1}Manga`
    :   `Sadamoto_${idx === 12 ? 'v' : 'V'}olume_${idx + 1}`;
const episodeTitle = (_: string, n: number) =>
    n <= 26 ? `Episode ${pad(n)}` : `Episode ${n - 2}'`;

export const EVA_TIMELINE: Timeline = {
    layout: {
        volume: {
            type: 'volume',
            height: VOLUME_HEIGHT,
            width: getVolumeWidth,
            defaultCoverPosition: 'top',
            titleProcessor: (title, n) => `${title}\n(Volume ${n})`,
            blankfontSize: 500,
            titleFontSize: 100,
            sectionLink: 'Neon_Genesis_Evangelion_(manga)',
            wikiLink: (_, n) => `Volume_${n}_(Neon_Genesis_Evangelion)`,
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
            sectionLink: 'Neon_Genesis_Evangelion_(manga)',
            wikiLink: (title, n) =>
                `Volume_${
                    getVolumeByChapter(EVA_TIMELINE.data, n - 1) + 1
                }_(Neon_Genesis_Evangelion)#Stage_${n}:_${title.replaceAll(
                    ' ',
                    '_',
                )}`,
        },
        saga: {
            type: 'saga',
            height: ARC_HEIGHT,
            blankfontSize: 0,
            titleFontSize: 0,
            width: getSagaWidth,
            sectionLink: 'Episodes_and_Films_(Portal)#Notes',
            wikiLink: () => 'unused',
            subTimeline: {
                type: 'arc',
                height: ARC_HEIGHT,
                width: getArcWidth,
                titleProcessor: (title, n) => (n <= 3 ? `${title} arc` : title),
                blankfontSize: 100,
                titleFontSize: 100,
                sectionLink: 'Episodes_and_Films_(Portal)#Notes',
                wikiLink: () => 'Episodes_and_Films_(Portal)#Notes',
            },
        },
        season: {
            type: 'season',
            height: SEASON_HEIGHT,
            width: getSeasonWidth,
            blankfontSize: 250,
            titleFontSize: 100,
            sectionLink: 'Episodes_and_Films_(Portal)',
            wikiLink: title => title.replaceAll(' ', '_'),
            subTimeline: {
                type: 'episode',
                height: EPISODE_HEIGHT,
                width: getEpisodeWidth,
                scale: 1.2,
                titleProcessor: (title, n) =>
                    `${title}\n(${episodeTitle(title, n)})`,
                blankfontSize: 50,
                titleFontSize: 50,
                sectionLink: 'Episodes and Films (Portal)',
                wikiLink: (title, n) =>
                    episodeTitle(title, n).replaceAll(' ', '_'),
            },
        },
    },
    data: {
        title: 'Neon Genesis Evangelion',
        seasons: [
            {
                title: 'Neon Genesis Evangelion',
                cover: () => 'Neon_Genesis_Evangelion_logo',
                offset: { x: 0, y: 2050 },
                chapters: { from: 1, to: 75 },
                episodes: [
                    {
                        title: () => 'Angel Attack',
                        cover: () => 'Episode-01-Info',
                        offset: { x: 100, y: 0 },
                        chapters: { from: 1, to: 3 },
                    },
                    {
                        title: () => 'The Beast',
                        cover: () => 'Episode_02_info',
                        offset: { x: 100, y: 0 },
                        chapters: { from: 3, to: 7 },
                    },
                    {
                        title: () => 'A Transfer',
                        cover: () => 'Episode-03-info',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 7, to: 10 },
                    },
                    {
                        title: () => "Hedgehog's Dilemma",
                        cover: () => 'Shinjitrain',
                        offset: { x: 170, y: 0 },
                        chapters: { from: 11, to: 12 },
                    },
                    {
                        title: () => 'Rei I',
                        cover: () => 'Shinji_Rei_Escalator',
                        offset: { x: 150, y: 0 },
                        chapters: { from: 13, to: 15 },
                    },
                    {
                        title: () => 'Rei II',
                        cover: () => 'Japan_Blackout',
                        offset: { x: 400, y: 0 },
                        chapters: { from: 15, to: 19 },
                    },
                    {
                        title: () => 'A Human Work',
                        cover: () => '07_C178_ohshi',
                        offset: { x: 200, y: 0 },
                        chapters: { from: 19, to: 20 }, // shrug
                    },
                    {
                        title: () => 'Asuka Strikes!',
                        cover: () => 'Asuka_Ships_Bridge',
                        offset: { x: 300, y: 0 },
                        chapters: { from: 19, to: 21 },
                    },
                    {
                        title: () => 'Both of You, Dance Like You Want to Win!',
                        cover: () => 'Dance_Vs_Israfel',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 21, to: 26 },
                    },
                    {
                        title: () => 'Magma Diver',
                        cover: () => 'D-Type-Submerge',
                        offset: { x: 250, y: 0 },
                        chapters: { from: 26, to: 26 }, // shrug
                    },
                    {
                        title: () => 'The Day Tokyo-3 Stood Still',
                        cover: () => 'Fuyutsuki_Candle',
                        offset: { x: 100, y: 0 },
                        chapters: { from: 26, to: 27 }, // shrug
                    },
                    {
                        title: () =>
                            'She Said, "Don\'t Make Others Suffer for Your Personal Hatred."',
                        cover: () => 'Misatos_Intuition',
                        offset: { x: 100, y: 0 },
                        chapters: { from: 27, to: 30 },
                    },
                    {
                        title: () => 'Lilliputian Hitcher',
                        cover: () => 'Ireul_Hacking_Magi',
                        offset: { x: 300, y: 0 },
                        chapters: { from: 30, to: 31 }, // shrug
                    },
                    {
                        title: () => 'Weaving a Story',
                        cover: () => 'Gendo_With_Committee',
                        offset: { x: 200, y: 0 },
                        chapters: { from: 30, to: 31 }, // shrug
                    },
                    {
                        title: () =>
                            "Those Women Longed for the Touch of Other's Lips, and Thus Invited Their Kisses",
                        cover: () => 'Visiting_Yuis_Grave',
                        offset: { x: 200, y: 0 },
                        chapters: { from: 31, to: 32 },
                    },
                    {
                        title: () => 'Splitting of the Breast',
                        cover: () => '16_C221_hell-train',
                        offset: { x: 400, y: 0 },
                        chapters: { from: 32, to: 33 }, // shrug
                    },
                    {
                        title: () => 'FOURTH CHILDREN',
                        cover: () => '17_C153_shinji-kaji',
                        offset: { x: 150, y: 0 },
                        chapters: { from: 34, to: 36 },
                    },
                    {
                        title: () => 'Ambivalence',
                        cover: () => '18_C167_eva03-silhouette',
                        offset: { x: 50, y: 0 },
                        chapters: { from: 37, to: 41 },
                    },
                    {
                        title: () => 'Introjection',
                        cover: () => '19_C067_shinji-stern',
                        offset: { x: 1, y: 0 },
                        chapters: { from: 42, to: 46 },
                    },
                    {
                        title: () => 'Weaving a story 2: Oral Stage',
                        cover: () => '20_C023_being-watched',
                        offset: { x: 50, y: 0 },
                        chapters: { from: 47, to: 51 },
                    },
                    {
                        title: () => 'He was aware that he was still a child',
                        cover: () => '21_C181_path-to-god',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 52, to: 56 },
                    },
                    {
                        title: () => "Don't be.",
                        cover: () => '22_C400_asuka-lonely',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 57, to: 61 },
                    },
                    {
                        title: () => 'Rei III',
                        cover: () => '23_C141_rei-namida',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 62, to: 70 },
                    },
                    {
                        title: () =>
                            'The Beginning and the End, or "Knockin\' on Heaven\'s Door"',
                        cover: () => '24_C308_deliberation',
                        offset: { x: 0, y: 0 },
                        chapters: { from: 71, to: 75 },
                    },
                    {
                        title: () => 'Do you love me?',
                        cover: () => 'Ep25_screenshot_naked_shinji',
                        offset: { x: 20, y: 0 },
                        chapters: { from: 74, to: 75 }, // shrug
                    },
                    {
                        title: () => 'Take Care of Yourself',
                        cover: () => 'Ep26_screenshot_sketch_shinji',
                        offset: { x: 300, y: 0 },
                        chapters: { from: 74, to: 75 }, // shrug
                    },
                ],
            },
            {
                title: 'The End of Evangelion',
                cover: () => 'End_of_Evangelion_poster',
                offset: { x: 0, y: 3550 },
                chapters: { from: 75 },
                episodes: [
                    {
                        title: () => 'Love is destructive.',
                        cover: () => 'M25_C640_otona-no-kisu',
                        offset: { x: 0, y: 200 },
                        chapters: { from: 75, to: 86 },
                    },
                    {
                        title: () => 'I Need You.',
                        cover: () => 'M26_C130_zomgrei',
                        offset: { x: 0, y: 100 },
                        chapters: { from: 87 },
                    },
                ],
            },
        ] as const satisfies Tuple<Season, typeof SEASONS_TOTAL>,
        sagas: [
            {
                title: '',
                cover: '',
                offset: { x: 0, y: 0 },
                chapters: { from: 1 },
                arcs: [
                    {
                        title: 'Intro',
                        cover: null,
                        chapters: { from: 1, to: 15 },
                    },
                    {
                        title: 'Action',
                        cover: null,
                        chapters: { from: 16, to: 31 },
                    },
                    {
                        title: 'Descent',
                        cover: null,
                        chapters: { from: 32, to: 51 },
                    },
                    {
                        title: 'Bitter End',
                        cover: null,
                        chapters: { from: 52, to: 72 },
                    },
                    {
                        title: 'End of TV',
                        cover: null,
                        chapters: { from: 73, to: 74 },
                    },
                    {
                        title: 'Movies',
                        cover: null,
                        chapters: { from: 75 },
                    },
                ] as const satisfies Tuple<Arc, typeof ARCS_TOTAL>,
            },
        ],
        volumes: [
            {
                title: () => 'Angel Attack (使徒、襲来 / Shito, Shūrai)',
                cover: volumeCover,
                chapters: [
                    {
                        title: () =>
                            'Angel Attack (使徒、襲来 / Shito, Shūrai)',
                        cover: null,
                        date: 'August 29, 1995',
                        pages: 38,
                    },
                    {
                        title: () => 'Reunion (再会 / Saikai)',
                        cover: null,
                        date: 'August 29, 1995',
                        pages: 27,
                    },
                    {
                        title: () =>
                            'Unit-01, Lift Off (初号機、出撃 / Shogōki, Rifuto Ofu)',
                        cover: null,
                        date: 'August 29, 1995',
                        pages: 27,
                    },
                    {
                        title: () => 'Silence... (沈黙… / Chinmoku...)',
                        cover: null,
                        date: 'August 29, 1995',
                        pages: 25,
                    },
                    {
                        title: () =>
                            'What Was Seen In The Well Of Light (光の淵に見たもの / Hikari no Fuchi ni Mitamono)',
                        cover: null,
                        date: 'August 29, 1995',
                        pages: 30,
                    },
                    {
                        title: () => 'I...Cry... (ボクハナク / Boku wa Naku)',
                        cover: null,
                        date: 'August 29, 1995',
                        pages: 25,
                    },
                ],
            },
            {
                title: () =>
                    'Shōnen and Knife (ナイフと少年 / Naifu to Shōnen)',
                cover: volumeCover,
                chapters: [
                    {
                        title: () =>
                            'Closing Hearts (閉じゆく心 / Toji Yuku Kokoro)',
                        cover: null,
                        date: 'March 5, 1996',
                        pages: 29,
                    },
                    {
                        title: () =>
                            "Shinji's Mood (シンジご機嫌ななめ / Shinji Gokigen Naname)",
                        cover: null,
                        date: 'March 5, 1996',
                        pages: 18,
                    },
                    {
                        title: () =>
                            'The Trials of a True Fan (マニアの受難 / Mania no Junan)',
                        cover: null,
                        date: 'March 5, 1996',
                        pages: 32,
                    },
                    {
                        title: () =>
                            'Shonen and Knife (ナイフと少年 / Naifu to Shōnen)',
                        cover: null,
                        date: 'March 5, 1996',
                        pages: 25,
                    },
                    {
                        title: () =>
                            'Third Child Wandering (さまよえるサード・チルドレン / Samayoeru Sādo Chirudoren)',
                        cover: null,
                        date: 'March 5, 1996',
                        pages: 29,
                    },
                    {
                        title: () =>
                            'Fumbling Towards Kindness (やさしさの輪郭 / Yasashisa no Katachi)',
                        cover: null,
                        date: 'March 5, 1996',
                        pages: 29,
                    },
                ],
            },
            {
                title: () => 'White Scars (白い傷跡 / Shiroi Kizuato)',
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'White Scars (白い傷跡 / Shiroi Kizuato)',
                        cover: null,
                        date: 'October 29, 1996',
                        pages: 25,
                    },
                    {
                        title: () =>
                            'The Warped Room (歪んだ部屋 / Yuganda Heya)',
                        cover: null,
                        date: 'October 29, 1996',
                        pages: 24,
                    },
                    {
                        title: () =>
                            'What Her Crimson Eyes Believe (紅い瞳の信じるものは / Akai Hitomi no Shinjirumono wa)',
                        cover: null,
                        date: 'October 29, 1996',
                        pages: 27,
                    },
                    {
                        title: () =>
                            'Abandoned Memories (棄てられた記憶 / Suterareta Kioku)',
                        cover: null,
                        date: 'October 29, 1996',
                        pages: 24,
                    },
                    {
                        title: () =>
                            "The Night Before Battle (決戦前夜 / Kessen Zen'ya)",
                        cover: null,
                        date: 'October 29, 1996',
                        pages: 24,
                    },
                    {
                        title: () => 'Blood Battle (血戦! / Kessen!)',
                        cover: null,
                        date: 'October 29, 1996',
                        pages: 16,
                    },
                    {
                        title: () =>
                            'The Moon Inside the Darkness (闇の中の月 / Yami no Naka no Tsuki)',
                        cover: null,
                        date: 'October 29, 1996',
                        pages: 39,
                    },
                ],
            },
            {
                title: () =>
                    'Asuka Comes to Japan (アスカ、来日 / Asuka, Rainichi)',
                cover: volumeCover,
                chapters: [
                    {
                        title: () =>
                            'Asuka Comes To Japan (アスカ、来日 / Asuka, Rainichi)',
                        cover: null,
                        date: 'October 17, 1997',
                        pages: 33,
                    },
                    {
                        title: () =>
                            'The Uninvited (招かれざる者 / Manekarezarumono)',
                        cover: null,
                        date: 'October 17, 1997',
                        pages: 32,
                    },
                    {
                        title: () =>
                            'Asuka Attacks (アスカ攻撃 / Asuka Atakku)',
                        cover: null,
                        date: 'October 17, 1997',
                        pages: 32,
                    },
                    {
                        title: () =>
                            'Try, Try Again (トライ・アゲイン / Torai Agein)',
                        cover: null,
                        date: 'October 17, 1997',
                        pages: 31,
                    },
                    {
                        title: () => 'Dissonance (不協和音 / Disonansu)',
                        cover: null,
                        date: 'October 17, 1997',
                        pages: 31,
                    },
                    {
                        title: () => 'Shall We Dance? (Shall we dance?)',
                        cover: null,
                        date: 'October 17, 1997',
                        pages: 28,
                    },
                    {
                        title: () =>
                            'One Moment, One Heart (瞬間、心、重ねて / Shunkan, Kokoro, Kasanete)',
                        cover: null,
                        date: 'October 17, 1997',
                        pages: 28,
                    },
                ],
            },
            {
                title: () => 'Cenotaph (墓標 / Bohyō)',
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'The Party (パーティー / Pātī)',
                        cover: null,
                        date: 'December 17, 1999',
                        pages: 32,
                    },
                    {
                        title: () =>
                            'Follow Back Along Your Scar (傷跡をたどれば / Kizuato o Tadoreba)',
                        cover: null,
                        date: 'December 17, 1999',
                        pages: 29,
                    },
                    {
                        title: () => 'Centopath (墓標 / Bohyō)',
                        cover: null,
                        date: 'December 17, 1999',
                        pages: 33,
                    },
                    {
                        title: () =>
                            'Catch The G-Shock (受け止めろ 重力攻撃! / Catch The G-Shock!)',
                        cover: null,
                        date: 'December 17, 1999',
                        pages: 32,
                    },
                    {
                        title: () =>
                            'NERV Blackout (ネルフ、停電 / Nerufu, Teiden)',
                        cover: null,
                        date: 'December 17, 1999',
                        pages: 31,
                    },
                    {
                        title: () =>
                            "The Abyss of Truth (真実の深淵 / Shinjitsu no Shin'en)",
                        cover: null,
                        date: 'December 17, 1999',
                        pages: 25,
                    },
                    {
                        title: () => 'Aquarium (アクアリウム / Akuariumu)',
                        cover: null,
                        date: 'December 17, 1999',
                        pages: 27,
                    },
                ],
            },
            {
                title: () =>
                    'The Fourth Child (四人目の適格者 / Yoninme no Tekikakusha)',
                cover: volumeCover,
                chapters: [
                    {
                        title: () =>
                            'The Fourth Child (四人目の適格者 / Yoninme no Tekikakusha)',
                        cover: null,
                        date: 'December 15, 2000',
                        pages: 38,
                    },
                    {
                        title: () =>
                            'Light, Then Shadow (光、そして影 / Hikari, Soshite Kage)',
                        cover: null,
                        date: 'December 15, 2000',
                        pages: 27,
                    },
                    {
                        title: () => 'Confession (告白 / Kokuhaku)',
                        cover: null,
                        date: 'December 15, 2000',
                        pages: 57 - 27,
                    },
                    {
                        title: () => 'The Gift (ギフト / Gifuto)',
                        cover: null,
                        date: 'December 15, 2000',
                        pages: 27,
                    },
                    {
                        title: () => 'Ambush (迎撃 / Geigeki)',
                        cover: null,
                        date: 'December 15, 2000',
                        pages: 57 - 27,
                    },
                    {
                        title: () =>
                            'The Dummy System (ダミーシステム / Damī Shisutemu)',
                        cover: null,
                        date: 'December 15, 2000',
                        pages: 23,
                    },
                    {
                        title: () =>
                            'Staining the Twilight Black (黄昏を黒に染めて… / Tasogare o Kuro ni Somete...)',
                        cover: null,
                        date: 'December 15, 2000',
                        pages: 48 - 23,
                    },
                ],
            },
            {
                title: () => "A Man's Battle (男の戦い / Otoko no Tatakai)",
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Fist (フィスト / Fisuto)',
                        cover: null,
                        date: 'December 1, 2001',
                        pages: 31,
                    },
                    {
                        title: () => 'Ashen Skies (灰色の空 / Hai-iro no Sora)',
                        cover: null,
                        date: 'December 1, 2001',
                        pages: 49 - 31,
                    },
                    {
                        title: () => 'Cross-Examination (尋問 / Jinmon)',
                        cover: null,
                        date: 'December 1, 2001',
                        pages: 29,
                    },
                    {
                        title: () => 'Atonement (贖罪 / Shokuzai)',
                        cover: null,
                        date: 'December 1, 2001',
                        pages: 29,
                    },
                    {
                        title: () =>
                            "A Man's Battle (男の戦い / Otoko no Tatakai)",
                        cover: null,
                        date: 'December 1, 2001',
                        pages: 27,
                    },
                    {
                        title: () =>
                            'The Awakening, Part 1 (覚醒・前編 / Kakusei, Zenpen)',
                        cover: null,
                        date: 'December 1, 2001',
                        pages: 32,
                    },
                    {
                        title: () =>
                            'The Awakening, Part 2 (覚醒・後編 / Kakusei, Kōhen)',
                        cover: null,
                        date: 'December 1, 2001',
                        pages: 22,
                    },
                    {
                        title: () => 'Eradication (消滅 / Shōmetsu)',
                        cover: null,
                        date: 'December 1, 2001',
                        pages: 47 - 22,
                    },
                ],
            },
            {
                title: () => 'Mother (MOTHER)',
                cover: volumeCover,
                chapters: [
                    {
                        title: () => '…Kiss (•••Kiss)',
                        cover: null,
                        date: 'December 19, 2002',
                        pages: 33,
                    },
                    {
                        title: () =>
                            'Into the Heart… (心の中へ… / Kokoro no Naka e...)',
                        cover: null,
                        date: 'December 19, 2002',
                        pages: 25,
                    },
                    {
                        title: () => 'Mother (MOTHER)',
                        cover: null,
                        date: 'December 19, 2002',
                        pages: 20,
                    },
                    {
                        title: () => 'Flashback (回想 / Kaisō)',
                        cover: null,
                        date: 'December 19, 2002',
                        pages: 25,
                    },
                    {
                        title: () =>
                            'A Giant Made of Light (光の巨人 / Hikari no Kyojin)',
                        cover: null,
                        date: 'December 19, 2002',
                        pages: 21,
                    },
                    {
                        title: () =>
                            'The Birth of NERV (ネルフ誕生 / Nerufu Tanjō)',
                        cover: null,
                        date: 'December 19, 2002',
                        pages: 21,
                    },
                    {
                        title: () => 'Message (伝言 / Dengon)',
                        cover: null,
                        date: 'December 19, 2002',
                        pages: 24,
                    },
                    {
                        title: () => 'Of Jealousy (ジェラシー / Jerashī)',
                        cover: null,
                        date: 'December 19, 2002',
                        pages: 29,
                    },
                ],
            },
            {
                title: () =>
                    'The Fifth Child (フィフス・チルドレン / Fifusu Chirudoren)',
                cover: volumeCover,
                chapters: [
                    {
                        title: () =>
                            'The Fifth Child (フィフス・チルドレン / Fifusu Chirudoren)',
                        cover: null,
                        date: 'April 3, 2004',
                        pages: 33,
                    },
                    {
                        title: () => 'Rejection (拒絶 / Kyozetsu)',
                        cover: null,
                        date: 'April 3, 2004',
                        pages: 27,
                    },
                    {
                        title: () => 'Pride',
                        cover: null,
                        date: 'April 3, 2004',
                        pages: 26,
                    },
                    {
                        title: () => 'Doll',
                        cover: null,
                        date: 'April 3, 2004',
                        pages: 27,
                    },
                    {
                        title: () => 'The Spear of Longinus',
                        cover: null,
                        date: 'April 3, 2004',
                        pages: 25,
                    },
                    {
                        title: () => 'Distance',
                        cover: null,
                        date: 'April 3, 2004',
                        pages: 25,
                    },
                    {
                        title: () => 'Returning Fire',
                        cover: null,
                        date: 'April 3, 2004',
                        pages: 27,
                    },
                ],
            },
            {
                title: () => 'Tears (涙 / Namida)',
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Tears',
                        cover: null,
                        date: 'February 25, 2006',
                        pages: 33,
                    },
                    {
                        title: () => 'I Want to Become One',
                        cover: null,
                        date: 'February 25, 2006',
                        pages: 23,
                    },
                    {
                        title: () => 'Without Reaching Your Heart',
                        cover: null,
                        date: 'February 25, 2006',
                        pages: 27,
                    },
                    {
                        title: () => 'Twisted Night',
                        cover: null,
                        date: 'February 25, 2006',
                        pages: 26,
                    },
                    {
                        title: () => 'Mixing',
                        cover: null,
                        date: 'February 25, 2006',
                        pages: 20,
                    },
                    {
                        title: () => 'Tainted Blood',
                        cover: null,
                        date: 'February 25, 2006',
                        pages: 21,
                    },
                    {
                        title: () => 'A Gathering of Nothingness',
                        cover: null,
                        date: 'February 25, 2006',
                        pages: 22,
                    },
                ],
            },
            {
                title: () =>
                    'Memories Within My Palm (手のひらの記憶 / Te no Hira no Kioku)',
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Descendent of Adam',
                        cover: null,
                        date: 'June 19, 2007',
                        pages: 30,
                    },
                    {
                        title: () => 'The Last Messenger',
                        cover: null,
                        date: 'June 19, 2007',
                        pages: 27,
                    },
                    {
                        title: () => 'Reaching the Boundary',
                        cover: null,
                        date: 'June 19, 2007',
                        pages: 29,
                    },
                    {
                        title: () => 'Memories Within My Palm',
                        cover: null,
                        date: 'June 19, 2007',
                        pages: 27,
                    },
                    {
                        title: () => 'Broken Heart',
                        cover: null,
                        date: 'June 19, 2007',
                        pages: 26,
                    },
                    {
                        title: () => 'Final Enemy',
                        cover: null,
                        date: 'June 19, 2007',
                        pages: 15 + 12,
                    },
                ],
            },
            {
                title: () => 'Father and Child (父と子 / Chan to Ko)',
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Genocide',
                        cover: null,
                        date: 'April 3, 2010',
                        pages: 22 + 4,
                    },
                    {
                        title: () => 'Father and Child',
                        cover: null,
                        date: 'April 3, 2010',
                        pages: 26,
                    },
                    {
                        title: () => 'The Promised Time',
                        cover: null,
                        date: 'April 3, 2010',
                        pages: 28,
                    },
                    {
                        title: () => 'Encounter',
                        cover: null,
                        date: 'April 3, 2010',
                        pages: 13 + 17,
                    },
                    {
                        title: () => 'Enemy From The Sky',
                        cover: null,
                        date: 'April 3, 2010',
                        pages: 19,
                    },
                    {
                        title: () => 'The Last Instruction',
                        cover: null,
                        date: 'April 3, 2010',
                        pages: 24,
                    },
                    {
                        title: () => 'Call And Response',
                        cover: null,
                        date: 'April 3, 2010',
                        pages: 25,
                    },
                ],
            },
            {
                title: () => 'Calling',
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Calling',
                        cover: null,
                        date: 'November 2, 2012',
                        pages: 29 + 16,
                    },
                    {
                        title: () => 'Betrayal',
                        cover: null,
                        date: 'November 2, 2012',
                        pages: 26,
                    },
                    {
                        title: () => 'The Ceremony Begins',
                        cover: null,
                        date: 'November 2, 2012',
                        pages: 21,
                    },
                    {
                        title: () => 'Rejection',
                        cover: null,
                        date: 'November 2, 2012',
                        pages: 17,
                    },
                    {
                        title: () => 'Black Moon',
                        cover: null,
                        date: 'November 2, 2012',
                        pages: 22,
                    },
                    {
                        title: () => 'Face-To-Face',
                        cover: null,
                        date: 'November 2, 2012',
                        pages: 15 + 18,
                    },
                    {
                        title: () => 'Memories Of Summer',
                        cover: null,
                        date: 'November 2, 2012',
                        pages: 23,
                    },
                ],
            },
            {
                title: () => 'The Journey Begins (旅立ち / Tabidachi)',
                cover: volumeCover,
                chapters: [
                    {
                        title: () => 'Where Light Returns',
                        cover: null,
                        date: 'November 20, 2014',
                        pages: 22,
                    },
                    {
                        title: () => 'Birthday',
                        cover: null,
                        date: 'November 20, 2014',
                        pages: 24,
                    },
                    {
                        title: () => 'Sea of Life',
                        cover: null,
                        date: 'November 20, 2014',
                        pages: 24,
                    },
                    {
                        title: () => 'Palms',
                        cover: null,
                        date: 'November 20, 2014',
                        pages: 15 + 20,
                    },
                    {
                        title: () => 'Thank You ∞ Goodbye',
                        cover: null,
                        date: 'November 20, 2014',
                        pages: 11,
                    },
                    {
                        title: () => 'The Journey Begins',
                        cover: null,
                        date: 'November 20, 2014',
                        pages: 25,
                    },
                    {
                        title: () => 'Eden In Summer',
                        cover: null,
                        date: 'November 20, 2014',
                        pages: 33,
                    },
                ],
            },
        ] as const satisfies Tuple<Volume, typeof VOLUMES_TOTAL>,
        splitChapters: {
            3: 24,
            7: 9,
            15: 25,
            19: 20,
            21: 14,
            75: 15,
        },
        wikiBase: 'https://wiki.evageeks.org/',
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
