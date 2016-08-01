'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _optionsJs = require('./options.js');

var _optionsJs2 = _interopRequireDefault(_optionsJs);

var MultiSearch = (function () {
	function MultiSearch(options) {
		_classCallCheck(this, MultiSearch);

		this.opts = _jquery2['default'].extend({}, _optionsJs2['default'], options);
		//this.data = ["a1","ab2","a3","bb1","b2","b3","c1","c2","c3"];
		this.catchMap = new Map();
		this.bind();
	}

	MultiSearch.prototype.getData = function getData(pre) {
		var _this = this;

		console.log("pre " + pre);
		if (pre == 'a') _jquery2['default'].getJSON('./data/data_a.json', function (data) {
			console.dir(data);
			_this.catchMap.set(pre, data);
		});else if (pre == 'b') _jquery2['default'].getJSON('./data/data_b.json', function (data) {
			console.dir(data);
			_this.catchMap.set(pre, data);
		});else this.catchMap.set(pre, {});
	};

	MultiSearch.prototype.bind = function bind() {
		var _this2 = this;

		_jquery2['default']("input").on("input propertychange focus", function () {
			setTimeout(function () {
				_this2.showTip();
			}, 200);
		});
		_jquery2['default']("body").on("mousedown", function (e) {
			if (!_jquery2['default'](e.target).hasClass("item")) _jquery2['default']("ul").hide();
		});
		_jquery2['default']("ul").on("click", "li", function (e) {
			e.preventDefault();
			e.stopPropagation();
			var con = _jquery2['default'](e.target).text();
			_this2.addWord(con);
			_jquery2['default']("ul").hide();
		});
		_jquery2['default'](".multi-search").on("click", ".word .close", function (e) {
			e.preventDefault();
			e.stopPropagation();
			var that = _jquery2['default'](e.target).parents(".word");
			that.remove();
		});
	};

	MultiSearch.prototype.showTip = function showTip() {
		var inText = _jquery2['default']("input").val().trim();
		if (inText.endsWith(";") || inText.endsWith("；")) {
			this.addWord(inText.substring(0, inText.length - 1));
		}

		_jquery2['default']("ul").html("");

		/*this.catchMap.forEach((item)=>{
  	if(item.includes(inText))
  		$("ul").append("<li class='item' value='"++"'>"+item+"</li>"); 
  });*/

		if (this.catchMap.has(inText)) {
			console.log("has pre: " + inText);
			var data = this.catchMap.get(inText);
			data.forEach(function (item) {
				_jquery2['default']("ul").append("<li class='item' value='" + item.value + "'>" + item.context + "</li>");
			});
		} else {
			console.log("no pre: " + inText);
			this.getData(inText);
			var data = this.catchMap.get(inText);
			data.forEach(function (item) {
				_jquery2['default']("ul").append("<li class='item' value='" + item.value + "'>" + item.context + "</li>");
			});
		}

		_jquery2['default']("ul").show();
	};

	MultiSearch.prototype.addWord = function addWord(con) {
		_jquery2['default']("input").before("<span class='word'>" + con + "<span class='close'>×</span></span>");
		_jquery2['default']("ul").hide();
		_jquery2['default']("input").val("");
		_jquery2['default']("input").focus();
	};

	return MultiSearch;
})();

exports['default'] = function () {
	var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	return new MultiSearch(options);
};

module.exports = exports['default'];