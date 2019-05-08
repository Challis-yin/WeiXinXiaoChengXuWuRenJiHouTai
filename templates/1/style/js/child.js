//============================================
//		2018-06-07  By Fanhua
//		DzAdmin 1.0.9
//============================================

function getTop(){
	return window.top;	
}

function getParent(){
	return window.parent;
}

function addTab(id,title,url){
    getTop().$.addtabs.add({
         url: url,
         title: title,
        id:id,
        refresh:true
    });
}

function closeTab(id){
    getTop().$.addtabs.close({id:id});
}

//打开加载中
function showLoading(title){
	getTop().showLoading(title);
}

//关闭加载中
function closeLoading(){
	getParent().closeLoading();
}

//界面跳转
function redirect(url){
	getTop().redirect(url);
}
