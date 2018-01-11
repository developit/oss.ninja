export default function ossNinja({ config }) {
	let model;

	if (typeof Worker==='function') {
		model = require('workerize-loader?name=ossninja!./ossninja-worker')();
		delete model.getAllLicensesSync;
	}
	else {
		model = require('./ossninja-worker');
	}

	return model;
}
