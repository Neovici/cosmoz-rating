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
	// Tests often use assertion styles that look like unused expressions (chai). Turn off the rule for test files.
	{
		files: ['test/**', '**/*.test.*', 'test/**/*.+(ts|js)'],
		rules: {
			'@typescript-eslint/no-unused-expressions': 'off',
		},
	},
	{
		rules: {
			'max-lines-per-function': 0,
			'no-unused-expressions': 0,
			'import/group-exports': 0,
		},
	},
];
