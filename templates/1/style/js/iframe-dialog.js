// 网页弹窗 请保证该js文件在body内

function showWebDialog(title,url){
    $("body").append('<div class="iframe-dialog">' +
        '    <div class="iframe-dialog-title">'+ title +' <a href="javascript:closeWebDialog();">X</a></div>' +
        " <iframe src='"+ url +"' /> "+
        '</div>');
}

function closeWebDialog() {
    $(".iframe-dialog").remove();
}
