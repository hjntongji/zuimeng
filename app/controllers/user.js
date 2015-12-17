var mongoose = require('mongoose');

// 个人中心  index page
exports.index = function(req, res) {
  res.render('self/index', {
    title: '最盟 个人中心'
  });
};

// 参与模块  index page
exports.participate = function(req, res) {
  res.render('participate/index', {
    title: '最盟 参与'
  });
};