"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.authorize = exports.authenticate = exports.login = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const user = yield prisma_1.default.user.findUnique({
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
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email,
            role: user.role
        }, JWT_SECRET, { expiresIn: '8h' });
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
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Authentication failed',
            error: error.message
        });
    }
});
exports.login = login;
// Middleware para verificar autenticación
const authenticate = (req, res, next) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        console.log("Token verificado para usuario:", decoded.email);
        // Añadir datos del usuario a la request
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error("Error de autenticación:", error);
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
            error: error.message
        });
    }
};
exports.authenticate = authenticate;
const authorize = (roles) => {
    return (req, res, next) => {
        try {
            const user = req.user;
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
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Authorization failed',
                error: error.message
            });
        }
    };
};
exports.authorize = authorize;
const verifyToken = (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                valid: false
            });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return res.status(200).json({
            success: true,
            valid: true,
            user: {
                id: decoded.userId,
                email: decoded.email,
                role: decoded.role
            }
        });
    }
    catch (error) {
        return res.status(200).json({
            success: true,
            valid: false,
            error: error.message
        });
    }
};
exports.verifyToken = verifyToken;
