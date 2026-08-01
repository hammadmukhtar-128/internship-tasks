import "dotenv/config";
import { connectDB } from "../config/db.js";
import mongoose from "mongoose";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";

const categories = [
  { name: "Electronics & Audio", slug: "electronics", image: "/images/categories/cat_sq1.jpg", tagline: "Sound, screens & smart gear" },
  { name: "Fashion & Apparel", slug: "fashion", image: "/images/categories/cat_sq2.jpg", tagline: "Everyday staples, well made" },
  { name: "Bags & Accessories", slug: "bags-accessories", image: "/images/categories/cat_sq3.jpg", tagline: "Carry it with you" },
  { name: "Home & Living", slug: "home-living", image: "/images/categories/cat_sq4.jpg", tagline: "For the space you live in" },
  { name: "Beauty & Wellness", slug: "beauty-wellness", image: "/images/categories/cat_wide1.jpg", tagline: "Small rituals, done right" },
];

const vendors = [
  { name: "Northwind Audio Team", email: "vendor.northwind@hammad.test", shopName: "Northwind Audio" },
  { name: "Studio Loom Team", email: "vendor.studioloom@hammad.test", shopName: "Studio Loom" },
  { name: "Craftline Leather Team", email: "vendor.craftline@hammad.test", shopName: "Craftline Leather" },
  { name: "Hearth & Home Co. Team", email: "vendor.hearth@hammad.test", shopName: "Hearth & Home Co." },
  { name: "Botanica Naturals Team", email: "vendor.botanica@hammad.test", shopName: "Botanica Naturals" },
];

// [name, price, compareAtPrice, image, categorySlug, vendorIndex, badge, stock]
const productSeed = [
  ["Aria Wireless Over-Ear Headphones", 12999, 15999, "/images/products/product1.jpg", "electronics", 0, "Bestseller", 34],
  ["Pulse True Wireless Earbuds", 6499, null, "/images/products/product2.jpg", "electronics", 0, null, 61],
  ["Nova Smart Fitness Watch", 9999, null, "/images/products/product3.jpg", "electronics", 0, "New", 19],
  ["Halo Bluetooth Speaker", 5299, null, "/images/products/product4.jpg", "electronics", 0, null, 48],
  ["Orbit Wireless Charging Pad", 2799, null, "/images/products/product5.jpg", "electronics", 0, null, 72],
  ["Flux Portable Power Bank 20000mAh", 3499, null, "/images/products/product6.jpg", "electronics", 0, "Trending", 55],
  ["Meridian Oversized Denim Jacket", 7499, null, "/images/products/product7.jpg", "fashion", 1, null, 26],
  ["Linen Blend Relaxed Shirt", 3999, null, "/images/products/product8.jpg", "fashion", 1, null, 40],
  ["Everyday Ribbed Knit Sweater", 4599, 5999, "/images/products/product9.jpg", "fashion", 1, "Sale", 33],
  ["Classic Tailored Trousers", 4299, null, "/images/products/product10.jpg", "fashion", 1, null, 29],
  ["Heritage Cotton Overshirt", 5199, null, "/images/products/product11.jpg", "fashion", 1, null, 22],
  ["Studio Wide-Leg Trousers", 4799, null, "/images/products/product12.jpg", "fashion", 1, null, 18],
  ["Essential Crewneck Tee (3-Pack)", 2999, null, "/images/products/product13.jpg", "fashion", 1, "Bestseller", 66],
  ["Atlas Leather Weekender Bag", 14999, null, "/images/products/product14.jpg", "bags-accessories", 2, null, 12],
  ["Milo Canvas Tote Bag", 2499, null, "/images/products/product15.jpg", "bags-accessories", 2, null, 74],
  ["Vega Minimalist Card Wallet", 1899, null, "/images/products/product16.jpg", "bags-accessories", 2, null, 90],
  ["Compass Crossbody Sling Bag", 3299, null, "/images/products/product17.jpg", "bags-accessories", 2, "New", 38],
  ["Aviator Polarized Sunglasses", 2199, null, "/images/products/product18.jpg", "bags-accessories", 2, null, 47],
  ["Sterling Chronograph Watch", 11499, null, "/images/products/product19.jpg", "bags-accessories", 2, "Trending", 15],
  ["Hearth Ceramic Pour-Over Set", 3799, null, "/images/products/product20.jpg", "home-living", 3, null, 21],
  ["Linen Textured Throw Pillow Cover", 1499, null, "/images/products/product21.jpg", "home-living", 3, null, 58],
  ["Amber Glass Table Lamp", 5999, null, "/images/products/product22.jpg", "home-living", 3, null, 14],
  ["Terra Stoneware Dinner Set (16pc)", 8499, null, "/images/products/product23.jpg", "home-living", 3, "Bestseller", 17],
  ["Nordic Wool Area Rug", 12999, null, "/images/products/product24.jpg", "home-living", 3, null, 9],
  ["Botanica Face Serum Duo", 2899, null, "/images/products/product25.jpg", "beauty-wellness", 4, null, 43],
  ["Cedarwood Candle Trio", 1999, 2499, "/images/products/product26.jpg", "beauty-wellness", 4, "Sale", 51],
  ["Renew Body Care Gift Set", 3499, null, "/images/products/product27.jpg", "beauty-wellness", 4, "New", 30],
  ["Silk-Wrapped Hair Accessory Set", 1299, null, "/images/products/product28.jpg", "beauty-wellness", 4, null, 64],
];

async function run() {
  await connectDB();
  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany({ email: { $regex: "@hammad.test$" } }),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Coupon.deleteMany({}),
  ]);

  console.log("Creating categories...");
  const createdCategories = await Category.insertMany(categories);
  const categoryBySlug = Object.fromEntries(createdCategories.map((c) => [c.slug, c]));

  console.log("Creating admin, vendors, and demo customer...");
  const admin = await User.create({
    name: "Hammad",
    email: "admin@hammad.test",
    password: "Admin@12345",
    role: "admin",
  });

  const createdVendors = [];
  for (const v of vendors) {
    const vendor = await User.create({
      name: v.name,
      email: v.email,
      password: "Vendor@12345",
      role: "vendor",
      vendorProfile: { shopName: v.shopName, status: "approved" },
    });
    createdVendors.push(vendor);
  }

  const customer = await User.create({
    name: "Demo Customer",
    email: "customer@hammad.test",
    password: "Customer@12345",
    role: "customer",
  });

  console.log("Creating products...");
  function slugify(str) {
    return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  const products = productSeed.map(([name, price, compareAtPrice, image, categorySlug, vendorIdx, badge, stock]) => ({
    name,
    slug: slugify(name),
    description: `${name} from ${vendors[vendorIdx].shopName}. Quality checked and ready to ship.`,
    bullets: ["Quality checked before shipping", "Ships within 2 business days", "7-day return window"],
    price,
    compareAtPrice: compareAtPrice || undefined,
    category: categoryBySlug[categorySlug]._id,
    vendor: createdVendors[vendorIdx]._id,
    image,
    stock,
    badge: badge || null,
  }));

  await Product.insertMany(products);

  console.log("Creating coupons...");
  await Coupon.insertMany([
    { code: "WELCOME10", type: "percentage", value: 10, minOrderValue: 2000, isActive: true },
    { code: "FLAT500", type: "fixed", value: 500, minOrderValue: 5000, isActive: true },
  ]);

  console.log("\nSeed complete.");
  console.log("Admin login:    admin@hammad.test / Admin@12345");
  console.log("Vendor login:   vendor.northwind@hammad.test / Vendor@12345");
  console.log("Customer login: customer@hammad.test / Customer@12345");

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
