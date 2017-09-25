var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' });
});

/* GET New User page. */
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
    	docs = docs.reverse();
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

/* GET User delete page. */
router.get('/delete/:id', function(req, res) {
    var db = req.db;
    var uid = req.params.id;
    var collection = db.get('usercollection');
    collection.remove({"_id":uid},{},function(e,docs){
        res.redirect("/userlist");
    });
});


/* login page. */
router.get('/login', function(req, res) {
    res.render('login', { title: 'Login page' });
});


/*-------maintaining session-----------*/

router.post('/loginuser', function(req, res) {
  var db = req.db;
  // Get our form values. These rely on the "name" attributes
  var userName = req.body.username;
  var userEmail = req.body.useremail;
  var collection = db.get('usercollection');
  collection.findOne({ username: userName }, function(err, user) {
    console.log(user);
    if (!user) {
        console.log("in")
      res.render('login', { error: 'Invalid email or password.' });
    } else {
        console.log("in else!!")
      if (userEmail === user.email) {
        console.log("in email");
        // sets a cookie with the user's info
        console.log(user);
        //req.session.user = user;
        res.redirect('/dashboard');
      } else {
        console.log("in else else");
        res.render('login.jade', { error: 'Invalid email or password.' });
      }
    }
  });
});


/* dashboard page. */
router.get('/dashboard', function(req, res) {
    res.render('dashboard', { title: 'Dashboard page' });
});




/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("userlist");
        }
    });
});

module.exports = router;
