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
                boxShadow: showTitles ? 'white 0px 0px 11px' : undefined,
            }}
        />
    );
};
