/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js}'],
	theme: {
		extend: {
			colors: {
				zine: {
					DEFAULT: '#ffa500',
					dark: '#ff9c35',
					darker: '#fe7910',
					lighter: '#fff6e5',
					red: '#ff693a',
				},
			},
			fontFamily: {
				inter: ['Inter', 'sans-serif'],
			},
		},
	},
	plugins: [],
};
