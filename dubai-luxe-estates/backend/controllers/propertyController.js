const asyncHandler = require("express-async-handler");
const Property = require("../models/Property");

// @desc Get all properties with filters, search, sort, pagination
// @route GET /api/properties
// @access Public
const getProperties = asyncHandler(async (req, res) => {
  const {
    location,
    community,
    city,
    purpose,
    propertyType,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    minArea,
    maxArea,
    search,
    sort,
    page = 1,
    limit = 9,
    featured,
    furnishing,
  } = req.query;

  const query = { status: "Available" };

  if (location) {
    query.$or = [
      { location: new RegExp(location, "i") },
      { community: new RegExp(location, "i") },
      { address: new RegExp(location, "i") },
      { city: new RegExp(location, "i") },
    ];
  }

  if (community) query.community = new RegExp(community, "i");
  if (city) query.city = new RegExp(city, "i");
  if (purpose) query.purpose = purpose;
  if (propertyType) query.propertyType = propertyType;
  if (furnishing) query.furnishing = furnishing;
  if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
  if (bathrooms) query.bathrooms = { $gte: Number(bathrooms) };
  if (featured) query.featured = featured === "true";
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (minArea || maxArea) {
    query.area = {};
    if (minArea) query.area.$gte = Number(minArea);
    if (maxArea) query.area.$lte = Number(maxArea);
  }
  if (search) {
    query.$or = [
      { title: new RegExp(search, "i") },
      { description: new RegExp(search, "i") },
      { community: new RegExp(search, "i") },
      { location: new RegExp(search, "i") },
      { city: new RegExp(search, "i") },
    ];
  }

  let sortOption = { createdAt: -1 };
  if (sort === "price_asc") sortOption = { price: 1 };
  if (sort === "price_desc") sortOption = { price: -1 };
  if (sort === "area_desc") sortOption = { area: -1 };
  if (sort === "featured") sortOption = { featured: -1, createdAt: -1 };

  const pageNum = Number(page) || 1;
  const limitNum = Math.min(Math.max(Number(limit) || 9, 1), 24);

  const [properties, total] = await Promise.all([
    Property.find(query)
      .populate("agent", "name image phone whatsapp designation")
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Property.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: properties.length,
    total,
    page: pageNum,
    pages: Math.max(Math.ceil(total / limitNum), 1),
    data: properties,
  });
});

// @desc Get single property by slug
// @route GET /api/properties/:slug
// @access Public
const getPropertyBySlug = asyncHandler(async (req, res) => {
  const property = await Property.findOne({ slug: req.params.slug }).populate("agent");
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }
  property.views += 1;
  await property.save();

  const related = await Property.find({
    community: property.community,
    _id: { $ne: property._id },
  }).limit(3);

  res.json({ success: true, data: property, related });
});

// @desc Create property
// @route POST /api/properties
// @access Private/Admin
const createProperty = asyncHandler(async (req, res) => {
  const property = await Property.create(req.body);
  res.status(201).json({ success: true, data: property });
});

// @desc Update property
// @route PUT /api/properties/:id
// @access Private/Admin
const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }
  Object.assign(property, req.body);
  await property.save();
  res.json({ success: true, data: property });
});

// @desc Delete property
// @route DELETE /api/properties/:id
// @access Private/Admin
const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }
  await property.deleteOne();
  res.json({ success: true, message: "Property removed" });
});

module.exports = {
  getProperties,
  getPropertyBySlug,
  createProperty,
  updateProperty,
  deleteProperty,
};
