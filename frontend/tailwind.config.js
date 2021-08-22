module.exports = {
	purge: ['./src/**/*.html', './src/**/*.js'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			keyframes: {
				roll: {
					'0%, 10%': {
						transform: 'translateX(calc(-0.5 * 240px))',
					},
					'100%': {
						transform: 'translateX(calc(-60.5 * 240px))',
						animationTimingFunction: 'cubic-bezier(0,0,0.33,1)',
					},
				},
			},
			animation: {
				roll: 'roll 5s',
			},
		},
	},
	variants: {
		extend: {
			backgroundColor: ['disabled'],
			cursor: ['disabled'],
		},
	},
	plugins: [],
}
