// server.js

// BASE SETUP
// =============================================================================

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bears'); // connect to our database
var Bear     = require('./bears');

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');


var fs = require('fs');
var rawdata = fs.readFileSync('./database.json');
var data = JSON.parse(rawdata);

var obj = {table:[]}

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here
router.route('/bears')
	.post(function(req, res) {
		
		var bear = new Bear();		// create a new instance of the Bear model
		bear.name = req.body.name;  // set the bears name (comes from the request)

		bear.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Bear created!' });
		});

		
	})
	.get(function(req, res) {
		Bear.find(function(err, bears) {
			if (err)
				res.send(err);

			res.json(bears);
		});
	});

// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/bears/:bear_id')
    .get(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err)
                res.send(err);
            res.json(bear);
        });
    
    })
	.put(function(req, res) {
		Bear.findById(req.params.bear_id, function(err, bear) {

			if (err)
				res.send(err);

			bear.name = req.body.name;
			bear.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Bear updated!' });
			});

		});
	})
	.delete(function(req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });


router.route('/alldata')
	.get(function(req, res){
		var datasnd = JSON.stringify(data, null , 2);
		res.send(datasnd);
	})
router.route('/books/:bookid')
	.get(function(req, res) {
		//const bookwewant = data.books.find(c=>c.bookid === parseInt(req.params.bookid));
		//if (!bookwewant){ res.status(404).send("The book with the given ID was not found1");}
	    var temp = req.params.bookid;
	    var datasnd = JSON.stringify(data.books[temp], null , 2)
	    res.send(datasnd);// for some reason this doesnt work--> data.books[index]
	})
// Adds a new book in the array	
router.route('/books/:bookname/:price/:stock')
	.post(function(req,res) {
		fs.readFile('database.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    obj = JSON.parse(data); //now it an object
    obj.table.push({id: 2, square:3}); //add some data
    var json = JSON.stringify(obj); //convert it back to json
    fs.writeFile('database.json', json, 'utf8'); // write it back 
	}});
		
	})

router.route('./books/:deleteid')
	.get(function(req, res) {
	    var temp =req.params.deleteid;
	    fs.readFile('database.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } 
    else {
    obj = JSON.parse(data);
    	obj.table.splice(temp, 1);
    	var json = JSON.stringify(obj); //convert it back to json
    	fs.writeFile('database.json', json, 'utf8');
    }
	}})
	
router.route('./books/:newtax/:bookid')// this is the update tax method
	.put(function(req,res){
		
		
		
	})


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);