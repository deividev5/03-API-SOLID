import { FlatCompat } from '@eslint/eslintrc'
import path from 'path'
import { fileURLToPath } from 'url'
import js from '@eslint/js'

// Simula o comportamento do formato antigo para compatibilidade
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
  recommendedConfig: js.configs.recommended,
})

export default [
  // 1. Ignorar pastas (substitui o .eslintignore)
  {
    ignores: ['node_modules/', 'dist/', 'build/', 'out/'],
  },

  // 2. Importar a configuração da Rocketseat
  ...compat.extends('@rocketseat/eslint-config/node'), // ou /node se for backend

  // 3. Configurações específicas para TypeScript
  {
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      // Adicione seus overrides aqui
    },
  },
]
