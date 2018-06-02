Bwebapp.Page.regPageByVue('Tab__classify', //id Tab__search Tab__index
document.getElementById('Tab__classify').innerHTML, //模板
{ //控制器
	data: {},
	methods: {
		pageBack : function(){
			Bwebapp.Page.getCurrentPage(this).close()
		},
		init: function() {
		}
	},
	mounted : function(){
		var that = this;
		Bwebapp.Page.bindInit(this, function(){
			that.init();
		})
	}
});
