import styled from 'styled-components';

import {
    AnimeTitle,
    HEADERS_WIDTH,
    TIMELINE,
    TIMELINE_HEIGHT,
    TimelineSectionLayout,
} from '../constants';
import { HEADER_TITLES, scale } from '../helpers';
import { Link } from './Link';
import { withShadow } from './ShadowWrapper';

interface HeaderProps {
    $height: number;
}

const Header = withShadow(
    styled.div<HeaderProps>`
        position: relative;
        display: flex;
        width: 100%;
        height: ${({ $height }) => scale($height)};
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: ${scale(60)};

        writing-mode: vertical-lr;
        @supports (writing-mode: sideways-lr) {
            writing-mode: sideways-lr;
        }

        & > a {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            cursor: pointer;
        }
    `
);

const Headers = styled.div`
    width: ${scale(HEADERS_WIDTH)};
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    user-select: none;
`;

export const TimeLineHeaders: React.FC<{ $animeTitle: AnimeTitle }> = ({
    $animeTitle,
}) => {
    const wikiBase = TIMELINE[$animeTitle].data.wikiBase;
    const layout = TIMELINE[$animeTitle].layout;
    return (
        <Headers className='headers'>
            {Object.keys(layout)
                .filter(
                    (
                        section
                    ): section is Exclude<
                        keyof TimelineSectionLayout,
                        'timeline'
                    > => section !== 'timeline' // TODO: add it correctly?
                )
                .map(
                    section =>
                        layout[section] && (
                            <Header
                                className={`${section}Header`}
                                key={section}
                                $height={
                                    layout[section].height +
                                    (section === 'chapter' // TODO: see above
                                        ? TIMELINE_HEIGHT
                                        : 0)
                                }
                                $invertBorder
                            >
                                <Link
                                    href={`${wikiBase}${layout[section].sectionLink}`}
                                >
                                    {HEADER_TITLES[section]}
                                </Link>
                            </Header>
                        )
                )}
        </Headers>
    );
};
