"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employee_1 = require("../controllers/employee");
const router = express_1.default.Router();
router.post('/', employee_1.createEmployee);
router.get('/', employee_1.getAllEmployees);
router.put('/:id', employee_1.updateEmployee);
router.delete('/:id', employee_1.deleteEmployee);
exports.default = router;
