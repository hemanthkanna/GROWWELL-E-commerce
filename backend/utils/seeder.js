const products = require("../data/products.json");
const Product = require("../modals/productModal");
const dotenv = require("dotenv");
const connectDatabase = require("../config/database");

dotenv.config({ path: "config/config.env" });
connectDatabase();

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log("Product Deleted!");
    await Product.insertMany(products);
    console.log("All products added");
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

seedProducts();
