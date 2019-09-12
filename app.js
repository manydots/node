const Koa = require('koa')
const app = new Koa();
const statics = require('koa-static');
const views = require('koa-views')
const bodyparser = require('koa-bodyparser')
const path = require('path')
const router =  require('./routes/index.js')


const index = require('./routes/index')
const users = require('./routes/users')

const staticPath = './static';
app.use(statics(
	path.join(__dirname, staticPath)
))
app.use(bodyparser({
	enableTypes: ['json', 'form', 'text']
}))


// 加载模板引擎
app.use(views(path.join(__dirname, './views'), {
	extension: 'ejs'
}))
// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods())

// logger
// app.use(async (ctx, next) => {
// 	const start = new Date()
// 	await next()
// 	const ms = new Date() - start
// 	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// })

// 挂载日志模块
// app.use(async (ctx, next) => {
// 	ctx.util = {
// 		log: require('./utils/log')
// 	}
// 	await next()
// })


// 记录日志
/*app.use(async (ctx, next) => {
	ctx.util = {
		log: require('./utils/log'),
		mysql: require('./utils/mysql')
	}
	const start = new Date();
	await next();
	const ms = new Date() - start;
	ctx.util.log.info(`${ctx.method}-${ctx.url}-${ms}ms`)
})*/


const db = require('./utils/mysql')
// 操作数据库
const sql = 'select * from';
app.use(async (ctx, next) => {

	db(sql,null,function(qerr, vals, fields){
		console.log(vals);
		//console.log(fields);
	})
	await next();
})


// error-handling
app.on('error', (err, ctx) => {
	console.error('server error', err, ctx)
});

module.exports = app