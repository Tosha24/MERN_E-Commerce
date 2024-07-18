import asyncHandler from "../middlewares/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

function calcPrices(orderItems) {

  console.log("orderItems", orderItems);
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = Number((itemsPrice * taxRate).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  return {
    itemsPrice: Number(itemsPrice.toFixed(2)),
    shippingPrice: Number(shippingPrice.toFixed(2)),
    taxPrice,
    totalPrice,
  };
}

const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  console.log("orderItems", orderItems);

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  // Optimize by querying for all products in a single database query
  console.log("orderItems", orderItems);
  const productIds = orderItems.map((item) => item?.product?._id);
  console.log("productIds", productIds);
  const products = await Product.find({ _id: { $in: productIds } });
  console.log("products", products);

  if (products.length !== orderItems.length) {
    res.status(400);
    throw new Error("Some products not found");
  }

  const updatedOrderItems = orderItems.map((item) => {
    const product = products.find((p) => p._id.toString() === item.product?._id.toString());

    console.log("product", product);
    if (!product) {
      throw new Error(`Product not found: ${item.product?._id}`);
    }
    return {
      ...item,
      name: product.name,
      image: product.image,
      price: product.price,
      product: product._id,
      category: product.category,
      qty: item.quantity,

    };
  });

  console.log("updatedOrderItems", updatedOrderItems);

  const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
    calcPrices(updatedOrderItems);

  const order = new Order({
    orderItems: updatedOrderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id username");
  res.json(orders);
});

const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

const getTotalOrdersCount = asyncHandler(async (req, res) => {
  const totalOrdersCount = await Order.countDocuments();
  res.json(totalOrdersCount);
});

const getTotalSalesAmount = asyncHandler(async (req, res) => {
  const totalSalesAmount = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);
  res.json(totalSalesAmount.pop().totalSales);
});

const calcualteTotalSalesByDate = async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json(salesByDate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getOrderById = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "id username email");
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    res.json(order);
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
);


const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updateOrder = await order.save();
      res.status(200).json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  getTotalOrdersCount,
  getTotalSalesAmount,
  calcualteTotalSalesByDate,
  getOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,

};
