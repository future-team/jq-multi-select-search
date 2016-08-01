// import $ from 'jquery';
import opts from './options.js';
import {addProperty,Map} from './util.js';
import panelTpl from '../template/panel.html';
import listTpl from '../template/list.html';
import wordTpl from '../template/word.html';

class MultiSearch{
	constructor(options){
		this.opts = $.extend({}, opts, options);
		this.init();
		
		if(this.isFirstLoad)
			this.firstLoad();
		this.bind();
	}

	init(){
		this.maxWordSize = this.opts.maxWordSize;
		this.isLoadAll = this.opts.isLoadAll;
		this.type = this.opts.type;
		this.inputMaxSize = this.opts.inputMaxSize;
		this.isFirstLoad= this.opts.isFirstLoad;
		this.allLoadUrl= this.opts.allLoadUrl;
		this.someLoadUrl= this.opts.someLoadUrl;
		this.parameterName = this.opts.parameterName;
		this.placeholder= this.opts.placeholder;
		this.afterDisable= this.opts.afterDisable;
		//this.cache = this.opts.cache;

		this.wordSize = 0;
		this.contents = []; //选择的
		this.values = []; //选择的
		this.catchMap = new Map();
		this.cacheKeys = [];
		addProperty();

		$('.multi-select-search').html(panelTpl());

		if(this.placeholder!=null)
			$('.input-box').prop("placeholder",this.placeholder);
	}

	firstLoad(){
		$.getJSON(this.allLoadUrl, (data)=>{
				this.catchMap.set('',data);
				this.cacheKeys.push('');
			});
	}

	bind(){

		let time;
		$(".input-box").on("input propertychange click",()=>{

			// console.log("input-box click");
			this.changeWidth();
			
			let inText = $(".input-box").val().trim();

			if(this.type != 'only_select'){
				
				$('.input-box').prop("maxlength",this.inputMaxSize);
				if(inText.endsWith(";")||inText.endsWith("；")){
					this.addWord(inText.substring(0,inText.length-1),inText.substring(0,inText.length-1));
					return;
				}
			}

			if(this.type != 'only_input'){
				clearTimeout(time);
				time = setTimeout(()=>{this.showTip()}, 200);
			}
			
		});

		$("body").on("click",(e)=>{
			if(!$(e.target).hasClass("item")&&$(e.target).prop("id")!='list'&&!$(e.target).hasClass("input-box")&&!$(e.target).hasClass("multi-search")){
				this.hideUl();
			}
		});

		$(".list").on("click", "li",(e)=>{
			e.preventDefault();
            e.stopPropagation();
			let con = $(e.target).text();
			let value = $(e.target).prop("value");
			//console.log("value: "+value);
			if($(e.target).hasClass("disabled"))
				return;
			this.addWord(con,value);
			this.hideUl();
		});

		$(".multi-search").on("click",(e)=>{
			if($(e.target).hasClass("multi-search")&&this.wordSize<this.maxWordSize){
				//console.log("transfer");
				$(".input-box").focus();
				$(".input-box").click();
			}
		});

		$(".multi-search").on("click",".word .close",(e)=>{
			e.preventDefault();
            e.stopPropagation();
            let that = $(e.target).parents(".word");

            let con= that.attr("content");
            
            this.contents = this.grep(this.contents,con);
            //this.values.splice(0,1,that.attr("value"));
            this.values = this.grep(this.values,that.attr("value"));
            $(".values").val(this.values.join(";"));

            $("[con='"+con+"']").removeClass("disabled");

           // console.log(con);
            that.remove();
            this.wordSize--;
            if(this.maxWordSize!=null)
           		this.wordSize<this.maxWordSize?$(".input-box").show():$(".input-box").hide();
            
            if(this.wordSize == 0)
       			$(".input-box").prop("placeholder",this.placeholder);
            $(".input-box").focus();
		});
	}

	grep(array,item){
		let temp= [];
		temp = $.grep(array,(val,key)=>{
			if(val!=item)
				return true;
		},false);
		return temp;
	}

	changeWidth(){
		let text = $(".input-box").val();
		let textWidth = text.visualLength();
		let inputWidth = $(".input-box").width();
		let boxWidth = $(".multi-search").width()-12;
		// console.log("textWidth: "+textWidth);
		// console.log("inputtext: "+inputWidth);
		if(textWidth >= inputWidth)
			$(".input-box").width(boxWidth<inputWidth+50?boxWidth:inputWidth+50);
		
		else if(inputWidth-textWidth>50)
			$(".input-box").width(inputWidth-parseInt((inputWidth-textWidth)/50)*50);
	}

