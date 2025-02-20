import React, {
    createContext,
    FC,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

interface Settings {
    showCrosslines: boolean;
    infoBoxOpen: boolean;
    openInfoBox: (open: boolean) => void;
    unboundedChapterWidth: boolean;
    setUnboundedChapterWidth: React.Dispatch<React.SetStateAction<boolean>>;
    calendarOpen: boolean;
    openCalendar: (open: boolean) => void;
    showTitles: boolean;
    setShowTitles: React.Dispatch<React.SetStateAction<boolean>>;
}

const SettingsContext = createContext<Settings>({
    showCrosslines: false,
    infoBoxOpen: false,
    openInfoBox: () => {},
    unboundedChapterWidth: false,
    setUnboundedChapterWidth: () => {},
    calendarOpen: false,
    openCalendar: () => {},
    showTitles: true,
    setShowTitles: () => {},
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: FC<PropsWithChildren> = ({ children }) => {
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
    const [showTitles, setShowTitlesRaw] = useState(() => {
        // default to true if not set (first visit), otherwise get from storage
        return window.localStorage.getItem('showTitles') !== 'false';
    });

    const setShowTitles = (show: React.SetStateAction<boolean>) => {
        if (typeof show === 'function') {
            show = show(showTitles);
        }
        window.localStorage.setItem('showTitles', show.toString());
        setShowTitlesRaw(show);
    };

    const openInfoBox = (open: boolean) => {
        if (open) {
            window.history.pushState({ infoBoxOpen: true }, '');
        } else {
            if (window.history.state?.infoBoxOpen) {
                window.history.back();
            }
        }
        setInfoBoxOpen(open);
    };

    const openCalendar = (open: boolean) => {
        if (open) {
            window.history.pushState({ calendarOpen: true }, '');
        } else {
            if (window.history.state?.calendarOpen) {
                window.history.back();
            }
        }
        setCalendarOpen(open);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.code === 'Space') {
            setShowCrosslines(p => !p);
        }

        if (e.code === 'Escape' && infoBoxOpen) {
            openInfoBox(false);
        }
    };

    const handlePopState = useCallback((e: PopStateEvent) => {
        setInfoBoxOpen(!!e.state?.infoBoxOpen);
        setCalendarOpen(!!e.state?.calendarOpen);
    }, []);

    useEffect(() => {
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [handlePopState]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [infoBoxOpen, calendarOpen]);

    return (
        <SettingsContext.Provider
            value={{
                showCrosslines,
                infoBoxOpen,
                openInfoBox,
                unboundedChapterWidth,
                setUnboundedChapterWidth,
                calendarOpen,
                openCalendar,
                showTitles,
                setShowTitles,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};
