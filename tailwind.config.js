/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {},
		fontFamily: {
			'pixel-operator': ['Pixel Operator', 'sans-serif'],
			'press-start': ['"Press Start 2P"', 'cursive'],
			montserrat: ['Montserrat', 'sans-serif']
		}
	},

	plugins: [require('@tailwindcss/typography'), require('daisyui'), require('tailwindcss-animated')]
};
