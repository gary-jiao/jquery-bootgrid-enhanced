# jquery-bootgrid-enhanced
Enhanced jquery-bootgrid to support subtotal and search from other criteria fields in http form

#为什么需要
在使用jquery-bootgrid的过程中发现，其样式是比较符合我们的需求，但在功能上，跟jqGrid那些组件相比，的确偏弱，但考虑到项目比较简单，也基本够用。
但在使用过程中，发现缺少2个项目所需要的功能，一个是针对不同分组的小结功能，一个是使用我们自己的查询功能。
jquery-bootgrid自带的查询是一个输入框，但对于复杂查询貌似还没有支持，所以就自己实现了一下。
因为时间比较匆忙，主要考虑到功能实现，代码质量没有太多考虑，留待以后再去优化。

#主要改动
##增加分组小结汇总功能
主要是增加了以下参数：

```javascript

	grouping: true,			//是否开启分组显示功能
	groupingView: {
		groupField: 'catalog',		//根据哪个字段进行分组，目前只支持单个字段
		calculateFields: ['salary', 'bonus'],	//哪些字段需要进行汇总，只支持数字列
	    groupText: "<span class=\"subtotal-text\">小计</span>",		//小结那一行显示的文字
	    groupShowField: 'catalog',			//小结的文字显示在哪一列里
	    groupSummary: true,					
	    groupCssClass: '',
	    showTotalSummary: true				//是否需要全部的汇总信息，目前这个还没有支持，下一步准备实现
	}
```

##增加查询条件
主要增加以下配置选项：

```javascript

	queryTrigger: function(grid, searchFunc) {
		$('.btn-default').bind('click', function(e) {
	        searchFunc.call(grid, $('#queryDate').val());	
	        //这里的第2个参数，$('#queryDate').val()根据不同情况决定如何使用，这个参数其实是控制是否要进行查询。
		//因为对于jquery-bootgrid，如果查询参数与上次一样，是不会重新进行查询操作的。
	        //如果希望不管查询参数是否改变，每次都进行查询，最简单的办法是传入一个随机数，或者当前时间
	    });
	},
	queryCriterias: function() {
		return $('.form-horizontal').serializeObject();
	},

```

## 增加对本地json数据的支持
Bootgrid默认只支持2种数据加载模式，一种是html直接渲染，一种是使用ajax方式，但如果需要把本地获取的json数据里的一部分拿来渲染表格，就无法支持了。现在增加了这个功能上的支持，
在配置项里增加了一个jsonData节点，还是借用ajax模式，只要按照要示的json格式配置jsonData属性，就可以正确渲染表格。<br/>
注意，使用这种模式时，url属性还是必须有，但url的值可以随意，只要不为空即可。因为bootgrid原生的功能是要求在ajax模式下必须有url，改造功能时没有去掉这个限制。  
然后引入了mockjax组件，因为发现如果url的功能不启用，那么在排序、分页等功能方面，bootgrid有些问题。相关代码在352~358行之间。

```javascript

	grid = $("#grid-weekly-revenue").bootgrid({
		ajax: true,
		jsonData: {
			current: 1,
			rowCount: 10,
			total: 1000,
			rows: [...]
		},
		url: 'test'
	});
```

## 排序时提交字段的方式
默认情况下，bootgrid在排序字段提交时，会使用 sort[name]=asc 这样的方式，但问题在于这种参数提交对于后台的处理来说，非常不方便，后台正常情况下能够容易处理的方式是： sortBy=name&sortDir=asc。
要实现这个功能，只需要添加一个requestHandler即可。

```javascript
	
	//根据项目需要，可以整理成任意想要的格式
    //但是这里只处理了单字段排序的情况，如果开启了多字段排序功能，则需要自行处理
	requestHandler: function (request) {
	  if (request.sort) {
	    request.sortBy = Object.keys(request.sort)[0]; //this only gets first sort param
	    request.sortDir = request.sort[request.sortBy];
	    delete request.sort
	  }
	  return request;
	},

```