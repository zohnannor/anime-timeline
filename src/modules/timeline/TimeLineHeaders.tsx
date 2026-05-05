import styled from 'styled-components';

import { useTimeline } from '@shared/contexts/TimelineContext';
import { HEADER_TITLES, scale } from '@shared/lib/helpers';
import { typedKeys } from '@shared/lib/util';
import { Link, withShadow } from '@shared/ui';
import { HEADERS_WIDTH } from '@timelines/index';

type HeaderProps = {
    $height: number;
};

const Header = withShadow(
    // a comment to have a line break, otherwise syntax highlighting breaks
    styled.div<HeaderProps>`
        position: relative;
        display: flex;
        width: 100%;
        flex-grow: ${({ $height }) => $height};
        flex-basis: 0;
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
    display: flex;
    flex-direction: column;
    height: 100svh;
    user-select: none;
`;

export const TimeLineHeaders: React.FC = () => {
    const {
        data: { wikiBase },
        layout,
    } = useTimeline();

    const allKeys = typedKeys(layout);
    const sections = allKeys.filter(section => section !== 'timeline');
    const sectionAfterTimeline = allKeys.find(
        (_, i) => allKeys[i - 1] === 'timeline',
    );

    return (
        <Headers className='headers'>
            {sections.map(
                section =>
                    layout[section] && (
                        <Header
                            className={`${section}Header`}
                            key={section}
                            $height={
                                layout[section].height +
                                (section === sectionAfterTimeline ?
                                    layout.timeline.height
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
