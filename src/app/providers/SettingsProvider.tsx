import { PropsWithChildren, useEffect, useMemo, useState } from 'react';

import { Settings, SettingsContext } from '@shared/contexts/SettingsContext';
import { AnimeTitle, TITLES } from '@timelines/types';

const isTitle = (animeTitle: string | null): animeTitle is AnimeTitle =>
    TITLES.includes(animeTitle as AnimeTitle);

const createModalHandler =
    (
        stateKey: keyof Settings,
        setter: React.Dispatch<React.SetStateAction<boolean>>,
    ) =>
    (isOpen: React.SetStateAction<boolean>) => {
        if (typeof isOpen === 'boolean') {
            if (isOpen) {
                history.pushState({ [stateKey]: true }, '');
            } else if (history.state?.[stateKey] !== undefined) {
                history.back();
            }
        }
        setter(isOpen);
    };

export const SettingsProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [showCrosslines, setShowCrosslines] = useState(false);
    const [infoBoxOpen, setInfoBoxOpen] = useState(() => {
        const isFirstVisit = localStorage.getItem('firstVisit') === null;
        if (isFirstVisit) {
            localStorage.setItem('firstVisit', 'false');
        }
        return isFirstVisit;
    });
    const [unboundChapterWidth, setUnboundChapterWidth] = useState(false);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [captureTimelineModalOpen, setCaptureTimelineModalOpen] =
        useState(false);
    const [showTitles, setShowTitles] = useState(
        // default to true if not set (first visit), otherwise get from storage
        () => localStorage.getItem('showTitles') !== 'false',
    );
    const [showExtraChapters, setShowExtraChapters] = useState(
        () => localStorage.getItem('showExtraChapters') !== 'false',
    );
    const [animeTitle, setAnimeTitle] = useState<AnimeTitle>(() => {
        const parameters = new URLSearchParams(location.search);
        const animeTitle = parameters.get('title');
        if (isTitle(animeTitle)) {
            return animeTitle;
        }
        history.replaceState({}, '', `?title=csm`);
        return 'csm';
    });
    const [animeTitleSelectorOpen, setAnimeTitleSelectorOpen] = useState(false);

    useEffect(() => {
        const handlePopState = (ev: PopStateEvent) => {
            const state = (ev.state ?? {}) as Record<string, boolean>;
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

        addEventListener('popstate', handlePopState);
        return () => removeEventListener('popstate', handlePopState);
    }, []);

    const context = useMemo(() => {
        const toggleAnimeTitle = (title: React.SetStateAction<AnimeTitle>) => {
            const theTitle =
                typeof title === 'function' ? title(animeTitle) : title;
            setAnimeTitle(theTitle);
            history.replaceState({}, '', `?title=${theTitle}`);
        };

        const toggleShowTitles = (
            shouldShow: React.SetStateAction<boolean>,
        ) => {
            const shouldShowResolved =
                typeof shouldShow === 'function' ?
                    shouldShow(showTitles)
                :   shouldShow;
            setShowTitles(shouldShowResolved);
            localStorage.setItem('showTitles', shouldShowResolved.toString());
        };

        const toggleShowExtraChapters = (
            shouldShow: React.SetStateAction<boolean>,
        ) => {
            const shouldShowResolved =
                typeof shouldShow === 'function' ?
                    shouldShow(showExtraChapters)
                :   shouldShow;
            setShowExtraChapters(shouldShowResolved);
            localStorage.setItem(
                'showExtraChapters',
                shouldShowResolved.toString(),
            );
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
            showExtraChapters,
            setShowExtraChapters: toggleShowExtraChapters,
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
        animeTitle,
        animeTitleSelectorOpen,
        calendarOpen,
        captureTimelineModalOpen,
        infoBoxOpen,
        showCrosslines,
        showExtraChapters,
        showTitles,
        unboundChapterWidth,
    ]);

    return <SettingsContext value={context}>{children}</SettingsContext>;
};
