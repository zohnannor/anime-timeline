/* eslint-disable sort-keys */ // context object
import {
    PropsWithChildren,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

import { Settings, SettingsContext } from '@shared/contexts/SettingsContext';
import { TITLES } from '@timelines/registry';
import { AnimeTitle } from '@timelines/types';

const title = (animeTitle: string | null): animeTitle is AnimeTitle =>
    TITLES.includes(animeTitle as AnimeTitle);

// eslint-disable-next-line max-lines-per-function, max-statements
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
    const [unboundedChapterWidth, setUnboundedChapterWidth] = useState(false);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [captureTimelineModalOpen, setCaptureTimelineModalOpen] =
        useState(false);
    const [showTitles, setShowTitlesRaw] = useState(
        // default to true if not set (first visit), otherwise get from storage
        () => globalThis.localStorage.getItem('showTitles') !== 'false',
    );
    const [animeTitle, setAnimeTitleRaw] = useState<AnimeTitle>(() => {
        const params = new URLSearchParams(globalThis.location.search);
        const animeTitle = params.get('title');
        if (title(animeTitle)) {
            return animeTitle;
        }
        globalThis.history.replaceState({}, '', `?title=csm`);
        return 'csm';
    });
    const [animeTitleSelectorOpen, setAnimeTitleSelectorOpen] = useState(false);

    // complains about it not being a callback and changing every render
    // eslint-disable-next-line react-x/no-unnecessary-use-callback
    const createModalHandler = useCallback(
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
            },
        [],
    );

    const openInfoBox = useMemo(
        () => createModalHandler('infoBoxOpen', setInfoBoxOpen),
        [createModalHandler],
    );
    const openCalendar = useMemo(
        () => createModalHandler('calendarOpen', setCalendarOpen),
        [createModalHandler],
    );
    const openCaptureTimelineModal = useMemo(
        () =>
            createModalHandler(
                'captureTimelineModalOpen',
                setCaptureTimelineModalOpen,
            ),
        [createModalHandler],
    );
    const openAnimeTitleSelector = useMemo(
        () =>
            createModalHandler(
                'animeTitleSelectorOpen',
                setAnimeTitleSelectorOpen,
            ),
        [createModalHandler],
    );

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
        const setAnimeTitle = (title: React.SetStateAction<AnimeTitle>) => {
            const theTitle =
                typeof title === 'function' ? title(animeTitle) : title;
            setAnimeTitleRaw(theTitle);
            globalThis.history.replaceState({}, '', `?title=${theTitle}`);
        };

        const setShowTitles = (show: React.SetStateAction<boolean>) => {
            const doShow = typeof show === 'function' ? show(showTitles) : show;
            setShowTitlesRaw(doShow);
            globalThis.localStorage.setItem('showTitles', doShow.toString());
        };

        return {
            showCrosslines,
            setShowCrosslines,
            infoBoxOpen,
            setInfoBoxOpen: openInfoBox,
            unboundedChapterWidth,
            setUnboundedChapterWidth,
            calendarOpen,
            setCalendarOpen: openCalendar,
            showTitles,
            setShowTitles,
            captureTimelineModalOpen,
            setCaptureTimelineModalOpen: openCaptureTimelineModal,
            animeTitle,
            setAnimeTitle,
            animeTitleSelectorOpen,
            setAnimeTitleSelectorOpen: openAnimeTitleSelector,
        };
    }, [
        showCrosslines,
        infoBoxOpen,
        openInfoBox,
        unboundedChapterWidth,
        calendarOpen,
        openCalendar,
        showTitles,
        captureTimelineModalOpen,
        openCaptureTimelineModal,
        animeTitle,
        animeTitleSelectorOpen,
        openAnimeTitleSelector,
    ]);

    return <SettingsContext value={context}>{children}</SettingsContext>;
};
