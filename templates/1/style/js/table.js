//============================================
//		2018-06-06  By Fanhua
//		DzAdmin 1.0.9
//============================================
var prePage = "<";
var nextPage = ">";
(function ($) {
    var ms = {
        init: function (obj, args) {
            return (function () {
                ms.fillHtml(obj, args);
                ms.bindEvent(obj, args);
            })();
        },
        //填充html
        fillHtml: function (obj, args) {
            return (function () {
                obj.empty();
                //上一页
                if (args.current > 1) {
                    obj.append('<a href="javascript:;" class="prevPage">' + prePage + '</a>');
                } else {
                    obj.append('<span class="prevPage">' + prePage + '</span>');
                }
                //中间页码    可不要
                if (args.current != 1 && args.current >= 4 && args.pageCount != 4) {
                    obj.append('<a href="javascript:;" class="tcdNumber">' + 1 + '</a>');
                }
                if (args.current - 2 > 2 && args.current <= args.pageCount && args.pageCount > 5) {
                    obj.append('<span>...</span>');
                }
                var start = args.current - 2, end = args.current + 2;
                if ((start > 1 && args.current < 4) || args.current == 1) {
                    end++;
                }
                if (args.current > args.pageCount - 4 && args.current >= args.pageCount) {
                    start--;
                }
                for (; start <= end; start++) {
                    if (start <= args.pageCount && start >= 1) {
                        if (start != args.current) {
                            obj.append('<a href="javascript:;" class="tcdNumber">' + start + '</a>');
                        } else {
                            obj.append('<span class="current currentPage">' + start + '</span>');
                        }
                    }
                }
                if (args.current + 2 < args.pageCount - 1 && args.current >= 1 && args.pageCount > 5) {
                    obj.append('<span>...</span>');
                }

                //可不要
                if (args.current != args.pageCount && args.current < args.pageCount - 2 && args.pageCount != 4) {
                    obj.append('<a href="javascript:;" class="tcdNumber">' + args.pageCount + '</a>');
                }
                //下一页
                if (args.current < args.pageCount) {
                    obj.append('<a href="javascript:;" class="nextPage">' + nextPage + '</a>');
                } else {
                    obj.append('<span class="nextPage">' + nextPage + '</span>');
                }
            })();
        },
        //绑定事件
        bindEvent: function (obj, args) {
            return (function () {
                obj.on("click", "a.tcdNumber", function () {
                    var current = parseInt($(this).text());
                    ms.fillHtml(obj, {"current": current, "pageCount": args.pageCount});
                    if (typeof(args.backFn) == "function") {
                        args.backFn(current);
                    }
                });
                //上一页
                obj.on("click", "a.prevPage", function () {
                    var current = parseInt(obj.children("span.current").text());
                    ms.fillHtml(obj, {"current": current - 1, "pageCount": args.pageCount});
                    if (typeof(args.backFn) == "function") {
                        args.backFn(current - 1);
                    }
                });
                //下一页
                obj.on("click", "a.nextPage", function () {
                    var current = parseInt(obj.children("span.current").text());
                    ms.fillHtml(obj, {"current": current + 1, "pageCount": args.pageCount});
                    if (typeof(args.backFn) == "function") {
                        args.backFn(current + 1);
                    }
                });
            })();
        }
    }
    $.fn.createPage = function (options) {
        var args = $.extend({
            pageCount: 10,
            current: 1,
            backFn: function () {
            }
        }, options);
        ms.init(this, args);
    }
})(jQuery);

//==============================


//加入自动获取表数据分页码
var page_limit = 10;//分页显示的数据条数  与后台数据需保持一致
var page_count = 0;//数据页数
var page_init = 0;
var xbase_table_pagination;//分页对象
var xbase_table;
var toolbar_onclick;//是否自动注册工具条按钮事件
var xbase_table_loading;
var xbase_table_header;
var data_name;
var data_name_index;
var data_function_index;
var data_html;
var page = 1;
var offset = 0;
var data_count;
var api_url;
var all_check = false;//是否全选
var data;//表格数据
var url;//请求数据地址
var data_extra_param;//表格参数
var auto_refresh_table = false;//是否自动刷新表格
var refresh_table_interval = 5;//单位秒
var show_pagination = true;
var data_sort_name;//排序字段
var data_sort_order;

