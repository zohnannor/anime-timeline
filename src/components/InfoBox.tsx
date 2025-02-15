import ReactDOM from 'react-dom';
import styled from 'styled-components';

import { useSettings } from '../providers/SettingsProvider';
import { ThumbnailImage } from './ThumbnailImage';

const InfoBoxRoot = styled.div`
    position: fixed;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    z-index: 100;
`;

const ShadowOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background: rgba(0, 0, 0, 0.6);
    cursor: pointer;
`;

interface BoxProps {
    $dir?: 'row' | 'column';
}

const Box = styled.span<BoxProps>`
    display: inline-flex;
    flex-wrap: wrap;
    flex-direction: ${({ $dir }) => $dir || 'row'};
    white-space: pre-line;
    width: 90vw;
    max-width: 90vw;
    background: rgba(0, 0, 0, 0.85);
    font-size: 24px;
    padding: 12px 60px;
    justify-content: center;
    align-content: center;
    align-items: center;
    column-gap: 1ch;

    & a {
        text-decoration: underline;
        text-decoration-style: dotted;
        text-decoration-thickness: 1px;
        text-decoration-skip-ink: auto;
        text-underline-offset: 3px;
    }

    & kbd:not(:has(kbd)) {
        background-color: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 3px;
        box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
        padding: 2px 4px;
        font-size: 0.8em;
        line-height: 1;
    }
`;

export const Button = styled.div`
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 100;
    cursor: help;

    & > img {
        width: 48px;
        height: 48px;
        filter: drop-shadow(0 0 5px rgba(0, 0, 0, 1));
    }

    & > img:hover {
        transform: scale(1.05);
    }
`;

export const InfoBoxButton: React.FC = () => {
    const { openInfoBox } = useSettings();

    return (
        <Button onClick={() => openInfoBox(true)}>
            <ThumbnailImage src='pochita2' draggable={false} />
        </Button>
    );
};

const CONTENT = (
    <Box $dir='column'>
        <Box>
            Made with ❤️ by
            <a
                href='https://github.com/zohnannor'
                target='_blank'
                rel='noopener'
            >
                zohnannor
            </a>
            <span style={{ display: 'inline-flex' }}>
                (
                <a
                    href='https://reddit.com/u/zohnannor'
                    target='_blank'
                    rel='noopener'
                >
                    u/zohnannor
                </a>
                )
            </span>
            and
            <a href='https://github.com/swbuwk' target='_blank' rel='noopener'>
                swbuwk
            </a>
        </Box>

        <Box $dir='column'>
            Site info and features:
            <ul>
                <li>
                    Click on any image (season, episode, arc, chapter, volume)
                    to go to the corresponding
                    <a
                        href='https://chainsaw-man.fandom.com/wiki/'
                        target='_blank'
                        rel='noopener'
                    >
                        wiki
                    </a>
                    page
                </li>
                <li>
                    Widths of episodes of the show are accurate down to the
                    chapter page
                </li>
                <li>
                    Hover over the chapter images to display a preview (desktop
                    only)
                </li>
                <li>
                    Use the scrollbar at the bottom of the page for faster
                    navigation (desktop only)
                </li>
                <li>
                    Seasons and volumes without images are not officially
                    confirmed and may be incorrect. Not every chapter has a
                    Pochita sketch, so some are just numbers
                </li>
                <li>
                    Dates of chapter releases in the timeline are displayed in
                    your local timezone
                </li>
                <li>
                    Press{' '}
                    <kbd>
                        <kbd>Ctrl</kbd> + <kbd>Space</kbd>
                    </kbd>{' '}
                    to toggle cross-lines
                </li>
                <li>
                    I will personally update this site whenever new chapter
                    releases. There can be a slight delay if i'm busy, but also
                    your browser might use cached version of the page. On
                    desktop browsers, you can press{' '}
                    <kbd>
                        <kbd>Ctrl</kbd> + <kbd>R</kbd>
                    </kbd>{' '}
                    to refresh.
                </li>
            </ul>
        </Box>

        <Box>
            This is a non-profit, unofficial fan site. We are not affiliated
            with VIZ Media or the authors of Chainsaw Man. All images are
            copyrighted by their respective owners and are used for illustration
            purposes only. We do not own any artwork, characters, or
            intellectual property on this site.
        </Box>

        <Box $dir='column'>
            <h3>Official Links:</h3>

            <a
                href='https://mangaplus.shueisha.co.jp/titles/100037'
                target='_blank'
                rel='noopener'
            >
                Manga Plus
            </a>
            <a
                href='https://www.viz.com/shonenjump/chapters/chainsaw-man'
                target='_blank'
                rel='noopener'
            >
                VIZ Media
            </a>
            <a
                href='https://x.com/nagayama_koharu'
                target='_blank'
                rel='noopener'
            >
                Author's Twitter
            </a>
            <a
                href='https://www.shonenjump.com/j/rensai/chainsaw.html'
                target='_blank'
                rel='noopener'
            >
                Official Site
            </a>
        </Box>
    </Box>
);

export const InfoBox: React.FC = () => {
    const { infoBoxOpen, openInfoBox } = useSettings();

    if (!infoBoxOpen) return null;

    return ReactDOM.createPortal(
        <>
            <ShadowOverlay onClick={() => openInfoBox(false)} />
            <InfoBoxRoot>{CONTENT}</InfoBoxRoot>
        </>,
        document.querySelector('#infoBox')!
    );
};
