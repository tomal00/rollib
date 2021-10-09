export default function Info(): JSX.Element {
	return (
		<section class='px-6 py-12'>
			<h2>What is [insert name]?</h2>
			<p>
				[insert name] is a tool which you can use to randomly select a game
				<br />
				from your steam library.
			</p>
			<h2 class='mt-4'>How do I use this thing?</h2>
			<p>
				<ol>
					<li>Enter your steam profile link</li>
					<li>"Load" your steam library</li>
					<li>Roll</li>
				</ol>
			</p>
			<h2 class='mt-4'>I'm unable to load my steam library, what should I do?</h2>
			<p>
				It's possible that your steam library is not publicly visible.
				<br />
				<a
					class='hover:text-purple-400 underline transition-colors'
					rel='noreferrer noopener'
					href='https://help.steampowered.com/en/faqs/view/588C-C67D-0251-C276'
					target='_blank'>
					In order to use this app, you'll need to make your steam library publicly
					available.
				</a>
			</p>
		</section>
	)
}
