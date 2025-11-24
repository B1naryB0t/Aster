import { PrismaClient } from '../generated/prisma/index.js';
const prisma = new PrismaClient();

export const getTasks = async (req, res, next) => {
	try {
		let where = {};

		if (req.user.role === 'user') {
			where.userId = req.user.userId;
		}

		const tasks = await prisma.task.findMany({
			where,
			include: {
				category: true,
			},
		});

		res.json(tasks.map(formatTask));
	} catch (error) {
		next(error);
	}
};

export const getTaskById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const task = await prisma.task.findUnique({
			where: { id: parseInt(id) },
			include: {
				category: true,
			},
		});

		if (!task) {
			return res.status(404).json({ error: 'Task not found' });
		}

		if (task.userId !== req.user.userId && req.user.role !== 'manager') {
			return res.status(403).json({ error: 'Access denied' });
		}

		res.json(formatTask(task));
	} catch (error) {
		next(error);
	}
};

export const createTask = async (req, res, next) => {
	try {
		const { title, description, status, priority, dueDate, categoryId } =
			req.body;

		if (!title) {
			return res.status(400).json({ error: 'Title is required' });
		}

		const task = await prisma.task.create({
			data: {
				title,
				description: description || null,
				status: status || 'pending',
				priority: priority || 'medium',
				dueDate: dueDate ? new Date(dueDate) : null,
				userId: req.user.userId,
				categoryId: categoryId ? parseInt(categoryId) : null,
			},
			include: {
				category: true,
			},
		});

		res.status(201).json(formatTask(task));
	} catch (error) {
		next(error);
	}
};

export const updateTask = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { title, description, status, priority, dueDate, categoryId } =
			req.body;

		const task = await prisma.task.findUnique({
			where: { id: parseInt(id) },
		});

		if (!task) {
			return res.status(404).json({ error: 'Task not found' });
		}

		if (task.userId !== req.user.userId && req.user.role !== 'manager') {
			return res.status(403).json({ error: 'Access denied' });
		}

		const updatedTask = await prisma.task.update({
			where: { id: parseInt(id) },
			data: {
				title: title || task.title,
				description: description !== undefined ? description : task.description,
				status: status || task.status,
				priority: priority || task.priority,
				dueDate: dueDate ? new Date(dueDate) : task.dueDate,
				categoryId: categoryId ? parseInt(categoryId) : task.categoryId,
			},
			include: {
				category: true,
			},
		});

		res.json(formatTask(updatedTask));
	} catch (error) {
		next(error);
	}
};

export const deleteTask = async (req, res, next) => {
	try {
		const { id } = req.params;

		const task = await prisma.task.findUnique({
			where: { id: parseInt(id) },
		});

		if (!task) {
			return res.status(404).json({ error: 'Task not found' });
		}

		if (task.userId !== req.user.userId && req.user.role !== 'manager') {
			return res.status(403).json({ error: 'Access denied' });
		}

		await prisma.task.delete({
			where: { id: parseInt(id) },
		});

		res.status(204).send();
	} catch (error) {
		next(error);
	}
};

export const getUserTasks = async (req, res, next) => {
	try {
		const { userId } = req.params;
		const parsedUserId = parseInt(userId);

		if (parsedUserId !== req.user.userId && req.user.role !== 'manager') {
			return res.status(403).json({ error: 'Access denied' });
		}

		const tasks = await prisma.task.findMany({
			where: { userId: parsedUserId },
			include: {
				category: true,
			},
		});

		res.json(tasks.map(formatTask));
	} catch (error) {
		next(error);
	}
};

const formatTask = (task) => ({
	id: task.id,
	title: task.title,
	description: task.description,
	status: task.status,
	priority: task.priority,
	due_date: task.dueDate,
	user_id: task.userId,
	category_id: task.categoryId,
	created_at: task.createdAt,
	updated_at: task.updatedAt,
});
