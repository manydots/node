const Router = require('koa-router');
const Tools = require('../utils/index');
const log = require('../utils/log');
const http = require('../utils/http');


// 首页路由
let router = new Router();
router.get('/', async ctx => {
	let apiStartTime = new Date();
	let title = 'Socket.IO chat';
	await ctx.render('chat', {
		title
	});
	let ms = new Date() - apiStartTime;
	let logs = `ip:[${Tools.getClientIp(ctx.req,'nginx')}],响应时间[${ms}ms]`;
	console.log(logs)
	log.info(logs);
});

router.get('/wechat/:userId', async (ctx, next) => {
	//console.log(ctx.params)
	var userId = ctx.params.userId; // 获取请求参数
	let params = {
		userId: userId,
		cmd: 'login',
		username: 'admin',
		password: 'admin'
	};
	await http.pjax(params).then(async (res) => {
		//console.log(res)
		ctx.cookies.set("username", "admin" + Math.random());
		await ctx.render('privatechat', {
			title: `与${params.username}的私聊`,
			isConsole: false
		});
	});
});


router.get('/register', async (ctx, next) => {
	await ctx.render('register', {
		title: '注册',
		isConsole: false
	});
});
router.post('/register', async (ctx, next) => {
	//console.log(ctx.params)
	console.log(ctx.util.apiStartTime)
	const data = ctx.request.body;
	let params = {
		cmd: 'register',
		username: data.username,
		password: data.password,
		email: data.email
	};
	if (data.username == '' || data.password == '' || data.email == '') {

		ctx.body = {
			'code': 'register_error_lack_params',
			'msg': '用户注册信息异常'
		}
		let ms = new Date() - ctx.util.apiStartTime;
		let logs = `ip:[${Tools.getClientIp(ctx.req,'nginx')}],api:[${params.cmd}],响应时间[${ms}ms]`;
		console.log(logs)
		log.info(logs);
	} else {
		await http.pjax(params).then(async (res) => {
			//ctx.cookies.set("username", params.username);
			console.log(typeof res)
			console.log(res)
			ctx.body = res;
			// await ctx.render('privatechat', {
			// 	title: `与${params.username}`,
			// 	isConsole: false
			// });
		});
	}

});

module.exports = router;