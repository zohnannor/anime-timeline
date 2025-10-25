import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { AnimeTitleSelectorModal } from './components/AnimeTitleSelector';
import { CalendarModal } from './components/CalendarModal';
import { CaptureTimelineModal } from './components/CaptureTimelineModal';
import { FloatingButton, FloatingButtons } from './components/FloatingButtons';
import { InfoBox } from './components/InfoBox';
import { Scroller } from './components/Scroller';
import { TimeLineHeaders } from './components/TimeLineHeaders';
import { TimelineSection } from './components/TimelineSection';
import { FLOATING_BUTTONS, TIMELINE } from './constants';
import { maxHeight } from './helpers';
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
    const { infoBoxOpen, calendarOpen, captureTimelineModalOpen, animeTitle } =
        useSettings();
    const [renderUi, setRenderUi] = useState(true);

    const timeline = TIMELINE[animeTitle].data;

    const handleScroll = useCallback(
        (e: WheelEvent) => {
            if (infoBoxOpen || calendarOpen || captureTimelineModalOpen) return;
            document.body.scrollLeft += e.deltaY;
        },
        [infoBoxOpen, calendarOpen]
    );

    useEffect(() => {
        window.addEventListener('wheel', handleScroll);
        return () => window.removeEventListener('wheel', handleScroll);
    }, [handleScroll]);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.code == 'KeyV') {
            setRenderUi(p => !p);
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        document.documentElement.style.setProperty(
            '--max-height',
            `${maxHeight(animeTitle)}`
        );
        document.title = `${timeline.title} Timeline`;
        document.head.querySelector<HTMLLinkElement>(
            "link[rel~='icon']"
        )!.href = `./${animeTitle}/${timeline.smallImages['scroller-or-favicon']}.webp`;
    }, [animeTitle]);

    return (
        <>
            <TimeLineHeaders $animeTitle={animeTitle} />
            <AnimeTitleSelectorModal />
            <CalendarModal />
            <CaptureTimelineModal />
            <InfoBox />
            <AppContainer className='appContainer'>
                {renderUi && (
                    <FloatingButtons>
                        <FloatingButton
                            key='animeTitleSelectorOpen'
                            filename={
                                timeline.smallImages['scroller-or-favicon']
                            }
                            title='Select Manga/Anime Title'
                            option='animeTitleSelectorOpen'
                        />
                        {FLOATING_BUTTONS.map(({ filename, title, option }) => (
                            <FloatingButton
                                key={filename}
                                filename={timeline.smallImages[filename]}
                                title={title}
                                option={option}
                            />
                        ))}
                    </FloatingButtons>
                )}
                {Object.values(TIMELINE[animeTitle].layout).map(item => (
                    <TimelineSection key={item.type} {...item} />
                ))}
                {renderUi && width > 768 && <Scroller />}
            </AppContainer>
        </>
    );
};

export default App;
