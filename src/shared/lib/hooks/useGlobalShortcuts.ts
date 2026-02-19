import { useEffect } from 'react';

import { useSettings } from '@shared/contexts/SettingsContext';

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

    useEffect(() => {
        const openModals: [
            boolean,
            React.Dispatch<React.SetStateAction<boolean>>,
        ][] = [
            [infoBoxOpen, setInfoBoxOpen],
            [calendarOpen, setCalendarOpen],
            [captureTimelineModalOpen, setCaptureTimelineModalOpen],
            [animeTitleSelectorOpen, setAnimeTitleSelectorOpen],
        ];

        const handleKeyDown = (ev: KeyboardEvent) => {
            if (ev.ctrlKey && ev.code === 'KeyC') {
                setShowCrosslines(state => !state);
            }

            if (ev.code === 'Escape') {
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
        setInfoBoxOpen,
        calendarOpen,
        setCalendarOpen,
        captureTimelineModalOpen,
        setCaptureTimelineModalOpen,
        animeTitleSelectorOpen,
        setAnimeTitleSelectorOpen,
        setShowCrosslines,
    ]);
};

export default useGlobalShortcuts;
