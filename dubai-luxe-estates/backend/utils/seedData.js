require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Property = require("../models/Property");
const Agent = require("../models/Agent");
const Blog = require("../models/Blog");
const Admin = require("../models/Admin");

const agents = [
  {
    name: "Hammad Mukhtar",
    designation: "Senior Property Consultant",
    phone: "+92 300 1234567",
    email: "hammad@lahoreestatehub.com",
    whatsapp: "923001234567",
    image: "/images/img36.jpg",
    bio: "Hammad advises buyers and investors across DHA Lahore, Bahria Town, and Gulberg with a focus on high-growth neighbourhoods.",
    experience: 10,
    languages: ["English", "Urdu"],
    social: { linkedin: "#", instagram: "#" },
  },
  {
    name: "Ayesha Khan",
    designation: "Residential Sales Specialist",
    phone: "+92 321 7654321",
    email: "ayesha@lahoreestatehub.com",
    whatsapp: "923217654321",
    image: "/images/img37.jpg",
    bio: "Ayesha helps families secure luxury homes and investment properties in Bahria Town and Johar Town.",
    experience: 8,
    languages: ["English", "Urdu"],
    social: { linkedin: "#", instagram: "#" },
  },
  {
    name: "Usman Tariq",
    designation: "Commercial Property Advisor",
    phone: "+92 333 6543210",
    email: "usman@lahoreestatehub.com",
    whatsapp: "923336543210",
    image: "/images/img38.jpg",
    bio: "Usman specializes in commercial plots, office spaces, and retail opportunities across Lahore’s prime commercial corridors.",
    experience: 11,
    languages: ["English", "Urdu"],
    social: { linkedin: "#", instagram: "#" },
  },
  {
    name: "Maham Iqbal",
    designation: "Luxury Villas Manager",
    phone: "+92 312 3456789",
    email: "maham@lahoreestatehub.com",
    whatsapp: "923123456789",
    image: "/images/img39.jpg",
    bio: "Maham focuses on premium villas and family homes in DHA Lahore, Gulberg, and Lake City.",
    experience: 9,
    languages: ["English", "Urdu"],
    social: { linkedin: "#", instagram: "#" },
  },
];

const communities = [
  "DHA Lahore",
  "Bahria Town Lahore",
  "Gulberg",
  "Johar Town",
  "Model Town",
  "Lake City",
  "Lahore Cantt",
  "Township",
];

const propertyTemplates = [
  { title: "DHA Lahore Family Villa", propertyType: "Villa", bedrooms: 5, bathrooms: 4, area: 4200, price: 50000000 },
  { title: "Lake City Modern Residence", propertyType: "House", bedrooms: 4, bathrooms: 3, area: 3100, price: 39500000 },
  { title: "Bahria Town Garden Home", propertyType: "House", bedrooms: 3, bathrooms: 3, area: 2600, price: 28500000 },
  { title: "Gulberg Luxury Apartment", propertyType: "Apartment", bedrooms: 3, bathrooms: 3, area: 2400, price: 19000000 },
  { title: "Johar Town Family House", propertyType: "House", bedrooms: 4, bathrooms: 3, area: 3000, price: 24500000 },
  { title: "Model Town Executive Apartment", propertyType: "Apartment", bedrooms: 2, bathrooms: 2, area: 1800, price: 16500000 },
  { title: "Lahore Cantt Corner Plot", propertyType: "Plot", bedrooms: 0, bathrooms: 0, area: 5000, price: 13500000 },
  { title: "Valencia Town Contemporary Villa", propertyType: "Villa", bedrooms: 4, bathrooms: 3, area: 3400, price: 31000000 },
  { title: "Township Commercial Office", propertyType: "Office", bedrooms: 0, bathrooms: 2, area: 1600, price: 8500000 },
  { title: "Gulberg Retail Shop", propertyType: "Shop", bedrooms: 0, bathrooms: 1, area: 900, price: 7000000 },
  { title: "Bahria Town Premium Apartment", propertyType: "Apartment", bedrooms: 2, bathrooms: 2, area: 1700, price: 12000000 },
  { title: "DHA Lahore Commercial Plaza", propertyType: "Commercial", bedrooms: 0, bathrooms: 2, area: 2200, price: 9500000 },
  { title: "Askari 11 Residence", propertyType: "House", bedrooms: 3, bathrooms: 2, area: 2300, price: 17500000 },
  { title: "Faisal Town Home", propertyType: "House", bedrooms: 4, bathrooms: 3, area: 2800, price: 22000000 },
  { title: "Gulshan-e-Ravi Plot", propertyType: "Plot", bedrooms: 0, bathrooms: 0, area: 7200, price: 9800000 },
  { title: "Wapda Town Family Apartment", propertyType: "Apartment", bedrooms: 3, bathrooms: 2, area: 2000, price: 15000000 },
];

