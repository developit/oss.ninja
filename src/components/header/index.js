import { Component } from 'preact';
import style from './style';

export default class Header extends Component {
	render() {
		return (
			<header class={style.header}>
				<div class={style.inner}>
					<h2>
						<a href="/">
							<img class={style.logo} src="/assets/ossninja.svg" alt="oss.ninja logo" />
							<span class={style.name}>OSS Ninja</span>
						</a>
					</h2>
					<nav>
						<label>Popular:</label>
						<a href="/mit">MIT</a>
						<a href="/bsd">BSD</a>
					</nav>
				</div>
			</header>
		);
	}
}
