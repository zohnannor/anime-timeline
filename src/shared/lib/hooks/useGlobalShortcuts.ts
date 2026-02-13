import { useEffect } from 'react';

import useSettings from '../../contexts/SettingsContext';

const useGlobalShortcuts = () => {
    const {
        setShowCrosslines,
        infoBoxOpen,
        calendarOpen,
        captureTimelineModalOpen,
        animeTitleSelectorOpen,
        setInfoBoxOpen,
        setCalendarOpen,
        setCaptureTimelineModalOpen,
        setAnimeTitleSelectorOpen,
    } = useSettings();

    const openModals: [
        boolean,
        React.Dispatch<React.SetStateAction<boolean>>,
    ][] = [
        [infoBoxOpen, setInfoBoxOpen],
        [calendarOpen, setCalendarOpen],
        [captureTimelineModalOpen, setCaptureTimelineModalOpen],
        [animeTitleSelectorOpen, setAnimeTitleSelectorOpen],
    ];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.code === 'KeyC') {
                setShowCrosslines(p => !p);
            }

            if (e.code === 'Escape') {
                for (const [isOpen, close] of openModals) {
                    if (isOpen) {
                        close(false);
                    }
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [
        infoBoxOpen,
        calendarOpen,
        captureTimelineModalOpen,
        animeTitleSelectorOpen,
        setShowCrosslines,
        setInfoBoxOpen,
        setCalendarOpen,
        setCaptureTimelineModalOpen,
        setAnimeTitleSelectorOpen,
    ]);
};

export default useGlobalShortcuts;
