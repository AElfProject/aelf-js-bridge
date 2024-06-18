import globals from 'globals';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';
import { fixupPluginRules } from '@eslint/compat';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import babelParser from '@babel/eslint-parser';

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname
});

function legacyPlugin(name, alias = name) {
  const plugin = compat.plugins(name)[0]?.plugins?.[alias];

  if (!plugin) {
    throw new Error(`Unable to resolve plugin ${name} and/or alias ${alias}`);
  }

  return fixupPluginRules(plugin);
}

export default [
  eslintPluginPrettierRecommended,
  {
    plugins: {
      import: legacyPlugin('eslint-plugin-import', 'import')
    },
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.es6,
        ...globals.node,
        ...globals.jest,
        myCustomGlobal: 'readonly'
      },
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-syntax-import-assertions']
        }
      }
    },
    rules: {
      'no-console': ['warn'],
      'no-useless-escape': 0,
      'no-empty': 0,
      'comma-dangle': 0,
      'arrow-parens': ['error', 'as-needed'],
      'import/prefer-default-export': 'off',
      'import/no-cycle': 'off',
      'no-underscore-dangle': 'off',
      'no-bitwise': 'off',
      'no-mixed-operators': 'off',
      'max-len': ['error', { code: 130 }],
      'class-methods-use-this': 'off',
      'no-plusplus': 'off',
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          trailingComma: 'none',
          arrowParens: 'avoid',
          proseWrap: 'always',
          endOfLine: 'auto'
        }
      ]
    },
    ignores: ['dist', 'build']
  }
];
