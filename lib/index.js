'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('../css/index.less');

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _multiSearch = require('./multiSearch');

var _multiSearch2 = _interopRequireDefault(_multiSearch);

exports.MultiSearch = _multiSearch2['default'];

if (typeof MultiSearch == 'undefined') {
	window.MultiSearch = exports['MultiSearch'];
}

_jquery2['default'].fn.extend({
	MultiSearch: (function (_MultiSearch2) {
		function MultiSearch(_x) {
			return _MultiSearch2.apply(this, arguments);
		}

		MultiSearch.toString = function () {
			return _MultiSearch2.toString();
		};

		return MultiSearch;
	})(function (opt) {
		MultiSearch(this, opt);
		return this;
	})
});