xbase_table = $("#xbase-table");
xbase_table_header = $("#xbase-table-header");
xbase_table_loading = $("#xbase-table-loading");
xbase_table_pagination = $("#xbase-table-pagination");

xbase_table.attr("cellspacing", 0);
url = xbase_table.attr("data-url");
toolbar_onclick = xbase_table.attr("data-toolbar-onclick");
data_extra_param = xbase_table.attr("data-extra-param");
auto_refresh_table = xbase_table.attr("auto-refresh-table");
data_sort_name = xbase_table.attr("data-sort-name");
data_sort_order = xbase_table.attr("data-sort-order");

data_name = new Array();
data_function = new Array();
data_name_index = 0;
data_function_index = 0;
data_count = 0;

if(typeof(data_sort_order) == "undefined"){
	data_sort_order = "asc";
}

//启动自动刷新
if (typeof(xbase_table.attr("refresh-table-interval")) != "undefined") {
    refresh_table_interval = parseInt(xbase_table.attr("refresh-table-interval"));
    if (refresh_table_interval < 2)
        refresh_table_interval = 5;
}

//分页数量
if (typeof(xbase_table.attr("pagination-limit")) != "undefined") {
    page_limit = parseInt(xbase_table.attr("pagination-limit"));
    if (page_limit < 1)
        page_limit = 1;
}

if (typeof(auto_refresh_table) != "undefined") {
    auto_refresh_table = eval(auto_refresh_table);
    if (auto_refresh_table) {
        setInterval("updateTable();", refresh_table_interval * 1000);
    }
}

if (typeof(xbase_table.attr("show-pagination")) != "undefined") {
    show_pagination = eval(xbase_table.attr("show-pagination"));
    if (!show_pagination)
        hiddenPager();
}

//table
if (typeof(xbase_table.attr("show-table-row-dbclick")) != "undefined") {
    xbase_table.on("dblclick","tr",function(){
		var index = $(this).index() - 1;
		if(index != -1)
        tableRowDbclick(index,data[index]);
	});
}

if (typeof(toolbar_onclick) != "undefined" && toolbar_onclick == "true") {
    $("#xbase-table-toolbar button").click(function () {
        var index = $(this).index();
        toolBarOnClick(index);
    });
}

//立即加载
if (typeof(url) != "undefined") {
    Table(url, data_extra_param);
}

//隐藏分页
function hiddenPager() {
    xbase_table_pagination.hide();
}

/*
*
*如果您要使用自动注册工具条按钮的事件。请在table.js引入后复写ToolBarOnClick(int index)方法。
*/
function toolBarOnClick(index) {
    alert("请复写toolBarOnClick(int index);");
}

function tableRowDbclick(index,row){
	alert("请复写tableRowDbclick(index,row);");
}


//清空表数据
function clearTable() {
    var d = $("#xbase-table tr");
    var index = 0;

    d.each(function () {
        index++;

        if (index != 1) {
            $(this).remove();
        }
    });
    data_name_index = 0;
    data_function_index = 0;
}


