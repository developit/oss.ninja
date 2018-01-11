import { h, Component } from 'preact';
import cx from 'classnames';
import wire from 'wiretie';
import style from './style';

function flattenAliases(data, item) {
	if (item.type==='alias') {
		(data.aliases[item.to] || (data.aliases[item.to] = [])).push(item);
	}
	else {
		data.list.push(item);
	}
	return data;
}

const getName = obj => obj.name || obj.key;

@wire('model', {
	licenses: 'getAllLicenses'
}, ({ getAllLicensesSync }) => ({ getAllLicensesSync }))
export default class Home extends Component {
	render({ licenses, pending, getAllLicensesSync }) {
		// prerendering!
		if (!licenses || pending && pending.licenses) licenses = getAllLicensesSync ? getAllLicensesSync() : window.ALL_LICENSES;

		let { list, aliases } = licenses ? licenses.reduce(flattenAliases, { list: [], aliases: {} }) : {};

		return (
			<div class={cx(style.home, pending && style.loading)}>
				<header>
					<img class={style.logo} src="/assets/ossninja.svg" alt="oss.ninja logo" />
					<h1 class={style.name}>OSS Ninja</h1>
					<p>Open Source licenses with just a link.</p>
				</header>
				<section>
					<article>
						<div class={style.tip}>
							<strong>#protip:</strong> append a GitHub username to URLs for automatic population:
							{' '} <a href="/mit/developit">/mit/developit</a>
						</div>

						<ul>
							{ list && list.map( license => (
								<li>
									<a href={'/'+license.key}>
										{getName(license)}
										{ aliases[license.key] && (
											<em> (alias: {aliases[license.key].map(getName).join(', ')})</em>
										) }
									</a>
								</li>
							) )}
						</ul>

						<footer>
							✨ <a href="https://github.com/developit/oss.ninja" target="_blank" rel="noopener noreferrer">Star oss.ninja on GitHub</a>!
						</footer>
					</article>
				</section>
			</div>
		);
	}
}
