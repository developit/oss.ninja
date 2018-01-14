const ALIASES = [
	{
		key: 'bsd',
		type: 'alias',
		to: 'bsd-3-clause'
	}
];

let ctx = require.context('!!file-loader?name=licenses/[name].[ext]!license.js/licenses', false, /\.txt/);
const LICENSES = ctx.keys().map( id => {
	let name = id.replace(/(^.*\/|\.[^.]+$)/g, '');
	let key = normalizeName(name);
	return { key, name, type: 'license', url: location.origin+ctx(id) };
});

// for SSR
export function getAllLicensesSync() {
	return LICENSES.concat(ALIASES).map( ({ name, key }) => ({ name, key }) );
}

export async function getAllLicenses() {
	return LICENSES.concat(ALIASES);
}

const GET_CACHE = {};
function get(url, as='json') {
	let key = url+'\n'+as;
	return GET_CACHE[key] || (GET_CACHE[key] = fetch(url).then( r => r.ok ? r[as]() : Promise.reject(`Error ${r.status}`) ));
}

export async function getLicense(name) {
	let info = findLicense(normalizeName(name));
	if (info==null) throw Error('Not Found');
	let text = await get(info.url, 'text');
	return { info, text };
}

export async function getGithubProfile(username) {
	return await get(`https://api.github.com/users/${encodeURIComponent(username)}`, 'json');
}

export async function getSimplifiedLicense(name) {
	let info = findLicense(normalizeName(name));
	if (info==null) throw Error('Not found');
	let result = await get(`https://api.github.com/licenses/${encodeURIComponent(info.name)}`, 'json');
	if (result.description) result.description = result.description.replace(/<.*?>/g, '');
	return result;
}

function normalizeName(name) {
	return String(name).toLowerCase().replace(/[ -]+/g, '-');
}

function findLicense(key) {
	let license = pluck(LICENSES, 'key', key);
	if (license!=null) return license;
	let alias = pluck(ALIASES, 'key', key);
	if (alias!=null) return findLicense(alias.to);
}

function pluck(arr, key, value) {
	for (let i=arr.length; i--; ) if (arr[i][key]===value) return arr[i];
}
