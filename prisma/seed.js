import { PrismaClient } from '../src/generated/prisma/index.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
	// Create admin user
	console.log('Creating admin user...');
	const adminPassword = await bcrypt.hash('admin123', 10);
	const admin = await prisma.user.create({
		data: {
			username: 'admin',
			email: 'admin@example.com',
			password: adminPassword,
			role: 'admin',
		},
	});
	console.log(`Created admin user: ${admin.username} (ID: ${admin.id})`);

	// Create regular user
	console.log('Creating regular user...');
	const userPassword = await bcrypt.hash('user123', 10);
	const regularUser = await prisma.user.create({
		data: {
			username: 'johndoe',
			email: 'john@example.com',
			password: userPassword,
			role: 'user',
		},
	});
	console.log(`Created regular user: ${regularUser.username} (ID: ${regularUser.id})`);

	// Create another regular user for more test data
	const user2Password = await bcrypt.hash('user123', 10);
	const regularUser2 = await prisma.user.create({
		data: {
			username: 'janedoe',
			email: 'jane@example.com',
			password: user2Password,
			role: 'user',
		},
	});
	console.log(`Created regular user: ${regularUser2.username} (ID: ${regularUser2.id})`);

	// Create categories for admin
	console.log('Creating categories for admin...');
	const adminCategory1 = await prisma.category.create({
		data: {
			name: 'Work',
			color: '#3B82F6',
			userId: admin.id,
		},
	});

	const adminCategory2 = await prisma.category.create({
		data: {
			name: 'Personal',
			color: '#10B981',
			userId: admin.id,
		},
	});

	// Create categories for regular user
	console.log('Creating categories for regular user...');
	const userCategory1 = await prisma.category.create({
		data: {
			name: 'Shopping',
			color: '#F59E0B',
			userId: regularUser.id,
		},
	});

	const userCategory2 = await prisma.category.create({
		data: {
			name: 'Health',
			color: '#EF4444',
			userId: regularUser.id,
		},
	});

	// Create categories for second regular user
	const user2Category1 = await prisma.category.create({
		data: {
			name: 'Education',
			color: '#8B5CF6',
			userId: regularUser2.id,
		},
	});

	// Create tags for admin
	console.log('Creating tags for admin...');
	const adminTag1 = await prisma.tag.create({
		data: {
			name: 'urgent',
			userId: admin.id,
		},
	});

	const adminTag2 = await prisma.tag.create({
		data: {
			name: 'important',
			userId: admin.id,
		},
	});

	// Create tags for regular user
	console.log('Creating tags for regular user...');
	const userTag1 = await prisma.tag.create({
		data: {
			name: 'home',
			userId: regularUser.id,
		},
	});

	const userTag2 = await prisma.tag.create({
		data: {
			name: 'weekend',
			userId: regularUser.id,
		},
	});

	// Create tasks for admin
	console.log('Creating tasks for admin...');
	const adminTask1 = await prisma.task.create({
		data: {
			title: 'Review project proposal',
			description: 'Review and provide feedback on the Q4 project proposal',
			status: 'in-progress',
			priority: 'high',
			dueDate: new Date('2024-12-15'),
			userId: admin.id,
			categoryId: adminCategory1.id,
			tags: {
				connect: [{ id: adminTag1.id }, { id: adminTag2.id }],
			},
		},
	});

	const adminTask2 = await prisma.task.create({
		data: {
			title: 'Schedule team meeting',
			description: 'Schedule weekly team sync meeting',
			status: 'pending',
			priority: 'medium',
			dueDate: new Date('2024-12-10'),
			userId: admin.id,
			categoryId: adminCategory1.id,
			tags: {
				connect: [{ id: adminTag2.id }],
			},
		},
	});

	const adminTask3 = await prisma.task.create({
		data: {
			title: 'Buy groceries',
			description: 'Milk, eggs, bread, vegetables',
			status: 'pending',
			priority: 'low',
			userId: admin.id,
			categoryId: adminCategory2.id,
		},
	});

	// Create tasks for regular user
	console.log('Creating tasks for regular user...');
	const userTask1 = await prisma.task.create({
		data: {
			title: 'Buy birthday gift',
			description: 'Find a gift for Sarah\'s birthday party',
			status: 'pending',
			priority: 'high',
			dueDate: new Date('2024-12-20'),
			userId: regularUser.id,
			categoryId: userCategory1.id,
			tags: {
				connect: [{ id: userTag1.id }],
			},
		},
	});

	const userTask2 = await prisma.task.create({
		data: {
			title: 'Doctor appointment',
			description: 'Annual checkup scheduled for next week',
			status: 'pending',
			priority: 'medium',
			dueDate: new Date('2024-12-18'),
			userId: regularUser.id,
			categoryId: userCategory2.id,
		},
	});

	const userTask3 = await prisma.task.create({
		data: {
			title: 'Clean the garage',
			description: 'Organize and clean out the garage',
			status: 'completed',
			priority: 'low',
			userId: regularUser.id,
			tags: {
				connect: [{ id: userTag1.id }, { id: userTag2.id }],
			},
		},
	});

	// Create tasks for second regular user
	console.log('Creating tasks for second regular user...');
	const user2Task1 = await prisma.task.create({
		data: {
			title: 'Complete JavaScript course',
			description: 'Finish the advanced JavaScript course on Udemy',
			status: 'in-progress',
			priority: 'high',
			dueDate: new Date('2024-12-25'),
			userId: regularUser2.id,
			categoryId: user2Category1.id,
		},
	});

	const user2Task2 = await prisma.task.create({
		data: {
			title: 'Read database design book',
			description: 'Continue reading chapter 5 of the database design book',
			status: 'pending',
			priority: 'medium',
			userId: regularUser2.id,
			categoryId: user2Category1.id,
		},
	});

	console.log('\n✅ Database seeded successfully!');
	console.log('\nSample credentials:');
	console.log('Admin - Email: admin@example.com, Password: admin123');
	console.log('User 1 - Email: john@example.com, Password: user123');
	console.log('User 2 - Email: jane@example.com, Password: user123');
	console.log('\nCreated resources:');
	console.log(`- ${await prisma.user.count()} users`);
	console.log(`- ${await prisma.category.count()} categories`);
	console.log(`- ${await prisma.tag.count()} tags`);
	console.log(`- ${await prisma.task.count()} tasks`);
}

main()
	.catch((e) => {
		console.error('Error seeding database:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

