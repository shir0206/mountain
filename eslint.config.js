import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    // react-three-fiber idiomatically mutates three.js objects returned by
    // useThree()/passed to useFrame() (camera, gl, controls, ...) — that's
    // not React state, so react-hooks/immutability's false positives here
    // are expected and safe to disable for the Scene tree.
    files: ["src/presentation/Scene/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/immutability": "off",
    },
  },
])
