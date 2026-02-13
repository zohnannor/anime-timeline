import {
    PropsWithChildren,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { AnimeTitle, TITLES } from '../../timelines';
import {
    Settings,
    SettingsContext,
} from '../../shared/contexts/SettingsContext';

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
        if (animeTitle && TITLES.includes(animeTitle as AnimeTitle)) {
            return animeTitle as AnimeTitle;
        }
        globalThis.history.replaceState({}, '', `?title=csm`);
        return 'csm';
    });
    const [animeTitleSelectorOpen, setAnimeTitleSelectorOpen] = useState(false);

    const setShowTitles = (show: React.SetStateAction<boolean>) => {
        if (typeof show === 'function') {
            show = show(showTitles);
        }
        globalThis.localStorage.setItem('showTitles', show.toString());
        setShowTitlesRaw(show);
    };

    const createModalHandler = useCallback(
        (
            stateKey: keyof Settings,
            setter: React.Dispatch<React.SetStateAction<boolean>>,
        ) => {
            return (open: React.SetStateAction<boolean>) => {
                if (open) {
                    globalThis.history.pushState({ [stateKey]: true }, '');
                } else if (globalThis.history.state?.[stateKey]) {
                    globalThis.history.back();
                }
                setter(open);
            };
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

    const handlePopState = useCallback((e: PopStateEvent) => {
        const state = e.state || {};
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

        modalStates.forEach(({ key, setter }) => {
            setter(!!state[key]);
        });
    }, []);

    useEffect(() => {
        globalThis.addEventListener('popstate', handlePopState);
        return () => globalThis.removeEventListener('popstate', handlePopState);
    }, [handlePopState]);

    const setAnimeTitle = (title: React.SetStateAction<AnimeTitle>) => {
        setAnimeTitleRaw(title);
        globalThis.history.replaceState({}, '', `?title=${title}`);
    };

    const contextValue = useMemo<Settings>(
        () => ({
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
        }),
        [
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
        ],
    );

    return (
        <SettingsContext.Provider value={contextValue}>
            {children}
        </SettingsContext.Provider>
    );
};
