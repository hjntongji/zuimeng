var mongoose = require('mongoose');
var Category = mongoose.model('Category');

// mass模块  index page
exports.mass = function(req, res) {
  Category
    .find({})
    .sort('_id -1')
    .populate({
      path: 'activitys',
      select: 'title poster',
      options: { limit: 6 }
    })
    .exec(function(err, categories) {
      if (err) {
        console.log(err);
      }
      res.render('mass/index', {
        title: '最盟 社团',
        pageid: 'mass',
        pageIndex: 1,
        categories: categories
      });
    });
};

exports.detail = function(req, res) {
  res.render('mass/detail', {
        title: '最盟 社团详情页',
        pageid: 'massDetail'
    });
};