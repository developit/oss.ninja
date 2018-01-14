export default function ossNinja({ config }) {
	let model;

	if (PRERENDER) {
		model = require('./ossninja-worker');
	}
	else {
		model = require('workerize-loader?name=ossninja!./ossninja-worker')();
		delete model.getAllLicensesSync;
	}

	return model;
}
