Bwebapp.Page.regPageByVue('Tab__home', //id Tab__home Tab__index
	document.getElementById('Tab__home').innerHTML, //模板
	{ //控制器
		data: {},
		methods: {
			goSearch: function() {
				Bwebapp.Page.openPage({
					id: 'Tab__search',
					page_url: 'Tab__search',
					auto_show: true,
					show_ani: 'slide',
					extrals: {
						before_id: Bwebapp.Page.getCurrentPage(this).id
					}
				});
			},
			init: function() {}
		},
		mounted: function() {
			var that = this;
			Bwebapp.Page.bindInit(this, function() {
				that.init();
			})
			Bwebapp.Page.bindEvent(this, 'backShow', function() {
				console.log('backShow')
			})
		}
	});