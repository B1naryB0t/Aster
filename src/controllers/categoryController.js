import { PrismaClient } from '../generated/prisma/index.js';
const prisma = new PrismaClient();

export const getCategories = async (req, res, next) => {
	try {
		const categories = await prisma.category.findMany({
			where: { userId: req.user.userId },
		});

		res.json(categories.map(formatCategory));
	} catch (error) {
		next(error);
	}
};

export const getCategoryById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const category = await prisma.category.findUnique({
			where: { id: parseInt(id) },
		});

		if (!category) {
			return res.status(404).json({ error: 'Category not found' });
		}

		if (category.userId !== req.user.userId) {
			return res.status(403).json({ error: 'Access denied' });
		}

		res.json(formatCategory(category));
	} catch (error) {
		next(error);
	}
};

export const createCategory = async (req, res, next) => {
	try {
		const { name, color } = req.body;

		if (!name || !color) {
			return res.status(400).json({ error: 'Name and color are required' });
		}

		const category = await prisma.category.create({
			data: {
				name,
				color,
				userId: req.user.userId,
			},
		});

		res.status(201).json(formatCategory(category));
	} catch (error) {
		next(error);
	}
};

export const updateCategory = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { name, color } = req.body;

		const category = await prisma.category.findUnique({
			where: { id: parseInt(id) },
		});

		if (!category) {
			return res.status(404).json({ error: 'Category not found' });
		}

		if (category.userId !== req.user.userId) {
			return res.status(403).json({ error: 'Access denied' });
		}

		const updatedCategory = await prisma.category.update({
			where: { id: parseInt(id) },
			data: {
				name: name || category.name,
				color: color || category.color,
			},
		});

		res.json(formatCategory(updatedCategory));
	} catch (error) {
		next(error);
	}
};

export const deleteCategory = async (req, res, next) => {
	try {
		const { id } = req.params;

		const category = await prisma.category.findUnique({
			where: { id: parseInt(id) },
		});

		if (!category) {
			return res.status(404).json({ error: 'Category not found' });
		}

		if (category.userId !== req.user.userId) {
			return res.status(403).json({ error: 'Access denied' });
		}

		await prisma.task.updateMany({
			where: { categoryId: parseInt(id) },
			data: { categoryId: null },
		});

		await prisma.category.delete({
			where: { id: parseInt(id) },
		});

		res.status(204).send();
	} catch (error) {
		next(error);
	}
};

const formatCategory = (category) => ({
	id: category.id,
	name: category.name,
	color: category.color,
	created_at: category.createdAt,
});
