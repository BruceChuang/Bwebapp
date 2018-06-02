Bwebapp = {
	/**
	 * 路由的配置
	 */
	config: {
		index: 'Tab__index', //首页所在的节点
		loader_ani: 'three_cicle'
	},
	/**
	 * webapp启动时的操作
	 */
	Loader: Object,
	/**
	 * js操作封装函数
	 */
	Common: Object,
	/**
	 * dom操作类
	 * @param {String} selector 选择器
	 */
	Query: Object,
	/**
	 * 页面类实例（new后还需要执行run()来启动）
	 */
	Page: Object,
	/**
	 * 浏览器UI类
	 */
	WebUI: Object
};
! function(B) {
	/**
	 * webapp启动时的操作
	 */
	! function($) {
		function callback() { //创建加载中dom
			var div = document.createElement('div');
			div.className = 'Bwebapp-loader-wrapper';
			switch(B.config.loader_ani) {
				case 'three_cicle':
					div.innerHTML = '<div class="Bwebapp-loader"></div><div class="loader-section section-left"></div><div class="loader-section section-right"></div>';
					break;
				default:
					break;
			}
			document.body.appendChild(div);
		}
		//---文档流加载完成后执行.start
		///兼容FF,Google
		if(document.addEventListener) {
			document.addEventListener('DOMContentLoaded', function() {
				document.removeEventListener('DOMContentLoaded', arguments.callee, false);
				callback();
			}, false)
		}
		//兼容IE
		else if(document.attachEvent) {
			document.attachEvent('onreadytstatechange', function() {
				if(document.readyState == "complete") {
					document.detachEvent("onreadystatechange", arguments.callee);
					callback();
				}
			})
		} else if(document.lastChild == document.body) {
			callback();
		}
		//---文档流加载完成后执行.end
		$.loaded = function() { //删除加载中
			var loader = document.getElementsByClassName('Bwebapp-loader-wrapper')[0];
			loader.className += ' loaded';
			setTimeout(function() {
				loader.parentNode.removeChild(loader);
			}, 2000);
		}
	}(B.Loader)
	/**
	 * js操作封装函数
	 */
	! function($) {
		/** !!!（待完善）
		 * 复制一份对象
		 * @param {Object} obj
		 * @return {Object}
		 */
		$.copyObj = function(obj) {
			return obj; //测试代码
			var obj_str = JSON.stringify(obj);
			var new_obj = JSON.parse(obj_str);
			return new_obj;
		}
	}(Bwebapp.Common)
	/**
	 * dom操作类
	 * @param {String} selector 选择器
	 */
	function Query(selector) {
		return new Query.prototype.init(selector); //使用无new构造
	}! function($) { //指向原型链，继承方法
		/**
		 * 构造器
		 * @param {String} selector 选择器
		 */
		$.init = function(selector) {
			this.el = null; //存放选择器选择出来的元素
			if(typeof selector == 'string') {
				this.el = document.querySelectorAll(selector);
			}
			return this;
		}
		$.constructor = Query;
		$.init.prototype = $;
		/**
		 * 设置当前实例中的element对象
		 * @param {Object} element
		 */
		$.setEl = function(element) {
			this.el = element;
			return this;
		}
		/**
		 * 无论实例中的element为节点集合还是单个节点，都会保证对每个节点进行遍历
		 * @param {Function} func 回调函数，func(HTMLElement)
		 */
		$.each = function(func) {
			if(this.el instanceof HTMLElement) { //如果是直接的HTMLElement，则执行回调函数
				try {
					func(this.el); //执行回调函数
				} catch(e) {
					//TODO handle the exception
					console.error('[Bwebapp]参数错误：请传入一个函数');
				} finally {
					return this;
				}
			} else if(this.el instanceof NodeList) { //如果是节点集合，则遍历执行回调函数
				for(var i in this.el) { //遍历节点集合
					try {
						func(this.el[i]); //执行回调函数
					} catch(e) {
						//TODO handle the exception
						console.error('[Bwebapp]参数错误：请传入一个函数');
					} finally {
						return this;
					}
				}
			}
			return this;
		}
		/**
		 * 通过字符串创建element对象，并覆盖当前实例中的el
		 * @param {Object} html_code html字符串
		 * @return {Object} 当前实例本身
		 */
		$.createElByString = function(html_code) {
			var div = document.createElement('div');
			div.innerHTML = html_code;
			this.el = div.childNodes[0];
			return this;
		}
		/**
		 * 将字符串转换为element，并且父节点为tagname对应的element
		 * @param {String} html_code
		 * @param {String} tagname 父节点的标签名
		 * @return {Object} 当前实例本身
		 */
		$.createElInTagnameByString = function(html_code, tagname) {
			var el = document.createElement(tagname);
			el.innerHTML = html_code;
			this.el = el;
			return this;
		}
		/**
		 * 从dom树中删除自己
		 */
		$.remove = function() {
			this.each(function(el) {
				el.parentNode.removeChild(el);
			})
		}
		/**
		 * 设置或获取css属性，可批量设置或单个设置css，当实例中的element为集合时，不能获取样式
		 * @param {Object} {String} name_or_arr 如果是数组，则可批量设置
		 * @param {String} value * 当第一个参数为样式名时必填
		 * @return {Object} 如果是设置属性，则返回实例本身
		 * @return {String} 如果是获取属性，获取成功则返回样式值
		 * @return {Boolean} 如果获取属性失败，则返回false
		 */
		$.css = function(name_or_arr, value) {
			var that = this;
			if(name_or_arr instanceof Array) { //如果第一个参数是数组，则遍历得出样式
				for(var i in name_or_arr) {
					var name = name_or_arr[i][0]; //获取样式名
					var value = name_or_arr[i][1]; //获取样式值
					that.each(function(element) { //遍历节点，应用样式
						try {
							element.style[name] = value;
						} catch(e) {
							//TODO handle the exception
							console.error('[Bwebapp]参数格式错误：格式应为([["name","value"], ["name","value"]])或(name, value)')
						} finally {
							return that;
						}
					})
				}
				return that;
			} else if((typeof name_or_arr == 'string') && (typeof value == 'string')) { //如果两个参数都为字符串，则设置单一参数
				that.each(function(element) { //遍历节点，应用样式
					try {
						element.style[name_or_arr] = value;
					} catch(e) {
						//TODO handle the exception
						console.error('[Bwebapp]参数格式错误：格式应为([["name","value"], ["name","value"]])或(name, value)')
					} finally {
						return that;
					}
				})
				return that;
			} else if(typeof name_or_arr == 'string') { //如果只有第一个参数，则获取样式值
				if(this.el instanceof HTMLElement) {
					return this.el.style[name_or_arr];
				} else {
					return false;
				}
			} else { //如果什么都没匹配到则提示参数错误，并返回实例
				console.warn('[Bwebapp]参数格式错误:[Bwebapp]参数格式错误：格式应为([["name","value"], ["name","value"]])或(name, value)')
				return that;
			}
		}
		/**
		 * 设置属性或获取属性，使用规则跟css方法一致
		 * @param {Object} name_or_arr
		 * @param {Object} value
		 */
		$.attr = function(name_or_arr, value) {
			var that = this;
			if(name_or_arr instanceof Array) { //如果第一个参数是数组，则遍历得出属性名称
				for(var i in name_or_arr) {
					var name = name_or_arr[i][0]; //获取样式名
					var value = name_or_arr[i][1]; //获取样式值
					that.each(function(element) { //遍历节点，应用样式
						try {
							element.setAttribute(name, value);
						} catch(e) {
							//TODO handle the exception
							console.error('[Bwebapp]参数格式错误：格式应为([["name","value"], ["name","value"]])或(name, value)')
						} finally {
							return that;
						}
					})
				}
				return that;
			} else if((typeof name_or_arr == 'string') && (typeof value == 'string')) { //如果两个参数都为字符串，则设置单一参数
				that.each(function(element) { //遍历节点，应用样式
					try {
						element.setAttribute(name_or_arr, value);
					} catch(e) {
						//TODO handle the exception
						console.error('[Bwebapp]参数格式错误：格式应为([["name","value"], ["name","value"]])或(name, value)')
					} finally {
						return that;
					}
				})
				return that;
			} else if(typeof name_or_arr == 'string') { //如果只有第一个参数，则获取样式值
				if(this.el instanceof HTMLElement) {
					return this.el.getAttribute(name_or_arr);
				} else {
					return false;
				}
			} else { //如果什么都没匹配到则提示参数错误，并返回实例
				console.warn('[Bwebapp]参数格式错误:[Bwebapp]参数格式错误：格式应为([["name","value"], ["name","value"]])或(name, value)')
				return that;
			}
		}
		/**
		 * 判断是否存在class
		 * @param {String} name
		 * @return {Boolean} 是否存在class
		 */
		$.hasClass = function(name) {
			var has = false;
			this.each(function(el) { //遍历元素，如果有一个存在，则返回true
				var res = !!el.className.match(new RegExp("(\\s|^)" + name + "(\\s|$)")); // ( \\s|^ ) 判断前面是否有空格 （\\s | $ ）判断后面是否有空格 两个感叹号为转换为布尔值 以方便做判断
				if(res) {
					has = true;
				}
			})
			return has;
		}
		/**
		 * 添加类名（该函数不会覆盖原来的类）
		 * @param {Object} name
		 * @return {Object} 实例本身
		 */
		$.addClass = function(name) {
			this.each(function(element) { //遍历处理实例中的节点
				var has = !!element.getAttribute('class').match(new RegExp("(\\s|^)" + name + "(\\s|$)")); // ( \\s|^ ) 判断前面是否有空格 （\\s | $ ）判断后面是否有空格 两个感叹号为转换为布尔值 以方便做判断
				if(!has) {
					//处理class中的内容
					var class_old = element.getAttribute('class');
					var class_new = class_old + ' ' + name;
					element.setAttribute('class', class_new); //设置新class内容
				}
			});
			return this;
		}
		/**
		 * 移除指定类名
		 * @param {Object} name
		 */
		$.removeClass = function(name) {
			this.each(function(element) {
				var reg = new RegExp('(\\s|^)' + name + '(\\s|$)'); //定义一个正则用于匹配类名
				//处理类名
				var class_old = element.getAttribute('class');
				var class_new = class_old.replace(reg, ' ');
				element.setAttribute('class', class_new);
			})
			return this;
		}
		/**
		 * 为dom绑定事件
		 * @param {Object} event_name
		 * @param {Object} cb
		 */
		$.addEvent = function(event_name, cb) {
			this.each(function(el) {
				el.addEventListener(event_name, cb)
			})
			return this;
		}
		/**
		 * 绑定动画完毕事件
		 * @param {Object} cb
		 */
		$.addTransitionendEvent = function(cb) {
			//--网上抄来的代码.start
			function whichTransitionEvent() {
				var t;
				var el = document.createElement('fakeelement');
				var transitions = {
					'transition': 'transitionend',
					'OTransition': 'oTransitionEnd',
					'MozTransition': 'transitionend',
					'WebkitTransition': 'webkitTransitionEnd'
				}
				for(t in transitions) {
					if(el.style[t] !== undefined) {
						return transitions[t];
					}
				}
			}
			var transitionEvent = whichTransitionEvent();
			transitionEvent && this.addEvent(transitionEvent, function() {
				cb();
			});
			//--网上抄来的代码.start
			return this;
		}
		/**
		 * 触发dom事件
		 */
		$.fire = function(event_name) {
			var evt = document.createEvent('HTMLEvents');
			evt.initEvent(event_name, false, false);
			this.each(function(el) {
				el.dispatchEvent(evt);
			})
			return this;
		}
	}(Query.prototype);
	/**
	 * 页面实例
	 * @param {Object} id
	 * @param {Object} controller_type
	 * @param {Object} controller_obj
	 * @param {Object} tpl
	 * @param {Object} show_ani
	 * @param {Object} extrals
	 */
	function PageObj(id, controller_type, controller_obj, tpl, show_ani, style, extrals) {
		this.id = id;
		this.node_id = 'Bwebapp_page__' + this.id + B.Page.create_count++; //实际在dom中的id
		this.controller_type = controller_type;
		this.controller_obj = controller_obj;
		this.tpl = tpl;
		this.show_ani = show_ani;
		this.style = style;
		this.extrals = extrals;
		this.controller = {};
		this.el = {};
		var class_ani;
		switch(this.show_ani) { //处理显示动画的类名
			case 'none':
				class_ani = 'ani-none';
				break;
			case 'fade':
				class_ani = 'ani-fade';
				break;
			default:
				this.show_ani = 'slide'; //默认为slide
				class_ani = 'ani-slide';
				break;
		}
		//----创建节点.start
		var body = document.body;
		var style_css = [];
		var attrs = [ //设置属性
			['id', this.node_id],
			['Bwebapp__page_id', this.id],
			['class', 'Bwebapp-page ' + class_ani + ' hide'], //设置类名
		]
		for(var i in extrals) { //将扩展参数存放进属性中
			attrs.push([i, extrals[i]]);
		}
		for(var i in this.style) {
			switch(i) {
				case 'top':
					style_css.push(['top', this.style.top])
					break;
				case 'right':
					style_css.push(['right', this.style.right])
					break;
				case 'bottom':
					style_css.push(['bottom', this.style.bottom])
					break;
				case 'left':
					style_css.push(['top', this.style.left])
					break;
				case 'background-color':
					style_css.push(['background-color', this.style['background-color']])
					break;
				default:
					break;
			}
		}
		var page = B
			.Query()
			.createElInTagnameByString(this.tpl, 'div')
			.css(style_css)
			.attr(attrs); //创建节点
		body.appendChild(page.el); //往body中添加页面
		this.el = document.getElementById(this.node_id); //获取最终创建完成的el
		//----创建节点.end
		//----创建控制器实例.start
		switch(this.controller_type) { //判断是什么类型的页面
			case 'vue':
				this.controller_obj.el = this.el;
				this.controller = new Vue(controller_obj);
				this.el = this.controller.$el;
				break;
			default:
				break;
		}
		//----创建控制器实例.end
	}! function($) {
		$.changeShowAni = function(show_ani) {
			if(show_ani == 'auto') { //如果显示动画为auto，则沿用上次的动画
				return true;
			} else { //如果不是auto，则删除之前的动画，再替换为当前动画
				var before_class_ani = ''; //之前的动画类
				var target_class_ani = '' //现在的动画类
				switch(this.show_ani) {
					case 'none':
						before_class_ani = 'ani-none';
						break;
					case 'fade':
						before_class_ani = 'ani-fade';
						break;
					case 'slide':
						before_class_ani = 'ani-slide';
						break;
					default:
						break;
				}
				switch(show_ani) {
					case 'none':
						target_class_ani = 'ani-none';
						break;
					case 'fade':
						target_class_ani = 'ani-fade';
						break;
					case 'slide':
						target_class_ani = 'ani-slide';
						break;
					default:
						break;
				}
				B.Query().setEl(this.el).removeClass(before_class_ani).addClass(target_class_ani); //设置element的类
				this.show_ani = show_ani;
			}
		}
		/**
		 * 判断页面是否正在显示
		 * @return {Boolean}
		 */
		$.isShow = function() {
			var is = false;
			var query = B.Query().setEl(this.el); //获取Bquery对象
			if(query.hasClass('show')) { //如果有显示,则返回true
				is = true;
			}
			return is;
		}
		/**
		 * 判断页面是否隐藏
		 * @return {Boolean}
		 */
		$.isHide = function() {
			var is = false;
			var query = B.Query().setEl(this.el); //获取Bquery对象
			if(query.hasClass('hide')) { //如果有隐藏,则返回true
				is = true;
			}
			return is;
		}
		/**
		 * 触发事件
		 */
		$.fire = function(eventName) {
			try{				
				B.Query().setEl(this.el).fire(eventName);
			}catch(e){
				//TODO handle the exception
				console.warn('[Bwebapp]参数缺失:请传入要触发的事件名称')
			}
		}
		/**
		 * 初始化页面
		 */
		$.init = function() {
			B.Query().setEl(this.el).fire('init');
		}
		/**
		 * 显示页面
		 * @param {Object} show_ani
		 */
		$.show = function(show_ani) {
			if((typeof show_ani != 'undefined') && (this.show_ani != show_ani)) { //判断是否更改页面显示动画
				this.changeShowAni(show_ani);
			}
			B.Query().setEl(this.el)
				.addClass('show')
				.removeClass('hide') //将element的hide类去除，并添加show类，达到显示页面的目的
				.fire('show'); //触发show事件
		}
		$.hide = function(show_ani) {
			if((typeof show_ani != 'undefined') && (this.show_ani != show_ani)) { //判断是否更改页面显示动画
				this.changeShowAni(show_ani);
			}
			B.Query().setEl(this.el)
				.addClass('hide')
				.removeClass('show') //将element的hide类去除，并添加show类，达到显示页面的目的
				.fire('hide'); //触发hide事件
		}
		$.close = function(show_ani) {
			if((typeof show_ani != 'undefined') && (this.show_ani != show_ani)) { //判断是否更改页面显示动画
				this.changeShowAni(show_ani);
			}
			var that = this;

			function closeLogic() { //关闭逻辑
				B.Query().setEl(that.el).remove(); //删除元素
				B.Page.removeOfOpenPageList(that.id);
			}
			B.Query().setEl(that.el).fire('close');
			if(this.isShow()) { //判断页面是否正在显示,如果有则隐藏页面再关闭
				if(this.show_ani != 'none') { //如果显示动画不为none，则需要在动画执行完毕后再删除节点
					B.Query().setEl(this.el).addTransitionendEvent(function() {
						closeLogic(); //执行关闭逻辑
					})
					this.hide() //隐藏页面
				} else { //如果显示动画为none，则直接hide后close
					this.hide() //隐藏页面
					closeLogic();
				}
			} else {
				closeLogic(); //执行关闭逻辑
			}
		}
	}(PageObj.prototype)
	/**
	 * 页面类（new后还需要执行run()来启动）
	 */
	function Page() {
		this.create_count = 0; //用以防止页面创建时node_id重复
		this.events = ['init', 'show', 'hide', 'close']; //事件列表
		/* 存放注册的页面
		this.reg_page_list = {
			page_url : {
				type : 'vue', //页面可以有多种控制器类型（vue、angular）
				tpl : '',
				vue_obj : Object
			}
		};
		*/
		this.reg_page_list = {};
		/* 存放已打开的页面
		this.open_page_list = [
			Object //页面的实例
			{
				id : 'page_id',
				page_url : 'page_url',
				el : HTMLElement, 参数放在元素的属性中
				controller : VueObject,
				show_ani : auto
			}
		]; 
		 */
		this.open_page_list = [];
	}! function($) { //指向原型链，继承方法
		$.existOfRegPageList = function(page_url) {
			var exist = false;
			if(typeof this.reg_page_list[page_url] == 'object') { //判断页面是否已经注册过了
				exist = true;
			}
			return exist;
		}
		/**
		 * reg_page_list添加元素
		 * @param {String} page_url
		 * @param {Object} page_info
		 * @return {Boolean} 页面是否已经注册
		 */
		$.addToRegPageList = function(page_url, page_info) {
			var exist = this.existOfRegPageList(page_url);
			this.reg_page_list[page_url] = page_info; //加入页面
			return exist;
		}
		/**
		 * 获取注册的页面
		 * @param {String} page_url
		 * @return {Object}
		 */
		$.getInfoOfRegPageList = function(page_url) {
			return this.reg_page_list[page_url];
		}
		/**
		 * reg_page_list删除元素
		 * @param {Object} page_url
		 * @return {Boolean} 删除前页面是否注册
		 */
		$.removeOfRegPageList = function(page_url) {
			var exist = this.existOfRegPageList(page_url);
			this.reg_page_list[page_url] = undefined; //删除页面
			return exist;
		}
		/**
		 * 寻找页面在数组中的索引
		 * @param {Object} id
		 * @return {Number} 如果页面存在，返回页面在数组中所在的索引
		 * @return {Boolean} 如果页面不存在，返回false
		 */
		$.searchIdOfOpenPageList = function(id) {
			var index = false;
			for(var i in this.open_page_list) { //遍历打开页面
				if(this.open_page_list[i].id == id) { //寻找id所指的页面
					index = i;
					break;
				}
			}
			return index;
		}
		/**
		 * open_page_list压入元素
		 * @param {Object} page_content
		 * @return {Number} 如果页面id合法，返回添加后的数组长度
		 * @return {Boolean} 如果页面id不合法，返回false
		 */
		$.addToOpenPageList = function(page_content) {
			if(typeof page_content.id == 'string') { //如果页面id存在且合法，则进行添加操作
				this.open_page_list.push(page_content) //将元素添加到末尾
				return this.open_page_list.length; //返回数组长度
			} else { //如果页面id不合法，则返回false
				return false;
			}
		}
		/**
		 * open_page_list删除元素
		 * @param {Object} id
		 * @return {Boolean} 页面是否存在
		 */
		$.removeOfOpenPageList = function(id) {
			var index = this.searchIdOfOpenPageList(id); //寻找页面在数组中的索引
			if(typeof index != Number && index >= 0) { //如果找到了页面，则删除页面
				this.open_page_list[index] = false;
				return true;
			} else { //如果没有找到页面，则返回false
				return false;
			}
		}
		/**
		 * 创建页面
		 * @param {String} id 页面id（跟变量命名格式一样）
		 * @param {String} page_url 页面路径（会在注册的页面里面找）
		 * @param {String} show_ani 页面显示的动画
		 * @param {Object} style 页面样式(top, right, bottom, left)
		 * @param {Object} extrals 扩展参数（将以属性的方式，设置在该页面对应的el中）
		 * @return {Boolean} 页面打开失败
		 * @return {Object} 页面打开成功
		 */
		$.createPage = function(id, page_url, show_ani, style, extrals) {
			//----参数赋值处理.start
			if(typeof id != 'string') { //如果id不合法，则返回false
				try {
					this.forced_error_reporting.exist.exist = 'error'; //强制报错			
				} catch(e) {
					//TODO handle the exception
					console.warn('[Bwebapp]页面创建错误：缺少参数（id），页面创建失败');
				} finally {
					return false;
				}
			} else if(this.searchIdOfOpenPageList(id) != false) { //如果id对应的页面已存在，则警告，并且返回错误
				try {
					this.forced_error_reporting.exist.exist = 'error'; //强制报错			
				} catch(e) {
					//TODO handle the exception
					console.warn('[Bwebapp]页面创建错误：id所指向的页面已存在，页面创建失败');
				} finally {
					return false;
				}
			}
			if(typeof page_url != 'string') { //如果没有传入page_url,则返回false
				console.warn('[Bwebapp]页面创建错误：缺少参数（page_url），页面创建失败');
				return false;
			} else if(this.existOfRegPageList(page_url) == false) { //如果在注册页面里找不到该页面，则警告，并返回错误
				console.warn('[Bwebapp]页面创建错误：找不到page_url：' + page_url + '所指向的页面（请检查是否该页面是否已经注册），页面创建失败');
				return false;
			}
			if(typeof show_ani != 'string') { //判断是否传入show_ani
				try {
					this.forced_error_reporting.exist.exist = 'error'; //强制报错			
				} catch(e) {
					//TODO handle the exception
					console.warn('[Bwebapp]页面创建错误：缺少参数（show_ani），页面创建失败');
				} finally {
					return false;
				}
			}
			if(typeof style != 'object') { //判断是否传入style
				try {
					this.forced_error_reporting.exist.exist = 'error'; //强制报错			
				} catch(e) {
					//TODO handle the exception
					console.warn('[Bwebapp]页面创建错误：缺少参数（style），页面创建失败');
				} finally {
					return false;
				}
			} else if((typeof style.top != 'string') ||
				(typeof style.right != 'string') ||
				(typeof style.bottom != 'string') ||
				(typeof style.left != 'string')) { //判断参数是否都存在（top right bottom left）
				try {
					this.forced_error_reporting.exist.exist = 'error'; //强制报错			
				} catch(e) {
					//TODO handle the exception
					console.warn('[Bwebapp]页面创建错误：参数错误（style），页面创建失败');
				} finally {
					return false;
				}
			}
			if(typeof extrals != 'object') { //判断是否传入了extrals
				try {
					this.forced_error_reporting.exist.exist = 'error'; //强制报错			
				} catch(e) {
					//TODO handle the exception
					console.warn('[Bwebapp]页面创建错误：缺少参数（extrals），页面创建失败');
				} finally {
					return false;
				}
			}
			//----参数赋值处理.end
			var page_info = B.Common.copyObj(this.getInfoOfRegPageList(page_url)); //获取注册的页面信息
			var page; //用于存放页面实例
			switch(page_info.type) { //创建页面实例
				case 'vue':
					page = new PageObj(id, page_info.type, page_info.vue_obj, page_info.tpl, show_ani, style, extrals);
					break;
				default:
					break;
			}
			//----添加到打开的页面列表.start
			this.addToOpenPageList(page);
			//----添加到打开的页面列表.end
			//----触发事件.start
			page.init();
			//----触发事件.end

			return page;
		}
		/**
		 * 根据页面id获取page对象
		 * @param {String} id
		 */
		$.getPageById = function(id) {
			var index = this.searchIdOfOpenPageList(id);
			var page = this.open_page_list[index];
			return page;
		}
		/**
		 * 获取当前页面对象
		 * @param {Object} controller
		 */
		$.getCurrentPage = function(controller) {
			//暂时没有考虑其他框架作为控制器的情况
			var id = B.Query().setEl(controller.$el).attr('Bwebapp__page_id');
			var page = this.getPageById(id);
			return page;
		}
		/**
		 * 运行方法
		 */
		$.run = function() {

			this.openPage({
				id: 'index',
				page_url: B.config.index
			})
		}
		/**
		 * 注册页面（vue作为控制器）
		 * @param {String} page_url 页面路径
		 * @param {String} tpl 页面模板
		 * @param {Object} vue_obj 实例化vue时的对象
		 * @return {Boolean} 页面是否已经注册
		 */
		$.regPageByVue = function(page_url, tpl, vue_obj) {
			var page_info = { //进行注册操作
				type: 'vue',
				tpl: tpl,
				vue_obj: vue_obj
			};
			var exist = this.addToRegPageList(page_url, page_info);
			return exist;
		}
		/**
		 * 打开新页面
		 * @param {Object} param (id, page_url, auto_show*, show_ani*, style*, extrals*)
		 * @param {String} id 页面id（跟变量命名格式一样）
		 * @param {String} page_url 页面路径（会在注册的页面里面找）
		 * @param {Boolean} auto_show* 默认为true，是否自动显示页面
		 * @param {String} show_ani* 页面显示的动画
		 * @param {Object} style* 页面样式(top, right, bottom, left)
		 * @param {Object} extrals* 扩展参数（将以属性的方式，设置在该页面对应的el中）
		 * @return {Boolean} 页面是否成功打开
		 */
		$.openPage = function(param) {
			//----参数初始化.start
			var id = '',
				page_url = '',
				auto_show = true,
				show_ani = 'none';
			var style = {
				top: '0px',
				right: '0px',
				bottom: '0px',
				left: '0px'
			};
			var extrals = {};
			//----参数初始化.end
			//----参数赋值处理.start
			if(typeof param.id != 'string') { //如果id不合法，则返回false
				return false;
			} else { //如果id没有问题，则赋值
				id = param.id
			}
			if(typeof param.page_url != 'string') { //如果没有传入page_url,则返回false
				return false;
			} else { //如果page_url没有问题，则赋值
				page_url = param.page_url;
			}
			if(typeof param.auto_show == 'boolean') { //如果有传入auto_show，则赋值
				auto_show = param.auto_show;
			}
			if(typeof param.show_ani == 'string') { //如果有传入show_ani，则赋值
				show_ani = param.show_ani;
			}
			if(typeof param.style == 'object') { //如果有传入show_ani，则赋值
				for(var i in param.style) { //将传入的属性全赋值进style
					style[i] = param.style[i];
				}
			}
			if(typeof param.extrals == 'object') { //如果有传入extrals，则赋值
				for(var i in param.extrals) { //将传入的属性全赋值进extrals
					extrals[i] = param.extrals[i];
				}
			}
			//----参数赋值处理.end
			//----创建页面.start
			var page = this.createPage(id, page_url, show_ani, style, extrals);
			if(page == false) { //判断页面是否创建成功
				return false;
			}
			//----创建页面.end
			if(auto_show) { //如果指定自动显示，则显示页面
				setTimeout(function() { //延迟5毫秒显示，不然显示动画无效（bug，需要解决）
					page.show()
				}, 5)
			}
			return page;
		}
		/**
		 * 绑定关闭事件
		 * @param {String} eventName
		 * @param {Object} cb
		 */
		$.bindEvent = function(controller, eventName, cb) {
			B.Query().setEl(controller.$el).addEvent(eventName, function() { //绑定事件
				cb(controller)
			})
		}
		/**
		 * 绑定初始化事件
		 * @param {Object} cb
		 */
		$.bindInit = function(controller, cb) {
			B.Query().setEl(controller.$el).addEvent('init', function() { //绑定事件
				cb(controller)
			})
		}
		/**
		 * 绑定显示事件
		 * @param {Object} cb
		 */
		$.bindShow = function(controller, cb) {
			B.Query().setEl(controller.$el).addEvent('show', function() { //绑定事件
				cb(controller)
			})
		}
		/**
		 * 绑定隐藏事件
		 * @param {Object} cb
		 */
		$.bindHide = function(controller, cb) {
			B.Query().setEl(controller.$el).addEvent('hide', function() { //绑定事件
				cb(controller)
			})
		}
		/**
		 * 绑定关闭事件
		 * @param {Object} cb
		 */
		$.bindClose = function(controller, cb) {
			B.Query().setEl(controller.$el).addEvent('close', function() { //绑定事件
				cb(controller)
			})
		}
	}(Page.prototype);

	! function($) {
		/**
		 * 模态框类
		 */
		function Modal() {
			this.body_el = null;
		}
		/**
		 * 显示等待框
		 * @param {Object} options
		 * @param {String} background-color* 模态框的颜色（默认为透明）opacity
		 * @param {Number} opacity* 背景透明度，默认为0.3
		 */
		Modal.prototype.show = function(options) {
			var el = Query().createElByString('<div class="Bwebapp-WebUI-Modal"></div>'); //创建节点（还未绑在body上）
			//初始化参数.start
			options = typeof options == 'undefined' ? {} : options;
			options['background-color'] = typeof options['background-color'] == 'undefined' ? 'black' : options['background-color'];
			options.opacity = typeof options.opacity == 'undefined' ? 0.3 : options.opacity;
			//初始化参数.end
			if(this.body_el == null){ //如果body上的节点为空，则插入				
				this.body_el = Query().setEl(document.body.appendChild(el.el)); //将modal节点加入document
			}else{ //如果body上的节点不为空，则先删除节点在插入
				this.body_el.remove();
				this.body_el = Query().setEl(document.body.appendChild(el.el)); //将modal节点加入document
			}
			this.body_el.css([ //设置透明度
				['opacity', options.opacity]
			]);
			this.body_el.css([ //设置背景色
				['background-color', options['background-color']]
			]);
			this.body_el.css([ //显示模态框
				['display', 'block']
			]);
		}
		Modal.prototype.hide = function() {
			if(this.body_el != null){ //如果body上的 节点不为空，则删除节点
				this.body_el.remove();
				this.body_el = null;
			}
		}
		/**
		 * 等待框类
		 */
		function Waiting() {
			this.body_els = {
				modal : null,
				main : null,
				title : null
			};
		}
		/**
		 * 显示等待框
		 * @param {Object} options
		 * @param {String} title*
		 * @param {Boolean} modal* 等待框是否以模态框显示
		 */
		Waiting.prototype.show = function(options) {
			var els = {
				modal: Query().createElByString('<div class="Bwebapp-WebUI-waiting_modal"></div>'),
				main: Query().createElByString('<div class="Bwebapp-WebUI-waiting"><span></span><span></span><span></span><div class="title"></div></div>'),
				title: Object
			};
			//初始化参数.start
			options = typeof options == 'undefined' ? {} : options;
			options.title = typeof options.title == 'undefined' ? '' : options.title;
			options.modal = typeof options.modal == 'undefined' ? false : options.modal;
			//初始化参数.end
			//body节点创建.start
			if(this.body_els.modal == null){ //如果body上的节点为空，则插入				
				this.body_els.modal = Query().setEl(document.body.appendChild(els.modal.el)); //将modal节点加入document
			}else{ //如果body上的节点不为空，则先删除节点在插入
				this.body_els.modal.remove();
				this.body_els.modal = Query().setEl(document.body.appendChild(els.modal.el)); //将modal节点加入document
			}
			if(this.body_els.main == null){ //如果body上的节点为空，则插入				
				this.body_els.main = Query().setEl(document.body.appendChild(els.main.el)); //将modal节点加入document
			}else{ //如果body上的节点不为空，则先删除节点在插入
				this.body_els.main.remove();
				this.body_els.main = Query().setEl(document.body.appendChild(els.main.el)); //将modal节点加入document
			}
			this.body_els.title = this.body_els.main.el.getElementsByClassName('title')[0]; //获取title节点
			//body节点创建.end
			this.body_els.title.innerHTML = options.title; //设置标题
			if(options.modal) { //设置是否以模态显示
				this.body_els.modal.css([
					['display', 'block']
				]);
			}
			this.body_els.main.css([ //显示等待中
				['display', 'block']
			]);
		}
		Waiting.prototype.hide = function() {
			if(this.body_els.modal != null) //如果body上的 节点不为空，则删除节点
				this.body_els.modal.remove();
				this.body_els.modal = null;
			if(this.body_els.main != null) //如果body上的 节点不为空，则删除节点
				this.body_els.main.remove()
				this.body_els.main = null;
		}
		$.run = function() {
			this.Waiting = new Waiting();
			this.Modal = new Modal();
		}
		$.showWaiting = function(options){
			$.Waiting.show(options)
		}
		$.hideWaiting = function(){
			$.Waiting.hide()
		}
		$.showModal = function(options){
			$.Modal.show(options)
		}
		$.hideModal = function(){
			$.Modal.hide()
		}
	}(B.WebUI)

	var config = Bwebapp.config; //获取配置
	Bwebapp.Query = Query; //放置js操作类
	Bwebapp.Page = new Page(); //实例化页面类

	/**
	 * 当页面准备完毕后运行各实例
	 */
	window.onload = function() {
		Bwebapp.Page.run(); //运行页面类实例
		B.WebUI.run();
		B.Loader.loaded();
	}
}(Bwebapp);