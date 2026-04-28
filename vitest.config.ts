/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig({
    // Наследуем алиасы и резолвер из Vite
    ...viteConfig,
    test: {
        globals: true, // Описания вроде describe/test доступны глобально
        environment: 'jsdom', // Для тестов UI/Canvas
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: ['node_modules/', 'dist/', '**/*.d.ts']
        }
    }
})