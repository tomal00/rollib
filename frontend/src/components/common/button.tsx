import classnames from 'classnames'

const Button = (props: {[key: string]: any}) => (
	<button
		{...props}
		class={classnames(
			'w-36 md:w-48 color-transition text-white disabled:bg-black disabled:cursor-not-allowed bg-red-400 hover:bg-red-600',
			props.class
		)}
	/>
)

export default Button
