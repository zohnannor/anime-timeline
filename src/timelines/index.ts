import { SettingsValues } from '@shared/contexts/SettingsContext';
import { Icons } from '@timelines/types';

export const SCROLLER_WIDTH = 1300;
export const HEADERS_WIDTH = 150;

export const LARGE_FONT_SIZE = 500;
export const SMALL_FONT_SIZE = 45;

export const TIMELINE_HEIGHT = 200;

export type FloatingButtonConfig = {
    icon: Exclude<keyof Icons, 'favicon' | 'scroller'>;
    title: string;
    option: keyof SettingsValues;
};

export const getFloatingButtons = (
    isMobileDevice: boolean,
    hasExtraChapters: boolean,
): FloatingButtonConfig[] => [
    {
        icon: 'select-title',
        title: 'Select Manga/Anime Title',
        option: 'animeTitleSelectorOpen',
    },
    { icon: 'read-info', title: 'Read info', option: 'infoBoxOpen' },
    {
        icon: 'toggle-unbound-chapter-width',
        title: 'Toggle unbound chapter width',
        option: 'unboundChapterWidth',
    },
    // include cross-lines button only on desktop
    ...(isMobileDevice ?
        []
    :   [
            {
                icon: 'toggle-cross-lines',
                title: 'Toggle cross-lines',
                option: 'showCrosslines',
            } as const,
        ]),
    {
        icon: 'open-chapter-calendar',
        title: 'Open chapter calendar',
        option: 'calendarOpen',
    },
    {
        icon: 'toggle-always-show-titles',
        title: 'Toggle always show titles',
        option: 'showTitles',
    },
    // include extra chapters button only if the title has extra chapters
    ...(hasExtraChapters ?
        [
            {
                icon: 'toggle-extra-chapters',
                title: 'Toggle extra chapters visibility',
                option: 'showExtraChapters',
            } as const,
        ]
    :   []),
    {
        icon: 'capture-timeline',
        title: 'Capture timeline (Save as a PNG)',
        option: 'captureTimelineModalOpen',
    },
];
