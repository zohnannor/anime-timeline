import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { FloatingButton, FloatingButtons } from '../modules/FloatingButtons';
import {
    AnimeTitleSelectorModal,
    CalendarModal,
    CaptureTimelineModal,
    InfoModal,
} from '../modules/modals';
import { Scroller } from '../modules/Scroller';
import { TimeLineHeaders, TimelineSection } from '../modules/timeline';
import useSettings from '../shared/contexts/SettingsContext';
import { maxHeight } from '../shared/lib/helpers';
import { useGlobalShortcuts, useWindowSize } from '../shared/lib/hooks';
import { FLOATING_BUTTONS, TIMELINE } from '../timelines';

const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    user-select: none;
`;

const App: React.FC = () => {
    const { width } = useWindowSize();
    const {
        infoBoxOpen,
        calendarOpen,
        captureTimelineModalOpen,
        animeTitleSelectorOpen,
        animeTitle,
    } = useSettings();
    const [renderUi, setRenderUi] = useState(true);

    const timeline = TIMELINE[animeTitle].data;

    const handleScroll = useCallback(
        (e: WheelEvent) => {
            if (
                infoBoxOpen ||
                calendarOpen ||
                captureTimelineModalOpen ||
                animeTitleSelectorOpen
            )
                return;
            document.body.scrollLeft += e.deltaY;
        },
        [
            infoBoxOpen,
            calendarOpen,
            captureTimelineModalOpen,
            animeTitleSelectorOpen,
        ],
    );

    useEffect(() => {
        globalThis.addEventListener('wheel', handleScroll);
        return () => globalThis.removeEventListener('wheel', handleScroll);
    }, [handleScroll]);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.code == 'KeyV') {
            setRenderUi(p => !p);
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    useGlobalShortcuts();

    useEffect(() => {
        document.documentElement.style.setProperty(
            '--max-height',
            `${maxHeight(animeTitle)}`,
        );
        document.title = `${timeline.title} Timeline`;
        document.head.querySelector<HTMLLinkElement>(
            "link[rel~='icon']",
        )!.href =
            `./${animeTitle}/${timeline.smallImages['scroller-or-favicon']}.webp`;
    }, [animeTitle]);

    return (
        <>
            <TimeLineHeaders $animeTitle={animeTitle} />
            <AnimeTitleSelectorModal />
            <CalendarModal />
            <CaptureTimelineModal />
            <InfoModal />
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
