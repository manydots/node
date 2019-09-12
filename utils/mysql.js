const mysql = require('mysql');
const config = require('./config.json').mysql;
//console.log(config)
const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    port: config.port,
    multipleStatements: true //是否开启多条sql语句查询，因项目需要开启，默认为false
});

let query = (sql, sqlParams, callback) => {
    pool.getConnection(function(err, conn) {
        if (err) {
            callback(err, null, null);
        } else {
            //console.log('数据库连接成功.',conn)
            conn.query(sql, sqlParams, function(qerr, vals, fields) {
                callback(qerr, vals, fields);
            });
        }
        // conn.release(); // not work!!!
        pool.releaseConnection(conn);
    });
}


module.exports = query;