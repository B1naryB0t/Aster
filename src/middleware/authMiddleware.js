import { verifyToken } from '../utils/jwt.js';

export const authMiddleware = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ error: 'Missing or invalid token' });
	}

	const token = authHeader.slice(7);
	const decoded = verifyToken(token);

	if (!decoded) {
		return res.status(401).json({ error: 'Invalid or expired token' });
	}

	req.user = decoded;
	next();
};

export const managerMiddleware = (req, res, next) => {
	if (req.user.role !== 'manager') {
		return res
			.status(403)
			.json({ error: 'Access denied. Manager role required.' });
	}
	next();
};
