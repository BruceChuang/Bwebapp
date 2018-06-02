#webapp
##编译
###bhtml引进include标签后运行compile.py进行编译
##框架结构
###概览
	1.Bwebapp.config: { 路由的配置
		index: 'Tab__index', 首页所在的节点
		loader_ani: 'three_cicle' 启动动画
	},
	2.Bwebapp.Loader: Object, webapp启动时的操作
	3.Bwebapp.Common: Object, js操作封装函数
	4.Bwebapp.Query: Object, dom操作类
	5.Bwebapp.Page: Object 页面类实例
###Page类
	Bwebapp.Page.getCurrentPage(controller) 获取当前页面的PageObj对象
	Bwebapp.Page.getPageById(id) 获取指定id页面的PageObj对象
	Bwebapp.Page.bindEvent(controller, eventName, cb) 绑定页面自定义事件
	Bwebapp.Page.bindInit(controller, cb) 绑定页面初始化事件
	Bwebapp.Page.bindShow(controller, cb) 绑定页面显示事件
	Bwebapp.Page.bindHide(controller, cb) 绑定页面隐藏事件
	Bwebapp.Page.bindClose(controller, cb) 绑定页面关闭事件
	Bwebapp.Page.openPage({id, page_url, auto_show*, show_ani*, style*, extrals*}) 打开新页面
###PageObj对象
	PageObj.fire(eventName) 触发页面自定义事件
	PageObj.show(show_ani) 显示页面
	PageObj.hide(show_ani) 隐藏页面
	PageObj.close(show_ani) 关闭页面
	PageObj.extrals 页面打开时传递过来的扩展参数
###WebUI类
	Bwebapp.WebUI.showWaiting(options) 显示等待框
	Bwebapp.WebUI.hideWaiting() 关闭等待框
	Bwebapp.WebUI.showModal(options) 显示等待框
	Bwebapp.WebUI.hideModal() 关闭等待框
##接口文档
###Auction 买卖
####pelease* 发布“出售”（提交表单）
	type : jsonString
	request : {
	}
	respone : {
		code : '200',
		msg : 'ok',
		data : {}
	}
###Sms 短信服务
####sendReg 发送注册账号的短信验证码
	url : http://192.168.1.131:8080/seckill/sendReg
	type : jsonString
	request : { 发送的数据
		phone : '', 手机号
	}
	respone : { 返回的数据
		code : '200', 状态码：'200'为处理成功
		msg : 'ok',
		data : {}
	}
####sendLogon 发送登陆的短信验证码
	url : http://123.207.48.54:8080/seckill/sendLogon
	type : jsonString
	request : { 发送的数据
		phone : '', 手机号
	}
	respone : { 返回的数据
		code : '200', 状态码：'200'为处理成功
		msg : 'ok',
		data : {}
	}
###User 用户表相关操作
####logout* 退出登录
	type : jsonString
	request : { 发送的数据
		token : '', 登陆凭据
	}
	respone : { 返回的数据
		code : '200', 状态码：'200'为处理成功
		msg : 'ok'
	}
####logonBySms 用户使用验证码进行登陆
	url : http://123.207.48.54:8080/seckill/logonBySms
	type : jsonString
	request : { 发送的数据
		phone : '', 手机号
		sms : '', 验证码
	}
	respone : { 返回的数据
		code : '200', 状态码：'200'为处理成功
		msg : 'ok',
		data : {
			token : '', 登陆成功后的token
			userInfo : {
				avatar_url: 'http://www.abv.hhh/yellow.jpg', 头像地址
				name : '庄德伟', 真实姓名
				nickname: 'Bruce', 用户名
				phone: '13660452641', 手机号
			}
		}
	}
	respone : { 返回的数据
		code : '1003'
		msg : '为手机号已注册'
	}
####regBySms 用户使用验证码进行注册，注册成功后的同时进行登录
	url : http://123.207.48.54:8080/seckill/regBySms
	type : jsonString
	request : { post 发送的数据
		phone : '', 手机号
		sms : '', 验证码
	}
	respone : { 返回的数据
		code : '200', 状态码：'200'为处理成功
		msg : 'ok',
		data : {
			token : '', 登陆成功后的token
			userInfo : {
				avatar_url: 'http://www.abv.hhh/yellow.jpg', 头像地址
				name : '庄德伟', 真实姓名
				nickname: 'Bruce', 用户名
				phone: '13660452641', 手机号
			}
		}
	}