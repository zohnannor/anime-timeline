import ReactDOM from 'react-dom';
import styled from 'styled-components';

import { scale } from '../constants';
import { useSettings } from '../providers/SettingsProvider';
import { ThumbnailImage } from './ThumbnailImage';

const InfoBoxRoot = styled.div`
    position: fixed;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -40%);
    z-index: 100;
    background: rgba(0, 0, 0, 0.85);

    @media (max-width: 768px) {
        height: 80%;
        overflow-y: scroll;
    }
`;

const ShadowOverlay = styled.div`
    position: fixed;
    inset: 0;
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
    font-size: ${scale(75)}svh;
    padding: ${scale(40)}svh ${scale(190)}svh;
    justify-content: center;
    align-content: center;
    align-items: center;
    column-gap: 1ch;

    & a {
        text-decoration: underline;
        text-decoration-style: dotted;
        text-decoration-thickness: ${scale(3)}svh;
        text-decoration-skip-ink: auto;
        text-underline-offset: ${scale(10)}svh;
    }

    & kbd:not(:has(kbd)) {
        background-color: rgba(0, 0, 0, 0.5);
        border: ${scale(3)}svh solid rgba(255, 255, 255, 0.5);
        border-radius: ${scale(10)}svh;
        box-shadow: 0 ${scale(3)}svh 0 rgba(255, 255, 255, 0.5);
        padding: ${scale(2)}svh ${scale(12)}svh;
        font-size: 0.8em;
        line-height: 1;
    }
`;

export const InfoBoxButton: React.FC = () => {
    const { openInfoBox } = useSettings();

    return (
        <ThumbnailImage
            src='pochita2'
            draggable={false}
            onClick={() => openInfoBox(true)}
            title='Read info'
            style={{ cursor: 'help' }}
        />
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
                    <span
                        style={{
                            display: 'inline-flex',
                            flexWrap: 'wrap',
                            gap: '0 1ch',
                        }}
                    >
                        Click on any image (season, episode, arc, chapter,
                        volume) to go to the corresponding
                        <a
                            href='https://chainsaw-man.fandom.com/wiki/'
                            target='_blank'
                            rel='noopener'
                        >
                            wiki
                        </a>
                        page
                    </span>
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
                    The button below the info button toggles unbounded chapter
                    width (volume width would not be constant but instead depend
                    on the number of pages in the chapters)
                </li>
                <li>
                    Use chapter calendar to quickly navigate to a chapter if you
                    know the date of its release
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
            <ShadowOverlay
                className='shadowOverlay'
                onClick={() => openInfoBox(false)}
            />
            <InfoBoxRoot className='infoBoxRoot'>{CONTENT}</InfoBoxRoot>
        </>,
        document.querySelector('#infoBox')!
    );
};
