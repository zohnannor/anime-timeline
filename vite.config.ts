import path from 'path';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react(),
        checker({
            eslint: {
                lintCommand: 'eslint .',
                watchPath: './src',
                useFlatConfig: true,
            },
            typescript: true,
        }),
    ],
    build: {
        outDir: 'build',
    },
    server: {
        port: 3000,
    },
    base: '/anime-timeline/',
    resolve: {
        alias: {
            '@app': path.resolve(__dirname, './src/app'),
            '@modules': path.resolve(__dirname, './src/modules'),
            '@shared': path.resolve(__dirname, './src/shared'),
            '@timelines': path.resolve(__dirname, './src/timelines'),
        },
    },
});
