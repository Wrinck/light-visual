import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
    { ignores: ['dist', 'node_modules', 'coverage', 'commitlint.config.js', '*.json'] },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    prettier,
    {
        // Тайп-чекинг только для TS-файлов
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/explicit-function-return-type': 'off',
        },
    },
    // Базовые правила для JS/MJS конфигов без тайп-чекинга
    {
        files: ['**/*.js', '**/*.mjs'],
        ...js.configs.recommended,
    }
)