const Router = require('koa-router');
const db = require('../utils/mysql')
const Koa = require('koa');
const app = new Koa();

//https://github.com/xiaqijian/koa2-lessons/blob/master/lesson6/db/db.js

const home = new Router();

home.get('/', async (ctx) => {
	let title = '首页';
	await ctx.render('indext', {
		title
	})
})

const index = new Router();
index.get('/', async (ctx) => {
	let title = 'index333';
	await ctx.render('index', {
		title
	})
}).post('/', async (ctx) => {
	const data = ctx.request.body;
	//console.log(data)
	ctx.body = {}
	const sql = 'select * from ';
	console.log(sql)
})


// 子路由2
const page = new Router()

page.get('/404', async (ctx) => {
	let title = "404"
	await ctx.render('err', {
		title
	})
})


const login = new Router()

login.get('/', async (ctx) => {
	let title = "登录"
	await ctx.render('login', {
		title
	})
}).post('/', async (ctx) => {
	const data = ctx.request.body;
	console.log(data)
	//let queryres = await User.queryEmail(data.email)
	if (ctx) {
		ctx.body = {
			'code': 0,
			'data': {},
			'mesg': '密码错误'
		}

	} else {
		ctx.body = {
			'code': 0,
			'data': {},
			'mesg': '没有该用户，去注册吧'
		}
	}
})



// 装载所有子路由
let router = new Router()
router.use('/', home.routes(), home.allowedMethods())
router.use('/index', index.routes(), index.allowedMethods())
router.use('/page', page.routes(), page.allowedMethods())
router.use('/login', login.routes(), login.allowedMethods())



module.exports = router;