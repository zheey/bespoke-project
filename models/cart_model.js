/**
 * Created by Zainab on 30.7.17.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var AddressSchema = new Schema({
  address: String,
  city: String,
  state: String
}, { _id: false});
mongoose.model('Address', AddressSchema);

var ShippingAddressSchema = new Schema({
  firstname: String,
  lastname: String,
  address: String,
  city: String,
  state: String
}, { _id: false});
mongoose.model('ShippingAddress', ShippingAddressSchema);

var BillingSchema = new Schema({
  cardType: { type: String, enum: ['Visa', 'MasterCard', 'Amex'] },
  firstname: String,
  lastname: String,
  number: String,
  expiremonth: Number,
  expireyear: Number,
  address: [AddressSchema]
}, { _id: false});
mongoose.model('Billing', BillingSchema);

var ProductSchema = new Schema({
  name: String,
  imagefile: String,
  description: String,
  price: Number,
  category: String
});
mongoose.model('Product', ProductSchema);

var ProductQuantitySchema = new Schema({
  quantity: Number,
  product: [ProductSchema]
}, { _id: false });
mongoose.model('ProductQuantity', ProductQuantitySchema);

var CategorySchema = new Schema({
  name: String,
  product: [ProductSchema]
});
mongoose.model('Category', CategorySchema);

var OrderSchema = new Schema({
  userid: String,
  cartitems: [ProductQuantitySchema],
  cartshipping: [ShippingAddressSchema],
  cartbilling: [BillingSchema],
  status: {type: String, default: "Pending"},
  deliverydate: Date,
  deliverytime: Date,
  responsetype: {type:String, default: "Call"},
  timestamp: {type: Date, default: Date.now },
  ordertype: {type:String, default: "Cart Order"},
  reply: {type: String, default:"Thank you for the order. You will receive a response shortly."}
});
mongoose.model('Order', OrderSchema);

var CustomOrderSchema = new Schema({
  userid: String,
  productname: String,
  size: String,
  productimage: String,
  description: String,
  items: [ProductQuantitySchema],
  customshipping: [ShippingAddressSchema],
  custombilling: [BillingSchema],
  status: {type: String, default: "Pending"},
  deliverydate: Date,
  deliverytime: Date,
  responsetype: {type:String, default: "Call"},
  timestamp: {type: Date, default: Date.now },
  ordertype: {type:String, default: "Cart Order"},
  reply: {type: String, default:"Thank you for the order. You will receive a response shortly."}
});
mongoose.model('CustomOrder', CustomOrderSchema);

var CustomerSchema = new Schema({
  userid: {type: String, unique: true, required: true },
  firstname: String,
  lastname: String,
  email: String,
  phonenumber: Number,
  password: String,
  address: [AddressSchema],
  shipping: [ShippingAddressSchema],
  billing: [BillingSchema],
  cart: [ProductQuantitySchema],
  cartorders: [OrderSchema],
  customorders: [CustomOrderSchema]
});
mongoose.model('Customer', CustomerSchema);

var AdminSchema = new Schema({
  username: {type: String, unique: true},
  email: String,
  password: String
});
mongoose.model('Admin', AdminSchema);
