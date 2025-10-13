import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { CSS } from 'styled-components/dist/types';

import { scale } from '../helpers';
import { useSettings } from '../providers/SettingsProvider';
import { Link } from './Link';

const ShadowOverlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 100;
    background: rgba(0, 0, 0, 0.6);
    cursor: pointer;
`;

const InfoBoxContainer = styled.div`
    position: fixed;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -40%);
    z-index: 100;
    background: rgba(0, 0, 0, 0.85);
    height: 90svh;
    overflow-y: scroll;

    @media (max-width: 768px) {
        height: 80svh;
    }
`;

interface BoxProps {
    $dir?: 'row' | 'column';
    $wrap?: boolean;
    $align?: CSS.Property.JustifyContent;
}

const Box = styled.div<BoxProps>`
    position: relative;
    display: flex;
    flex-direction: ${({ $dir }) => $dir || 'row'};
    flex-wrap: ${({ $wrap }) => ($wrap ? 'wrap' : 'nowrap')};
    gap: 1ch;
    align-items: ${({ $align }) => $align || 'center'};
    justify-content: center;
    width: 90vw;
    max-width: 90vw;
    padding: ${scale(40)} ${scale(190)};
    white-space: pre-line;
    font-size: ${scale(75)};

    & a {
        text-decoration: underline dotted;
        text-underline-offset: ${scale(10)};
        text-decoration-thickness: ${scale(3)};
    }

    & kbd:has(kbd) {
        margin: ${scale(20)};
    }

    & kbd:not(:has(kbd)) {
        background-color: rgba(0, 0, 0, 0.5);
        border: ${scale(3)} solid rgba(255, 255, 255, 0.5);
        border-radius: ${scale(10)};
        box-shadow: 0 ${scale(3)} 0 rgba(255, 255, 255, 0.5);
        padding: ${scale(2)} ${scale(12)};
        font-size: 0.8em;
        line-height: 1;
    }
`;

const ListContainer = styled.ul`
    margin: 0;
    padding-left: 1.5em;
`;

interface InlineLinkGroupProps {
    $gap?: boolean;
}

const InlineLinkGroup = styled.span<InlineLinkGroupProps>`
    display: flex;
    gap: ${({ $gap }) => ($gap ? '0 1ch' : '0')};
    flex-wrap: wrap;
`;

type Keys = {
    keys: string[];
};

const KeyboardShortcut: React.FC<Keys> = ({ keys }) => (
    <kbd>
        {keys.map((key, idx) => (
            <React.Fragment key={key}>
                <kbd>{key}</kbd>
                {idx < keys.length - 1 && ' + '}
            </React.Fragment>
        ))}
    </kbd>
);

const SpoilerWarning = styled.div`
    text-align: center;
    color: red;
    line-height: 1;
`;

const CloseButton = styled.span`
    position: sticky;
    inset: 0;
    cursor: pointer;
    font-size: 1.5em;
    top: ${scale(100)};
    right: ${scale(100)};
    z-index: 101;
    float: right;
`;

export const InfoBoxContent = (
    <Box $dir='column'>
        <Box $align='flex-start'>
            <Box $wrap>
                Made with ❤️ by
                <Link href='https://github.com/zohnannor'>zohnannor</Link>
                <InlineLinkGroup>
                    (
                    <Link href='https://reddit.com/u/zohnannor'>
                        u/zohnannor
                    </Link>
                    )
                </InlineLinkGroup>
                and
                <Link href='https://github.com/swbuwk'>swbuwk</Link>
            </Box>
        </Box>
        <SpoilerWarning>
            <h1>SPOILER WARNING</h1>
            This site contains spoilers for the Chainsaw Man manga and anime. I
            would suggest leaving the page if you are interested in the story.
        </SpoilerWarning>

        <Box $dir='column'>
            <h2>Site info and features:</h2>
            <ListContainer>
                <li>
                    <InlineLinkGroup $gap>
                        Click any image (season, episode, arc, chapter, volume)
                        to go to the corresponding
                        <Link href='https://chainsaw-man.fandom.com/wiki/'>
                            wiki
                        </Link>
                        page
                    </InlineLinkGroup>
                </li>
                <li>Show/hide season/episode/arc/volume titles</li>
                <li>Hover over chapter images for previews (desktop only)</li>
                <li>
                    Use the scrollbar at the bottom of the page for faster
                    navigation (desktop only)
                </li>
                <li>
                    Save the page as a huge PNG file (warning: it's about 50 MB
                    in size)
                </li>
                <li>
                    Seasons and volumes without images are not officially
                    confirmed and may be incorrect. Not every chapter has a
                    Pochita sketch, so some are just numbers
                </li>
                <li>
                    Chapter release dates in the timeline are displayed in your
                    local timezone
                </li>
                <li>
                    Press
                    <KeyboardShortcut keys={['Ctrl', 'C']} />
                    to toggle cross-lines (desktop only)
                </li>
                <li>
                    The button below the info button toggles unbounded chapter
                    width (volume width would not be constant but instead depend
                    on the number of pages in the chapters)
                </li>
                <li>
                    Use chapter calendar to quickly navigate to a chapter if you
                    know the date of its release, by clicking on a day. Or,
                    click on a day in the timeline to open a calendar and
                    navigate to the chapter date
                </li>
                <li>Episode widths are accurate down to the chapter page</li>
                <li>
                    I will personally update this site whenever new chapter
                    releases. There can be a slight delay if i'm busy, but also
                    your browser might use cached version of the page. On
                    desktop browsers, you can press
                    <KeyboardShortcut keys={['Ctrl', 'R']} />
                    to refresh
                </li>
            </ListContainer>
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
            <Link href='https://mangaplus.shueisha.co.jp/titles/100037'>
                Manga Plus
            </Link>
            <Link href='https://www.viz.com/shonenjump/chapters/chainsaw-man'>
                VIZ Media
            </Link>
            <Link href='https://x.com/nagayama_koharu'>Author's Twitter</Link>
            <Link href='https://www.shonenjump.com/j/rensai/chainsaw.html'>
                Official Site
            </Link>
        </Box>
    </Box>
);

export const InfoBox: React.FC = () => {
    const { infoBoxOpen, setInfoBoxOpen } = useSettings();

    if (!infoBoxOpen) return null;

    return ReactDOM.createPortal(
        <>
            <ShadowOverlay
                className='shadowOverlay'
                onClick={() => setInfoBoxOpen(false)}
            />
            <InfoBoxContainer className='infoBoxContainer'>
                <CloseButton onClick={() => setInfoBoxOpen(false)}>
                    &times;
                </CloseButton>
                {InfoBoxContent}
            </InfoBoxContainer>
        </>,
        document.querySelector('#infoBox')!
    );
};
