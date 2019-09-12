const Router = require('koa-router');
const router = new Router();
const config = require('../utils/config.json');

let isConsole = config.isConsole;
/**
 * @getClientIP
 * @desc 获取用户 ip 地址
 * @param {Object} req - 请求
 */
function getClientIp(req, proxyType) {
	let ip = req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
	// 如果使用了nginx代理

	if (proxyType === 'nginx') {
		// headers上的信息容易被伪造,但是我不care,自有办法过滤,例如'x-nginx-proxy'和'x-real-ip'我在nginx配置里做了一层拦截把他们设置成了'true'和真实ip,所以不用担心被伪造
		// 如果没用代理的话,我直接通过req.connection.remoteAddress获取到的也是真实ip,所以我不care
		ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || ip;
	}
	const ipArr = ip.split(',');
	// 如果使用了nginx代理,如果没配置'x-real-ip'只配置了'x-forwarded-for'为$proxy_add_x_forwarded_for,如果客户端也设置了'x-forwarded-for'进行伪造ip
	// 则req.headers['x-forwarded-for']的格式为ip1,ip2只有最后一个才是真实的ip
	if (proxyType === 'nginx') {
		ip = ipArr[ipArr.length - 1];
	}
	if (ip.indexOf('::ffff:') !== -1) {
		ip = ip.substring(7);
	}
	return ip;
}


router.get('/', async (ctx, next) => {
	let title = 'Hello Koa2';
	//ctx.render(xxx)页面的地址
	await ctx.render('index', {
		title,
		isConsole
	})
}).get('/login', async (ctx, next) => {
	let title = 'login';
	await ctx.render('login', {
		title,
		isConsole
	});
	const ms = new Date() - ctx.util.apiStartTime;
	let logs = `ip:[${getClientIp(ctx.req,'nginx')}], method:[${ctx.method}],api:[${ctx.url}],响应时间[${ms}ms]`;
	console.log(`时间:[${new Date()}],${logs}`);
	ctx.util.log.info(logs);
}).post('/index', async (ctx, next) => {
	const data = ctx.request.body;
	//console.log(data)
	ctx.body = {
		code: 0,
		msg: ''
	};
	ctx.body = ctx.request;
}).post('/api', async (ctx, next) => {
	const data = ctx.request.body;
	//console.log(getClientIp(ctx.req,'nginx'))
	ctx.body = {
		code: 0,
		msg: '/api',
		ctx: ctx,
		ip: ctx.request.ip,
		ipn: getClientIp(ctx.req, 'nginx')
	};
	const ms = new Date() - ctx.util.apiStartTime;
	let logs = `ip:[${getClientIp(ctx.req,'nginx')}], method:[${ctx.method}],api:[${ctx.url}],响应时间[${ms}ms]`;
	console.log(`时间:[${new Date()}],${logs}`);
	ctx.util.log.info(logs);
}).post('/webapp/api', async (ctx, next) => {
	const data = ctx.request.body;
	//console.log(ctx.util.log)
	//console.log(ctx.util.apiStartTime)
	//console.log(getClientIp(ctx.req,'nginx'))
	ctx.body = {
		code: 0,
		msg: '/webapp/api',
		ctx: ctx,
		ip: ctx.request.ip,
		ipn: getClientIp(ctx.req, 'nginx')
	};
	const ms = new Date() - ctx.util.apiStartTime;
	let logs = `ip:[${getClientIp(ctx.req,'nginx')}], method:[${ctx.method}],api:[${ctx.url}],响应时间[${ms}ms]`;
	console.log(`时间:[${new Date()}],${logs}`);
	ctx.util.log.info(logs);
}).post('/login', async (ctx, next) => {
	const data = ctx.request.body;
	//console.log(ctx.util.log)
	//console.log(ctx.util.apiStartTime)
	//console.log(getClientIp(ctx.req,'nginx'))
	ctx.body = {
		code: 0,
		msg: '/login',
		ctx: ctx,
		ip: ctx.request.ip,
		ipn: getClientIp(ctx.req, 'nginx')
	};
	const ms = new Date() - ctx.util.apiStartTime;
	let logs = `ip:[${getClientIp(ctx.req,'nginx')}], method:[${ctx.method}],api:[${ctx.url}],响应时间[${ms}ms]`;
	console.log(`时间:[${new Date()}],${logs}`);
	ctx.util.log.info(logs);
})

module.exports = router;