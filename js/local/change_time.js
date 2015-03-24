var pomelo = null;

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function save(i)
{
	$.cookies.set('tab_1', 'tab'+i);
}

function setScroll()
{
	if(window.pageYOffset) 
	{    // all except IE    
		y = window.pageYOffset;    
	} else if(document.documentElement && document.documentElement.scrollTop) 
	{    // IE 6 Strict    
		y = document.documentElement.scrollTop;    
	} else if(document.body) {    // all other IE    
		y = document.body.scrollTop;    
	} 
	//	var x = document.body.scollTop; 
	$.cookies.set('top_1', y);
}
function setScroll()
{
}
$(document).ready(function(){
		$("#back-to-top").hide();
		//当滚动条的位置处于距顶部100像素以下时，跳转链接出现，否则消失
		$(window).scroll(function()
			{
			if ($(window).scrollTop()>100){
			$("#back-to-top").fadeIn(1500);
			}
			else
			{
			$("#back-to-top").fadeOut(1500);
			}
			});
		//当点击跳转链接后，回到页面顶部位置
		$("#back-to-top").click(function(){
			$('body,html').animate({scrollTop:0},1000);
			return false;
			});
		//	$("#usual1 ul").idTabs(); 
		window.onscroll = setScroll;
		t = $.cookies.get('top_1');
		if(window.pageYOffset) 
		{    // all except IE    
			window.pageYOffset = t;    
		} else if(document.documentElement && document.documentElement.scrollTop) 
		{    // IE 6 Strict    
			document.documentElement.scrollTop = t;    
		} else if(document.body) {    // all other IE    
			document.body.scrollTop = t;    
		} 
		var s = "tab1";
		var t = 0;
		if($.cookies.get('tab_1') != null){
			s = $.cookies.get('tab_1');
		}

		$("#usual1 ul").idTabs(s); 

		//初始化files servs
		$.post("dispatch.php",{
			"func": "check",	
		},
		function(data){
			if (data !="") {
				$("#name").text(data);
			} else {
				location.href="login.html";
			}
		},"text");	

		//初始化files servs
		$.post("dispatch.php",{
			"func": "init",		
		},
		function(data){
			//init files
			var file_names = [];	
			for (var i in data[2]) {
				file_names[i] = data[2][i]; 
			}
			for (var i in data[1]) {
				file_names[i] = file_names[i] + "-" + data[1][i];
				$('#files').append("<option value='"+i+"'>"+file_names[i]+"</option>");
			}

			for (var i in data[0]) {
				$('#servs').append("<option value='"+i+"'>"+data[0][i]["serv"]+"</option>");
				$('#gates').append("<option value='"+i+"'>"+data[0][i]["serv"]+"</option>");
			}
		
			//保存到cookie里面
			$.cookies.set("servs", data[0]);

			require('boot');
			pomelo = window.pomelo;
		},"json");	

		//初始化echart
		var chartid = document.getElementById('chart');
		var myChart = echarts.init(chartid);
		var option = {
			title : {
				text: 'ev_serv性能测试',
			//	subtext: '并发测试',
				y : '20'
			},
			tooltip : {
				trigger: 'axis'
			},
			legend: {
				data:['最高气温','最低气温']
			},
			toolbox: {
				show : true,
				y : 20,
				feature : {
					mark : {show: true},
					dataView : {show: true, readOnly: false},
					magicType : {show: true, type: ['line', 'bar']},
					restore : {show: true},
					saveAsImage : {show: true}
				}
			},
			calculable : true,
			xAxis : [
				{
				type : 'category',
				boundaryGap : false,
				data : ['周一','周二','周三','周四','周五','周六','周日']
			}
			],
			yAxis : [
				{
				type : 'value',
				axisLabel : {
					formatter: '{value} °C'
				}
			}
			],
			series : [
				{
				name:'最高气温',
				type:'line',
				data:[11, 11, 15, 13, 12, 13, 10],
				markPoint : {
					data : [
						{type : 'max', name: '最大值'},
						{type : 'min', name: '最小值'}
					]
				},
				markLine : {
					data : [
						{type : 'average', name: '平均值'}
					]
				}
			},
			{
				name:'最低气温',
				type:'line',
				data:[1, -2, 2, 5, 3, 2, 0],
				markPoint : {
					data : [
						{name : '周最低', value : -2, xAxis: 1, yAxis: -1.5}
					]
				},
				markLine : {
					data : [
						{type : 'average', name : '平均值'}
					]
				}
			}
			]
		};
		myChart.setOption(option);
});

