import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTags = async (req, res, next) => {
	try {
		const tags = await prisma.tag.findMany({
			where: { userId: req.user.userId },
		});

		res.json(tags.map(formatTag));
	} catch (error) {
		next(error);
	}
};

export const getTagById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const tag = await prisma.tag.findUnique({
			where: { id: parseInt(id) },
		});

		if (!tag) {
			return res.status(404).json({ error: 'Tag not found' });
		}

		if (tag.userId !== req.user.userId) {
			return res.status(403).json({ error: 'Access denied' });
		}

		res.json(formatTag(tag));
	} catch (error) {
		next(error);
	}
};

export const createTag = async (req, res, next) => {
	try {
		const { name } = req.body;

		if (!name) {
			return res.status(400).json({ error: 'Name is required' });
		}

		const tag = await prisma.tag.create({
			data: {
				name,
				userId: req.user.userId,
			},
		});

		res.status(201).json(formatTag(tag));
	} catch (error) {
		next(error);
	}
};

export const updateTag = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { name } = req.body;

		const tag = await prisma.tag.findUnique({
			where: { id: parseInt(id) },
		});

		if (!tag) {
			return res.status(404).json({ error: 'Tag not found' });
		}

		if (tag.userId !== req.user.userId) {
			return res.status(403).json({ error: 'Access denied' });
		}

		const updatedTag = await prisma.tag.update({
			where: { id: parseInt(id) },
			data: {
				name: name || tag.name,
			},
		});

		res.json(formatTag(updatedTag));
	} catch (error) {
		next(error);
	}
};

export const deleteTag = async (req, res, next) => {
	try {
		const { id } = req.params;

		const tag = await prisma.tag.findUnique({
			where: { id: parseInt(id) },
		});

		if (!tag) {
			return res.status(404).json({ error: 'Tag not found' });
		}

		if (tag.userId !== req.user.userId) {
			return res.status(403).json({ error: 'Access denied' });
		}

		await prisma.tag.delete({
			where: { id: parseInt(id) },
		});

		res.status(204).send();
	} catch (error) {
		next(error);
	}
};

const formatTag = (tag) => ({
	id: tag.id,
	name: tag.name,
	created_at: tag.createdAt,
});
