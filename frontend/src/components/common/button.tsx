import classnames from 'classnames'

const Button = ({colorClassNames, ...rest}: {[key: string]: any; colorClassNames?: string}) => (
	<button
		{...rest}
		class={classnames(
			'p-2 transition-colors disabled:cursor-not-allowed',
			colorClassNames || 'disabled:bg-gray-400 bg-purple-500 hover:bg-purple-700',
			rest.class
		)}
	/>
)

export default Button
