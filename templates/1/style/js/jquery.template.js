
function isArray(arg) {
    if (typeof arg === 'object') {
        return Object.prototype.toString.call(arg) === '[object Array]';
    }
    return false;
}

/**
 *  负责将数据进行渲染到网页上
 */
function parseTemplate(json,tempPath,selector){
    var temp = $.ajax({
        url: tempPath+".html",
        type: "GET",
        async:false,
        dataType: "html"});
    if(temp.readyState != 4){
        alert(tempPath +"模板文件不存在");
    }
    temp = temp.responseText;
    var html = Array();
    var cache;
    if(isArray(json)){
        for(var i = 0;i<json.length;i++){
            cache = temp;
            for (var key in json[i]){
                cache = cache.replace(new RegExp("{{"+ key +"}}",'gm'),json[i][key]);
            }
            html.push(cache);
        }
    }else{
        cache = temp;
        for (var key in json){
            cache = cache.replace(new RegExp("{{"+ key +"}}",'gm'),json[key]);
        }
        html.push(cache);
    }
    if(selector == null)
        return html.join("");
    else
        $(selector).html(html.join(""));

}

//基本选择器的数据绑定
function bindView(selector,data) {
    $(selector).html(data);
}

function bindText(selector,data) {
    $(selector).text(data);
}