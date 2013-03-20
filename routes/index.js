
/*
 * GET home page.
 */

//import db
var mongoose = require('mongoose');
mongoose.connect('localhost', 'test');

var usrStruc = mongoose.Schema({
    	username: String,
    	password:String
	});


var userObj = mongoose.model('user', usrStruc);

exports.index = function(req, res){
	var logerr;
	//console.log(req.session.user);
	if(req.session.user != undefined){
		if(req.session.user.username != 'admin'){
			admindash(req,res);//res.redirect('/admindash');
		}
		else{
			res.redirect('/dash');	
		}
	}
	else{
	//express 3.1 does not have flash therefore do folloing step
		if(req.session.logerr != undefined){
			logerr = req.session.logerr;
			delete req.session.logerr ;
		}
  		res.render('index', { title: 'Express ToDo',errLog : logerr });
	}
};

exports.dashboard = function(req,res){
	var userArr = [];
	if(req.session.user == undefined){
		var uname = req.body.uname;
		var upass = req.body.upass;
	}
	else{
		var uname = req.session.user.username;
		var upass = req.session.user.password;
	}
	//check if the user exists in mongodb
	
	var query = userObj.findOne({ username: uname,password:upass });
	query.exec(function(err,user){
		if (err) return handleError(err);
		if(user){
			req.session.user = user;
			//res.render('dash',{title:'Dashboard',name:uname});
			if(req.session.user.username == 'admin'){
					admindash(req,res);//res.redirect('/admindash');
				}
				else{
					res.render('dash',{title:'Dashboard',name:uname});
					//res.redirect('/dash');	
				}
		}
		else{
			 //Set session
			 req.session.logerr = "User Not Found !"
   			 res.redirect('/');
		}
	});

};


admindash = function(req,res){
		usersdata = userObj.find(function(err,users){
			var userArr = new Array();
			for(i=0;i<users.length;i++){
				userArr.push(users[i]);
			}
			res.render('admindash',{title:'Dashboard',name:req.session.user.username,users:userArr});
		});
}

exports.adduser = function(req, res){
	var uname = req.body.uname;
	var upass = req.body.upass;
	var query = userObj.findOne({ username: uname,password:upass });
	query.exec(function(err,user){
		if (err) return handleError(err);
		if(user){
			res.send('exist');
		}
		else{
				var user = new userObj({ username: uname,password:upass });
				//save user to database
				user.save(function (err) {
			  		res.send('done');
				});
			}
		});
  	
};

exports.logout = function(req,res){
	delete req.session.user;
	res.redirect('/');
}