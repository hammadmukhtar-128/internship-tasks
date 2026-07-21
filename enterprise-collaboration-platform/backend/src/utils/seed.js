/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');
const env = require('../config/env');
const User = require('../models/User');
const Team = require('../models/Team');
const Channel = require('../models/Channel');

async function seed() {
  await mongoose.connect(env.MONGODB_URI);
  console.log('Connected to MongoDB for seeding...');

  const existingAdmin = await User.findOne({ email: 'admin@ecp.com' });
  if (existingAdmin) {
    console.log('Seed data already exists. Skipping.');
    process.exit(0);
  }

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@ecp.com',
    password: 'Password123',
    role: 'admin',
    isEmailVerified: true,
  });

  const owner = await User.create({
    name: 'Sarah Chen',
    email: 'sarah@ecp.com',
    password: 'Password123',
    role: 'team_owner',
    isEmailVerified: true,
  });

  const member = await User.create({
    name: 'James Miller',
    email: 'james@ecp.com',
    password: 'Password123',
    role: 'member',
    isEmailVerified: true,
  });

  const team = await Team.create({
    name: 'Product Engineering',
    slug: 'product-engineering',
    description: 'Cross-functional product and engineering team',
    owner: owner._id,
    members: [
      { user: owner._id, role: 'owner' },
      { user: member._id, role: 'member' },
      { user: admin._id, role: 'member' },
    ],
  });

  await Channel.create([
    {
      name: 'general',
      team: team._id,
      type: 'public',
      createdBy: owner._id,
      members: [owner._id, member._id, admin._id],
      description: 'General discussion',
    },
    {
      name: 'engineering',
      team: team._id,
      type: 'public',
      createdBy: owner._id,
      members: [owner._id, member._id],
      description: 'Engineering discussions and code reviews',
    },
    {
      name: 'leadership',
      team: team._id,
      type: 'private',
      createdBy: owner._id,
      members: [owner._id],
      description: 'Private channel for team leads',
    },
  ]);

  console.log('✅ Seed complete!');
  console.log('Login with: admin@ecp.com / Password123 (Admin)');
  console.log('Login with: sarah@ecp.com / Password123 (Team Owner)');
  console.log('Login with: james@ecp.com / Password123 (Member)');

  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
