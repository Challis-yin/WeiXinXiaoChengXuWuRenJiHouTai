/**   
* 脚本名称：页面加载Loading脚本   
* 脚本说明：   
* 1.因为使用到document.body.scrollHeight对象，脚本引入时，脚本应放到body内，否则报错；   
* 2.loadingImage为loading的图片，您可以替换为您想要的图片；loading弹窗的样式可以通过代码修改；    
* 3.使用方法：弹出遮罩：load.loading.add("加载中，请稍候", 1);扔掉遮罩： load.loading.remove();   
* 脚本作者：18383219470@163.com   
*    
*/    
var load = window.whir || {};    
load.loading =    
{    
    add: function (title) {       
        //背景遮罩    
        var mask = document.createElement("div");    
        mask.id = 'loading-mask';    
        mask.addEventListener('touchstart', function (e) { e.preventDefault(); }, false);   //触摸事件    
        mask.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);    //滑动事件    
        mask.addEventListener('touchend', function (e) { e.preventDefault(); }, false);         //离开元素事件    
        document.body.appendChild(mask);    
    
        //提示文本    
        var loading = document.createElement("div");    
        loading.id = 'loading-text';       
        title = (title != undefined && title.length > 0) ? title : "加载中，请稍候...";    
        loading.innerHTML = title;    
        document.body.appendChild(loading);    
    }, 
    remove: function () {    
        var element = document.getElementById("loading-mask");    
        element.parentNode.removeChild(element);    
        element = document.getElementById("loading-text");    
        element.parentNode.removeChild(element);    
    } 
}; 


function showLoading(title){
	load.loading.add(title);
}

function closeLoading(){
	load.loading.remove();
}