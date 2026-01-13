import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { SettingsProvider } from './providers/SettingsProvider';
import { TouchHoverProvider } from './providers/TouchHoverProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <SettingsProvider>
            <TouchHoverProvider>
                <App />
            </TouchHoverProvider>
        </SettingsProvider>
    </React.StrictMode>
);