const amenitiesPool = [
  "Covered Parking",
  "Security System",
  "Garden / Lawn",
  "Community Club",
  "Power Backup",
  "Gymnasium",
  "24/7 Security",
  "Kids Play Area",
  "Lounge & Lobby",
  "Central Air Conditioning",
  "Basement Storage",
  "CCTV Access",
];

const blogs = [
  {
    title: "Why DHA Lahore Remains a Top Choice for Families",
    image: "/images/img42.jpg",
    category: "Buying Guide",
    excerpt: "A practical look at where DHA Lahore stands for quality living, resale value, and family convenience.",
    content:
      "DHA Lahore continues to attract families, investors, and professionals who value security, long-term value, and a well-planned lifestyle. We explore why locations within DHA remain among the strongest choices in Lahore property demand.",
  },
  {
    title: "Bahria Town Lahore: What Buyers Should Know Before Investing",
    image: "/images/img43.jpg",
    category: "Investment",
    excerpt: "From infrastructure to pricing trends, here is a practical guide to Bahria Town Lahore real estate.",
    content:
      "Bahria Town Lahore continues to set a benchmark for modern urban living in the city. This guide covers park-facing plots, rental appeal, infrastructure, and pricing patterns that matter to buyers and investors.",
  },
  {
    title: "Renting in Gulberg vs Johar Town: Which Fits Your Lifestyle?",
    image: "/images/img44.jpg",
    category: "Lifestyle",
    excerpt: "A quick comparison of two of Lahore's most active residential corridors.",
    content:
      "Gulberg and Johar Town both offer highly connected residential options, but each appeals to different buyers and tenants. We compare pricing, commute time, amenities, and lifestyle fit.",
  },
  {
    title: "How to Evaluate a Lahore Plot Before Purchase",
    image: "/images/img45.jpg",
    category: "Buying Guide",
    excerpt: "If you're considering a plot investment in Lahore, these checks can save time and money.",
    content:
      "Plot purchases in Lahore require careful attention to location, ownership status, nearby development, and access to utilities. We list the key questions every homeowner or investor should answer before buying.",
  },
];

const seed = async () => {
  await connectDB();

  await Promise.all([
    Property.deleteMany(),
    Agent.deleteMany(),
    Blog.deleteMany(),
  ]);

  const createdAgents = await Agent.insertMany(agents);

  const propertyImageStart = 4;
  const properties = propertyTemplates.map((tpl, i) => {
    const community = communities[i % communities.length];
    const imgIndex = propertyImageStart + (i % 12);
    const purpose = i % 3 === 0 ? "Rent" : "Buy";
    const city = "Lahore";
    const price = purpose === "Rent" ? Math.round(tpl.price / 18) : tpl.price;
    const areaText = `${tpl.area.toLocaleString()} sq ft`;

    return {
      ...tpl,
      title: `${tpl.title}${purpose === "Rent" ? " - Available for Rent" : ""}`,
      description: `A well-designed ${tpl.propertyType.toLowerCase()} in ${community}, Lahore, offering ${tpl.bedrooms} bedrooms and premium finishes. Located close to schools, shopping centres, and major routes, it is ideal for families, investors, and professionals seeking a solid property opportunity in Lahore.`,
      currency: "PKR",
      price,
      purpose,
      city,
      location: `${community}, Lahore, Pakistan`,
      community,
      address: `${community} Main Road, Lahore, Pakistan`,
      amenities: amenitiesPool.sort(() => 0.5 - Math.random()).slice(0, 6),
      images: [`/images/img${imgIndex}.jpg`, `/images/img${propertyImageStart + ((i + 1) % 12)}.jpg`],
      featured: i < 8,
      status: "Available",
      furnishing: i % 2 === 0 ? "Furnished" : "Unfurnished",
      agent: createdAgents[i % createdAgents.length]._id,
      nearby: {
        schools: ["The City School", "Beaconhouse", "LGS"],
        hospitals: ["Mayo Hospital", "Ittefaq Hospital", "Shaukat Khanum"],
        metro: ["Lahore Metro", "Canal Road Access"],
      },
      coordinates: { latitude: 31.5204 + (i % 6) * 0.01, longitude: 74.3587 - (i % 5) * 0.01 },
      floorPlanImage: `/images/img${imgIndex}.jpg`,
      area: tpl.area,
      bedrooms: tpl.bedrooms,
      bathrooms: tpl.bathrooms,
      propertyType: tpl.propertyType,
      areaLabel: areaText,
    };
  });

  await Property.insertMany(properties);
  await Blog.insertMany(blogs);

  const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (!adminExists) {
    await Admin.create({
      name: "Site Administrator",
      email: process.env.ADMIN_EMAIL || "hammadmukhtar128@gmail.com",
      password: process.env.ADMIN_PASSWORD || "ChangeThisPassword123!",
    });
  }

  console.log("Seed data inserted successfully.");
  mongoose.connection.close();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
