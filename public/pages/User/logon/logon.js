Bwebapp.Page.regPageByVue('User__logon', //id User__logon Tab__index
	document.getElementById('User__logon').innerHTML, //模板
	{ //控制器
		data: {
			logon_method: true, //true为密码登录，false为手机登录
			validate: function() {},
			validate_phone: function() {},
			sms_onsend: false,
			phone_onvalid: false,
			password: "",
			phone: "",
			sms: "",
			username: ""
		},
		watch: {
			phone: function() {
				var that = this;
				that.validate_phone.checkOne("phone", "phone", function(ok) {
					if(ok) {
						that.phone_onvalid = true;
					} else {
						that.phone_onvalid = false;
					}
				})
			},
		},
		computed: {
			/**
			 * 实时监听sms_onsend和phone_onvalid以改变sms_onvalid
			 */
			sms_onvalid: function() {
				return !this.sms_onsend && this.phone_onvalid
			}
		},
		methods: {
			showReg: function() {
				Bwebapp.Page.openPage({
					id: 'User__reg',
					page_url: 'User__reg',
					auto_show: true,
					show_ani: 'slide',
					extrals: {
						before_id: Bwebapp.Page.getCurrentPage(this).id
					}
				});
			},
			/**
			 * 点击返回
			 */
			backClick: function() {
				Bwebapp.Page.getCurrentPage(this).close();
			},
			/**
			 * 更改登录方式
			 */
			changeLogonMethod: function() {
				this.logon_method = !this.logon_method;
			},
			/**
			 * 发起登陆请求
			 */
			phoneSubmit: function() {
				Bwebapp.WebUI.showWaiting({
					modal: true,
					title: "登陆中"
				});
				var that = this;
				mui.ajax(config.urls.apis.User.logonBySms, {
					data: {
						phone: that.phone,
						sms: that.sms
					},
					dataType: 'json', //服务器返回json格式数据
					type: 'post', //HTTP请求类型
					timeout: 10000, //超时时间设置为10秒；
					success: function(response) {
						/*用于本地测试*/
//						response = {
//							code: '200',
//							msg: 'ok',
//							data: {
//								token: 'q12223edwsefaf',
//								userInfo: {
//									avatar_url: '../../../img/icon/logo-cicle.png',
//									name: '庄德伟',
//									nickname: 'Bruce',
//									phone: '13660452641',
//								}
//							}
//						}
						switch(response.code) {
							case '200':
								var user = response.data.userInfo; //获取用户信息
								user.token = response.data.token; //获取token
								setUser(user) //储存用户信息
								Bwebapp.Page.getCurrentPage(that).close('fade') //关闭本页面
								Bwebapp.WebUI.hideWaiting() //关闭等待框
								mui.toast('登陆成功', {
									duration: 1000,
									type: 'div'
								});
								break;
							case '1004':
								Bwebapp.WebUI.hideWaiting()
								mui.toast('手机号未注册~', {
									duration: 1000,
									type: 'div'
								});
								break;
							default:
								Bwebapp.WebUI.hideWaiting()
								mui.toast('发生了未知错误呢~', {
									duration: 1000,
									type: 'div'
								});
								break;
						}
					},
					error: function(xhr, type, errorThrown) {
						Bwebapp.WebUI.hideWaiting()
						mui.toast('你的手机没网络哦~', {
							duration: 1000,
							type: 'div'
						});
					}
				});
			},
			/**
			 * 发送验证码
			 * @param {Object} e
			 */
			sendSms: function(e) {
				var that = this;
				that.sms_onsend = true;
				//发起异步请求
				mui.ajax(config.urls.apis.Sms.sendLogon, {
					data: {
						phone: that.phone
					},
					dataType: 'json', //服务器返回json格式数据
					type: 'get', //HTTP请求类型
					timeout: 10000, //超时时间设置为10秒；
					success: function(response) {
						var mask = mui.createMask(); //创建遮罩蒙版	
						/*用于本地测试*/
//						response = {
//							code: '200',
//							msg: 'ok',
//							data: {
//								avatar_url: '../../../img/icon/logo-cicle.png',
//								nickname: 'Bruce',
//								phone: '13660452641',
//								integral: 200,
//								fan_count: 2,
//								concern_count: 4,
//								publication_count: 10,
//								collection_count: 2
//							}
//						}
						switch(response.code) { //判断验证码发送结果
							case '200': //成功发送验证码
								mask.show(); //显示遮罩
								mui.toast('发送成功', {
									duration: 1000,
									type: 'div'
								});
								setTimeout(function() { //关闭遮罩
									mask.close();
								}, 1000);
								break;
							case '1004': //手机未注册
								mask.show(); //显示遮罩
								mui.toast('手机号未注册', {
									duration: 1000,
									type: 'div'
								});
								setTimeout(function() { //关闭遮罩
									mask.close();
								}, 1000);
								break;
							default:
								console.log(JSON.stringify(response))
								mask.show(); //显示遮罩
								mui.toast('发送失败，请重试', {
									duration: 1000,
									type: 'div'
								});
								setTimeout(function() { //关闭遮罩
									mask.close();
								}, 1000);
								break;
						}
					},
					error: function(xhr, type, errorThrown) {
						var mask = mui.createMask(); //创建遮罩蒙版	
						mask.show(); //显示遮罩
						mui.toast('好像没网络呢~', {
							duration: 1000,
							type: 'div'
						});
						setTimeout(function() { //关闭遮罩
							mask.close();
						}, 1000);
					}
				});
				//设置定时器进行倒计时
				var time_target = Date.parse(new Date()) + 1000 * config.sms_interval;
				var timeout;
				var textt = e.currentTarget.innerText;

				function timedCount() {
					var t = time_target - Date.parse(new Date());
					if(t > 0) {
						timeout = setTimeout(timedCount, 500);
						e.target.innerText = (t / 1000) + "秒";
					} else {
						clearTimeout(timeout);
						that.sms_onsend = false;
						e.target.innerText = textt;
					}
				}
				timedCount();
			},
			init: function() {
				var that = this;
				that.validate_phone = new Validate({
					form: "#phone-logon",
					autoSubmit: false,
					rules: {
						phone: {
							required: true,
							phone: true
						},
						sms: {
							required: true
						}
					},
					cbs: {
						phone: {
							required: function(ok) {
								if(ok) {
									return false;
								}
								if(document.querySelectorAll(".mui-toast-container").length == 0) {
									mui.toast('请填写手机', {
										duration: 'short',
										type: 'div'
									})
								}
							},
							phone: function(ok) {
								if(ok) {
									return false;
								}
								if(document.querySelectorAll(".mui-toast-container").length == 0) {
									mui.toast('手机格式错误', {
										duration: 'short',
										type: 'div'
									})
								}
							}
						},
						sms: {
							required: function(ok) {
								if(ok) {
									return false;
								}
								if(document.querySelectorAll(".mui-toast-container").length == 0) {
									mui.toast('请填写验证码', {
										duration: 'short',
										type: 'div'
									})
								}
							}
						}
					},
					success: function() {
						that.phoneSubmit();
					}
				});
				that.validate = new Validate({
					form: "#password-logon",
					autoSubmit: false,
					rules: {
						username: {
							required: true,
						},
						password: {
							required: true
						}
					},
					cbs: {
						username: {
							required: function(ok) {
								if(ok) {
									return false;
								}
								if(document.querySelectorAll(".mui-toast-container").length == 0) {
									mui.toast('请填写账号', {
										duration: 'short',
										type: 'div'
									})
								}
							}
						},
						password: {
							required: function(ok) {
								if(ok) {
									return false;
								}
								if(document.querySelectorAll(".mui-toast-container").length == 0) {
									mui.toast('请填写密码', {
										duration: 'short',
										type: 'div'
									})
								}
							}
						}
					},
					success: function() {
						plus.nativeUI.showWaiting("登录中", {
							modal: true,
							back: 'none'
						});
						setTimeout(function() {
							plus.nativeUI.closeWaiting();
						}, 5000);
					}
				});
			}
		},
		mounted: function() {
			var that = this;
			var el = Bwebapp.Query().setEl(that.$el);
			el.addEvent('init', function() { //绑定事件
				that.init();
			})
			Bwebapp.Page.bindClose(this, function() {
				var before_id = Bwebapp.Page.getCurrentPage(that).extrals.before_id; //获取前一个页面的id
				Bwebapp.Page.getPageById(before_id).fire('backShow'); //触发前一个页面的backShow事件
			})
		}
	});