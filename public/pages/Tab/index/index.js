Bwebapp.Page.regPageByVue('Tab__index', //id
document.getElementById('Tab__index').innerHTML, //模板
{ //控制器
	data: {
		app: {},
		tabs: [],
		current: 0,
		styles: {
			bottom: '50px',
			scrollIndicator: 'none'
		},
		isactive: {
			home: true,
			pelease: false,
			msg: false,
			my: false
		}
	},
	methods: {
		showPelease: function(){
			var page = Bwebapp.Page.openPage({
				id : 'pelease',
				page_url : 'Tab__pelease',
				auto_show : true,
				style : {
					'background-color' : 'transparent'
				},
				show_ani : 'fade'
			});
		},
		/**
		 * 选项卡点击
		 */
		changeTab: function(event) {
			var that = this;
			var href = event.currentTarget.getAttribute('href');
			var name = event.currentTarget.getAttribute('data-name');
			//如果要显示的页面跟当前页面相同，则不进行任何操作
			if(that.tabs[that.current].id == href) {
				return false;
			}
			//更新active
			for(var i in that.isactive) {
				that.isactive[i] = i == name ? true : false;
			}
			//找到页面对应的索引，显示当前页面，隐藏旧业面，并更新current
			for(var i = 0; i < that.tabs.length; i++) {
				if(that.tabs[i].id == href) {
					that.tabs[i].show();
					that.tabs[that.current].hide();
					that.current = i;
					break;
				}
			}
		},
		/**
		 * 创建tab
		 */
		createWebviews: function() {
			var that = this;
			//创建子页面并获取子页面id
			for(var i = 0, arr_a = mui('.tab.true'); i < arr_a.length; i++) {
				page = Bwebapp.Page.openPage({
					id : arr_a[i].getAttribute('href'),
					page_url : arr_a[i].getAttribute('href'),
					auto_show : false,
					style : that.styles
				});
				that.tabs[i] = page;
			}
			//默认显示第一个页面
			try{ //避免报错				
				that.tabs[that.current].show();
			}catch(e){
				//TODO handle the exception
			}
		},
		init: function() {
			this.createWebviews(); //创建Tab
		}
	},
	mounted : function(){
		var that = this;
		Bwebapp.Page.bindInit(this, function(){
			that.init();
		})
	}
});
