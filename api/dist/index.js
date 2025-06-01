"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const employees_1 = __importDefault(require("./routes/employees"));
const auth_1 = __importDefault(require("./routes/auth"));
// Load environment variables
dotenv_1.default.config();
// Create Express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true // Importante para cookies
}));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
// Routes
app.use('/api/employees', employees_1.default);
app.use('/api/auth', auth_1.default);
// Root route
app.get('/', (req, res) => {
    res.send('Employee Management API is running');
});
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
