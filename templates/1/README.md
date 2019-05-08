# XBaseAdmin
> 一款轻量级的，快速搭建后台管理平台的前端框架。使用XBaseAdmin可以快速搭建后台界面，快速渲染表格数据，基本的系统函数及弹出动画。

## 四大功能
>表格渲染、后台搭建、系统方法、登录模块、表单校验、数据绑定

## 最新版本
版本号：2.0.0(20181212)

## Tabs
http://git.oschina.net/hbbcs/bootStrap-addTabs

### 1.快速搭建后台界面
>	V1.0.0效果
![V1.0.0搭建的后台首页](https://github.com/fanhua1994/XBaseAdmin/blob/master/image/2018-01-13%2021-58-05%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE.png?raw=true)

>	V2.0.0效果
![V2.0.0搭建的后台首页](https://github.com/fanhua1994/XBaseAdmin/blob/master/image/TIM%E5%9B%BE%E7%89%8720181130110003.png?raw=true)

>  News Tables 仿Element
![仿ElementUI表格样式](https://github.com/fanhua1994/XBaseAdmin/blob/master/image/Table%202.0.png?raw=true)


### 2.表格渲染的使用方法
#### 第一步 导入css 和 js
```
<link rel="stylesheet" href="css/bootstrap.min.css" />
<link rel="stylesheet" href="css/table.css" />
<script src="js/jquery-3.2.1.min.js"></script>
```
#### 第二步 加入table代码
```
<div id="xbase-table-box">
		  <div id="xbase-table-toolbar">
			<!-- http://www.runoob.com/try/demo_source/bootstrap3-glyph-icons.htm   菜单图标定义 -->
			<button type="button" class="btn btn-default btn-sm" id="back_btn">
				<span class="glyphicon glyphicon-share-alt"></span> 返回上级
			</button>
			
			<button type="button" class="btn btn-default btn-sm" id="table_delete_btn">
				<span class="glyphicon glyphicon-trash"></span> 导出数据
			</button>

			<button type="button" class="btn btn-default btn-sm" id="table_mod_btn">
				<span class="glyphicon glyphicon-pencil"></span> 编辑案列
			</button>
		  </div>
		  <table 
		  	id="xbase-table"
		    data-url="data.json"
		    data-sort-name="id"
		    data-sort-order="asc"
		    data-extra-param="aaa=2&bbb=4&vvv=444" 
		    data-toolbar-onclick="true" 
		    auto-refresh-table="false" 
		    refresh-table-interval="20" 
		    show-pagination="true"
		    pagination-limit="10"
		    show-table-row-dbclick="true"
		    >  
			  <tr id="xbase-table-header">
				<th data-name="checkbox">全选</th>
				<th data-name="id" data-width="50">ID</th>
				<th data-name="name">名称</th>  
				<th data-name="price">价格</th>
				<th data-name="image" data-function="imageController">图片</th>
				<th data-name="operation" data-function="operationController">操作</th>
			  </tr>  
		</table>  
		<div id="xbase-table-loading">正在加载数据..</div>
		<div id="xbase-table-pagination"></div>
	</div>
```

#### 第三步
> 在界面最底部body上导入表格插件js
```
<script src="js/table.js"></script>
```

#### 第四步
> 实现工具栏点击事件，data-function对应响应函数
```
//复写toolBarOnClick方法 获得点击事件
function toolBarOnClick(index){
	alert("执行了点击方法");
}

//渲染图片显示的方法
function imageController(value){
	return "<img src='"+ value +"' />";
}
```

### API文档
#### table属性
| 表格属性 | 演示 | 备注 |
|------|------|---------|
|data-url|data.php| 请求数据的地址，不支持跨域 |
|data-extra-param| name=aaa&age=20|扩展参数，会自动拼接到url后面|
|data-toolbar-onclick|true | 是否需要自动注册工具栏点击事件，默认不注册|
|auto-refresh-table|true/false|是否需要自动刷新，默认不自动刷新|
|refresh-table-interval|10|自动刷新周期、auto-refresh-table为true生效,单位秒|
|show-pagination|true/flase|是否显示分页条|
|pagination-limit|10|每页数据条数|
|show-table-row-dbclick|true|是否可以双击数据项|
|data-sort-name|user_id|排序字段|
|data-sort-order|asc|排序方式，asc,desc。默认是asc|
|data-width|50|50代表50px   px可加可不加。|
#### table字段属性
| 字段属性 | 演示 | 备注 |
|----|-----|-------|
|data-name|name|字段名，请对应数据库（接口返回数据）字段名|
|data-function|functionFoater|使用函数返回字段的值，非必须，支持html|


**data-function 回调函数**
functionFoater(index,value,row);

#### 接口请求如下所示
1.接口返回数据规范
```
{"total":100,"rows":[
{"id":1,"name":"董志平","price":"120.00","image":"https://www.baidu.com/img/baidu_jgylogo3.gif"},
{"id":2,"name":"繁华","price":"190.00","image":"https://www.baidu.com/img/baidu_jgylogo3.gif"},
{"id":2,"name":"繁华","price":"190.00","image":"https://www.baidu.com/img/baidu_jgylogo3.gif"},
{"id":2,"name":"繁华","price":"190.00","image":"https://www.baidu.com/img/baidu_jgylogo3.gif"},
{"id":2,"name":"繁华","price":"190.00","image":"https://www.baidu.com/img/baidu_jgylogo3.gif"},
{"id":2,"name":"繁华","price":"190.00","image":"https://www.baidu.com/img/baidu_jgylogo3.gif"},
{"id":2,"name":"繁华","price":"190.00","image":"https://www.baidu.com/img/baidu_jgylogo3.gif"},
{"id":2,"name":"繁华","price":"190.00","image":"https://www.baidu.com/img/baidu_jgylogo3.gif"},
{"id":2,"name":"繁华","price":"190.00","image":"https://www.baidu.com/img/baidu_jgylogo3.gif"},
{"id":2,"name":"繁华","price":"190.00","image":"https://www.baidu.com/img/baidu_jgylogo3.gif"},
{"id":2,"name":"繁华","price":"190.00","image":"https://www.baidu.com/img/baidu_jgylogo3.gif"}
]}
```

2.table发出请求参数格式
```
http://127.0.0.1:8020/DzAdmin/data.json?limit=15&page=1&offset=0&random=0.8821554652295365&aaa=2&bbb=4&vvv=444
```


## table.js
updateTable();//刷新表数据

getSelectedRows();//获取所有选中的数据

getSelectedRow();//获取选中的第一条数据

### 3.更新详情
+ 2017.09.21 更新多皮肤切换。美化分页条
+ 2017.10.18 表格使用
+ 2017.12.24 新增右侧菜单事件。继承方法即可实现单机事件
+ 2018.01.13 更换左边菜单栏皮肤，支持按T切换皮肤。
+ 2018.02.27 DzTable加入自动刷新功能。
+ 2018.05.26 XBaseAdmin初始化开发。
+ 2018.06.01 XbaseAdmin完善外菜单栏。
+ 2018.06.21 加入头像显示。

### 4.作者邮箱
> 90fanhua@gmail.com
