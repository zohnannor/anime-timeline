import { createContext, use } from 'react';

import { AnimeTitle } from '@timelines/types';

export type Settings = {
    showCrosslines: boolean;
    setShowCrosslines: React.Dispatch<React.SetStateAction<boolean>>;
    infoBoxOpen: boolean;
    setInfoBoxOpen: React.Dispatch<React.SetStateAction<boolean>>;
    unboundChapterWidth: boolean;
    setUnboundChapterWidth: React.Dispatch<React.SetStateAction<boolean>>;
    calendarOpen: boolean;
    setCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    showTitles: boolean;
    setShowTitles: React.Dispatch<React.SetStateAction<boolean>>;
    captureTimelineModalOpen: boolean;
    setCaptureTimelineModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    animeTitle: AnimeTitle;
    setAnimeTitle: React.Dispatch<React.SetStateAction<AnimeTitle>>;
    animeTitleSelectorOpen: boolean;
    setAnimeTitleSelectorOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

// ☝🤓

type Setter<T extends string> =
    T extends `${infer First}${infer Rest}` ? `set${Uppercase<First>}${Rest}`
    :   never;

export type SettingsValues = {
    [Key in keyof Settings as Settings[Key] extends boolean ?
        Setter<Key> extends keyof Settings ?
            Key
        :   never
    :   never]: Settings[Key];
};

type SettingsValuesSetters = {
    [Key in keyof Settings as Settings[Key] extends boolean ?
        Setter<Key> extends keyof Settings ?
            Key
        :   never
    :   never]: Setter<Key>;
};

export const SETTINGS_FUNCTIONS: SettingsValuesSetters = {
    showCrosslines: 'setShowCrosslines',
    infoBoxOpen: 'setInfoBoxOpen',
    unboundChapterWidth: 'setUnboundChapterWidth',
    calendarOpen: 'setCalendarOpen',
    showTitles: 'setShowTitles',
    captureTimelineModalOpen: 'setCaptureTimelineModalOpen',
    animeTitleSelectorOpen: 'setAnimeTitleSelectorOpen',
};

const dummy = () => {
    /* empty */
};

export const SettingsContext = createContext<Settings>({
    showCrosslines: false,
    setShowCrosslines: dummy,
    infoBoxOpen: false,
    setInfoBoxOpen: dummy,
    unboundChapterWidth: false,
    setUnboundChapterWidth: dummy,
    calendarOpen: false,
    setCalendarOpen: dummy,
    showTitles: true,
    setShowTitles: dummy,
    captureTimelineModalOpen: false,
    setCaptureTimelineModalOpen: dummy,
    animeTitle: 'csm',
    setAnimeTitle: dummy,
    animeTitleSelectorOpen: false,
    setAnimeTitleSelectorOpen: dummy,
});

export const useSettings = () => use(SettingsContext);
