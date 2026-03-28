require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Service = require('./models/Service');

const users = [
  { name: 'Ahmed Ali', email: 'ahmed@pesaskill.com', password: 'password123', phone: '0712345678', role: 'seller', skills: ['Design', 'Coding'], bio: 'Creative designer with 3 years experience', rating: 4.8, jobsCompleted: 24, isVerified: true },
  { name: 'Amina Hassan', email: 'amina@pesaskill.com', password: 'password123', phone: '0723456789', role: 'seller', skills: ['Writing', 'Marketing'], bio: 'Content writer & digital marketer', rating: 4.6, jobsCompleted: 18 },
  { name: 'David Ochieng', email: 'david@pesaskill.com', password: 'password123', phone: '0734567890', role: 'both', skills: ['Coding'], bio: 'Full-stack developer, React & Node.js', rating: 4.9, jobsCompleted: 31, isVerified: true },
  { name: 'Fatuma Wanjiru', email: 'fatuma@pesaskill.com', password: 'password123', phone: '0745678901', role: 'seller', skills: ['Video', 'Music'], bio: 'Video editor & music producer', rating: 4.7, jobsCompleted: 15 },
  { name: 'Test Buyer', email: 'buyer@pesaskill.com', password: 'password123', phone: '0756789012', role: 'buyer', skills: [] },
];

const getServices = (sellerIds) => [
  { title: 'Professional Logo Design', description: 'I will create a modern, clean, and professional logo for your brand. Includes 3 concepts, unlimited revisions, and all source files.', price: 1500, category: 'Design', seller: sellerIds[0], rating: 4.8, totalRatings: 12, ordersCompleted: 18, deliveryDays: 3, tags: ['logo', 'branding', 'illustrator'], isFeatured: true },
  { title: 'Social Media Graphics Pack', description: 'Complete social media graphics package — 10 custom posts for Instagram, Facebook, and Twitter. Consistent branding guaranteed.', price: 800, category: 'Design', seller: sellerIds[0], rating: 4.6, totalRatings: 8, ordersCompleted: 11, deliveryDays: 2, tags: ['social media', 'graphics', 'canva'] },
  { title: 'SEO Blog Article (1000 words)', description: 'Well-researched, SEO-optimized blog article on any topic. Includes keyword research, meta description, and internal linking suggestions.', price: 600, category: 'Writing', seller: sellerIds[1], rating: 4.7, totalRatings: 15, ordersCompleted: 22, deliveryDays: 2, tags: ['seo', 'blog', 'content'], isFeatured: true },
  { title: 'Social Media Marketing Strategy', description: 'Complete 30-day social media strategy for your business. Includes content calendar, hashtag research, and growth tactics.', price: 2000, category: 'Marketing', seller: sellerIds[1], rating: 4.5, totalRatings: 6, ordersCompleted: 8, deliveryDays: 5, tags: ['marketing', 'strategy', 'growth'] },
  { title: 'React.js Web App Development', description: 'Build a modern, responsive React.js web application. REST API integration, authentication, and deployment included.', price: 5000, category: 'Coding', seller: sellerIds[2], rating: 4.9, totalRatings: 20, ordersCompleted: 28, deliveryDays: 7, tags: ['react', 'javascript', 'web'], isFeatured: true },
  { title: 'REST API Development (Node.js)', description: 'Professional Node.js REST API with Express, MongoDB, JWT auth, and full documentation. Production-ready code.', price: 3500, category: 'Coding', seller: sellerIds[2], rating: 4.8, totalRatings: 14, ordersCompleted: 19, deliveryDays: 5, tags: ['nodejs', 'api', 'backend'] },
  { title: 'YouTube Video Editing', description: 'Professional YouTube video editing with color grading, transitions, captions, and thumbnail design. Up to 10 minutes.', price: 1200, category: 'Video', seller: sellerIds[3], rating: 4.7, totalRatings: 9, ordersCompleted: 13, deliveryDays: 3, tags: ['youtube', 'editing', 'premiere'] },
  { title: 'Original Music Beat Production', description: 'Custom music beat/instrumental for your project. Any genre — Afrobeat, Hip-hop, Gospel, Pop. Full rights included.', price: 2500, category: 'Music', seller: sellerIds[3], rating: 4.6, totalRatings: 7, ordersCompleted: 10, deliveryDays: 4, tags: ['music', 'beat', 'production'] },
  { title: 'Business Plan Writing', description: 'Professional business plan with market analysis, financial projections, and executive summary. Investor-ready format.', price: 3000, category: 'Business', seller: sellerIds[1], rating: 4.4, totalRatings: 5, ordersCompleted: 7, deliveryDays: 7, tags: ['business', 'plan', 'startup'] },
  { title: 'WordPress Website Setup', description: 'Complete WordPress website setup with custom theme, plugins, SEO optimization, and 1 month of support.', price: 4000, category: 'Coding', seller: sellerIds[2], rating: 4.7, totalRatings: 11, ordersCompleted: 16, deliveryDays: 5, tags: ['wordpress', 'website', 'cms'] },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await Service.deleteMany({});

  const createdUsers = [];
  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10);
    const user = await User.create({ ...u, password: hashed });
    createdUsers.push(user);
  }
  console.log(`Created ${createdUsers.length} users`);

  const sellerIds = createdUsers.slice(0, 4).map(u => u._id);
  const services = getServices(sellerIds);
  await Service.insertMany(services);
  console.log(`Created ${services.length} services`);

  console.log('\n✅ Seed complete!');
  console.log('Test accounts:');
  users.forEach(u => console.log(`  ${u.email} / password123`));
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
