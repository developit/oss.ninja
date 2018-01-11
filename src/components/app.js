import { h, Component } from 'preact';
import { Router } from 'preact-router';
import Provider from 'preact-context-provider';
// import GAnalytics from 'ganalytics';
import createStore from 'unistore';
import ossninja from '@lib/ossninja';
import Header from './header';
import Home from '../routes/home';
import License from '../routes/license';
import config from '../config.json';

// const ga = new GAnalytics(config.gaTrackingId, { aid: 1 });
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
	handleRoute = () => {
		if (this.ga) this.ga.send('pageview');
	};

	componentDidMount() {
		setTimeout( () => {
			import('ganalytics').then( ({ default: GAnalytics }) => {
				this.ga = new GAnalytics(config.gaTrackingId, { aid: 1 });
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

				<link href="https://fonts.googleapis.com/css?family=Permanent+Marker|Quicksand" rel="stylesheet" />

				{ typeof document==='undefined' && model.getAllLicensesSync && (
					<script dangerouslySetInnerHTML={{ __html: `window.ALL_LICENSES=${JSON.stringify(model.getAllLicensesSync())}` }} />
				) }
			</div>
		);
	}
}
