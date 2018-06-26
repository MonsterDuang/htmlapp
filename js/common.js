var ua = navigator.userAgent.toLocaleLowerCase();

var iosDownLoadUrl = 'https://itunes.apple.com/cn/app/%E8%89%BA%E6%96%B9%E8%B4%AD/id1321524438?mt=8';
var androidDownLoadUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.yitao.juyiting';
var appSchema = "'yfg://m.native.com/visitor/webView?url='";
var _appName;
var _appVersion;
var _osVersion;
// const qiniuPath = "http://ow90m0wgs.bkt.clouddn.com/";
const qiniuPath = "http://img.aworld.cn/";

var _Api= {
    appraisalorder:'/my/appraisal/appraisalorder', //鉴定师订单列表
    appraisal:'/my/appraisal',//我的鉴定列表
    mydetails:"/my/appraisal/mydetails", //我的鉴定详情
    sendmsg:"/my/message/sendmsg", //催促
    assess:"/appraisal/assess/all", //评价鉴定师
    appraisaldetails:"/my/appraisal/appraisaldetails", //鉴定师列表详情

}

const appVersions = /app_version:(\d+.\d+.?\d+.?)/i.exec(ua);

if (Array.isArray(appVersions)) {
    _appVersion = appVersions[1];
}

const osVersions = /android (\d+.\d+.?\d+.?)/i.exec(ua);
if (Array.isArray(osVersions)) {
	_osVersion = osVersions[1];
}

function sliceSrc(params){
	// var path = "http://ow90m0wgs.bkt.clouddn.com/";
	var path = "http://img.aworld.cn/";
    if(typeof params==="string"){
        if(params.indexOf(path)<0)return;

		return params.replace(path,"")

    }else if(typeof params==="object"){
    	var newArr = [],Val
        params.forEach((Key,Index,Arr)=>{
			if(Arr[Index].indexOf(path)>-1){
                Val = Arr[Index].replace(path,"")
                newArr.push(Val)
			}else{
                newArr.push(Arr[Index])
			}
		})
		return newArr;
    }
}

function timeFormat(time) {
    if(!time-0)return;
    var T = time-0,minute,second;
    T>=60&&T!==0?
        minute="0"+Math.floor(T/60):
        minute="00";
    second=T%60;
    second<9?second="0"+second:second;
    return minute+":"+second
}

