var mysql = require('mysql');
var getConnection = function() {
    var connection = mysql.createConnection({
            host: '139.196.21.242',
            user: 'root',
            password: 'Jia123',
            port: 3306,
            database: 'jiaodarun'
        });
    return connection;
};

// index page
exports.result = function(req, res) {
  var name = req.body.name;
  console.log(name);
  var conn = getConnection();
  conn.query('SELECT * FROM profiles where name="' + name + '"', function (error, results, fields) {
        if (error) {
          res.render('error', {
            title: '上海高校跑步联盟（微信号:最盟）',
            tip: '查询出错',
            error: error
          });
          return;
        }
        if(!results || results.length === 0) {
          res.render('error', {
            title: '上海高校跑步联盟（微信号:最盟）',
            tip: '没有查到相关信息，重新查询',
            error: error
          });
          return;
        } else {
          // console.log(results);
          res.render('result', {
            title: '上海高校跑步联盟（微信号:最盟）',
            results: results,
          });
          return;
        }
    });
};
exports.query = function(req, res) {
  res.render('query', {
    title: '上海高校跑步联盟（微信号:最盟）',
  });
};