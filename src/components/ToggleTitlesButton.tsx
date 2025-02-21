import { useSettings } from '../providers/SettingsProvider';
import { ThumbnailImage } from './ThumbnailImage';

export const ToggleTitlesButton: React.FC = () => {
    const { showTitles, setShowTitles } = useSettings();

    return (
        <ThumbnailImage
            src='pochita5'
            onClick={() => setShowTitles(p => !p)}
            title='Toggle always show titles'
            style={{
                cursor: 'pointer',
                filter: showTitles
                    ? 'drop-shadow(0px 0px 3px white) drop-shadow(0px 0px 4px white)'
                    : undefined,
            }}
        />
    );
};
