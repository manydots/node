
<div align="center">

[![](https://flat.badgen.net/npm/v/dosn?icon=npm)](https://www.npmjs.com/package/dosn) [![NPM downloads](http://img.shields.io/npm/dm/dosn.svg?style=flat-square)](https://www.npmjs.com/package/dosn)

</div>
<pre>
  demo为node项目，建议clone到本地view
</pre>

## share
```
  
  demo结构还在优化中，nginx监听doso.jeeas.cn的80端口，转发到内部3030端口；
  nginx未配置负载均衡，已拦截ip访问；


  npm run server
  建议使用启动方式

  npm run start or npm start
  koa框架启动方式，建议自行配置

  预览地址 http://doso.jeeas.cn

  node环境:
    1、yum安装node会安装一个老版本;
    2、建议使用 n 管理node版本;
        n 常用的命令有：
        n 会列出所有安装的版本供你切换
        n latest 安装最新版本
        n stable 安装最新稳定版
        n lts 安装最新长期支持版本
        n rm [版本号] 删除某一版本
        n -h 帮助命令
        n [版本号] 安装指定版本node

        Tips:
          若n切换的版本未生效还需要手动配置一下;
          a.查看系统node的安装路径: which node
          b.通过N_PREFIX变量来修改 n 的默认node安装路径
            .编辑环境配置文件: vim ~/.bash_profile 
            .添加配置语句:
             export N_PREFIX=/usr/local/node  (#node实际安装位置)
             export PATH=$N_PREFIX/bin:$PATH
          c.执行source使修改生效: source ~/.bash_profile
          d.检查是否生效: echo $N_PREFIX
          (亲测可用,转自:https://www.jianshu.com/p/d934d3ba67ec)

    3、node项目可以使用pm2管理
    4、在linux上使用screen挂起任务


  遇到的坑：

	koa:使用 nginx+node+koa+mysql+ejs 简单尝试，透传获取真实ip；

  	log4js:日志级别无法拆分(原因未知)，未启用线程，都会打在info日志里；

  	koa-static:配置的静态资源无法访问(原因未知)，使用koa-static-router代替；

  	koa-bodyparser:读取post数据中间件=>ctx.request.body；

  	http-proxy-middleware:在入口处可配置转发请求；

  	koa-views:使用模板引擎(ejs)；

  	koa-router:配置路由，考虑动态方式，demo需要改进；






``` 