import cfg from '@neovici/cfg/eslint/index.mjs';

export default [
	...cfg,
	{
		ignores: [
			'coverage/',
			'dist/',
			'__snapshots__',
			'storybook-static/',
			'.storybook/',
		],
	},
	{
		rules: {
			'max-lines-per-function': 0,
			'no-unused-expressions': 0,
			'import/group-exports': 0,
		},
	},
];
