# jq-multi-select-search

jquery搜索框，模糊搜索，多项搜索


## 使用

```
let options = {
	
	type: 'both', //only_select:只能选择输入，only_input:只能键入(并用分号分隔)，both：两者皆可
    
    maxWordSize: null, //设置词条最大数目

    isFirstLoad: false, //ture: 键入前加载，false：边键入边异步加载

    isLoadAll: true, //在isFirstLoad=false的,isLoadAll才起作用， ture: 空白默认加载所有，false：只有键入值才显示提示

    placeholder: null, //占位

    allLoadUrl: './data/data.json', //url,直接load所有

    someLoadUrl: '', //url,筛选

    inputMaxSize: 20, //单次输入最大长度

    afterDisable: true, //选择后不可以再选择
	
};

```

使用实例：

js

```
	import { MultiSearch } from '../../src/index.js';

	(()=>{
	   new MultiSearch({
	      type: "both",
	      placeholder: "input",
	      maxWordSize: 4
	   });
	})();

```
html

```
	<div id="root" style="padding: 10px;height:500px">
		<div class="multi-select-search"></div>

	</div>

```

## Command

```
	#测试	
	npm run test	
	#打包	
	npm run build	
	#例子演示	
	npm run demo	
```


