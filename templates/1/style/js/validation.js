/*
 * 标签有
 * required  是否校验
 * 
 * 
 * 
 * 设置校验信息回调方式
 * 1.alert反馈
 * 2.自定义函数反馈
 * 3.dialog反馈
 */
/**
 * 检查标签是否存在
 * @param {Object} obj
 * @param {Object} tagName
 */
function checkTag(obj, tagName) {
    return (typeof(obj.attr(tagName)) != "undefined");
}

/**
 * 获取某个控件的标签值
 * @param {Object} obj
 * @param {Object} tagName
 */
function getTagValue(obj, tagName) {
    return obj.attr(tagName);
}

/**
 * 获取某个控件的输入值
 * @param {Object} obj
 */
function getInputValue(obj) {
    return obj.val();
}

/**
 * 正则判断
 * @param {Object} val
 * @param {Object} val
 */
function test(val, regex) {
    var pattern = new RegExp(regex, 'gi');
    return pattern.test(val);
}


/**
 * 判断某个值是否为空
 * @param {Object} val
 */
function stringEmpty(val) {
    if (val == undefined || val == null || val == '' || val.length == 0) {
        return true;
    } else {
        return false;
    }
}

/**
 * 核心代码
 * @param {Object} obj
 * @param {Object} callback
 */
function checkInputForm(obj, callback) {
    if (checkTag(obj, "ispass")) {
        return true;
    }

    var inputType = getTagValue(obj, "type").toLowerCase();
    var inputValue = getInputValue(obj);
    var showMessage = null;

    if (checkTag(obj, "message"))
        showMessage = getTagValue(obj, "message");
    else
        showMessage = "请填写完整";


    if (stringEmpty(inputValue)) {
        callback(false, obj, showMessage, []);
        obj.focus();
        return false;
    }

    if (checkTag(obj, "regex")) {
        var regexValue = getTagValue(obj, "regex");
        if (!test(inputValue, regexValue)) {
            callback(false, obj, showMessage, []);
            obj.focus();
            return false;
        }
    }
    return true;
}

/**
 * 校验多文本框
 * @param {Object} obj
 * @param {Object} callback
 */
function checkTextAreaForm(obj, callback) {
    if (checkTag(obj, "ispass")) {
        return true;
    }

    var inputValue = getInputValue(obj);
    var showMessage = null;
    if (checkTag(obj, "message"))
        showMessage = getTagValue(obj, "message");
    else
        showMessage = "请填写完整";


    if (stringEmpty(inputValue)) {
        callback(false, obj, showMessage, []);
        obj.focus();
        return false;
    }


    if (checkTag(obj, "regex")) {
        var regexValue = getTagValue(obj, "regex");
        if (!test(inputValue, regexValue)) {
            callback(false, obj, showMessage, []);
            obj.focus();
            return false;
        }
    }
    return true;
}

/**
 *
 * @param {Object} formId        表单ID
 * @param {Object} isAuto        是否自动提交
 * @param {Object} callback        回调函数
 */
function validation(formId, isAuto, callback) {
    formId = "#" + formId;
    var validObj = $(formId);
    var status = true;
    $(formId).find("input").each(function () {
        status = checkInputForm($(this), callback);
        if (!status) {
            return false;
        }
    });

    if (!status) {
        return false;
    }

    //校验textarea
    $(formId).find("textarea").each(function () {
        status = checkTextAreaForm($(this), callback);
        if (!status)
            return false;
    });
    if (status) {
        var formArr = $(formId).serializeArray();
        var json = {};
        for (var i = 0, l = formArr.length; i < l; i++) {
            json[formArr[i]["name"]] = formArr[i]["value"];
        }
        callback(true, $(this), "success", json);
    }

    return isAuto;
}