import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';

const prisma = new PrismaClient();

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email or username already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: 'user'
      }
    });

    
    const token = generateToken(user.id, user.role);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.createdAt,
      },
    });

  } catch (error) {
    next(error);
  }
};


export const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: 'Email and password required' });
		}

		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return res.status(401).json({ error: 'Invalid email or password' });
		}

		const isValid = await bcrypt.compare(password, user.password);

		if (!isValid) {
			return res.status(401).json({ error: 'Invalid email or password' });
		}

		const token = generateToken(user.id, user.role);

		res.json({
			token,
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
				role: user.role,
			},
			expires_in: process.env.JWT_EXPIRES_IN,
		});
	} catch (error) {
		next(error);
	}
};

export const getMe = async (req, res, next) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.user.userId },
		});

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		res.json({
			id: user.id,
			username: user.username,
			email: user.email,
			role: user.role,
			created_at: user.createdAt,
		});
	} catch (error) {
		next(error);
	}
};
