Bwebapp.Page.regPageByVue('Tab__personal', //id Tab__search Tab__index
document.getElementById('Tab__personal').innerHTML, //模板
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
