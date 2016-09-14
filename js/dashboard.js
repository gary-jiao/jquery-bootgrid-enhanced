var showError = function() {
	$('.alert-dismissable').html('有错误发生，请重新尝试！')
};

var getDataArray = function(arr, field) {
	var rtn = [];
	arr.forEach(function(item) {
		rtn.push(item[field]);
	});
	return rtn;
};

var getDataMap = function(arr, f1, f2) {
	var rtn = [];
	arr.forEach(function(item) {
		var obj = {};
		obj['name'] = item[f1];
		obj['value'] = item[f2];
		rtn.push(obj);
	});
	return rtn;
}

var deeplyMerge = function(obj1, obj2) {
	for (var p in obj2) {
		try {
			// Property in destination object set; update its value.
			if (obj2[p].constructor == Object) {
				obj1[p] = deeplyMerge(obj1[p], obj2[p]);
			} else if (obj2[p].constructor == Array) {
				for (var i = 0; i < obj2[p].length; i++) {
					obj1[p][i] = deeplyMerge(obj1[p][i], obj2[p][i]);
				}
			} else {
				obj1[p] = obj2[p];
			}
		} catch(e) {
			// Property in destination object not set; create it and set its value.
			obj1[p] = obj2[p];
		}
	}
	return obj1;
}

$(function() {
	option_daypr = {
	    tooltip : {
	        trigger: 'axis'
	    },
	    legend: {
	    	x: 'left',
	    	orient: 'vertical',
	        data:['房间数','出租数']
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            dataView : {show: false, readOnly: false},
	            magicType : {show: true, type: ['line', 'bar']}
	        }
	    },
	    calculable : true,
	    xAxis : [
	        {
	            type : 'category',
	            data : []
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    series : [
	    	{
	            name:'2',
	            type:'bar',
	            data:[]
	        },
	        {
	            name:'1',
	            type:'bar',
	            data:[]
	        }
		]
	};

	var chart_daypr = echarts.init($('#chart_daypr')[0]);
	chart_daypr.setOption(option_daypr, true);

	$.ajax({
		url: 'data/chart_daypr.json',
		dataType: 'json',
		success: function(data) {
			if (data.status != '1') {
				showError();
				return;
			}
			var opts = {
			    xAxis : [
			        {
			            type : 'category',
			            data : getDataArray(data.records, 'rtcode')
			        }
			    ],
			    series : [
			        {
			            name:'房间数',
			            type:'bar',
			            data: getDataArray(data.records, 'act')
			        },
			        {
			            name:'出租数',
			            type:'bar',
			            data: getDataArray(data.records, 'cnt')
			        }
			    ]
			};
			$.extend(option_daypr, opts);
			chart_daypr.setOption(option_daypr, true);		
		}
	});
	
});

$(function() {
	option_roomtype = {
	    tooltip : {
	        trigger: 'item',
	        formatter: "{b} : {c} ({d}%)"
	    },
	    legend: {
	    	itemHeight: '10',
	        //orient : 'vertical',
	        x : 'center',
	        y: 'top',
	        data:['']
	    },
	    calculable : true,
	    series : [
	        {
	            name:'房型',
	            type:'pie',
	       		itemStyle: {
	       			normal : {
	                    label : {
	                        position : 'outer',
	                        formatter: '{d}%'
	                    },
	                    labelLine : {
	                        show : true
	                    }
	                },
	       		},
	            radius : '55%',
	            center: ['50%', '60%'],
	            data:['']
	        }
	    ]
	};
	                    

	var chart_roomtype = echarts.init($('#chart_roomtype')[0]);
	chart_roomtype.setOption(option_roomtype, true);

	$.ajax({
		url: 'data/chart_roomtype.json',
		dataType: 'json',
		success: function(data) {
			if (data.status != '1') {
				showError();
				return;
			}
			var opts = {
				legend: {
			        data: getDataArray(data.records, 'rtroomname')
			    },
			    series : [
			        {
			            data: getDataMap(data.records, 'rtroomname', 'act')
			        }
			    ]
			};
			option_roomtype = deeplyMerge(option_roomtype, opts);
			console.log(option_roomtype);
			chart_roomtype.setOption(option_roomtype, true);		
		}
	});
	
});

$(function() {
	option_checkin = {
	    tooltip : {
	        trigger: 'item',
	        formatter: "{b} : {c} ({d}%)"
	    },
	    legend: {
	    	itemHeight: '10',
	        //orient : 'vertical',
	        x : 'center',
	        y: 'top',
	        data:['']
	    },
	    calculable : true,
	    series : [
	        {
	            name:'房型',
	            type:'pie',
	       		itemStyle: {
	       			normal : {
	                    label : {
	                        position : 'outer',
	                        formatter: '{d}%'
	                    },
	                    labelLine : {
	                        show : true
	                    }
	                },
	       		},
	            radius : '55%',
	            center: ['50%', '60%'],
	            data:['']
	        }
	    ]
	};             

	var chart_checkin = echarts.init($('#chart_checkin')[0]);
	chart_checkin.setOption(option_checkin, true);

	$.ajax({
		url: 'data/chart_checkin.json',
		dataType: 'json',
		success: function(data) {
			if (data.status != '1') {
				showError();
				return;
			}
			var opts = {
				legend: {
			        data: getDataArray(data.records, 'n')
			    },
			    series : [
			        {
			            data: getDataMap(data.records, 'n', 'cnt')
			        }
			    ]
			};
			option_checkin = deeplyMerge(option_checkin, opts);
			console.log(option_checkin);
			chart_checkin.setOption(option_checkin, true);		
		}
	});
	
});