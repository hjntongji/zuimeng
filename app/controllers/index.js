var mongoose = require('mongoose');
var Activity = mongoose.model('Activity');
var Category = mongoose.model('Category');

// index page
exports.index = function(req, res) {
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
      res.render('index', {
        title: '最盟 首页',
        categories: categories
      });
    });
};

// search page
exports.search = function(req, res) {
  var catId = req.query.cat;
  var q = req.query.q;
  var page = parseInt(req.query.p, 10) || 0;
  var count = 6;
  var index = page * count;

  if (catId) {
    Category
      .find({_id: catId})
      .populate({
        path: 'activitys',
        select: 'title poster'
      })
      .exec(function(err, categories) {
        if (err) {
          console.log(err);
        }
        var category = categories[0] || {};
        var activitys = category.activitys || [];
        var results = activitys.slice(index, index + count);

        res.render('results', {
          title: '最盟 结果列表页面',
          keyword: category.name,
          currentPage: (page + 1),
          query: 'cat=' + catId,
          totalPage: Math.ceil(activitys.length / count),
          activitys: results
        });
      });
  }
  else {
    Activity
      .find({title: new RegExp(q + '.*', 'i')})
      .exec(function(err, activitys) {
        if (err) {
          console.log(err);
        }
        var results = activitys.slice(index, index + count);

        res.render('results', {
          title: 'imooc 结果列表页面',
          keyword: q,
          currentPage: (page + 1),
          query: 'q=' + q,
          totalPage: Math.ceil(activitys.length / count),
          movies: results
        });
      });
  }
};