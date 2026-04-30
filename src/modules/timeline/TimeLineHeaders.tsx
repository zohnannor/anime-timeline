import styled from 'styled-components';

import { useTimeline } from '@shared/contexts/TimelineContext';
import { HEADER_TITLES, scale } from '@shared/lib/helpers';
import { typedKeys } from '@shared/lib/util';
import { Link, withShadow } from '@shared/ui';
import { HEADERS_WIDTH, TIMELINE_HEIGHT } from '@timelines/index';

type HeaderProps = {
    $height: number;
};

const Header = withShadow(
    // a comment to have a line break, otherwise syntax highlighting breaks
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
    `,
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

export const TimeLineHeaders: React.FC = () => {
    const {
        data: { wikiBase },
        layout,
    } = useTimeline();

    return (
        <Headers className='headers'>
            {typedKeys(layout)
                // TODO: add it correctly?
                .filter(section => section !== 'timeline')
                .map(
                    section =>
                        layout[section] && (
                            <Header
                                className={`${section}Header`}
                                key={section}
                                $height={
                                    layout[section].height +
                                    (section === 'chapter' ?
                                        // TODO: see above
                                        TIMELINE_HEIGHT
                                    :   0)
                                }
                                $invertBorder
                            >
                                <Link
                                    href={`${wikiBase}${layout[section].sectionLink}`}
                                >
                                    {HEADER_TITLES[section]}
                                </Link>
                            </Header>
                        ),
                )}
        </Headers>
    );
};
