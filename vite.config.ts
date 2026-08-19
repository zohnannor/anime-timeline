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
            enableBuild: false, // skip checking during 'yarn build'
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
            '@app': path.resolve(import.meta.dirname, './src/app'),
            '@modules': path.resolve(import.meta.dirname, './src/modules'),
            '@shared': path.resolve(import.meta.dirname, './src/shared'),
            '@timelines': path.resolve(import.meta.dirname, './src/timelines'),
        },
    },
});