//刷新表 当我们清空表 或者删除数据后需要从新加载一次数据
function refreshTable() {
    //初始化分页
    xbase_table_loading.show().text("正在刷新数据..");
    data_html = "";

    if (show_pagination) {
        if (data_count <= page_limit) {
            xbase_table_pagination.hide();
        } else {
            xbase_table_pagination.show();
        }
    }


    if (data_count == 0) {
        xbase_table_loading.show().text("没有任何数据");
    } else {
        var th = xbase_table_header.find("th");

        th.each(function () {
            data_name[data_name_index] = $(this).attr("data-name");

            //设置表格的Width大小
            var data_width = $(this).attr("data-width");


            if (typeof(data_width) != "undefined") {
                if(data_width.indexOf("page") < 0){
                    data_width = data_width + "px";
                }
                $(this).css("width", data_width);
            }

            if (data_name[data_name_index] == "checkbox") {
                $(this).css("width", 50);//如果是复选框就默认大小
                $(this).html("<input type='checkbox' id='parent_checkbox' />");
            }

            data_name_index++;
            data_function[data_function_index] = $(this).attr("data-function");
            data_function_index++;


        });

        var item, row;
        for (var i = 0; i < data.length; i++) {
            data_html += "<tr>";
            for (var j = 0; j < data_name_index; j++) {

                if (data_name[j] == "checkbox") {
                    data_html += "<td><input type='checkbox' class='child_checkbox' data-index='" + i + "' /></td>";
                    continue;
                }

                row = data[i];
                item = data[i][data_name[j]];

                if (typeof(item) == "undefined" || item == "" || item == "null" || item == null)
                    item = " - ";

                if (typeof(data_function[j]) == "undefined") {
                    data_html += "<td>" + item + "</td>";
                } else {
                    data_html += "<td>" + eval(data_function[j] + "(" + i + ",'" + item + "',row);") + "</td>";
                }
            }
            data_html += "</tr>";
            data[i]["index"] = i;
        }

        xbase_table.append(data_html);
        xbase_table_loading.hide();
    }
}

//更新表
function updateTable() {
    clearTable();
    Table(url, data_extra_param);
}

//设置扩展参数
function setExtraParams(params){
	data_extra_param = params;
}


//解析接口json数据 并刷新表
function Table(url, data_extra_param) {
    if (typeof(data_extra_param) != "undefined" && data_extra_param.length != 0) {
        data_extra_param = "&" + data_extra_param;
    }else{
    	data_extra_param = "";
    }
    
    if(typeof(data_sort_name) != "undefined"){
    	data_extra_param = data_extra_param + "&sortname=" + data_sort_name + "&sortorder=" + data_sort_order;
    }

    offset = (page - 1) * page_limit;
    api_url = url + "?limit=" + page_limit + "&page=" + page + "&offset=" + offset + "&random=" + Math.random() + data_extra_param;
    xbase_table_loading.show().text("正在加载数据..");
    $.getJSON(api_url, function (json, status) {
        data = json["rows"];
        data_count = json["total"];
        page_count = Math.ceil(data_count / page_limit);

        //初始化分页控件
        if (page_init == 0) {
            xbase_table_pagination.createPage({
                pageCount: page_count,//总页数
                current: page,//当前页
                backFn: function (p) {
                    page = p;
                    clearTable();
                    Table(url, data_extra_param);
                }
            });
            page_init = 1;
        }
        refreshTable();
    });
}

//全选
$("#xbase-table-header th:eq(0)").click(function () {
    var t = $(this).attr("data-name");

    if (t == "checkbox") {
        var parent = $("#parent_checkbox");
        var child = $(".child_checkbox");

        if (parent.prop("checked")) {
            all_check = false;
        } else {
            all_check = true;
        }

        if (all_check) {
            child.attr("checked", false);
            all_check = false;
        } else {
            child.attr("checked", true);
            all_check = true;
        }
    }
});

//获取表格所有选中数据
function getSelectedRows() {
    var row_data = Array();
    var row_data_index = 0;
    $(".child_checkbox:checked").each(function () {
        var index = $(this).attr("data-index");
        row_data[row_data_index] = data[index];
        row_data_index++;
    });
    return row_data;
}

//取第一条
function getSelectedRow() {
    var row_data;
    $(".child_checkbox:checked").each(function () {
        var index = $(this).attr("data-index");
        row_data = data[index];
        return row_data;
    });
    return row_data;
}

//取出选中json对像中某个字段 返回 数组或 数组字符串
function getSelectedRowsField(data, field, flag) {
    var data_out = Array();

    for (var i = 0; i < data.length; i++) {
        data_out[i] = data[i][field];
    }
    if (flag)
        return data_out.join();
    else
        return data_out;
}

