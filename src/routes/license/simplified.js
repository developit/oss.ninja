import { Component } from 'preact';
import cx from 'classnames';
import style from './style';
import wire from 'wiretie';

const SECTIONS = ['permissions', 'conditions', 'limitations'];
const ICONS = ['✅', '⚠️', '🛑'];

const titleCase = str => str.replace(/(^|-)([a-z])/g, titleCaseReplacer);
const titleCaseReplacer = (str, before, char) => (before?' ':'') + char.toUpperCase();

@wire('model', ({ licenseId, gh }) => ({
	licenseInfo: licenseId && ['getSimplifiedLicense', licenseId]
}))
export default class Simplified extends Component {
	renderSection = (section, index) => (
		<li data-section={section}>
			<h6>{titleCase(section)}</h6>
			<ul>
				{ this.props.licenseInfo[section].map(name => (
					<li>
						{ICONS[index]}
						{' '}
						{titleCase(name)}
					</li>
				)) }
			</ul>
		</li>
	);

	render({ licenseInfo, pending, rejected }) {
		return (
			<div class={cx(style.simplified, (!licenseInfo || pending) && style.loading)}>
				{ licenseInfo && (
					<div class={style.inner}>
						<summary>{licenseInfo.description}</summary>
						<ul class={style.details}>
							{ SECTIONS.map(this.renderSection) }
						</ul>
					</div>
				) }
			</div>
		);
	}
}
