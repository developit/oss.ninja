import { h, Component } from 'preact';
import style from './style';

export default class Header extends Component {
	render() {
		return (
			<header class={style.header}>
				<div class={style.inner}>
					<h1>
						<a href="/" class={style.logo}><img src="/assets/ossninja.svg" /></a>
						<a href="/" class={style.name}>OSS Ninja</a>
					</h1>
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
