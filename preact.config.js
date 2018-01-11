import path from 'path';
import asyncPlugin from 'preact-cli-plugin-async';
import netlifyPlugin from 'preact-cli-plugin-netlify';
import WebpackCritical from 'webpack-critical';

export default (config, env, helpers) => {
	asyncPlugin(config);

	if (env.production) {
		netlifyPlugin(config);

		// Inline Critical CSS
		config.plugins.push(
			new WebpackCritical({
				context: env.dest
			})
		);
	}

	// @lib/foo is convenient
	config.resolve.alias['@lib'] = path.resolve(__dirname, 'src/lib');

	// Exempt the homepage from lazy-loading
	helpers.getLoaders(config).forEach( ({ loaders, rule }) => {
		if (loaders && String(loaders).match(/async-component-loader/)) {
			rule.exclude = [
				/\/routes\/home(\/index\.[a-z]+|\.js)$/gi
			].concat(rule.exclude || []);
		}
	});
};