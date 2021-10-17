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
						transform: 'translateX(calc(-40.5 * 240px))',
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
			spacing: {
				'game-preview': '240px',
				'game-preview-4': '960px',
				'game-preview-2': '480px',
				'active-preview': '589px',
				'-game-preview-1/2': '-120px',
				'xs-1/2': '16rem',
				144: '36rem',
			},
			minWidth: {
				'game-preview': '240px',
			},
			animation: {
				roll: 'roll 5s',
				expand: 'expand 8s infinite',
			},
			height: {
				'game-preview': '112px',
				'active-preview': '331px',
			},
			minHeight: {
				'game-preview': '112px',
			},
			maxHeight: {
				'active-preview': '331px',
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
