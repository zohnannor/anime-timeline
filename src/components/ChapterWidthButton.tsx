import { useSettings } from '../providers/SettingsProvider';
import { ThumbnailImage } from './ThumbnailImage';

export const ChapterWidthButton: React.FC = () => {
    const { setUnboundedChapterWidth } = useSettings();

    return (
        <ThumbnailImage
            src='pochita3'
            onClick={() => setUnboundedChapterWidth(p => !p)}
            title='Toggle unbounded chapter width'
            style={{ cursor: 'pointer' }}
        />
    );
};
