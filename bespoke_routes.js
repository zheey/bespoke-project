var express = require('express');
var multer = require('multer');
var multerupload = multer({dest:'images/'});
module.exports = function (app) {
  var products = require('./controllers/products_controller');
  var customers = require('./controllers/customers_controller');
  var admin = require('./controllers/admin_controller');
  var orders = require('./controllers/orders_controller');
  app.use('/static', express.static( './static')).
      use('/images', express.static('../images')).
      use('/lib', express.static('../lib')
  );
  app.get('/', function (req, res) {
    res.render('shop');
  });
  app.get('/admin', function (req, res) {
    if(req.session.adminid) {
      res.render('admin');
    } else {
      res.redirect('/adminlogin')
    }
  });
  app.get('/admin/orders', function (req, res) {
    if(req.session.adminid) {
      res.render('adminorders');
    } else {
      res.redirect('/adminlogin')
    }
  });
  app.get('/admin/customorders', function (req, res) {
    if(req.session.adminid) {
      res.render('customorders');
    } else {
      res.redirect('/adminlogin')
    }
  });
  app.get('/admin/newadmin', function (req, res) {
      if (req.session.adminid){
          res.redirect('/admin');
      }
      res.render('newadmin', {msg:req.session.msg});
  });
  app.get('/admin/logout', function (req, res) {
      req.session.destroy(function () {
          res.redirect('/admin');
      });
  });
  app.get('/customer', function (req, res) {
      if(req.session.userid) {
          res.render('shop', {msg:req.session.msg});
      } else {
          res.redirect('/');
      }
  });
  app.get('/customer/signup', function (req, res) {
      if (req.session.userid){
          res.redirect('/');
      }
      res.render('signup', {msg:req.session.msg});
  });
  app.get('/customer/login', function (req, res) {
      if(req.session.userid){
          res.redirect('/');
      }
      res.render('login', {msg:req.session.msg});
  });
  app.get('/customers/profile', function (req, res) {
      if(req.session.userid){
          res.redirect('/profile');
      }
      res.render('login', {msg:req.session.msg});
  });
  app.get('/customer/logout', function (req, res) {
      req.session.destroy(function () {
          res.redirect('/');
      });
  });
  app.get('/products/get', products.getProducts);
  app.get('/product/get', products.getProduct);
  app.get('/products/category', products.categoryProducts);
  app.get('/orders/get/cartorder', orders.getCartOrders);
  app.get('/orders/get/customorder', orders.getCustomOrders);
  app.get('/order/get', orders.getOrder);
  app.post('/orders/add/cartorder', orders.addCartOrder);
  app.post('/orders/add/customorder', multerupload.any(), orders.addCustomOrder);
  app.post('/customers/signup', customers.signup);
  app.post('/customers/login', customers.login);
  app.get('/customers/profile', customers.getCustomer);
  app.post('/customers/update', customers.updateCustomer);
  app.post('/customers/delete', customers.deleteCustomer);
  app.post('/customers/update/shipping', customers.updateShipping);
  app.post('/customers/update/billing', customers.updateBilling);
  app.post('/customers/update/cart', customers.updateCart);
  app.get('/admin/products/get', admin.getProducts);
  app.post('/admin/products/add', multerupload.any(), admin.addProduct);
  app.post('/admin/products/delete', admin.deleteProduct);
  app.get('/admin/customer', admin.getCustomers);
  app.get('/admin/orders/cartorder', admin.getCartOrders);
  app.get('/admin/orders/customorder', admin.getCustomOrders);
  app.get('/admin/update/cartorder', admin.updateCartOrder);
  app.get('/admin/update/customorder', admin.updateCustomOrder);
  app.get('/admin/category', admin.categoryProducts);
  app.post('/admin/login', admin.login);
  app.post('/admin/newadmin', admin.addAdmin);
};
