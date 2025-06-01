import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const login = async (req: Request, res: Response) => {
  try {
    console.log("Login intento:", req.body.email);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Buscar el usuario por email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Verificar si el usuario existe
    if (!user) {
      console.log(`Usuario no encontrado: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordValid = password === user.password;


    if (!isPasswordValid) {
      console.log(`Contraseña incorrecta para: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    console.log(`Login exitoso: ${email}, token generado`);

    // Devolver token y datos de usuario
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: (error as Error).message
    });
  }
};

// Middleware para verificar autenticación
export const authenticate = (req: Request, res: Response, next: Function) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("Headers de autorización:", authHeader ? "Presente" : "Ausente");
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const token = authHeader.split(' ')[1];
    console.log("Token recibido:", token.substring(0, 15) + "...");
    
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    console.log("Token verificado para usuario:", decoded.email);
    
    // Añadir datos del usuario a la request
    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error("Error de autenticación:", error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: (error as Error).message
    });
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: Function) => {
    try {
      const user = (req as any).user;
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }
      
      if (!roles.includes(user.role)) {
        console.log(`Acceso denegado: ${user.email} (${user.role}) intentó acceder a ruta restringida`);
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Authorization failed',
        error: (error as Error).message
      });
    }
  };
};

export const verifyToken = (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        valid: false
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    return res.status(200).json({
      success: true,
      valid: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role
      }
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      valid: false,
      error: (error as Error).message
    });
  }
};