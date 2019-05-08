/*
*	名称：图片延迟加载插件
*	作者：董志平
*	日期：2017-04-07 22:25
*/
var auto_load_src;//设置占位图
var auto_load_tag = "lazy-src";//设置默认读取图片的标签
var auto_load_time = 3;//设置默认延迟加载时间 单位：秒
var auto_load_over = false;//判断是否加载网页完成
var imgs;//全局图片对象
var inter_ready,inter_start;

var Images = {
	run:function(){
		imgs.each(function(){
			var o = $(this);
			if(typeof(o.attr(auto_load_tag))!="undefined"){ 
				o.attr("src",o.attr(auto_load_tag));
			}
		});
	},	
	
	init_src:function(){
		imgs.each(function(){
			var o = $(this);
			if(typeof(o.attr(auto_load_tag))!="undefined"){ 
				o.attr("src",auto_load_src);//初始化所有图片
			}
		});
	},
	ready:function(){
		if(auto_load_over){
			clearInterval(inter_ready);
			imgs = $("img");
			Images.init_src();
			setTimeout("Images.run();",auto_load_time * 1000);
		}
		$(document).ready(function(){ 
			auto_load_over = true;
		});
	},
	init:function(src,tag,time){
		auto_load_src = src;
		auto_load_tag = tag;
		auto_load_time = time;
		inter_ready = setInterval("Images.ready();",100);
	},
}

/**
*  使用教程：Images.init("style/img/loading.png","lazy-src",2);//初始化延迟加载插件
*  <img lazy-src="xxx" src="style/img/loading.png" alt="">
*
*/