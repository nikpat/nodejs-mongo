
/*
 * GET home page.
 */
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var client = new Db('test', new Server('127.0.0.1', 27017, {}));

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.dashboard = function(req,res){
	//res.send('hello');
	var uname = req.query.uname;
	client.open(function(err, pClient) {
			client.collection('test',function(err,c){
				c.insert({name: uname})
			});
			client.close();
	});

	res.render('dash',{title:'Dashboard',name:uname+' len='+uname.length});
};