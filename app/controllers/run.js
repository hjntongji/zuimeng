var mysql = require('mysql');
var iiii=0;
var getConnection = function() {
    var connection = mysql.createConnection({
            host: 'localhost',
            user: 'zuimengOrg',
            password: 'zuimeng098',
            port: 3306,
            database: 'jiaodarun'
        });
    return connection;
};

// index page
exports.result = function(req, res) {
  var name = req.body.name;
  console.log(name, iiii++);
  var conn = getConnection();
  if (!name || name.indexOf('delete') >= 0
        || name.indexOf('drop') >= 0
        || name.indexOf('*') >= 0
        || name.indexOf('true') >= 0
        || name.indexOf('select') >= 0
        || name.indexOf('1') >= 0
        || name.indexOf('where') >= 0) {
    res.render('error', {
      title: '交大 uRun',
      tip: '信息有误, 请重新查询'
    });
    return;
  }
  else {
    conn.query('SELECT * FROM profiles where name="' + name + '" or partnername ="' + name + '"', function (error, results, fields) {
        if (error) {
          res.render('error', {
            title: '交大 uRun',
            tip: '查询出错',
            error: error
          });
        } else if(!results || results.length === 0) {
          res.render('error', {
            title: '交大 uRun',
            tip: '没有找到您的报名信息，请返回重新查询',
            error: error
          });
        } else {
          // console.log(results);
          res.render('result', {
            title: '交大 uRun',
            results: results,
          });
        }
        conn.end();
        return;
    });
  }
};
exports.query = function(req, res) {
  res.render('query', {
    title: '交大 uRun',
  });
};