//============================================
//		2018-06-07  By Fanhua
//		DzAdmin 1.0.9
//============================================
/*
flagName:标识绑定字段元素的属性，如data-bind是寻找绑定字段的属性：<input data-bind=‘Time‘ type=‘text‘ />
jsonData:json数据对象，根据其中的属性名，绑定到对应属性名的字段上
*/
var JsonBind = function (ele, opt) {
    this.$element = $(ele),
        this.defaults = {
            flagName: 'name'
},
    /*
    当给extend方法传递一个以上的参数时，它会将所有参数对象合并到第一个里。
    同时，如果对象中有同名属性时，合并的时候后面的会覆盖前面的。
    将一个新的空对象做为$.extend的第一个参数，defaults和用户传递的参数对象紧随其后，
    这样做的好处是所有值被合并到这个空对象上，保护了插件里面的默认值。
    */
    this.options = $.extend({}, this.defaults, opt)
};
JsonBind.prototype = {
    bind: function () {
        if (this.options.jsonData) {
            if (this.options.jsonData == 'string') {
                this.options.jsonData = JSON.parse(this.options.jsonData);
            }
        }
        //获得触发事件的元素
        var dom = this.$element;
        var name = this.options.flagName;
        var data = this.options.jsonData;
        //遍历元素内所有含有name属性的元素
        //return使其只是链式调用，如：$("#col").get().set().trim()
        return dom.find("[" + name + "]").each(function () {
            //取出json中对应name属性的值
            var key = $(this).attr(name);
            var val = $.trim(data[key]);
            if (val != '') {
                //检查当前元素标签，并根据不同标签进行赋值操作
                if ($(this).is("input")) {
                    //检查当前元素类型，并根据不同类型进行赋值操作
                    switch ($(this).attr("type")) {
                        case "radio":
                            $(dom).find("input:radio[" + name + "=‘" + key + "‘][value=‘" + val + "‘]").prop("checked", true);
                            break;
                        case "checkbox":
                            $(dom).find("input:checkbox[" + name + "=‘" + key + "‘][value=‘" + val + "‘]").prop("checked", true);
                            //$(this).siblings("[value=‘" + val + "‘]").prop("checked", true);
                            break;
                        default:
                            $(this).val(val);
                            break;
                    }
                }
                else if ($(this).is("select")) {
                    $(this).val(val);
                }else if($(this).is("textarea")){
                    $(this).val(val);
                }
            }
        });
    }
};
//将方法增加到jQuery扩展方法中
$.fn.extend({
    dataBind: function (options) {
        var jsBind = new JsonBind(this, options);
        return jsBind.bind();
    }
});

/**
 $("#add-article").dataBind({
        jsonData:data.data,
        flagName:'name'
});
 */