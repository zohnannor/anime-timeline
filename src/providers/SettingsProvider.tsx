import {
    createContext,
    FC,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from 'react';

interface Settings {
    showCrosslines: boolean;
    infoBoxOpen: boolean;
    openInfoBox: (open: boolean) => void;
}

export const SettingsContext = createContext<Settings>({
    showCrosslines: false,
    infoBoxOpen: false,
    openInfoBox: () => {},
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: FC<PropsWithChildren> = ({ children }) => {
    const [showCrosslines, setShowCrosslines] = useState(false);
    const [infoBoxOpen, setInfoBoxOpen] = useState(false);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.code === 'Space') {
            setShowCrosslines(p => !p);
        }

        if (e.code === 'Escape' && infoBoxOpen) {
            setInfoBoxOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <SettingsContext.Provider
            value={{
                showCrosslines,
                infoBoxOpen,
                openInfoBox: setInfoBoxOpen,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};
