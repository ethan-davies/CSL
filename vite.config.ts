import { defineConfig } from 'vite'
import { rmSync } from 'node:fs'
import path from 'node:path'

import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ command }) => {
    rmSync('dist-electron', { recursive: true, force: true })

    const isBuild = command === 'build'

    // Get the server port from the process environment variable or use a default (e.g., 8080)
    const port = Number(process.env.PORT) || 8080

    return {
        root: 'src/renderer',
        server: {
            port, // Use the dynamic port value
        },
        build: {
            outDir: path.join(__dirname, 'dist'),
        },
        plugins: [
            react(),
            electron([
                {
                    entry: 'src/electron/index.ts',
                    onstart() {
                        console.log('[Electron] Started Electron')
                    },
                    vite: {
                        build: {
                            minify: isBuild,
                            outDir: 'dist-electron/main',
                        },
                    },
                },
                {
                    entry: 'src/preload/index.ts',
                    vite: {
                        build: {
                            minify: isBuild,
                            outDir: 'dist-electron/preload',
                        },
                    },
                },
            ]),
            renderer(),
            tsconfigPaths(),
        ],
        clearScreen: false,
    }
})
