import { PropsWithChildren, useEffect, useMemo, useState } from 'react';

import { Settings, SettingsContext } from '@shared/contexts/SettingsContext';
import { TITLES } from '@timelines/registry';
import { AnimeTitle } from '@timelines/types';

const title = (animeTitle: string | null): animeTitle is AnimeTitle =>
    TITLES.includes(animeTitle as AnimeTitle);

const createModalHandler =
    (
        stateKey: keyof Settings,
        setter: React.Dispatch<React.SetStateAction<boolean>>,
    ) =>
    (open: React.SetStateAction<boolean>) => {
        if (open) {
            globalThis.history.pushState({ [stateKey]: true }, '');
        } else if (globalThis.history.state?.[stateKey]) {
            globalThis.history.back();
        }
        setter(open);
    };

export const SettingsProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [showCrosslines, setShowCrosslines] = useState(false);
    const [infoBoxOpen, setInfoBoxOpen] = useState(() => {
        const firstVisit =
            globalThis.localStorage.getItem('firstVisit') === null;
        if (firstVisit) {
            globalThis.localStorage.setItem('firstVisit', 'false');
        }
        return firstVisit;
    });
    const [unboundChapterWidth, setUnboundChapterWidth] = useState(false);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [captureTimelineModalOpen, setCaptureTimelineModalOpen] =
        useState(false);
    const [showTitles, setShowTitles] = useState(
        // default to true if not set (first visit), otherwise get from storage
        () => globalThis.localStorage.getItem('showTitles') !== 'false',
    );
    const [animeTitle, setAnimeTitle] = useState<AnimeTitle>(() => {
        const params = new URLSearchParams(globalThis.location.search);
        const animeTitle = params.get('title');
        if (title(animeTitle)) {
            return animeTitle;
        }
        globalThis.history.replaceState({}, '', `?title=csm`);
        return 'csm';
    });
    const [animeTitleSelectorOpen, setAnimeTitleSelectorOpen] = useState(false);

    useEffect(() => {
        const handlePopState = (ev: PopStateEvent) => {
            const state =
                (ev.state as Record<string, boolean> | undefined | null) ?? {};
            const modalStates: {
                key: keyof Settings;
                setter: React.Dispatch<React.SetStateAction<boolean>>;
            }[] = [
                { key: 'infoBoxOpen', setter: setInfoBoxOpen },
                { key: 'calendarOpen', setter: setCalendarOpen },
                {
                    key: 'captureTimelineModalOpen',
                    setter: setCaptureTimelineModalOpen,
                },
                {
                    key: 'animeTitleSelectorOpen',
                    setter: setAnimeTitleSelectorOpen,
                },
            ];

            for (const { key, setter } of modalStates) {
                setter(state[key] ?? false);
            }
        };

        globalThis.addEventListener('popstate', handlePopState);
        return () => globalThis.removeEventListener('popstate', handlePopState);
    }, []);

    const context = useMemo(() => {
        const toggleAnimeTitle = (title: React.SetStateAction<AnimeTitle>) => {
            const theTitle =
                typeof title === 'function' ? title(animeTitle) : title;
            setAnimeTitle(theTitle);
            globalThis.history.replaceState({}, '', `?title=${theTitle}`);
        };

        const toggleShowTitles = (show: React.SetStateAction<boolean>) => {
            const doShow = typeof show === 'function' ? show(showTitles) : show;
            setShowTitles(doShow);
            globalThis.localStorage.setItem('showTitles', doShow.toString());
        };

        return {
            showCrosslines,
            setShowCrosslines,
            infoBoxOpen,
            setInfoBoxOpen: createModalHandler('infoBoxOpen', setInfoBoxOpen),
            unboundChapterWidth,
            setUnboundChapterWidth,
            calendarOpen,
            setCalendarOpen: createModalHandler(
                'calendarOpen',
                setCalendarOpen,
            ),
            showTitles,
            setShowTitles: toggleShowTitles,
            captureTimelineModalOpen,
            setCaptureTimelineModalOpen: createModalHandler(
                'captureTimelineModalOpen',
                setCaptureTimelineModalOpen,
            ),
            animeTitle,
            setAnimeTitle: toggleAnimeTitle,
            animeTitleSelectorOpen,
            setAnimeTitleSelectorOpen: createModalHandler(
                'animeTitleSelectorOpen',
                setAnimeTitleSelectorOpen,
            ),
        };
    }, [
        showCrosslines,
        infoBoxOpen,
        setInfoBoxOpen,
        unboundChapterWidth,
        calendarOpen,
        setCalendarOpen,
        showTitles,
        captureTimelineModalOpen,
        setCaptureTimelineModalOpen,
        animeTitle,
        animeTitleSelectorOpen,
        setAnimeTitleSelectorOpen,
    ]);

    return <SettingsContext value={context}>{children}</SettingsContext>;
};
