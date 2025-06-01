import { Request, Response } from 'express';
import prisma from '../lib/prisma'; 

// Create a new employee
export const createEmployee = async (req: Request, res: Response) => {
  try {

        console.log("Datos recibidos:", req.body);

    const { name, email, phone, address, position, department, dateOfJoining, status } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    // Create employee record
    const employee = await prisma.employee.create({
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
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create employee',
      error: (error as Error).message,
    });
  }
};

// Get all employees
export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees',
      error: (error as Error).message,
    });
  }
};


// Update an existing employee
export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, position, department, dateOfJoining, status } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!existingEmployee) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID ${id} not found`,
      });
    }

    // Update employee record
    const updatedEmployee = await prisma.employee.update({
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
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update employee',
      error: (error as Error).message,
    });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!existingEmployee) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID ${id} not found`,
      });
    }

    // Delete employee record
    await prisma.employee.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee',
      error: (error as Error).message,
    });
  }
};