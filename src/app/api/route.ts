import { Employee } from '@/types/employee';
import axios from 'axios';

// Define the API base URL - adjust if your Express API runs on a different port
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Status mapping between frontend and backend
const mapStatusToApi = (status: string): string => {
  switch (status) {
    case 'Active': return 'ACTIVE';
    case 'Inactive': return 'INACTIVE';
    case 'On Leave': return 'ON_LEAVE';
    default: return 'ACTIVE';
  }
};

const mapStatusFromApi = (status: string): 'Active' | 'Inactive' | 'On Leave' => {
  switch (status) {
    case 'ACTIVE': return 'Active';
    case 'INACTIVE': return 'Inactive';
    case 'ON_LEAVE': return 'On Leave';
    default: return 'Active';
  }
};

// Create a new employee
export const createEmployee = async (employeeData: Employee) => {
  try {
    const apiData = {
      name: employeeData.name,
      email: employeeData.email,
      position: employeeData.position,
      department: employeeData.department,
      status: mapStatusToApi(employeeData.status),
      dateOfJoining: employeeData.hireDate, // API uses dateOfJoining, frontend uses hireDate
      phone: employeeData.phone,
      address: employeeData.address,
    };

    const response = await axios.post(`${API_URL}/employees`, apiData);
    return response.data;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

// Fetch all employees
export const fetchEmployees = async () => {
  try {
    const response = await axios.get(`${API_URL}/employees`);
    
    // Transform API response to match frontend format
    const transformedEmployees = response.data.data.map((emp: Employee) => ({
      id: emp.id,
      name: emp.name,
      email: emp.email || '',
      position: emp.position || '',
      department: emp.department || '',
      status: mapStatusFromApi(emp.status),
      hireDate: emp.dateOfJoining || '',
    }));
    
    return transformedEmployees;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};