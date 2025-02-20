import { useSettings } from '../providers/SettingsProvider';
import { ThumbnailImage } from './ThumbnailImage';

export const ToggleTitlesButton: React.FC = () => {
    const { setShowTitles } = useSettings();

    return (
        <ThumbnailImage
            src='pochita5'
            onClick={() => setShowTitles(p => !p)}
            title='Toggle always show titles'
            style={{ cursor: 'pointer' }}
        />
    );
};
