import classnames from 'classnames'

type Props = {
	[key: string]: any
	colorClassNames?: string
}

const AnchorButton = ({colorClassNames, ...rest}: Props): JSX.Element => (
	<a
		{...rest}
		class={classnames(
			'p-2 transition-colors disabled:cursor-not-allowed inline-block',
			colorClassNames || 'disabled:bg-gray-400 bg-purple-500 hover:bg-purple-700',
			rest.class
		)}
	/>
)

export default AnchorButton
