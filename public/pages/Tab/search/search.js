Bwebapp.Page.regPageByVue('Tab__search', //id Tab__search Tab__index
document.getElementById('Tab__search').innerHTML, //模板
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
