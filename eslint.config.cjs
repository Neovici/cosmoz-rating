const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: {},
});

module.exports = [
	...compat.extends('./node_modules/@neovici/cfg/eslint'),
	{
		rules: {
			'max-lines-per-function': 0,
			'no-unused-expressions': 0,
			'@typescript-eslint/no-unused-expressions': 0,
			'import/group-exports': 0,
			// Disable rules that were removed in ESLint 9
			'valid-jsdoc': 'off',
		},
	},
	{
		ignores: ['coverage/*', 'dist/*', 'storybook-static/*'],
	},
];
