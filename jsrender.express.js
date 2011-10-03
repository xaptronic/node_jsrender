var jsrender = require('./jsrender');

jsrender.views.registerTags({
	"partial": function (path, opts) {
		return this.data.partial(path, opts || {});
	},
	"layout": function () {
//		return this.data.layout();
		return "call layout..";
	}
});

exports.compile = function (markup, options) {
	jsrender.views.allowCode = true;

	options = options || {};
	var name = options.filename || markup;

	delete jsrender.views.templates[name];

	jsrender.template(name, markup);

	return function render(locals) {
		return jsrender.render(name, locals);
	};
};
