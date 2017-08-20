var fs = require('fs');
var path = require('path');
var async = require('async');
var mongoose = require('mongoose'),
CartOrder = mongoose.model('Order'),
CustomOrder = mongoose.model('CustomOrder'),
Address = mongoose.model('Address'),
ShippingAddress = mongoose.model('ShippingAddress'),
Billing = mongoose.model('Billing'),
Customer = mongoose.model('Customer');

exports.getCartOrders = function (req, res) {
  CartOrder.find({userid:req.session.userid})
  .exec(function (err, cartorders) {
    if(!cartorders){
      res.json(404, {msg:'No cart orders found.'});
    } else {
      res.json(cartorders);
    }
  });
};
exports.getCartOrder = function (req, res) {
  CartOrder.findOne({_id:req.query.cartOrderId})
  .exec(function (err, cartorder) {
    if(!cartorder){
      res.json(404, {msg:'Order was not found.'});
    } else {
      res.json(cartorder);
    }
  });
};
exports.getCustomOrders = function (req, res) {
  CustomOrder.find({userid:req.session.userid})
  .exec(function (err, customorders) {
    if(!customorders){
      res.json(404,{msg:'No custom orders found.'});
    } else {
      res.json(customorders);
    }
  });
};
exports.getCustomOrder = function (req, res) {
  CartOrder.findOne({_id:req.query.customOrderId})
  .exec(function (err, cartorder) {
    if(!cartorder){
      res.json(404, {msg:'Order was not found.'});
    } else {
      res.json(cartorder);
    }
  });
};
exports.addCartOrder = function (req, res) {
  var cartOrderShipping = new ShippingAddress(req.body.updatedCartShipping);
  var cartOrderBilling = new Billing(req.body.updatedCartBilling);
  var cartOrderItems = req.body.cartOrderItems;
  var user = req.session.userid;
  var deliveryDate = req.body.deliverydate;
  var deliveryTime = req.body.deliverytime;
  var cartOrder = new CartOrder({userid: user, cartshipping:cartOrderShipping,
    cartbilling: cartOrderShipping,cartitems: cartOrderItems,
    deliverytime: deliveryTime, deliverydate: deliveryDate
  });
    cartOrder.save(function (err, results) {
      if(err){
          res.json(500, "Failed to save Order.");
      } else {
          Customer.update({userid: user},
              {$set:{cart:[]}})
              .exec(function (err, results) {
                  if (err || results < 1){
                      res.json(404, {msg: "Failed to update Cart"});
                  } else {
                      res.json({msg: 'Order Saved.'});
                  }
              });
      }
    });

};
exports.addCustomOrder = function (req, res) {
  var customShipping = new ShippingAddress(req.body.updatedCustomShipping);
  var customBilling = new Billing(req.body.updatedCustomBilling);
  var CustomOrderItems = req.body.customOrderItems;
  var user = req.session.userid;
    var productName = req.body.cakeType;
  var Size = req.body.cakeSize;
  var productImage = req.files.productImage;
  var Description = req.body.description;
  var deliveryDate = req.body.deliverydate;
  var deliveryTime = req.body.deliverytime;
  var customOrder = new CustomOrder({userid: user, customshipping:customShipping,
    custombilling: customShipping,items: CustomOrderItems,productname:productName,
    size:Size,productimage:productImage,description:Description,
    deliverytime: deliveryTime, deliverydate: deliveryDate
  });
    customOrder.save(function (err, results) {
      if(err){
          res.json(500, "Failed to save Order.");
      } else {
        // upload custom image to file
        console.log("req", req.files);
        var filesArray = req.files;
        async.each(filesArray, function(file, eachcallback){

        }, function (err) {
          if(err){
            console.log("error occured in each," err);
          } else {
            res.json(200, "Picture successfully uploaded");
          }
        });
          Customer.update({userid: user},
              {$set:{cart:[]}})
              .exec(function (err, results) {
                  if (err || results < 1){
                      res.json(404, {msg: "Failed to update Cart"});
                  } else {
                      res.json({msg: 'Order Saved.'});
                  }
              });
      }
    });

};
