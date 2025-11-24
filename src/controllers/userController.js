import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const getUsers = async (req, res, next) => {
	try {
		if (req.user.role !== 'manager') {
			return res.status(403).json({ error: 'Manager role required' });
		}

		const users = await prisma.user.findMany({
			select: {
				id: true,
				username: true,
				email: true,
				role: true,
				createdAt: true,
			},
		});

		res.json(users.map(formatUser));
	} catch (error) {
		next(error);
	}
};

export const getUserById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const parsedId = parseInt(id);

		if (parsedId !== req.user.userId && req.user.role !== 'manager') {
			return res.status(403).json({ error: 'Access denied' });
		}

		const user = await prisma.user.findUnique({
			where: { id: parsedId },
			select: {
				id: true,
				username: true,
				email: true,
				role: true,
				createdAt: true,
			},
		});

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		res.json(formatUser(user));
	} catch (error) {
		next(error);
	}
};

export const updateUser = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { username, email } = req.body;
		const parsedId = parseInt(id);

		if (parsedId !== req.user.userId) {
			return res.status(403).json({ error: 'Access denied' });
		}

		const user = await prisma.user.findUnique({
			where: { id: parsedId },
		});

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		if (email && email !== user.email) {
			const existingEmail = await prisma.user.findUnique({
				where: { email },
			});
			if (existingEmail) {
				return res.status(409).json({ error: 'Email already in use' });
			}
		}

		if (username && username !== user.username) {
			const existingUsername = await prisma.user.findUnique({
				where: { username },
			});
			if (existingUsername) {
				return res.status(409).json({ error: 'Username already in use' });
			}
		}

		const updatedUser = await prisma.user.update({
			where: { id: parsedId },
			data: {
				username: username || user.username,
				email: email || user.email,
			},
			select: {
				id: true,
				username: true,
				email: true,
				role: true,
				createdAt: true,
			},
		});

		res.json(formatUser(updatedUser));
	} catch (error) {
		next(error);
	}
};

export const updateUserRole = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { role } = req.body;
		const parsedId = parseInt(id);

		if (req.user.role !== 'manager') {
			return res.status(403).json({ error: 'Manager role required' });
		}

		if (!['user', 'manager'].includes(role)) {
			return res.status(400).json({ error: 'Invalid role' });
		}

		const user = await prisma.user.findUnique({
			where: { id: parsedId },
		});

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		const updatedUser = await prisma.user.update({
			where: { id: parsedId },
			data: { role },
			select: {
				id: true,
				username: true,
				email: true,
				role: true,
				createdAt: true,
			},
		});

		res.json(formatUser(updatedUser));
	} catch (error) {
		next(error);
	}
};

export const deleteUser = async (req, res, next) => {
	try {
		const { id } = req.params;
		const parsedId = parseInt(id);

		if (parsedId !== req.user.userId && req.user.role !== 'manager') {
			return res.status(403).json({ error: 'Access denied' });
		}

		const user = await prisma.user.findUnique({
			where: { id: parsedId },
		});

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		await prisma.user.delete({
			where: { id: parsedId },
		});

		res.status(204).send();
	} catch (error) {
		next(error);
	}
};

const formatUser = (user) => ({
	id: user.id,
	username: user.username,
	email: user.email,
	role: user.role,
	created_at: user.createdAt,
});
