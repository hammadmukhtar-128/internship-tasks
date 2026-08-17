require('dotenv').config();
const mongoose = require('mongoose');

const User = require('../models/User');
const Organization = require('../models/Organization');
const Project = require('../models/Project');
const Task = require('../models/Task');
const SubTask = require('../models/SubTask');
const Sprint = require('../models/Sprint');
const ActivityLog = require('../models/ActivityLog');
const TeamInvite = require('../models/TeamInvite');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/saas_project_management';

const STATUSES = ['To Do', 'In Progress', 'In Review', 'Done'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
const LABELS = ['bug', 'feature', 'frontend', 'backend', 'design', 'urgent', 'docs'];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const daysFromNow = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

async function seed() {
  console.log('Connecting to', MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log('Connected. Clearing existing demo collections...');

  await Promise.all([
    User.deleteMany({}),
    Organization.deleteMany({}),
    Project.deleteMany({}),
    Task.deleteMany({}),
    SubTask.deleteMany({}),
    Sprint.deleteMany({}),
    ActivityLog.deleteMany({}),
    TeamInvite.deleteMany({}),
  ]);

  console.log('Creating demo users...');
  const users = await User.create([
    { name: 'Hammad Mukhtar', email: 'hammad@demo.com', password: 'password123', avatarColor: '#6366F1' },
    { name: 'Ali Raza', email: 'ali@demo.com', password: 'password123', avatarColor: '#10B981' },
    { name: 'Ahmed Khan', email: 'ahmed@demo.com', password: 'password123', avatarColor: '#F59E0B' },
    { name: 'Sara Malik', email: 'sara@demo.com', password: 'password123', avatarColor: '#EC4899' },
    { name: 'Bilal Ahmed', email: 'bilal@demo.com', password: 'password123', avatarColor: '#3B82F6' },
  ]);
  const [hammad, ali, ahmed, sara, bilal] = users;

  console.log('Creating demo organization...');
  const organization = await Organization.create({
    name: 'Demo Organization',
    description: 'A sample workspace to explore the platform',
    owner: hammad._id,
    slug: 'demo-organization',
    members: [
      { user: hammad._id, role: 'Owner' },
      { user: ali._id, role: 'Admin' },
      { user: ahmed._id, role: 'Member' },
      { user: sara._id, role: 'Member' },
      { user: bilal._id, role: 'Viewer' },
    ],
  });

  for (const u of users) {
    u.currentOrganization = organization._id;
    await u.save();
  }

  console.log('Creating projects...');
  const projectDefs = [
    { name: 'Website Redesign', key: 'WEB', status: 'Active', priority: 'High', color: '#6366F1' },
    { name: 'Mobile App Launch', key: 'MOB', status: 'Planning', priority: 'Urgent', color: '#10B981' },
    { name: 'Internal Tools', key: 'INT', status: 'On Hold', priority: 'Low', color: '#F59E0B' },
  ];

  const projects = [];
  for (const def of projectDefs) {
    const project = await Project.create({
      ...def,
      description: `${def.name} — demo project seeded for showcasing the platform.`,
      organization: organization._id,
      owner: hammad._id,
      members: [hammad._id, ali._id, ahmed._id, sara._id],
      startDate: daysFromNow(-20),
      dueDate: daysFromNow(30),
    });
    projects.push(project);

    await ActivityLog.create({
      organization: organization._id,
      project: project._id,
      user: hammad._id,
      action: 'created',
      entityType: 'Project',
      entityId: project._id,
      description: `Hammad Mukhtar created project "${project.name}"`,
    });
  }

  console.log('Creating sprints...');
  const sprints = [];
  for (const project of projects.slice(0, 2)) {
    const s1 = await Sprint.create({
      name: `${project.key} Sprint 1`,
      goal: 'Ship the core functionality for the first milestone',
      project: project._id,
      organization: organization._id,
      startDate: daysFromNow(-14),
      endDate: daysFromNow(-1),
      status: 'Completed',
      createdBy: hammad._id,
    });
    const s2 = await Sprint.create({
      name: `${project.key} Sprint 2`,
      goal: 'Polish UI and fix reported bugs',
      project: project._id,
      organization: organization._id,
      startDate: daysFromNow(0),
      endDate: daysFromNow(13),
      status: 'Active',
      createdBy: hammad._id,
    });
    sprints.push(s1, s2);
  }

  console.log('Creating tasks + subtasks...');
  const taskTitles = [
    'Design homepage hero section',
    'Build login API endpoint',
    'Set up CI/CD pipeline',
    'Create Kanban board UI',
    'Implement JWT authentication',
    'Write unit tests for task controller',
    'Fix responsive layout bug on mobile',
    'Add dark mode support',
    'Optimize MongoDB queries',
    'Create onboarding flow',
    'Integrate file upload with Multer',
    'Add burndown chart to sprint page',
    'Refactor project card component',
    'Set up activity log timeline',
    'Implement drag and drop for tasks',
    'Add email invitation flow',
    'Create dashboard analytics widgets',
    'Improve error handling middleware',
    'Add role-based access control',
    'Write API documentation',
    'Design empty states for all pages',
    'Add toast notification system',
  ];

  let globalTaskIndex = 0;
  for (const project of projects) {
    const relevantSprints = sprints.filter((s) => s.project.toString() === project._id.toString());
    const numTasks = randInt(7, 9);
    for (let i = 0; i < numTasks; i++) {
      project.taskCounter += 1;
      const title = taskTitles[globalTaskIndex % taskTitles.length];
      globalTaskIndex += 1;
      const status = pick(STATUSES);
      const assignee = pick([hammad, ali, ahmed, sara, null]);
      const sprint = relevantSprints.length && Math.random() > 0.3 ? pick(relevantSprints) : null;

      const task = await Task.create({
        taskId: `${project.key}-${project.taskCounter}`,
        title,
        description: `Detailed description for "${title}" in the ${project.name} project.`,
        project: project._id,
        organization: organization._id,
        sprint: sprint ? sprint._id : null,
        assignee: assignee ? assignee._id : null,
        reporter: hammad._id,
        status,
        priority: pick(PRIORITIES),
        startDate: daysFromNow(-randInt(1, 10)),
        dueDate: daysFromNow(randInt(-5, 20)),
        labels: [pick(LABELS), pick(LABELS)].filter((v, idx, a) => a.indexOf(v) === idx),
        estimatedHours: randInt(2, 16),
        actualHours: status === 'Done' ? randInt(2, 16) : randInt(0, 8),
        storyPoints: pick([1, 2, 3, 5, 8]),
      });

      // subtasks for some tasks
      if (Math.random() > 0.4) {
        const subCount = randInt(2, 5);
        for (let s = 0; s < subCount; s++) {
          await SubTask.create({
            task: task._id,
            title: `Subtask ${s + 1} for ${task.taskId}`,
            completed: Math.random() > 0.5,
            createdBy: hammad._id,
          });
        }
      }

      // a couple comments
      if (Math.random() > 0.5) {
        task.comments.push({ author: pick([hammad, ali, ahmed]), text: 'Looks good, please proceed with this.' });
        await task.save();
      }

      await ActivityLog.create({
        organization: organization._id,
        project: project._id,
        user: hammad._id,
        action: 'created',
        entityType: 'Task',
        entityId: task._id,
        description: `Hammad Mukhtar created task "${task.taskId}: ${task.title}"`,
      });
      if (assignee) {
        await ActivityLog.create({
          organization: organization._id,
          project: project._id,
          user: hammad._id,
          action: 'assigned',
          entityType: 'Task',
          entityId: task._id,
          description: `Hammad Mukhtar assigned task ${task.taskId} to ${assignee.name}`,
        });
      }
    }
    await project.save();
  }

  console.log('Creating a pending invite...');
  await TeamInvite.create({
    organization: organization._id,
    email: 'newmember@demo.com',
    role: 'Member',
    invitedBy: hammad._id,
    status: 'Pending',
  });

  console.log('\n✅ Seed complete!\n');
  console.log('Demo login credentials (all passwords: password123):');
  console.log('  Owner (Hammad):  hammad@demo.com');
  console.log('  Admin (Ali):     ali@demo.com');
  console.log('  Member (Ahmed):  ahmed@demo.com');
  console.log('  Member (Sara):   sara@demo.com');
  console.log('  Viewer (Bilal):  bilal@demo.com\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
