function toJSON(data){
    return JSON.parse(data);
}

//过滤
function trim(x) {
    return x.replace(/^\s+|\s+$/gm,'');
}

function isArray(arg) {
    if (typeof arg === 'object') {
        return Object.prototype.toString.call(arg) === '[object Array]';
    }
    return false;
}

//判断是否为空
function isEmpty(val) {
	val = trim(val);
    if (val == undefined || val == null || val == '' || val.length == 0) {
        return true;
    } else {
        return false;
    }
}

//返回上一级
function go(type){
    window.history.go(type);
}

function refresh(){
    go(0);
}

function back(){
    go(-1);
}

function forward(){
    go(1);
}