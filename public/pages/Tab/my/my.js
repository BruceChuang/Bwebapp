Bwebapp.Page.regPageByVue('Tab__my', //id Tab__my Tab__index
	document.getElementById('Tab__my').innerHTML, //模板
	{ //控制器
		data: {
			user: -1,
			app_name : config.app_name
		},
		methods: {
			goAllData: function() {

			},
			logout: function() {
				var that = this;
				mui.confirm('退出登录？', '提示', ['是', '否'], function(e) { //弹出提示框
					if(e.index != 0) { //如果没有点确认登陆则什么都不做
						return true;
					}
					Bwebapp.WebUI.showWaiting({
						title: '正在退出',
						modal: true
					});
					mui.ajax(config.urls.apis.User.logout, { //发起退出登录的请求
						data: {
							token: that.user.token
						},
						dataType: 'json', //服务器返回json格式数据
						type: 'get', //HTTP请求类型
						timeout: 10000, //超时时间设置为10秒
					});
					setUser(null); //清空用户登陆信息				
					setTimeout(function() {
						that.checkData(); //重新检查用户登陆状态
						Bwebapp.WebUI.hideWaiting()
						mui.toast('退出登陆成功', {
							duration: 1000,
							type: 'div'
						});
					}, 500)

				})
			},
			/**
			 * 检查用户数据是否存在
			 */
			checkData: function() {
				this.user = getUser();
			},
			goLogon: function() {
				Bwebapp.Page.openPage({
					id: 'User__logon',
					page_url: 'User__logon',
					auto_show: true,
					show_ani: 'slide',
					extrals: {
						before_id: Bwebapp.Page.getCurrentPage(this).id
					}
				});
			},
			init: function() {
				var that = this;
				that.checkData();
			}
		},
		mounted: function() {
			var that = this;
			Bwebapp.Page.bindInit(this, function() {
				that.init();
			})
			Bwebapp.Page.bindEvent(this, 'backShow', function() {
				that.checkData();
			})
		}
	});