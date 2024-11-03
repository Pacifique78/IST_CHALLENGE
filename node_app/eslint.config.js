import { FlatCompat } from '@eslint/eslintrc'
import path from 'path'
import { fileURLToPath } from 'url'
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin'
import prittierPlugin from 'eslint-plugin-prettier'
import typescriptEslintParser from '@typescript-eslint/parser'

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Compatibility layer for .eslintrc.* configs
const compat = new FlatCompat({
  baseDirectory: path.resolve(__dirname, 'node_modules'),
})

// Define the ESLint configurations directly
const config = [
  {
    files: ['*.js', '*.ts', '*.tsx'], // Apply for JS and TS files
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      prettier: prittierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
    },
  },
  // Include recommended ESLint configurations directly
  {
    files: ['**/*.js'],
    rules: {
      // Include any specific rules from eslint:recommended if needed
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // Include any specific rules from @typescript-eslint/recommended if needed
    },
  },
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx'],
    rules: {
      // Include any specific rules from prettier/recommended if needed
    },
  },
]

export default config
