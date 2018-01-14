import { Component } from 'preact';
import style from './style';

export default class Footer extends Component {
	render() {
		return (
			<footer class={style.footer}>
				<div class={style.inner}>
					<h2>
						<img class={style.logo} src="/assets/ossninja.svg" alt="oss.ninja logo" />
						OSS Ninja
					</h2>
					<section>
						<p>
							Made with ❤️ by <a href="https://twitter.com/_developit" target="_blank" rel="noopener noreferrer">developit</a>.
						</p>
					</section>
					<nav>
						<a href="https://github.com/developit/oss.ninja" target="_blank" rel="noopener noreferrer">GitHub</a>
						<a href="https://github.com/developit/oss.ninja/issues" target="_blank" rel="noopener noreferrer">Report Issues</a>
					</nav>
				</div>
			</footer>
		);
	}
}
