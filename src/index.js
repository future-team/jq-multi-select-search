import '../css/index.less';
// import $ from 'jquery';
export MultiSearch from './multiSearch';

if(typeof(MultiSearch) == 'undefined'){
	window.MultiSearch = exports['MultiSearch'];
}

$.fn.extend({
	MultiSearch: function(opt){
		MultiSearch(this,opt);
		return this;
	}
});