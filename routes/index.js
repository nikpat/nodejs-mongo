
/*
 * GET home page.
 */
var mongoose = require('mongoose');
mongoose.connect('localhost', 'test');

var usrStruc = mongoose.Schema({
    	username: String,
    	password:String
	});

var userObj = mongoose.model('user', usrStruc);

exports.index = function(req, res){
	var logerr;
	if(req.session.user != undefined){
		if(req.session.user.username != 'admin'){
			res.redirect('/dash');
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
			res.render('dash',{title:'Dashboard',name:uname});
		}
		else{
			 //Set session
			 req.session.logerr = "User Not Found !"
   			 res.redirect('/');
		}
	});
	/*
	var user = new userObj({ username: uname,password:'test' });
	//save user to database

	user.save(function (err) {
  		console.log('saved');
	});
	///finduser user to database
	usersdata = userObj.find(function(err,users){
			for(i=0;i<users.length;i++){
				userArr.push(users[i]);
			}
			res.render('dash',{title:'Dashboard',name:uname,users:userArr});
		}); */
};

exports.logout = function(req,res){
	delete res.session;
	res.redirect('/');
}