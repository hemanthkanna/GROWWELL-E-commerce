const catchAsyncError = require("../middlewares/catchAsyncError");
const { ErrorHandler } = require("../middlewares/errorHandler");
const Order = require("../modals/orderModal");
const Product = require("../modals/productModal");
exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

//GET SINGLE ORDER  --  /api/v1/order/:id
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(
      new ErrorHandler(`Order not found with this is ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    order,
  });
});

//GET LOGGED IN USER ORDERS -- /api/v1/myOrders
exports.getMyOrders = catchAsyncError(async (req, res, next) => {
  const order = await Order.find({
    user: req.user._id,
  });
  res.status(200).json({
    success: true,
    count: order.length,
    data: order,
  });
});

//ADMIN : GET ALL ORDERS  --  /api/v1/orders
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const orders = await Order.find().skip(skip).limit(limit);

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    count: orders.length,
    totalAmount,
    orders,
  });
});

//ADMIN : UPDATE ORDER or ORDER STATUS --  /api/v1/admin/order/:id
exports.updateOrderStatus = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order.orderStatus == "delivered") {
    return next(new ErrorHandler("Order has already been delivered", 400));
  }

  //Updating Product Stock of each Order Item
  order.orderItems.forEach(async (orderItem) => {
    await updateStock(orderItem.product, orderItem.quantity);
  });

  order.orderStatus = req.body.orderStatus;
  order.deliveredAt = Date.now();
  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

async function updateStock(productId, quantity) {
  const product = await Product.findById(productId);
  product.stock = product.stock - quantity;
  product.save({ validateBeforeSave: false });
}

//ADMIN : GET ORDERS BY STATUS  --  /api/v1/admin/orders/status?status=orderStatus

exports.getOrdersByStatus = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ orderStatus: req.query.status });
  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

//ADMIN : GET ORDERS BY USER  --  /api/v1/admin/orders/user/:userId

exports.getOrdersByUserId = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.params.userId });
  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

//ADMIN : GET ORDERS BY DATE RANGE  --  /api/v1/admin/orders/range/:startDate/:endDate

exports.getOrdersByDateRange = catchAsyncError(async (req, res, next) => {
  const startDate = new Date(req.params.startDate);
  const endDate = new Date(req.params.endDate);

  const orders = await Order.find({
    createdAt: { $gte: startDate, $lte: endDate },
  });
  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

//ADMIN : DELETE ORDER  --  /api/v1/admin/order/:id

exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});
