Bwebapp.Page.regPageByVue('Auction__pelease', //id Auction__pelease Tab__index
document.getElementById('Auction__pelease').innerHTML, //模板
{ //控制器
	data : {
		
	},
	methods : {
		pageBack : function(){
			Bwebapp.Page.getCurrentPage(this).close()
		},
		showWaiting : function(){
			Bwebapp.WebUI.Waiting.show({modal : true,title : '哈哈哈'})
		},
		init : function(){
		}
	},
	mounted : function(){
		var that = this;
		Bwebapp.Page.bindInit(this, function(){
			that.init();
		})
	}
});
