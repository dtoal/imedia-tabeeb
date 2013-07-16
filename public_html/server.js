var express = require('express');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tabeeb');
RegExp.quote = function(str) {
    return (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
};
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback(){
	var app = express();
	function find (collec, query, all, callback) {
		console.log("Query: ");
		console.log(query);
		mongoose.connection.db.collection(collec, function (err, collection) {
			console.log(all)
			if(all)
				collection.find(query).toArray(callback);
			else
				collection.find(query, {'like': 0, '_id' : 0, 'source' : 0, 'parent' : 0}, {limit: 50}).toArray(callback);
		});
	}
	function all (collec, callback) {
		mongoose.connection.db.collection(collec, function (err, collection) {
			collection.find().toArray(callback);
		});
	}
	app.get('/tab_api/search/:db', function(req, res) {
		all(req.params.db,  function(err, sub) {
			console.log(err);
			res.send(sub);
		}) 
	});
	app.get('/tab_api/searchexact/:db/:query', function(req, res){
		console.log(req.params.query);
		req.params.query = req.params.query.replace(/"/g, '')
		var re = new RegExp('^' + req.params.query + '$', 'i');
		var name = 'name'
		if (req.params.db === 'substance')
			name = 'substance';
		var quer = {};
		quer[name] = {};
		quer[name]['$regex'] = re;
		find(req.params.db, quer, true, function(err, sub) {
			console.log(err);
			res.send(sub);
		}) 
	});
	app.get('/tab_api/search/:db/:query', function(req, res) {
		console.log( req.params.query);
		var re = new RegExp('^' + req.params.query, 'i');
		var name = 'name'
		if (req.params.db === 'substance')
			name = 'substance'
		var quer = {};
		quer[name] = {};
		quer[name]['$regex'] = re;
		find(req.params.db, quer, false,  function(err, sub) {
			console.log(err);
			console.log(sub.length)
			if(sub.length > 0)
				res.send(sub);
			else {
				var reX = new RegExp(req.params.query, 'i');
				console.log(reX)
				quer = {};
				quer[name] = {};
				quer[name]['$regex'] = reX;
				find(req.params.db, quer, false,  function(err, sub) {
					console.log(err);
					console.log(sub.length)
					res.send(sub);
				});
			}
		}); 
	});
	
	app.listen(5000);
	console.log('Listening on port 5000...');
});
