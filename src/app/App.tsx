import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { FloatingButton, FloatingButtons } from '@modules/FloatingButtons';
import {
    AnimeTitleSelectorModal,
    CalendarModal,
    CaptureTimelineModal,
    InfoModal,
} from '@modules/modals';
import { Scroller } from '@modules/Scroller';
import { TimeLineHeaders, TimelineSection } from '@modules/timeline';
import { useSettings } from '@shared/contexts/SettingsContext';
import { maxHeight } from '@shared/lib/helpers';
import { useGlobalShortcuts, useWindowSize } from '@shared/lib/hooks';
import { FLOATING_BUTTONS } from '@timelines/index';
import { TIMELINE } from '@timelines/registry';

const MOBILE_WIDTH = 768;

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

    useEffect(() => {
        const handleScroll = (ev: WheelEvent) => {
            if (
                infoBoxOpen ||
                calendarOpen ||
                captureTimelineModalOpen ||
                animeTitleSelectorOpen
            ) {
                return;
            }
            document.body.scrollLeft += ev.deltaY;
        };

        globalThis.addEventListener('wheel', handleScroll);
        return () => globalThis.removeEventListener('wheel', handleScroll);
    }, [
        infoBoxOpen,
        calendarOpen,
        captureTimelineModalOpen,
        animeTitleSelectorOpen,
    ]);

    const handleKeyDown = (ev: KeyboardEvent) => {
        if (ev.ctrlKey && ev.code === 'KeyV') {
            setRenderUi(state => !state);
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
            `${maxHeight(TIMELINE[animeTitle])}`,
        );
        document.title = `${timeline.title} Timeline`;
        const favicon =
            document.head.querySelector<HTMLLinkElement>("link[rel~='icon']");
        if (favicon) {
            favicon.href = `./${animeTitle}/${timeline.smallImages['scroller-or-favicon']}.webp`;
        }
    }, [animeTitle, timeline.smallImages, timeline.title]);

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
                {renderUi && width > MOBILE_WIDTH && <Scroller />}
            </AppContainer>
        </>
    );
};

export default App;
