import {
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
}

const SettingsContext = createContext<Settings>({
    showCrosslines: false,
    infoBoxOpen: false,
    openInfoBox: () => {},
    unboundedChapterWidth: false,
    setUnboundedChapterWidth: () => {},
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: FC<PropsWithChildren> = ({ children }) => {
    const [showCrosslines, setShowCrosslines] = useState(false);
    const [infoBoxOpen, setInfoBoxOpen] = useState(false);
    const [unboundedChapterWidth, setUnboundedChapterWidth] = useState(false);

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

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.code === 'Space') {
            setShowCrosslines(p => !p);
        }

        if (e.code === 'Escape' && infoBoxOpen) {
            openInfoBox(false);
        }
    };

    const handlePopState = useCallback(
        (e: PopStateEvent) => setInfoBoxOpen(!!e.state?.infoBoxOpen),
        []
    );

    useEffect(() => {
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [handlePopState]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [infoBoxOpen]);

    return (
        <SettingsContext.Provider
            value={{
                showCrosslines,
                infoBoxOpen,
                openInfoBox,
                unboundedChapterWidth,
                setUnboundedChapterWidth,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};
