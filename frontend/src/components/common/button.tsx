import classnames from 'classnames'

type Props = {
	[key: string]: any
	colorClassNames?: string
}

const Button = ({colorClassNames, ...rest}: Props): JSX.Element => (
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
