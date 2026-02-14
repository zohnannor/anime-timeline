import { SettingsValues } from '@shared/contexts/SettingsContext';
import { isMobileDevice } from '@shared/lib/util';
import { SmallImages } from '@timelines/types';

export const SCROLLER_WIDTH = 1300;
export const HEADERS_WIDTH = 150;

export const LARGE_FONT_SIZE = 500;
export const SMALL_FONT_SIZE = 45;

export const TIMELINE_HEIGHT = 200;

export const FLOATING_BUTTONS: {
    filename: Exclude<keyof SmallImages, 'scroller-or-favicon'>;
    title: string;
    option: keyof SettingsValues;
}[] = [
    { filename: 'read-info', title: 'Read info', option: 'infoBoxOpen' },
    {
        filename: 'toggle-unbounded-chapter-width',
        title: 'Toggle unbounded chapter width',
        option: 'unboundedChapterWidth',
    },
    // include cross-lines button only on desktop
    ...(!isMobileDevice() ?
        [
            {
                filename: 'toggle-cross-lines',
                title: 'Toggle cross-lines',
                option: 'showCrosslines',
            } as const,
        ]
    :   []),
    {
        filename: 'open-chapter-calendar',
        title: 'Open chapter calendar',
        option: 'calendarOpen',
    },
    {
        filename: 'toggle-always-show-titles',
        title: 'Toggle always show titles',
        option: 'showTitles',
    },
    {
        filename: 'capture-timeline',
        title: 'Capture timeline (Save as a PNG)',
        option: 'captureTimelineModalOpen',
    },
];
