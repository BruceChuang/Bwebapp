Bwebapp.Page.regPageByVue('Demo__first', //id
document.getElementById('Demo__first').innerHTML, //模板
{ //控制器
	data : {
		
	},
	methods : {
		init : function(){
			console.log('init')
		}
	},
	mounted : function(){
		var that = this;
		var el = Bwebapp.Query().setEl(that.$el);
		el.addEvent('init', function(){ //绑定事件
			that.init();
		})
	}
});
