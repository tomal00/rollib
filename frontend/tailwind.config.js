module.exports = {
	purge: ['./src/**/*.html', './src/**/*.js'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			keyframes: {
				roll: {
					'0%, 5%': {
						transform: 'translateX(calc(-0.5 * 240px))',
					},
					'100%': {
						transform: 'translateX(calc(-50.5 * 240px))',
						animationTimingFunction: 'cubic-bezier(0,0,0.33,1)',
					},
				},
				expand: {
					'0%, 50%, 100%': {
						transform: 'scale(1)',
					},
					'75%': {
						transform: 'scale(1.25)',
					},
				},
			},
			animation: {
				roll: 'roll 5s',
				expand: 'expand 8s infinite',
			},
			height: {
				144: '36rem',
				'game-preview': '112px',
			},
			minHeight: {
				'game-preview': '112px',
			},
			width: {
				'game-preview': '240px',
			},
			minWidth: {
				'game-preview': '240px',
			},
			textColor: {
				inherit: 'inherit',
			},
		},
	},
	variants: {
		extend: {
			backgroundColor: ['disabled'],
			cursor: ['disabled'],
		},
	},
	plugins: [require('@tailwindcss/line-clamp')],
}
