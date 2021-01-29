//import
const express = require('express')
const app = express()
const port = 8000
const path = require('path');
const MongoClient = require("mongodb");
const url = "mongodb://localhost:27017/travelexperts";
var ObjectId = require('mongodb').ObjectID;

//listening to port
app.listen(port);
  console.log("Listening on port 8000")

//register middleware
app.use(express.static(path.join(__dirname, './views')));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

//set view engine
app.set("view engine", "ejs");


//configure routes
app.get('/', function (req, res) {
  res.render("home.ejs", { title: "Main Page" });
});

app.get('/register', function (req, res) {
    res.render("register.ejs", {title:"Register"});
});

app.get('/contacts', function (req, res) {
  res.render("contacts.ejs", {title:"Contact page"});
});

//route for creating new customer after registration
app.post('/create-new-customer',function (req, res) {
  //connect to customer database
  MongoClient.connect(url, {
  	useNewUrlParser: true,
  	useUnifiedTopology: true
  }, function(err, db) {
  	if (err) {
      throw err;
    }
    // Create a new collection called newCustomerRegisteration //
    // Any additional customer contact inquires will also be in this collection//

    let customerDatabase = db.db('travelexperts')
    customerDatabase.collection("newCustomerRegisteration").insertOne({
      fname: req.body.fname,
      lname: req.body.lname,
      bday: req.body.bday,
      address: req.body.address,
      city: req.body.city,
      pnumber: req.body.pnumber,
      pcode: req.body.pcode,
      prov: req.body.prov,
      email: req.body.email

    }, function(err, insertRes) {
      if (err) {
        throw err;
      }
      db.close();

      res.render('thankyou.ejs', {
        cust: {
          fname: req.body.fname,
          email: req.body.email,
        }
      })
    });
  })
});



//route for creating new customer after submitting contact inquiries
app.post("/sendContactForm", function (req,res) {
  MongoClient.connect(url, {
  	useNewUrlParser: true,
  	useUnifiedTopology: true
  }, function(err, db) {
  	if (err) {throw err;}
    // Create a new collection called customerContactInfo //
    // Any additional customer contact inquires will also be in this collection//
    let customerDatabase = db.db('travelexperts')
    customerDatabase.collection("customerContactInfo").insertOne({
        custFirstName: req.body.custFirstName,
        custLastName: req.body.custLastName,
        custPhone: req.body.custPhone,
        custEmail: req.body.custEmail,
        custComment: req.body.custComment
      }, function(err, insertCustomerContact) {
        if (err) {throw error;}
        db.close();
        res.render("thankyoucontact.ejs", {
          custContact: {
            custFirstName: req.body.custFirstName,
            custLastName: req.body.custLastName,
            custPhone: req.body.custPhone,
            custEmail: req.body.custEmail,
            custComment: req.body.custComment
          }
        });
    });
  });
});

//error page
app.use(function(req, res){
  res.status(404).render("404page.ejs", {title:"404 error"});
});

//find one customer from the database
MongoClient.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function(err, db) {
  if (err) {throw err;}
  let customerDatabase = db.db('travelexperts')
  customerDatabase.collection('customers').findOne({}, function(err, result) {
    if (err) {throw err;}
    console.log(result)
    db.close()
  })
});
