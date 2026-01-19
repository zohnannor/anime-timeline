import {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

import { AnimeTitle, TITLES } from '../constants';

export type Settings = {
    showCrosslines: boolean;
    setShowCrosslines: React.Dispatch<React.SetStateAction<boolean>>;
    infoBoxOpen: boolean;
    setInfoBoxOpen: React.Dispatch<React.SetStateAction<boolean>>;
    unboundedChapterWidth: boolean;
    setUnboundedChapterWidth: React.Dispatch<React.SetStateAction<boolean>>;
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
    unboundedChapterWidth: 'setUnboundedChapterWidth',
    calendarOpen: 'setCalendarOpen',
    showTitles: 'setShowTitles',
    captureTimelineModalOpen: 'setCaptureTimelineModalOpen',
    animeTitleSelectorOpen: 'setAnimeTitleSelectorOpen',
};

const SettingsContext = createContext<Settings>({
    showCrosslines: false,
    setShowCrosslines: () => {},
    infoBoxOpen: false,
    setInfoBoxOpen: () => {},
    unboundedChapterWidth: false,
    setUnboundedChapterWidth: () => {},
    calendarOpen: false,
    setCalendarOpen: () => {},
    showTitles: true,
    setShowTitles: () => {},
    captureTimelineModalOpen: false,
    setCaptureTimelineModalOpen: () => {},
    animeTitle: 'csm',
    setAnimeTitle: () => {},
    animeTitleSelectorOpen: false,
    setAnimeTitleSelectorOpen: () => {},
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [showCrosslines, setShowCrosslines] = useState(false);
    const [infoBoxOpen, setInfoBoxOpen] = useState(() => {
        const firstVisit = window.localStorage.getItem('firstVisit') === null;
        if (firstVisit) {
            window.localStorage.setItem('firstVisit', 'false');
        }
        return firstVisit;
    });
    const [unboundedChapterWidth, setUnboundedChapterWidth] = useState(false);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [captureTimelineModalOpen, setCaptureTimelineModalOpen] =
        useState(false);
    const [showTitles, setShowTitlesRaw] = useState(
        // default to true if not set (first visit), otherwise get from storage
        () => window.localStorage.getItem('showTitles') !== 'false',
    );
    const [animeTitle, setAnimeTitleRaw] = useState<AnimeTitle>(() => {
        const params = new URLSearchParams(document.location.search);
        const animeTitle = params.get('title');
        if (animeTitle && TITLES.includes(animeTitle as AnimeTitle)) {
            return animeTitle as AnimeTitle;
        }
        window.history.replaceState({}, '', `?title=csm`);
        return 'csm';
    });
    const [animeTitleSelectorOpen, setAnimeTitleSelectorOpen] = useState(false);

    const setShowTitles = (show: React.SetStateAction<boolean>) => {
        if (typeof show === 'function') {
            show = show(showTitles);
        }
        window.localStorage.setItem('showTitles', show.toString());
        setShowTitlesRaw(show);
    };

    const openInfoBox = (open: React.SetStateAction<boolean>) => {
        if (open) {
            window.history.pushState({ infoBoxOpen: true }, '');
        } else {
            if (window.history.state?.infoBoxOpen) {
                window.history.back();
            }
        }
        setInfoBoxOpen(open);
    };

    const openCalendar = (open: React.SetStateAction<boolean>) => {
        if (open) {
            window.history.pushState({ calendarOpen: true }, '');
        } else {
            if (window.history.state?.calendarOpen) {
                window.history.back();
            }
        }
        setCalendarOpen(open);
    };

    const openCaptureTimelineModal = (open: React.SetStateAction<boolean>) => {
        if (open) {
            window.history.pushState({ captureTimelineModal: true }, '');
        } else {
            if (window.history.state?.captureTimelineModal) {
                window.history.back();
            }
        }
        setCaptureTimelineModalOpen(open);
    };

    const openAnimeTitleSelector = (open: React.SetStateAction<boolean>) => {
        if (open) {
            window.history.pushState({ animeTitleSelector: true }, '');
        } else {
            if (window.history.state?.animeTitleSelector) {
                window.history.back();
            }
        }
        setAnimeTitleSelectorOpen(open);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.code == 'KeyC') {
            setShowCrosslines(p => !p);
        }

        if (e.code === 'Escape' && infoBoxOpen) {
            openInfoBox(false);
            openCalendar(false);
            openCaptureTimelineModal(false);
        }
    };

    const handlePopState = useCallback((e: PopStateEvent) => {
        setInfoBoxOpen(!!e.state?.infoBoxOpen);
        setCalendarOpen(!!e.state?.calendarOpen);
        setCaptureTimelineModalOpen(!!e.state?.captureTimelineModal);
        setAnimeTitleSelectorOpen(!!e.state?.animeTitleSelectorOpen);
    }, []);

    useEffect(() => {
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [handlePopState]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [
        infoBoxOpen,
        calendarOpen,
        captureTimelineModalOpen,
        animeTitleSelectorOpen,
    ]);

    const setAnimeTitle = (title: React.SetStateAction<AnimeTitle>) => {
        setAnimeTitleRaw(title);
        window.history.replaceState({}, '', `?title=${title}`);
    };

    return (
        <SettingsContext.Provider
            value={{
                showCrosslines,
                setShowCrosslines,
                infoBoxOpen,
                setInfoBoxOpen: openInfoBox,
                unboundedChapterWidth,
                setUnboundedChapterWidth,
                calendarOpen,
                setCalendarOpen: openCalendar,
                showTitles,
                setShowTitles,
                captureTimelineModalOpen,
                setCaptureTimelineModalOpen: openCaptureTimelineModal,
                animeTitle,
                setAnimeTitle,
                animeTitleSelectorOpen,
                setAnimeTitleSelectorOpen: openAnimeTitleSelector,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};