var env = {
	osVersion: _osVersion,
	appName: _appName,
	appVersion: _appVersion,
	isAndroid: /android/i.test(ua),
	isIos: !!ua.match(/\(i[^;]+;( u;)? cpu.+mac os x/i),
	isWechat: /(micromessenger|webbrowser)/.test(ua.toLocaleLowerCase())
}

// dev
// var baseApi = 'http://127.0.0.1:8000/api';

//sisi
// var baseApi = 'http://192.168.1.33:8000/api';
// prd
// var baseApi = 'http://49.4.13.104/api';
// var baseApi = 'http://aworld.cn/api';
// var baseApi = 'http://192.168.0.172:2589/api';
var baseApi = '/api';
function api(path) {
	return baseApi + path;
}

function resolvePath(relativePath) {
	var basePath = location.href;
	var regx = /^.+?:\/\/\/?/;
	var regxRes = regx.exec(basePath);
    var prefix = regxRes ? regxRes[0] : '';
	var path = basePath.substring(prefix.length, basePath.length);
	var pathDir = path.substring(0, path.lastIndexOf('/'));

	var temp = pathDir + '/' + relativePath;

	var parts = temp.split('/'),
		res = [];
	for (var i = 0; i < parts.length; i++) {
		var p = parts[i];
		if (!p || p === '.') {
			continue;
		}
		if (p == '..') {
			if (res.length) {
				res.pop();
			} else {
				res.push('..');
			}
		} else {
			res.push(p);
		}
	}

	var resolvedAbsolute = res.join('/');
	return prefix + resolvedAbsolute;
};

function forward(uri, params) {
	var to;
	if (/http/.test(uri) || /yfg:/.test(uri)) {
		to = uri;
	} else {
        to = resolvePath(uri);
	}
    if (window.Page) {
		if (!params) {
			window.Page.forward(JSON.stringify({
				url: to
			}));
		} else {
			window.Page.forward(JSON.stringify({
				url: to,
				nparams: JSON.stringify(params)
			}));
		}

	} else {
		location.href = to;
	}
}

function back() {
	console.info(1);
	if (window.Page) {
        window.Page.nativeBackkey('one',"two","three")
        // window.Page.back();
	} else {
		history.back();
	}
}

function backTop() {
	if (window.Page) {
		window.Page.backTop(JSON.stringify({}));
	} else {
		history.back();
	}
}

function _fmtDate(date, fmt) { //author: meizz 
	var o = {
		"M+": date.getMonth() + 1, //月份 
		"d+": date.getDate(), //日 
		"h+": date.getHours(), //小时 
		"m+": date.getMinutes(), //分 
		"s+": date.getSeconds(), //秒 
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度 
		"S": date.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};

function dateTime(time, format) {
	format = format || 'yyyy-MM-dd hh:mm:ss';
	if (typeof time === 'undefined' || !time) {
		return '';
	} else {
		return _fmtDate(new Date(time), format);
	}
}

//格式化显示性别
function formatGender(gender) {
	return gender == 'M'||gender == '' ? '男' : '女';
}

function getUrlParams() {
	var url = location.search; //获取url中"?"符后的字串
    var obj = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for (var i = 0; i < strs.length; i++) {
			obj[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
		}
	}
	return obj;
}

function getUrlId() {
    var href = location.href;
    if(href.indexOf("?")>-1){
        var sp = href.split("?")[1]
        return sp;
    }
}

function NewgetUrlParams() {
    var href = location.href
    if(href.indexOf("?")>-1){
        var sp = href.split("?")
        var sp2 = sp[1].split("=")[1]
        if(sp2){
			return sp2
		}else {
            return false
		}
	}
}

function NewgetUrlParams_app() {
    var href = location.href
    if(href.indexOf("?")>-1){
        var sp = href.split("?")
        if(sp[1]){
            return sp[1]
        }else {
            return false
        }
    }
}

function Jparse(value) {
    return JSON.parse(decodeURIComponent(value))
}

function Jstringify(value) {
    return encodeURIComponent(JSON.stringify(value))
}

//对比当前时间
function comparTime(time) {
	time = ('' + time).replace(/\-/g, "/");
	var currentTime = Date.parse(new Date().toUTCString());
	var argumentsTime = Date.parse(new Date(time));
	if (currentTime > argumentsTime) {
		return 1; //当前时间大于time
	} else if (currentTime < argumentsTime) {
		return 2; //当前时间小于time
	} else
		return 3; //当前时间等于time
}

//获取时间差
function substractTime(start, end) {
	var dateStart, dateEnd;
	if (start == undefined || start == '') {
		dateStart = new Date().getTime();
	} else {
		if (env.isIos) {
			// dateStart = new Date(start.replace(/-/g, '/')).getTime();
			dateStart = new Date(start).getTime();
		} else {
			dateStart = new Date(start).getTime();
		}
	}
	if (end == undefined || end == '') {
		dateEnd = new Date().getTime();
	} else {
		if (env.isIos) {
			// dateEnd = new Date(end.replace(/-/g, '/')).getTime();
			dateEnd = new Date(end).getTime();
		} else {
			dateEnd = new Date(end).getTime();
		}
	}
	var date3 = dateEnd - dateStart;//时间差的毫秒数
	//计算出相差天数  
	var days = Math.floor(date3 / (24 * 3600 * 1000));

	//计算出小时数  
	var leave1 = date3 % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数  
	var hours = Math.floor(leave1 / (3600 * 1000));

	//计算相差分钟数  
	var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数  
	var minutes = Math.floor(leave2 / (60 * 1000));

	//计算相差秒数  
	var leave3 = leave2 % (60 * 1000);//计算分钟数后剩余的毫秒数  
	var seconds = Math.round(leave3 / 1000);

	return {
		days: days,
		hours: hours,
		minutes: minutes,
		seconds: seconds
	}
}

// 格式化金额
function formatCurrency(num) {
	if (num) {
		//将num中的$,去掉，将num变成一个纯粹的数据格式字符串
		num = num.toString().replace(/\$|\,/g, '');
		//如果num不是数字，则将num置0，并返回
		if ('' == num || isNaN(num)) { return 'Not a Number ! '; }
		//如果num是负数，则获取她的符号
		var sign = num.indexOf("-") > 0 ? '-' : '';
		//如果存在小数点，则获取数字的小数部分
		var cents = num.indexOf(".") > 0 ? num.substr(num.indexOf(".")) : '';
		cents = cents.length > 1 ? cents : '';//注意：这里如果是使用change方法不断的调用，小数是输入不了的
		//获取数字的整数数部分
		num = num.indexOf(".") > 0 ? num.substring(0, (num.indexOf("."))) : num;
		//如果没有小数点，整数部分不能以0开头
		if ('' == cents) { if (num.length > 1 && '0' == num.substr(0, 1)) { return 'Not a Number ! '; } }
		//如果有小数点，且整数的部分的长度大于1，则整数部分不能以0开头
		else { if (num.length > 1 && '0' == num.substr(0, 1)) { return 'Not a Number ! '; } }
		//针对整数部分进行格式化处理，这是此方法的核心，也是稍难理解的一个地方，逆向的来思考或者采用简单的事例来实现就容易多了
		/*
			也可以这样想象，现在有一串数字字符串在你面前，如果让你给他家千分位的逗号的话，你是怎么来思考和操作的?
			字符串长度为0/1/2/3时都不用添加
			字符串长度大于3的时候，从右往左数，有三位字符就加一个逗号，然后继续往前数，直到不到往前数少于三位字符为止
		 */
		for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
			num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
		}
		//将数据（符号、整数部分、小数部分）整体组合返回
		return (sign + num + cents);
	} else {
		return 0.00;
	}
}

function formatOrderStatus(status) {
	if (status == 'nopay') return '待付款';
	else if (status == 'wait-shipping') return '待发货';
	else if (status == 'wait-receiving') return '待收货';
	else if (status == 'refunding') return '退货/换货';
	else if (status == 'completed') return '已完成';
	else
		return ''
}

function formatLatelyTime(time) {
	var subtime = substractTime(time, new Date().toString());
	if (subtime.days == 0) return '今天';
	else if (subtime.days > 0 && subtime.days <= 1) return '昨天';
	else if (subtime.days > 1 && subtime.days <= 2) return '前天';
	else if (subtime.days > 2 && subtime.days <= 7) return subtime.days + '天前';
	else if (subtime.days > 7 && subtime.days <= 30) return '一周前';
	else if (subtime.days > 30 && subtime.days <= 60) return '1月前';
	return dateTime(time, 'MM-dd');
}

var mask = mui.createMask();
function ajax(uri, options) {
	// var mask = mui.createMask();
	mask.show();
	if (options.autoProcessError == undefined || options.autoProcessError) {
		options.error = function (xhr, type, errerThrown) {
            if (xhr.status == 401) {
				forward('yfg://m.native.com/visitor/login');
			} else {
				// mui.toast('网络异常,请稍候再试');
			}
		}
	}
    if (options.autoProcessComplete == undefined || options.autoProcessComplete) {
		options.complete = function (xhr, msg) {
			mask.close();
			if (xhr.status == 200) {
                if (/pageIndex/i.test(xhr.responseText)) {
					var data = JSON.parse(xhr.responseText);
					if (data.objects.length == 0) {
						var pullrefresh = mui('#pullrefresh');
						pullrefresh.length != 0 && (pullrefresh.pullRefresh()).refresh(true);
						pullrefresh.length != 0 && (pullrefresh.pullRefresh().endPullupToRefresh(true));
						pullrefresh.length != 0 && (pullrefresh.pullRefresh().disablePullupToRefresh());
					}
				} else if (/groupbycount/i.test(xhr.responseURL)) {
                    var pullrefresh = mui('#pullrefresh');
					pullrefresh.length != 0 && (pullrefresh.pullRefresh()).refresh(true);
					pullrefresh.length != 0 && (pullrefresh.pullRefresh().endPullupToRefresh(true));
					pullrefresh.length != 0 && (pullrefresh.pullRefresh().disablePullupToRefresh());
				}
			}
		}
	}
	mui.ajax(uri, options);
}

function awakenToTarget(url) {
	// var startTime = Date.now();
	var ifr = document.createElement('iframe');

	var targetUrl = appSchema + url;
	if (env.osVersion && parseInt(env.osVersion[0]) > 8) {
		window.location.href = targetUrl;
		return;
	}

	ifr.src = targetUrl;
	ifr.style.display = 'none';
	document.body.appendChild(ifr);
	// console.log(config);
	// var t = setTimeout(function () {
	// 	var endTime = Date.now();
	// 	if (!startTime || endTime - startTime < config.timeout + 200) {
	// 		if (/micromessenger/.test(ua) || /weibo/.test(ua)) {
	// 			$(".errorAlert-wrap2").show();
	// 			setTimeout(function () {
	// 				$(".errorAlert-wrap2").hide();
	// 			}, 4000);
	// 		} else {
	// 			$(".againConfirm-wrap").show();
	// 			$(".againConfirm-background").show();
	// 		}
	// 	} else {
	// 		if (/micromessenger/.test(ua) || /weibo/.test(ua)) {
	// 			$(".errorAlert-wrap2").show();
	// 			setTimeout(function () {
	// 				$(".errorAlert-wrap2").hide();
	// 			}, 4000);
	// 		} else {
	// 			$(".againConfirm-wrap").show();
	// 			$(".againConfirm-background").show();
	// 		}
	// 	}
	// }, config.timeout);

	// window.onblur = function () {
	// 	clearTimeout(t);
	// }
}

function mockLogin(tel) {
	//sisi host
	// ajax(api('/auth/signin'), {
	// 	type: 'POST',
	// 	data: {
	// 		phone: '13058080101',
	// 		password: 'KIwazNYnHs2T9s0/P/dpPw==',
	// 		source: 'phone',
	// 		passwordType: 'p'
	// 	}
	// });


	//服务器 -普通用户
	ajax(api('/auth/signin'), {
		type: 'POST',
		data: {
			phone: tel || '13612345678',//13006681194,5a4f7249f39c916fa73137b8
			password: 'KIwazNYnHs2T9s0/P/dpPw==',
			source: 'phone',
			passwordType: 'p'
		}
	});
	// 服务器 -普通用户
	// ajax(api('/auth/signin'), {
	// 	type: 'POST',
	// 	data: {
	// 		phone: '13500000000',
	// 		password: 'KIwazNYnHs2T9s0/P/dpPw==',
	// 		source: 'phone',
	// 		passwordType: 'p'
	// 	}
	// });

	//服务器 -鉴定师
	// ajax(api('/auth/signin'), {
	// 	type: 'POST',
	// 	data: {
	// 		phone: '18700000000',
	// 		password: 'KIwazNYnHs2T9s0/P/dpPw==',
	// 		source: 'phone',
	// 		passwordType: 'p'
	// 	}
	// });

	//服务器 -商户
	// ajax(api('/auth/signin'), {
	// 	type: 'POST',
	// 	data: {
	// 		phone: '13500000000',
	// 		password: 'KIwazNYnHs2T9s0/P/dpPw==',
	// 		source: 'phone',
	// 		passwordType: 'p'
	// 	}
	// });
}
