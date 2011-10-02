var jsrender = require('./jsrender');

exports.compile = function (markup, options) {
	options = options || {};
	var name = options.filename || markup;

	jsrender.template(name, markup);

	return function render(locals) {
		return jsrender.render(name, locals);
	};
};