	getData(pre){
	
		if(pre=='a')
			$.getJSON('./data/data_a.json', {pre:pre}, (data)=>{
				this.catchMap.set(pre,data);
				this.cacheKeys.push(pre);
				data.forEach((item)=>{
					$(".list").append(listTpl({
						value: item.value,
						content: item.content,
						disabled: this.isDisabled(item.content)
					})); 
				});
				data.length>0?this.showUl():this.hideUl();
			});
		else if(pre=='b')
			$.getJSON('./data/data_b.json', {pre:pre}, (data)=>{
				this.catchMap.set(pre,data);
				this.cacheKeys.push(pre);
				data.forEach((item)=>{
					$(".list").append(listTpl({
						value: item.value,
						content: item.content,
						disabled: this.isDisabled(item.content)
					})); 
				});
				data.length>0?this.showUl():this.hideUl();
			});
		else if(pre==''){
			if(this.isLoadAll){
				$.getJSON(this.allLoadUrl, (data)=>{
					this.catchMap.set(pre,data);
					this.cacheKeys.push(pre);
					data.forEach((item)=>{
						$(".list").append(listTpl({
							value: item.value,
							content: item.content
						})); 
					});
					data.length>0?this.showUl():this.hideUl();

				});
			}else{
				this.hideUl();
			}

		}
		else{
			this.catchMap.set(pre,[]);
			this.cacheKeys.push(pre);
		}
		
	}


	showTip(){
		
		let inText = $(".input-box").val().trim();

		$(".list").html('');

		let key;
		if(this.catchMap.has(inText)){
			// console.log("has key: "+inText);
			let data = this.catchMap.get(inText);
			data.forEach((item)=>{
				$(".list").append(listTpl({
					value: item.value,
					content: item.content,
					disabled: this.isDisabled(item.content)
				})); 

			});

			data.length>0?this.showUl():this.hideUl();

		}else if((key=this.getKey(inText))!=null){
			// console.log("include key："+key);
			let data = this.catchMap.get(key);
			let newdata = [];
			data.forEach((item)=>{
				if(item.content.includes(inText)){
					newdata.push(item);
					$(".list").append(listTpl({
						value: item.value,
						content: item.content,
						disabled: this.isDisabled(item.content)
					})); 
				}
			});
			//如果前面对应的数据已是空的，后面的就没必要加入cacheMap里了。
			if(data.length!=0){
				this.catchMap.set(inText,newdata);
				this.cacheKeys.push(inText);
			}
			newdata.length>0?this.showUl():this.hideUl();

		}else{
			// console.log("fetch key: "+inText);
			this.getData(inText);
		}
	}

	isDisabled(content){
		// console.log(content);
		// console.log(this.contents);
		// console.log($.inArray(content,this.contents));
		return $.inArray(content,this.contents)>=0?true:false;
	}

	getKey(inText){
		
		let key = '';
		let flag = false;
		for(let item of this.cacheKeys)
			if(inText.includes(item)&&item.length>=key.length){
				flag = true;
				key=item;
			}
		// console.dir(this.catchMap);
		// console.dir(this.cacheKeys);
		// console.log(flag==true?key:null);
	    return flag==true?key:null;
	}

	showUl(){
		$('.multi-search').addClass('no-border-radius');
		$('.list').show();
		// console.log("show");
	}

	hideUl(){
		$('.multi-search').removeClass('no-border-radius');
		$('.list').hide();
		// console.log("hide");
	}

	addWord(con,value){
		$(".input-box").before(wordTpl({
			value:value,
			con:con
		}));
		this.contents.push(con+"");
		this.values.push(value+"");
		$(".values").val(this.values.join(";"));

		this.wordSize++;
		if(this.maxWordSize!=null)
			this.wordSize<this.maxWordSize?$(".input-box").show():$(".input-box").hide();
		
		$(".list").hide();
		$(".input-box").val("");
		$(".input-box").width(50);
		$(".input-box").prop("placeholder","");
		$(".input-box").focus();
	}

}


export default (options = {})=> {
	return new MultiSearch(options)
};