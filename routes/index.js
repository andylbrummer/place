
/*
 * GET home page.
 */

var fs = require('fs');
var ei = require('easyimage');

exports.index = function(req, res){
  res.render('index', { title: 'Austin' });
};

exports.image = function(req, res){
    var pathBase = 'public/' + req.params.tag + '/images/',
        cacheBase = 'public/cache/' + req.params.tag + '/';
    fs.readdir(pathBase, function(err, files)
    {
        var file_index = (req.query.index || ((req.params.width*41+req.params.height)*13)) % files.length;
        var filePath = pathBase + files[file_index];

        var cacheFile = (cacheBase + 'r' + req.params.width + 'x' + req.params.height + '-' + file_index + '.jpg');
        fs.stat(cacheFile, function(err, stat) {
            if (err) {
                ei.resize({src:filePath, dst:cacheFile, width:req.params.width, height:req.params.height+'!', fill:true }, function(err, image) {
                    if (!err) res.sendfile(cacheFile);
                });
            } else {
                res.sendfile(cacheFile);
            }
        });
    });
};

exports.thumb = function(req, res){
    var pathBase = 'public/' + req.params.tag + '/images/',
        cacheBase = 'public/cache/' + req.params.tag + '/';
    var filePath = pathBase + req.params.file;

    var cacheFile = (cacheBase + 'thumb-' + req.params.file);
    fs.stat(cacheFile, function(err, stat) {
        if (err) {
            ei.resize({src:filePath, dst:cacheFile, width:'200', height:'5000', fill:true }, function(err, image) {
                if (!err) res.sendfile(cacheFile);
            });
        } else {
            res.sendfile(cacheFile);
        }
    });
};

exports.info = function(req, res) {
    var pathBase = 'public/' + req.params.tag;
    fs.readFile(pathBase + '/info.txt', function(err, data) {
        var lines = data.toString().match(/^(.*?)([\n\r]+|$)/gm);
        res.render('info', { sources: lines.map(function(v) { var split = v.split('|'); return {file:split[0], path: '/'+req.params.tag+'/thumb/' + split[0], src:split[1]} })});
    });
};