//变量设置
var lang = [];//加载语言
var lang_version = [];//语言版本号
var url_lang = null;//检测当前版本

loadJs("加载配置","Language/Setting.js");

//==========函数区===================
function debug(log){
	if(lang_debug){
		if(lang_debug_type == 1)
			alert(log);
		else
			console.log(log);
	}
}

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return unescape(r[2]); return null;
}

function setCookie(name,value)
{
	var Days = 30;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days*24*60*60*1000);
	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

function changeLanguage(lang){
	setCookie(lang);
	window.history.go(0);
}

function getCookie(name)
{
	var arr,reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
}

function loadJs(name,js_file){
	$.ajax({  
    type: 'GET',  
    url:js_file,  
	cache:true,
    async:false,  
	contentType:"application/x-www-form-urlencoded; charset=utf-8",
    dataType:'script',
    success:function(data){
		debug(name + "加载成功");
	},
	error:function(data){
		debug(name + "加载失败");
	}
	});
}

function loadLang(){
	$.ajax({  
    type: 'GET',  
    url: default_version_url,  
	cache:true,
    async:false,  
	success:function(data){
		data = data.trim();
		if(data != "none" || data.length != 0){
			url_lang = data;
			default_version = url_lang;
		}else{
			url_lang = null;
		}
	},
	error:function(data){
		url_lang = null;
	}
	});
}

function setLang(key,language){
	lang[key] = language;
}

/**
*	如果key不存在将返回默认值
*/
function getLang(key,default_vlanguage){
	if(typeof(lang[key])=="undefined"){ 
		return default_vlanguage;
	}else{
		return lang[key];
	}
}

function getLang(key){
	if(typeof(lang[key])=="undefined"){ 
		return null;
	}else{
		return lang[key];
	}
}

function bindView(key,selector){
	if(typeof(lang[key]) != "undefined"){
		$(selector).html(lang[key]);
	}
}

function bindView(key){
	if(typeof(lang[key]) != "undefined"){
		$("#" + key).html(lang[key]);
	}
}

function autoBindView(){
	for(var key in lang){
		bindView(key);
	}
}

function bindValue(key,selector){
	if(typeof(lang[key]) != "undefined"){
		$(selector).val(lang[key]);
	}
}

function bindValue(key){
	if(typeof(lang[key]) != "undefined"){
		$("#" + key).val(lang[key]);
	}
}

function bindText(key,selector){
	if(typeof(lang[key]) != "undefined"){
		$(selector).text(lang[key]);
	}
}

function bindText(key){
	if(typeof(lang[key]) != "undefined"){
		$("#" + key).text(lang[key]);
	}
}


function bindTitle(key){
	document.title = getLang(key);
}

function bindTag(key,tag,selector){
	if(typeof(lang[key]) != "undefined"){
		$(selector).attr(tag,lang[key]);
	}
}

function bindTag(key,tag){
	if(typeof(lang[key]) != "undefined"){
		$("#" + key).attr(tag,lang[key]);
	}
}
//======================================

//url判断
url_lang = GetQueryString("lang");
if(url_lang != null){
	default_version = url_lang;
}

debug("加载param后的值：" + url_lang);

if(url_lang == null){
	url_lang = getCookie("lang");
	if(url_lang != null){
		default_version = url_lang;
	}
}
debug("加载cookie后的值：" + url_lang);

if(url_lang == null)
	loadLang();
debug("加载url后的值：" + url_lang);



debug("当前语言：" + default_version);




//自动加载模块语言
var module_lang = GetQueryString("module_lang");
if(module_lang != null){
	debug("module_lang = " + module_lang);
	if(module_lang.indexOf(",") > 0){
		var module_lang_arr = module_lang.split(",");
		for(i = 0; i < module_lang_arr.length; i++) {
   			loadJs("模块包","Language/module/" + module_lang_arr[i] + "/" + default_version +".js");
		} 
	}else{
		loadJs("模块包","Language/module/" + module_lang + "/" + default_version +".js");
	}
	
}

//自动加载语言包
loadJs("语言包","Language/locale/" + default_version +".js");