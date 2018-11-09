import { Component } from 'preact';
import { route } from 'preact-router';
import jsxReplace from '../../lib/jsx-replace';
import cx from 'classnames';
import wire from 'wiretie';
import Field from './field';
import Simplified from './simplified';
import style from './style';

const DEFAULTS = {
	year: new Date().getFullYear()
};

function getQuery(matches, githubProfile) {
	let query = {};
	if (githubProfile) {
		query.organization = githubProfile.name || githubProfile.login;
	}
	for (let i in Object(matches)) {
		if (matches.hasOwnProperty(i) && i!=='licenseId') {
			query[i] = matches[i];
		}
	}
	return query;
}

let first = true;

@wire('model', ({ licenseId, gh }) => ({
	license: licenseId && ['getLicense', licenseId],
	githubProfile: gh && ['getGithubProfile', gh]
}))
export default class License extends Component {
	format = (text, fields) => {
		text = jsxReplace(text, /\{\{\s*([ a-z0-9_\-$]+?)\s*\}\}/g, (str, field) => {
			let id = field.toLowerCase();
			return <Field id={id} value={fields[id] || DEFAULTS[id] || ''} onChange={this.updateField} />;
		});
		text = jsxReplace(text, /\n\n+/g, () => <br />);
		return text;
	};

	updateField = ({ id, value }) => {
		let e = encodeURIComponent,
			url = `/${e(this.props.licenseId)}`,
			query = getQuery(this.props.matches, this.props.githubProfile),
			add = true;
		if (this.props.githubInUrl) {
			url += `/${e(this.props.gh)}`;
			delete query.gh;
		}
		for (let i in query) {
			let v = query[i];
			if (i.toLowerCase()==id) {
				add = false;
				v = value;
			}
			url += `${~url.indexOf('?')?'&':'?'}${e(i)}=${e(v)}`;
		}
		if (add) {
			url += `${~url.indexOf('?')?'&':'?'}${e(id)}=${e(value)}`;
		}
		this.lazyRoute(url);
	};

	lazyRoute = url => {
		clearTimeout(this.routeTimer);
		this.routeTimer = setTimeout( () => {
			route(url, true);
		}, 250);
	};

	componentWillUnmount() {
		clearTimeout(this.routeTimer);
	}

	render({ licenseId, license, pending, error, matches, githubProfile }) {
		let query = getQuery(matches, githubProfile);

		if (license && first) {
			first = false;
			window.ga('send', 'timing', 'content', 'load', Math.round(performance.now()));
		}

		return (
			<div class={cx(style.license, pending && style.loading)}>
				<section>
					<h1>{license && license.info && license.info.name || licenseId} License</h1>
					<article>
						<Simplified licenseId={licenseId} />
						{license && this.format(license.text, query)}
					</article>
				</section>
			</div>
		);
	}
}
