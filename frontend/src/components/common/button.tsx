import classnames from 'classnames'

const Button = (props: {[key: string]: any}) => (
	<button
		{...props}
		class={classnames(
			'w-36 md:w-48 p-2 color-transition disabled:bg-gray-400 disabled:cursor-not-allowed bg-purple-500 hover:bg-purple-700',
			props.class
		)}
	/>
)

export default Button
