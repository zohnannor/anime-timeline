import { useCallback, useEffect } from 'react';
import styled from 'styled-components';

import { Arcs } from './components/Arcs';
import { CalendarModal } from './components/CalendarModal';
import { FloatingButton, FloatingButtons } from './components/FloatingButtons';
import { InfoBox } from './components/InfoBox';
import { Scroller } from './components/Scroller';
import { Seasons } from './components/Seasons';
import { Timeline } from './components/Timeline';
import { TimeLineHeaders } from './components/TimeLineHeaders';
import { Volumes } from './components/Volumes';
import useWindowSize from './hooks/useWindowSize';
import { FunctionSettings, useSettings } from './providers/SettingsProvider';
import { Chapters } from './components/Chapters';

const BUTTONS: {
    filename: string;
    title: string;
    option: keyof FunctionSettings;
}[] = [
    { filename: 'pochita2', title: 'Read info', option: 'openInfoBox' },
    {
        filename: 'pochita3',
        title: 'Toggle unbounded chapter width',
        option: 'setUnboundedChapterWidth',
    },
    {
        filename: 'pochita4',
        title: 'Open chapter calendar',
        option: 'openCalendar',
    },
    {
        filename: 'pochita5',
        title: 'Toggle always show titles',
        option: 'setShowTitles',
    },
];

const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    user-select: none;
`;

const App: React.FC = () => {
    const { width } = useWindowSize();
    const { infoBoxOpen, calendarOpen } = useSettings();

    const handleScroll = useCallback(
        (e: WheelEvent) => {
            if (infoBoxOpen || calendarOpen) return;
            document.body.scrollLeft += e.deltaY;
        },
        [infoBoxOpen, calendarOpen]
    );

    useEffect(() => {
        window.addEventListener('wheel', handleScroll);
        return () => window.removeEventListener('wheel', handleScroll);
    }, [handleScroll]);

    return (
        <>
            <TimeLineHeaders />
            <CalendarModal />
            <InfoBox />
            <AppContainer className='appContainer'>
                <FloatingButtons>
                    {BUTTONS.map(({ filename, title, option }) => (
                        <FloatingButton
                            key={filename}
                            filename={filename}
                            title={title}
                            option={option}
                        />
                    ))}
                </FloatingButtons>
                <Seasons />
                <Arcs />
                <Timeline />
                <Chapters />
                <Volumes />
                {width > 768 && <Scroller />}
            </AppContainer>
        </>
    );
};

export default App;
