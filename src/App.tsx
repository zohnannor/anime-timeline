import { useCallback, useEffect } from 'react';
import styled from 'styled-components';

import { CalendarModal } from './components/CalendarModal';
import { FloatingButton, FloatingButtons } from './components/FloatingButtons';
import { InfoBox } from './components/InfoBox';
import { Scroller } from './components/Scroller';
import { TimeLineHeaders } from './components/TimeLineHeaders';
import { TimelineSection } from './components/TimelineSection';
import { FLOATING_BUTTONS, TIMELINE_INFO } from './constants';
import useWindowSize from './hooks/useWindowSize';
import { useSettings } from './providers/SettingsProvider';

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
                    {FLOATING_BUTTONS.map(({ filename, title, option }) => (
                        <FloatingButton
                            key={filename}
                            filename={filename}
                            title={title}
                            option={option}
                        />
                    ))}
                </FloatingButtons>
                {TIMELINE_INFO.map(item => (
                    <TimelineSection key={item.type} {...item} />
                ))}
                {width > 768 && <Scroller />}
            </AppContainer>
        </>
    );
};

export default App;
