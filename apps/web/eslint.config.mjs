import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import pluginReactHooks from 'eslint-plugin-react-hooks';

export default [
	{ files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
	{ languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
	{ languageOptions: { globals: { ...globals.browser, ...globals.node } } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	pluginReactConfig,
	{
		plugins: {
			'react-hooks': pluginReactHooks,
		},
		ignores: ['.config/*',`".next"`,'build'],
		rules: {
			'react/react-in-jsx-scope': 'off',
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',
			'react/jsx-uses-react': 'off',
			'react/prop-types': 'off',
			'@typescript-eslint/no-explicit-any': 'off',

			/////////
			'@typescript-eslint/no-unused-vars': 'off',
			'no-prototype-builtins': 'off',
			'@typescript-eslint/no-this-alias': 'off',
		},
	},
];
