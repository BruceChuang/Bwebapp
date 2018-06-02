Bwebapp.Page.regPageByVue('Tab__msg', //id
document.getElementById('Tab__msg').innerHTML, //模板
{ //控制器
	data: {
		beforeStatusBarBackground : '' //页面显示前状态栏颜色
	},
	methods: {
		init: function() {
		},
		show: function() {
			var that = this;
			//状态栏颜色设置.start
			plus.navigator.setStatusBarBackground("#0eadfe");
			//状态栏颜色设置.end
		},
		/**
		 * 从其他页面返回
		 */
		backShow: function() {
			plus.navigator.setStatusBarBackground("#0eadfe");
		},
		close: function() {
			var before_id = plus.webview.currentWebview().before_id;
			var before_webview = plus.webview.getWebviewById(before_id);
			mui.fire(before_webview, 'backShow');
		}
	},
	mounted : function(){
		var that = this;
		Bwebapp.Page.bindInit(this, function(){
			that.init();
		})
	}
});
