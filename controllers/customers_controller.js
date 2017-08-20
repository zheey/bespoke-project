var cryto = require('crypto');
var mongoose = require('mongoose'),
Customers = mongoose.model('Customer'),
Address = mongoose.model('Address'),
Billing = mongoose.model('Billing'),
ShippingAddress = mongoose.model('ShippingAddress');
function hashPW(pwd) {
    return crypto.createHash('sha256').update(pwd).
        digest('base64').toString();
}
exports.signup = function (req, res) {
  var userid = Customers.count().exec(function (err, count) {
    var cusid = count+1;
    return('BesCus'+cusid);
  });
  var customer = new Customers({userid:userid, firstname:req.body.cusname,
     lastname:req.body.cuslastname, email: req.body.cusemail,
     phonenumber:req.body.cusnumber, password: hashPW(req.body.cuspassword)
  });
  customer.save(function (err) {
    if(err){
      res.redirect('/signup', function () {
          res.send(err);
      });
    }else {
      req.session.userid = customer.userid;
      req.session.firstname = customer.firstname;
      req.session.lastname = customer.lastname;
      req.session.email = customer.email;
      req.session.phonenumber = customer.phonenumber;
      req.session.msg = 'Welcome to bespoke cakes, ' + customer.firstname;
      res.redirect('/');
    }
  });
};
exports.login = function (req, res) {
  Customers.findOne({email:req.body.loginemail}).exec(function (err, customer) {
    if(!customer){
      err = 'Customer does not exist';
    }else if (customer.password === hashPW(req.body.loginpassword.toString())){
          req.session.regenerate(function () {
            req.session.userid = customer.userid;
            req.session.firstname = customer.firstname;
            req.session.lastname = customer.lastname;
            req.session.email = customer.email;
            req.session.phonenumber = customer.phonenumber;
            req.session.msg = 'Welcome to bespoke cakes, ' + customer.firstname;
            res.redirect('/');
          });
    }else {
      err = 'Email or Password incorrect. ';
    }

  });
};
exports.getCustomer = function (req, res) {
  Customers.findOne({userid:req.session.userid}).exec(function (err, customer) {
    if(!customer){
      res.json(404, {err:'Error fetching out user\'s records. '});
    }else{
      res.json(customer);
    }
  });
};
exports.updateCustomer = function (req, res) {
  Customers.findOne({userid: req.session.userid}).exec(function (err, customer) {
    customer.set('firstname', req.body.firstname);
    customer.set('lastname', req.body.lastname);
    customer.set('email', req.body.email);
    customer.set('phonenumber', req.body.phonenumber);
    customer.save(function (err) {
      if(err){
        res.session.error(err);
      }else {
        req.session.msg = 'User Updated.';
        req.session.regenerate(function () {
          req.session.firstname = customer.firstname;
          req.session.lastname = customer.lastname;
          req.session.email = customer.email;
          req.session.phonenumber = customer.phonenumber;
          req.session.msg = 'Your data has been updated ' + customer.firstname;
          res.redirect('/profile');
        });
      }
    });
  });
};
exports.deleteCustomer = function (req, res) {
  Customers.findOne({userid:req.session.userid}).exec(function (err, customer) {
    if(customer){
      customer.remove(function (err) {
          if (err) {
              req.session.msg = err;
          }
          req.session.destroy(function () {
              res.redirect('/');
          });
    }else {
        req.session.msg = "Customer Not Found!";
        req.session.destroy(function () {
            res.redirect('/');
        });
    }
  });
};
exports.updateShipping = function (req, res) {
  var newShipping = new ShippingAddress(req.body.updatedShipping);
  Customers.update({ userid: req.session.userid},
      {$set: {shipping:[newShipping.toObject()]}})
      .exec(function (err, results) {
          if(err || results < 1){
              res.json(404, {msg: "Failed to update Shipping."});
          }else {
              res.json({msg: "Customer shipping Updated."});
          }
      });
};
exports.updateBilling = function (req, res) {
    // this is where to verify the customer's billing details ad halt ceck out if invalid
    var newBilling = new Billing(req.body.updatedBilling);
    Customers.update({ userid: req.session.userid},
        {$set:{billing:[newBilling.toObject()]}})
        .exec(function (err, results) {
            if(err || results < 1){
                res.json(404, {msg: "Failed to update Billing."});
            }else {
                res.json({msg: "Customer Billing Updated."});
            }
        });
};
exports.updateCart = function (req, res) {
    Customers.update({ userid: req.session.userid },
        {$set:{cart: req.body.updatedCart}})
        .exec(function (err, results) {
            if(err || results < 1){
                res.json(404, {msg: "Failed to update Cart."});
            }else {
                res.json({msg: "Customer Cart Updated."});
            }
        });
};
