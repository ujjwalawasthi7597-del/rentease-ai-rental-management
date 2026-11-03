import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { dbStore } from '../models/store.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'rentease_jwt_secret_dev_key_secure_2025';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
    role: 'landlord' | 'tenant';
    phone?: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({ success: false, message: 'Access denied. No authentication token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    const user = await dbStore.users.findById(decoded.id);

    if (!user) {
      res.status(401).json({ success: false, message: 'User account not found or session expired.' });
      return;
    }

    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };
    next();
  } catch (err: any) {
    res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export const requireRole = (role: 'landlord' | 'tenant') => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    if (req.user.role !== role) {
      res.status(403).json({
        success: false,
        message: `Forbidden. This action requires ${role} privileges. Your current role is ${req.user.role}.`,
      });
      return;
    }

    next();
  };
};
