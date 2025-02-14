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
}

export const SettingsContext = createContext<Settings>({
    showCrosslines: false,
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: FC<PropsWithChildren> = ({ children }) => {
    const [showCrosslines, setShowCrosslines] = useState(false);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.code === 'Space') {
            setShowCrosslines(p => !p);
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <SettingsContext.Provider value={{ showCrosslines }}>
            {children}
        </SettingsContext.Provider>
    );
};
