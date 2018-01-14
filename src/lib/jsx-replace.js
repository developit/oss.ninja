export default function jsxReplace(str, pattern, callback) {
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