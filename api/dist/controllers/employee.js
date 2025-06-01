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
exports.deleteEmployee = exports.updateEmployee = exports.getAllEmployees = exports.createEmployee = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
// Create a new employee
const createEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Datos recibidos:", req.body);
        const { name, email, phone, address, position, department, dateOfJoining, status } = req.body;
        // Validate required fields
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        // Create employee record
        const employee = yield prisma_1.default.employee.create({
            data: {
                name,
                email,
                phone,
                address,
                position,
                department,
                dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : undefined,
                status: status || 'ACTIVE',
            },
        });
        res.status(201).json({
            success: true,
            data: employee,
        });
    }
    catch (error) {
        console.error('Error creating employee:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create employee',
            error: error.message,
        });
    }
});
exports.createEmployee = createEmployee;
// Get all employees
const getAllEmployees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield prisma_1.default.employee.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.status(200).json({
            success: true,
            count: employees.length,
            data: employees,
        });
    }
    catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch employees',
            error: error.message,
        });
    }
});
exports.getAllEmployees = getAllEmployees;
// Update an existing employee
const updateEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, email, phone, address, position, department, dateOfJoining, status } = req.body;
        // Validate required fields
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        // Check if employee exists
        const existingEmployee = yield prisma_1.default.employee.findUnique({
            where: { id },
        });
        if (!existingEmployee) {
            return res.status(404).json({
                success: false,
                message: `Employee with ID ${id} not found`,
            });
        }
        // Update employee record
        const updatedEmployee = yield prisma_1.default.employee.update({
            where: { id },
            data: {
                name,
                email,
                phone,
                address,
                position,
                department,
                dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : undefined,
                status: status || existingEmployee.status,
            },
        });
        res.status(200).json({
            success: true,
            data: updatedEmployee,
        });
    }
    catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update employee',
            error: error.message,
        });
    }
});
exports.updateEmployee = updateEmployee;
const deleteEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Check if employee exists
        const existingEmployee = yield prisma_1.default.employee.findUnique({
            where: { id },
        });
        if (!existingEmployee) {
            return res.status(404).json({
                success: false,
                message: `Employee with ID ${id} not found`,
            });
        }
        // Delete employee record
        yield prisma_1.default.employee.delete({
            where: { id },
        });
        res.status(200).json({
            success: true,
            message: 'Employee deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete employee',
            error: error.message,
        });
    }
});
exports.deleteEmployee = deleteEmployee;
