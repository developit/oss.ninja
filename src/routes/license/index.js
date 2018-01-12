import { Component } from 'preact';
import { route } from 'preact-router';
import cx from 'classnames';
import wire from 'wiretie';
import Field from './field';
import style from './style';

const DEFAULTS = {
	year: new Date().getFullYear()
};

function getQuery(matches, githubProfile) {
	let query = {};
	if (githubProfile) {
		query.organization = githubProfile.name;
	}
	for (let i in Object(matches)) {
		if (matches.hasOwnProperty(i) && i!=='licenseId') {
			query[i] = matches[i];
		}
	}
	return query;
}

function jsxReplace(str, pattern, callback) {
	if (Array.isArray(str)) return str.concat.apply([], str.map( str => jsxReplace(str, pattern, callback) ));
	if (typeof str!=='string') return str;
	let out = [],
		index = pattern.lastIndex = 0,
		match;
	while ((match=pattern.exec(str))) {
		if (match.index>index) {
			out.push(str.substring(index, match.index));
		}
		out.push(callback.apply(null, match));
		index = pattern.lastIndex;
	}
	if (index<str.length) {
		out.push(str.substring(index));
	}
	return out;
}

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

		return (
			<div class={cx(style.license, pending && style.loading)}>
				<section>
					<h1>{license && license.info && license.info.name || licenseId} License</h1>
					
					<article>
						{license && this.format(license.text, query)}
					</article>
				</section>
			</div>
		);
	}
}
