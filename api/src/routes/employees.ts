import express from 'express';
import { createEmployee, deleteEmployee, getAllEmployees, updateEmployee } from '../controllers/employee';

const router = express.Router();

router.post('/', createEmployee);

router.get('/', getAllEmployees);

router.put('/:id', updateEmployee);

router.delete('/:id', deleteEmployee);

export default router;