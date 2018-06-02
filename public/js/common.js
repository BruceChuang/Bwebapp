/**
 * 保存用户信息
 * @param {Object} user
 */
function setUser(user) {
	localStorage.setItem("user", JSON.stringify(user));
}

/**
 * 获取用户信息
 */
function getUser() {
	var user = localStorage.getItem('user');
	if(user != null) {
		user = JSON.parse(user);
	}
	return user;
}