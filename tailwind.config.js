/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {},
		fontFamily: {
			'pixel-operator': ['Pixel Operator', 'sans-serif'],
			'montserrat': ['Montserrat', 'sans-serif']
		}
	},

	plugins: [
		require('@tailwindcss/typography'),
		require('daisyui')
	]
};
