import { h, Component } from 'preact';
import { Router } from 'preact-router';
import Provider from 'preact-context-provider';
import createStore from 'unistore';
import ossninja from '@lib/ossninja';
import Header from './header';
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
	handleRoute = ({ url, previous }) => {
		// ignore repeated routes (eg, when editing fields):
		if (previous && url.replace(/?.*$/,'')===previous.replace(/?.*$/,'')) return;
		// eslint-disable-next-line no-undef
		if (typeof gtag==='function') gtag('config', config.gaTrackingId, { page_path: url });
	};

	render({ url }) {
		return (
			<div id="app">
				<Header />
				<Router url={url} onChange={this.handleRoute}>
					<Home path="/" />
					<License path="/:licenseId" />
					<License path="/:licenseId/:gh" githubInUrl />
				</Router>

				{ typeof document==='undefined' && model.getAllLicensesSync && (
					<script dangerouslySetInnerHTML={{ __html: `window.ALL_LICENSES=${JSON.stringify(model.getAllLicensesSync())}` }} />
				) }

				<script>{`dataLayer=[['js',new Date()],['config','${config.gaTrackingId}']];function gtag(){dataLayer.push(arguments)}`}</script>
				<script async src="//www.googletagmanager.com/gtag/js?id=UA-6031694-25" />
			</div>
		);
	}
}
