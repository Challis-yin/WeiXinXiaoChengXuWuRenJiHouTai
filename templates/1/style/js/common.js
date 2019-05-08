//弹出toast
function toast(title,content,icon){
	$.toast({
	    text: content, // 显示的文本
	    heading: title, //显示的标题
	    icon: icon, // icon  (info,warning,error,success)
	    showHideTransition: 'fade', // fade(隐藏), slide（滑动） or plain
	    allowToastClose: true, //是否可以关闭
	    hideAfter: 3000, // 隐藏时间
	    stack: 3, //显示时间
	    position: 'bottom-right', //位置： bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
	    textAlign: 'left',  // 文本对其方式
	    loader: true,  //是否显示进度条 True by default
	    loaderBg: '#9ec600',  // 进度条背景颜色
	    beforeShow: function () {}, // 
	    afterShown: function () {}, // 
	    beforeHide: function () {}, // 
	    afterHidden: function () {}  //
	});
}