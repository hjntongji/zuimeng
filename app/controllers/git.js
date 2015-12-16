var process = require('child_process');
exports.pull = function(req, res) {
    process.exec('cd /root/zuimeng/zuimeng&& git pull',
      function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error);
          res.send('exec error: ' + error);
        }
      }
    );
};