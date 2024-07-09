import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import { fixupConfigRules } from '@eslint/compat';

import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();
export default [
	{ files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
	{
		languageOptions: {
			parserOptions: { ecmaFeatures: { jsx: true } },
		},
	},
	{ languageOptions: { globals: { ...globals.browser, ...globals.node } } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	...fixupConfigRules(pluginReactConfig),
	...fixupConfigRules(compat.extends('plugin:@next/next/core-web-vitals')),
	{
		ignores: ['.next/*', '.cache'],

		rules: {
			'react/react-in-jsx-scope': 'off',
			'react/jsx-uses-react': 'off',
			'react/prop-types': 'off',
			'@typescript-eslint/no-unused-vars': 'error',
			'@typescript-eslint/no-explicit-any': 'off',
		},
	},
];
