import { SettingsValues } from '../shared/contexts/SettingsContext';
import { isMobileDevice } from '../shared/lib/util';
import { AOT_TIMELINE } from './data/aot';
import { BERSERK_TIMELINE } from './data/berserk';
import { CSM_TIMELINE } from './data/csm';
import { DEATHNOTE_TIMELINE } from './data/deathnote';
import { EVA_TIMELINE } from './data/eva';
import { FP_TIMELINE } from './data/fp';
import { FRIEREN_TIMELINE } from './data/frieren';
import { OPM_TIMELINE } from './data/opm';
import { AnimeTitle, SmallImages, Timeline } from './types';

const TIMELINE: Record<AnimeTitle, Timeline> = {
    csm: CSM_TIMELINE,
    berserk: BERSERK_TIMELINE,
    fp: FP_TIMELINE,
    frieren: FRIEREN_TIMELINE,
    eva: EVA_TIMELINE,
    aot: AOT_TIMELINE,
    opm: OPM_TIMELINE,
    deathnote: DEATHNOTE_TIMELINE,
};

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

export default TIMELINE;
