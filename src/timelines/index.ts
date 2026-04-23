import { SettingsValues } from '@shared/contexts/SettingsContext';
import { isMobileDevice } from '@shared/lib/util';
import { Icons } from '@timelines/types';

export const SCROLLER_WIDTH = 1300;
export const HEADERS_WIDTH = 150;

export const LARGE_FONT_SIZE = 500;
export const SMALL_FONT_SIZE = 45;

export const TIMELINE_HEIGHT = 200;

export const FLOATING_BUTTONS: {
    icon: Exclude<keyof Icons, 'favicon' | 'scroller'>;
    title: string;
    option: keyof SettingsValues;
}[] = [
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
    ...(isMobileDevice() ?
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
    {
        icon: 'capture-timeline',
        title: 'Capture timeline (Save as a PNG)',
        option: 'captureTimelineModalOpen',
    },
];
