import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { FloatingButtons } from '@modules/FloatingButtons';
import {
    AnimeTitleSelectorModal,
    CalendarModal,
    CaptureTimelineModal,
    InfoModal,
} from '@modules/modals';
import { Scroller } from '@modules/Scroller';
import { TimeLineHeaders, TimelineSection } from '@modules/timeline';
import { MOBILE_BREAKPOINT, SCALE_FACTOR_PROPERTY } from '@shared/config';
import { useSettings } from '@shared/contexts/SettingsContext';
import { useTimelineContext } from '@shared/contexts/TimelineContext';
import { useGlobalShortcuts, useWindowSize } from '@shared/lib/hooks';
import { isMobileDevice, typedValues } from '@shared/lib/util';
import { getFloatingButtons } from '@timelines/index';

const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    user-select: none;
`;

const App: React.FC = () => {
    const { width, height } = useWindowSize();
    const {
        infoBoxOpen,
        calendarOpen,
        captureTimelineModalOpen,
        animeTitleSelectorOpen,
        animeTitle,
    } = useSettings();
    const [renderUi, setRenderUi] = useState(true);
    const { timeline } = useTimelineContext();

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

    const floatingButtons = useMemo(
        () =>
            getFloatingButtons(
                isMobileDevice(),
                timeline?.data.volumes.some(vol => vol.extra) ?? false,
            ),
        [timeline],
    );

    useEffect(() => {
        if (timeline === undefined) {
            return;
        }

        const {
            data: { icons, title },
            maxHeight,
        } = timeline;
        document.documentElement.style.setProperty(
            SCALE_FACTOR_PROPERTY,
            `${height / maxHeight}px`,
        );
        document.title = `${title} Timeline`;
        const favicon =
            document.head.querySelector<HTMLLinkElement>("link[rel*='icon']");
        if (favicon && typeof icons.favicon === 'string') {
            favicon.href = `./${animeTitle}/${icons.favicon}.webp`;
        }
    }, [animeTitle, height, timeline]);

    if (timeline === undefined) {
        return <></>;
    }

    const {
        data: { icons },
        layout,
    } = timeline;

    return (
        <>
            <TimeLineHeaders />
            <AnimeTitleSelectorModal />
            <CalendarModal />
            <CaptureTimelineModal />
            <InfoModal />
            <AppContainer className='appContainer'>
                {renderUi && (
                    <FloatingButtons buttons={floatingButtons} icons={icons} />
                )}
                {typedValues(layout).map(item => (
                    <TimelineSection key={item.type} item={item} />
                ))}
                {renderUi && width > MOBILE_BREAKPOINT && <Scroller />}
            </AppContainer>
        </>
    );
};

export default App;
