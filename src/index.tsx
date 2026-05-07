import '@app/index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import App from '@app/App';
import { SettingsProvider } from '@app/providers/SettingsProvider';
import { TouchHoverProvider } from './app/providers/TouchHoverProvider';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <SettingsProvider>
            <TouchHoverProvider>
                <App />
            </TouchHoverProvider>
        </SettingsProvider>
    </React.StrictMode>,
);
