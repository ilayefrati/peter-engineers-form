module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{json,ico,html,png,txt,css,js,md,svg}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};