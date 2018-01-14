import { Component } from 'preact';
import { Router } from 'preact-router';
import Provider from 'preact-context-provider';
import createStore from 'unistore';
import ossninja from '@lib/ossninja';
import Header from './header';
import Footer from './footer';
import Home from '../routes/home';
import License from '../routes/license';
import config from '../config.json';

const model = ossninja({ config });
const store = createStore();

export default function AppWrapper(props) {
	return (
		<Provider model={model} store={store}>
			<App {...props} />
		</Provider>
	);
}

class App extends Component {
	tq = [];

	track = e => {
		if (this.ga) this.ga.send('pageview', { dp: e.url });
		else this.tq.push(e);
	};

	handleRoute = e => {
		// ignore repeated routes (eg, when editing fields)
		if (!e.previous || e.url.split('?')[0]!==e.previous.split('?')[0]) {
			this.track(e);

			// a11y fix
			clearTimeout(this.timer);
			this.timer = setTimeout( () => {
				let h1 = typeof document!=='undefined' && document.querySelector('h1');
				if (h1 && h1!==this.h1) {
					h1.tabIndex = -1;
					h1.style.outline = 'none';
					h1.focus();
					document.title = h1.textContent + config.appTitleSuffix;
				}
				this.h1 = h1;
			}, 250);
		}
	};

	componentDidMount() {
		setTimeout( () => {
			import('ganalytics').then( ({ default: GAnalytics }) => {
				this.ga = new GAnalytics(config.gaTrackingId);
				this.tq.forEach(this.track);
				this.tq.length = 0;
			});
		}, 250);
	}

	render({ url }) {
		return (
			<div id="app">
				<Header />
				<Router url={url} onChange={this.handleRoute}>
					<Home path="/" />
					<License path="/:licenseId" />
					<License path="/:licenseId/:gh" githubInUrl />
				</Router>
				<Footer />

				{ typeof document==='undefined' && model.getAllLicensesSync && (
					<script dangerouslySetInnerHTML={{ __html: `window.ALL_LICENSES=${JSON.stringify(model.getAllLicensesSync())}` }} />
				) }

				<script>{`dataLayer=[['js',new Date()],['config','${config.gaTrackingId}']];function gtag(){dataLayer.push(arguments)}`}</script>
				<script async src="//www.googletagmanager.com/gtag/js?id=UA-6031694-25" />
			</div>
		);
	}
}
