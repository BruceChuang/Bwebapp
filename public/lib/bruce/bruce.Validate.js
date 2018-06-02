/**
 * 2017.9.21 15:05
var validate = new window.Validate({
	form : "#form",
	autoSubmit : false,
	rules : {
		phone : {
			required : true,
			phone : true
		},
		sms : {
			required : true
		}
	},
	cbs : {
		phone : {
			required : function(ok){
				if(ok){
					return false;
				}
				if(document.querySelectorAll(".mui-toast-container").length == 0){
					mui.toast('请填写手机',{ duration:'short', type : 'div'})											
				}
			},
			phone : function(ok){
				if(ok){
					return false;
				}
				if(document.querySelectorAll(".mui-toast-container").length == 0){
					mui.toast('手机格式错误',{ duration:'short', type : 'div'})											
				}
			}
		},
		sms : {
			required : function(ok){
				if(ok){
					return false;
				}
				if(document.querySelectorAll(".mui-toast-container").length == 0){
					mui.toast('请填写验证码',{ duration:'short', type : 'div'})											
				}
			}
		}
	},
	success : function(){
		plus.nativeUI.showWaiting( "注册中", {
			modal : true,
			back : 'none'
		});
		setTimeout(function(){
			plus.nativeUI.closeWaiting();
		}, 5000);
	}
});
 */
(function(){
	window.Validate = function(conf){
		var that = this;
		//表单dom
		that.form = document.querySelector(conf.form) || document.querySelector("form");
		//验证规则
		that.rules = conf.rules || {};
		//每个验证规则对应的回调函数
		that.cbs = conf.cbs || {};
		//表单开始验证的函数
		that.onsubmit = conf.onsubmit || function(e){};
		//表单全部验证成功的函数
		that.success = conf.success || function(e){};
		//表单验证失败的函数
		that.fail = conf.fail || function(e){};
		//表单验证完成的函数
		that.complete = conf.complete || function(e){};
		//验证成功后是否自动提交
		that.autoSubmit = (typeof conf.autoSubmit == "boolean") ? conf.autoSubmit : true;
		//表单是否正在提交
		that.oncheck_count = 0;
		//记录验证结果
		that.check_res = true;
		
		//初始化
		that.init();
	}
	var V = Validate.prototype;
	/**
	 * 初始化
	 */
	V.init = function(){
		var that = this;
		that.oncheck_count = -1;
		
		that.form.onsubmit = function(e){ //阻止表单触发默认事件（刷新页面）
			return false; //阻止触发默认事件			
		}
		that.form.addEventListener('submit', function(e){ //表单提交时进行验证
			if(that.oncheck_count == -1){ //如果没有表单正在提交，则执行操作
				that.check_res = true; //初始值为true，如果有一个验证出错，则为false
				that.oncheck_count = 0;
				that.checkAll();
				that.onsubmit(e); //执行用户传入的函数
			}
		}, true);
	}
	/**
	 * 验证表单
	 */
	V.checkAll = function(){
		var that = this;
		for (var control_name in that.rules) { //统计需要验证的规则个数
			for (var rule_name in that.rules[control_name]) {
				that.oncheck_count ++;
			}
		}
		for (var control_name in that.rules) { //遍历控件
			for (var rule_name in that.rules[control_name]) { //遍历规则
				that.checking(control_name, rule_name, that.rules[control_name][rule_name], that.cbs[control_name][rule_name], 1); //验证规则
			}
		}
	}
	/**
	 * @param {String} control_name
	 * @param {String} name
	 * @param {Function} cb 回调函数：验证结果会通过ok参数穿进去
	 */
	V.checkOne = function(control_name, name, cb){
		var that = this;
		return that.checking(control_name, name, that.rules[control_name][name], cb, 2); //验证规则
	}
	/**
	 * 校检器
	 * @param {String} control_name
	 * @param {Object} name
	 * @param {Object} rule
	 * @param {Object} cb
	 */
	V.checking = function(control_name, name, rule, cb, mode){
		var that = this;
		switch (name){ //判断规则名
			case "required":
				return that.checkingRequire(that.form.querySelector('*[name="' + control_name + '"').value, rule, cb, mode);
				break;
			case "maxlength":
				return that.checkingMaxlength(that.form.querySelector('*[name="' + control_name + '"').value, rule, cb, mode);
				break;
			case "minlength":
				return that.checkingMinlength(that.form.querySelector('*[name="' + control_name + '"').value, rule, cb, mode);
				break;
			case "phone":
				return that.checkingPhone(that.form.querySelector('*[name="' + control_name + '"').value, rule, cb, mode);
				break;
			case "ajax":
				break;
			default:
				break;
		}
		
		switch (typeof rule){ //判断rule类型
			case "object": //正则
				break;
			default:
				break;
		}
	}
	V.checkingComplete = function(ok, cb, mode){
		var that = this;
		if(typeof cb == "function"){ //执行回调函数
			cb(ok);
		}
		switch (mode){ //判断模式
			case 1: //如果是表单提交的时候调用
				if(ok == false){ //如果验证失败
					that.check_res = false;
				}
				that.oncheck_count --; //减少需要验证的规则个数
				if(that.oncheck_count == 0){ //如果检查完成了，则oncheck_count重置为-1
					that.complete(that.check_res);
					if(that.check_res == true){ //判断表单是否符合规则
						that.success();
						that.autoSubmit && that.form.submit();
					}else{
						that.fail();
					}
					that.oncheck_count = -1;
				}
				break;
			case 2: //如果单独验证
				break;
			default:
				break;
		}
	}
	/**
	 * @param {Object} value
	 * @param {Object} cb
	 * @return {Boolean}
	 */
	V.checkingRequire = function(value, rule, cb, mode){
		var that = this;
		
		var t = value.length > 0 ? true : false;
		var ok = rule ? t : !t;
		that.checkingComplete(ok, cb, mode)
		
		return ok;
	}
	/**
	 * @param {String} value
	 * @param {Number} rule
	 * @param {Object} cb
	 * @return {Boolean}
	 */
	V.checkingMaxlength = function(value, rule, cb, mode){
		var that = this;
		
		var ok = value.length <= rule ? true : false;
		that.checkingComplete(ok, cb, mode)
		
		return ok;
	}
	/**
	 * @param {String} value
	 * @param {Number} rule
	 * @param {Object} cb
	 * @return {Boolean}
	 */
	V.checkingMinlength = function(value, rule, cb, mode){
		var that = this;
		
		var ok = value.length >= rule ? true : false;
		that.checkingComplete(ok, cb, mode)
		
		return ok;
	}
	/**
	 * @param {String} value
	 * @param {Number} rule
	 * @param {Object} cb
	 * @return {Boolean}
	 */
	V.checkingPhone = function(value, rule, cb, mode){
		var that = this;
		
		var ok = true;
		if(!(/^1[34578]\d{9}$/.test(value))){
			ok = false;
    	}
		that.checkingComplete(ok, cb, mode)
		
		return ok;
	}
})();