function handle(option) {
	switch(option){
		case 'dispatch_one': {
			var sname = $("#servs option:selected").text();
			var fname = $("#files option:selected").text();
			if (window.confirm("您确认将" + fname + "上传到" + sname + "吗?")) {
				$('#dispatch').text("");
				$.post("dispatch.php",{
					"func":"dispatch_file",		
					"sid": $("#servs").val(), 
					"fid": $("#files").val()
				},
				function(data){
					$('#dispatch').append(data);
				},"text");	
			} 
			break;
		}
		case 'dispatch_all': {
			var fname = $("#files option:selected").text();
			if (window.confirm("您确认将" + fname + "上传到所有服务器上吗?")) {
				$('#dispatch').text("");
				var servs = $.cookies.get("servs");
				for (var i in servs) {
					$.post("dispatch.php",{
						"func":"dispatch_file",		
						"sid": i, 
						"fid": $("#files").val()
					},
					function(data){
						$('#dispatch').append(data);
					},"text");	
				}
			}

			break;
		}
		case 'down': {
			$('#dispatch').text("........");
			$.post("dispatch.php",{
				"func": "down",		
				"sid": $("#servs").val(), 
				"fid": $("#files").val()
			},
			function(data){
				if (data != "") {
					$('#dispatch').text("下载成功!");
					location.href = "down.php?src=" + data;
				} else {
					$('#dispatch').text("下载失败!");
				}
			},"text");	

			break;
		}

	}
}

function leave() {
	$.post("dispatch.php",{
		"func":"leave"
	},
	function(data){
		location.href = "login.html";
	},"text");	
}

function login_serv(){
	var clientVersion = "1.10.0";
	var gate = $("#gates").val();
	var mid = $('#mid').val();
	var passwd = $('#mpasswd').val();

	$("#login_msg").text("登陆中……");

	pomelo.disconnect();	
	var servs = $.cookies.get("servs");
	pomelo.init({
		host: servs[gate]["gate"], 
		port: servs[gate]["gateport"], 
	}, function() {
		//查询connector
		console.log('init success');
		pomelo.request("gate.gateHandler.queryconnector", {
			name : mid, 
			pwd: passwd, 
			clientVersion: clientVersion
		}, function(data) {
			pomelo.disconnect();	
			//连接connector 发送消息
			pomelo.init({
				host: data.host, 
				port: data.port, 
				log: true,
				handshakeCallback :  function() {
					console.log("handshake");
				}
			}, function() {
				console.log("connect to connector");
				$("#login_msg").text("登陆成功");
				pomelo.request("connector.entryHandler.entry", {
					name: mid, 
					pwd : passwd, 
					clientVersion : clientVersion, 
					guid: "b8ccb69a-19e0-20ca-79c1-b245d117cc6b"
				}, function(data) {
					pomelo.on("onSendMsg", function(data) {
						alert("发送成功,消息为:" + data.msg + ";次数为:" + data.times);
					});
				});
			});
		});
	});
}	

function broadcast() {
	var content = $("#broad_msg").val();
	var times = $("#times").val();
	pomelo.request("gm.gmHandler.sendMsg", {
		content: content,
		times: times
	}, function(data) {
		console.log(data);
	});
}
