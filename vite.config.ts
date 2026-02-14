import path from 'path';
import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@app': path.resolve(__dirname, './src/app'),
            '@modules': path.resolve(__dirname, './src/modules'),
            '@shared': path.resolve(__dirname, './src/shared'),
            '@timelines': path.resolve(__dirname, './src/timelines'),
        },
    },
});
