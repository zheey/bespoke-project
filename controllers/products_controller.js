var mongoose = require('mongoose'),
Products = mongoose.model('Product'),
Category = mongoose.model('Category');

exports.getProducts = function (req, res) {
  Products.find().exec(function (err, products) {
    if(!products){
      res.json(404, {msg: 'Sorry, no product was found.'});
    } else {
      res.json(products);
    }
  });
};
exports.getProduct = function (req, res) {
  Products.findOne({_id:req.query.productId})
  .exec(function (err, product) {
    if(!product){
      res.json(404, {msg:'Sorry, product not found.'});
    } else {
      res.json(product);
    }
  });
};
exports.categoryProducts = function (req, res) {
  Category.find({_id:req.query.categoryId})
  .exec(function (err, categoryProducts) {
    if(!categoryProducts){
      res.json(404, {msg:'Category products not found.'});
    } else {
      res.json(categoryProducts);
    }
  });
};
