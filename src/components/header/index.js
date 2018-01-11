import { h, Component } from 'preact';
import style from './style';

export default class Header extends Component {
	render() {
		return (
			<header class={style.header}>
				<div class={style.inner}>
					<h1>
						<a href="/">
							<img class={style.logo} src="/assets/ossninja.svg" alt="oss.ninja logo" />
							<span class={style.name}>OSS Ninja</span>
						</a>
						{/* <a href="/" class={style.logo}><img src="/assets/ossninja.svg" alt="oss.ninja logo" /></a>
						<a href="/" class={style.name}>OSS Ninja</a> */}
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
