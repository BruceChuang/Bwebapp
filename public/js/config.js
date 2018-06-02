window.config = {
	app_name : '文玩核桃',
	index_page : 'Tab_home',
	sms_interval : 30,
	urls : {
		apis : {
			User : {
				logonBySms : 'http://123.207.48.54:8080/seckill/logonBySms',
				regBySms : 'http://123.207.48.54:8080/seckill/regBySms',
			},
			Sms : {
				sendReg : 'http://123.207.48.54:8080/seckill/sendReg',
				sendLogon : 'http://123.207.48.54:8080/seckill/sendLogon',
			}
		}
	}
}
