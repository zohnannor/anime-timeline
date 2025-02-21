import styled, { css } from 'styled-components';

import {
    ARC_HEIGHT,
    ARC_IMAGES,
    ARC_NAMES,
    ARC_OFFSETS,
    scale,
} from '../constants';
import { getArcWidth } from '../helpers';
import { useHover } from '../hooks/useHover';
import { useSettings } from '../providers/SettingsProvider';
import { TimelineContainer } from './Container';
import { withCrossLines } from './CrossLines';
import { Link } from './Link';
import { withShadow } from './ShadowWrapper';
import { ThumbnailImage } from './ThumbnailImage';

interface ArcProps {
    $width: number;
}

const Arc = withCrossLines(
    styled.div<ArcProps>`
        position: relative;
        height: ${scale(ARC_HEIGHT)}svh;
        width: ${({ $width }) => scale($width)}svh;
        transition: width 0.2s ease-in-out;
    `
);

const ArcCover = withShadow(
    styled.div`
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        height: 100%;
        width: 100%;

        & > a {
            position: absolute;
            writing-mode: sideways-lr;
            align-items: center;
            display: flex;
            justify-content: center;
            font-size: ${scale(100)}svh;
            inset: 0;
            cursor: pointer;
        }

        & > a > img {
            position: absolute;
            object-fit: cover;
            height: 100%;
            width: 100%;
            transition: 0.1s ease-in-out;
            pointer-events: none;
        }

        &:hover > a > img {
            transform: scale(1.05);
        }
    `
);

interface ArcTitleProps {
    $visible: boolean;
}

const ArcTitle = withShadow(
    styled.div<ArcTitleProps>`
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: ${scale(100)}svh;
        color: white;
        background: transparent;
        pointer-events: none;
        opacity: 0;
        ${({ $visible }) =>
            $visible &&
            css`
                opacity: 1;
                background-color: rgba(0, 0, 0, 0.2);
                text-shadow: -1px -1px 0 black, 1px -1px 0 black,
                    -1px 1px 0 black, 1px 1px 0 black, 0 0 ${scale(10)}svh black,
                    0 0 ${scale(20)}svh rgba(0, 0, 0, 0.5),
                    0 0 ${scale(30)}svh rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(${scale(10)}svh);
            `}

        transition: all 0.2s ease-in-out;
    `
);

export const Arcs: React.FC = () => {
    const [hoveredArc, hoverHandlers] = useHover();
    const { unboundedChapterWidth, showTitles } = useSettings();

    return (
        <TimelineContainer>
            {ARC_IMAGES.map((panel, idx) => {
                const arcWidth = getArcWidth(idx + 1, unboundedChapterWidth);
                const arcName = ARC_NAMES[idx];
                const link = `https://chainsaw-man.fandom.com/wiki/${arcName}_arc`;

                return (
                    <Arc
                        className='arc'
                        $width={arcWidth}
                        key={panel || idx}
                        $crossLinesVisible={hoveredArc(idx + 1)}
                        {...hoverHandlers(idx + 1)}
                    >
                        <ArcCover className='arcCover' $invertBorder={!panel}>
                            <Link href={link}>
                                {panel ? (
                                    <ThumbnailImage
                                        src={panel}
                                        $offsetX={ARC_OFFSETS[idx]?.x ?? 0}
                                        $offsetY={ARC_OFFSETS[idx]?.y ?? 0}
                                    />
                                ) : (
                                    `${arcName} arc`
                                )}
                            </Link>
                        </ArcCover>
                        {panel && (
                            <ArcTitle
                                className='arcTitle'
                                $visible={showTitles || hoveredArc(idx + 1)}
                            >
                                {arcName} arc
                            </ArcTitle>
                        )}
                    </Arc>
                );
            })}
        </TimelineContainer>
    );
};
