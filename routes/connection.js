var mysql = require('mysql')

var util = require('util')

var conn = mysql.createConnection({
    host: "bun9fq9ycki9avlxsm6h-mysql.services.clever-cloud.com ",
    user: "uhfctuxbu0ljcj9m",
    password: "s97lFinSkHJXw8Mmwq2c",
    database: "bun9fq9ycki9avlxsm6h"
})

var exe = util.promisify(conn.query).bind(conn)

module.exports = exe
