Bwebapp.Page.regPageByVue('Tab__pelease', //id Tab__pelease Tab__index
document.getElementById('Tab__pelease').innerHTML, //模板
{ //控制器
	data: {},
	methods: {
		goAuctionPelease : function(){
			Bwebapp.Page.openPage({
				id : 'Auction__pelease',
				page_url : 'Auction__pelease',
				auto_show : true,
				show_ani : 'slide'
			});
			Bwebapp.Page.getCurrentPage(this).close()
		},
		clickBack : function(){
			Bwebapp.Page.getCurrentPage(this).close()
		},
		init: function() {
		},
		show: function() {
			plus.navigator.setStatusBarBackground("#0eadfe");
		},
		/**
		 * 从其他页面返回
		 */
		backShow: function() {
			plus.navigator.setStatusBarBackground("#0eadfe");
		}
	},
	mounted : function(){
		var that = this;
		Bwebapp.Page.bindInit(this, function(){
			that.init();
		})
	}
});
