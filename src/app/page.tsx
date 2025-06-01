'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Navbar } from '@/components/Navbar';
import { EmployeeTable } from '@/components/employees/EmployeeTable';
import { EmployeeForm } from '@/components/employees/EmployeeForm';
import { DeleteConfirmation } from '@/components/employees/DeleteConfirmation';
import { Employee } from '@/types/employee';
import { EmployeeMobileList } from '@/components/employees/EmployeeMobile';

// API configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Status mapping helpers
const mapStatusToApi = (status: string): string => {
  switch (status) {
    case 'Active': return 'ACTIVE';
    case 'Inactive': return 'INACTIVE';
    case 'On Leave': return 'ON_LEAVE';
    default: return 'ACTIVE';
  }
};

const mapStatusFromApi = (apiStatus: string): 'Active' | 'Inactive' | 'On Leave' => {
  switch (apiStatus) {
    case 'ACTIVE': return 'Active';
    case 'INACTIVE': return 'Inactive';
    case 'ON_LEAVE': return 'On Leave';
    default: return 'Active';
  }
};

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/api/employees`);
        
        // Transform API response to match frontend format
        const transformedEmployees = response.data.data.map((emp: Employee) => ({
          id: emp.id,
          name: emp.name,
          email: emp.email || '',
          phone: emp.phone || '',
          address: emp.address || '',
          position: emp.position || '',
          department: emp.department || '',
          status: mapStatusFromApi(emp.status),
          dateOfJoining: emp.dateOfJoining || '',
          hireDate: emp.dateOfJoining || '',
        }));
        
        setEmployees(transformedEmployees);
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast.error("Failed to load employees. Please try again later.");
        
        // Use sample data as fallback
        setEmployees([
          {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@company.com',
            phone: '555-1234',
            address: '123 Main St',
            position: 'Software Engineer',
            department: 'Engineering',
            status: 'Active',
            dateOfJoining: '2022-01-15',
            hireDate: '2022-01-15',
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Filter employees based on search term
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.phone && employee.phone.includes(searchTerm)) ||
      (employee.address && employee.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle employee creation
  const handleAddEmployee = async (newEmployee: Omit<Employee, 'id'>) => {
    try {
      // Transform data for API
      const apiData = {
        name: newEmployee.name,
        email: newEmployee.email,
        phone: newEmployee.phone,
        address: newEmployee.address,
        position: newEmployee.position,
        department: newEmployee.department,
        status: mapStatusToApi(newEmployee.status),
        dateOfJoining: newEmployee.hireDate || newEmployee.dateOfJoining,
      };

      // Call API to create employee
      const response = await axios.post(`${API_URL}/employees`, apiData);
      
      // Add the newly created employee to the state
      const createdEmployee = response.data.data;
      const newEmployeeForState: Employee = {
        id: createdEmployee.id,
        name: createdEmployee.name,
        email: createdEmployee.email || '',
        phone: createdEmployee.phone || '',
        address: createdEmployee.address || '',
        position: createdEmployee.position || '',
        department: createdEmployee.department || '',
        status: mapStatusFromApi(createdEmployee.status),
        dateOfJoining: createdEmployee.dateOfJoining || '',
        hireDate: createdEmployee.dateOfJoining || '',
      };
      
      setEmployees([...employees, newEmployeeForState]);
      setShowAddModal(false);
      toast.success("Employee created successfully!");
      
      return true;
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error("Failed creating employee. Please try again later.");
      return false;
    }
  };

  // Handle employee update
  const handleUpdateEmployee = async (employee: Employee) => {
    try {
      // Transform data for API
      const apiData = {
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        address: employee.address,
        position: employee.position,
        department: employee.department,
        status: mapStatusToApi(employee.status),
        dateOfJoining: employee.hireDate || employee.dateOfJoining,
      };

      // Call API to update employee
      await axios.put(`${API_URL}/employees/${employee.id}`, apiData);
      
      // Update local state
      setEmployees(
        employees.map((emp) => emp.id === employee.id ? employee : emp)
      );
      
      setShowEditModal(false);
      setCurrentEmployee(null);
      
      toast.success("Employee updated successfully!");
      return true;
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error("Failed to update employee. Please try again later.");
      return false;
    }
  };

  // Handle employee deletion
  const handleDeleteEmployee = async () => {
    if (!currentEmployee) return false;
    
    try {
      // Call API to delete employee
      await axios.delete(`${API_URL}/employees/${currentEmployee.id}`);
      
      // Update local state
      setEmployees(employees.filter((emp) => emp.id !== currentEmployee.id));
      
      setShowDeleteModal(false);
      setCurrentEmployee(null);
      
      toast.success("Employee deleted successfully!");
      return true;
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error("Failed to delete employee. Please try again later.");
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Navbar 
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onAddClick={() => setShowAddModal(true)}
      />
      <main className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]" />
              <p className="mt-2 text-muted-foreground">Loading employees...</p>
            </div>
          ) : filteredEmployees.length > 0 ? (
            isMobile ? (
              <EmployeeMobileList 
                employees={filteredEmployees}
                onEdit={(employee: Employee) => {
                  setCurrentEmployee(employee);
                  setShowEditModal(true);
                }}
                onDelete={(employee: Employee) => {
                  setCurrentEmployee(employee);
                  setShowDeleteModal(true);
                }}
              />
            ) : (
              <EmployeeTable 
                employees={filteredEmployees} 
                onEdit={(employee) => {
                  setCurrentEmployee(employee);
                  setShowEditModal(true);
                }}
                onDelete={(employee) => {
                  setCurrentEmployee(employee);
                  setShowDeleteModal(true);
                }}
              />
            )
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No employees found matching your search.</p>
            </div>
          )}
        </div>
      </main>

      {/* Add Employee Modal */}
      {showAddModal && (
        <EmployeeForm
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddEmployee}
          title="Add New Employee"
          submitButtonText="Add Employee"
        />
      )}

      {/* Edit Employee Modal */}
      {showEditModal && currentEmployee && (
        <EmployeeForm
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={(data) => handleUpdateEmployee({...data, id: currentEmployee.id})}
          initialData={currentEmployee}
          title="Edit Employee"
          submitButtonText="Save Changes"
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentEmployee && (
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDeleteEmployee}
          employeeName={currentEmployee.name}
        />
      )}
    </div>
  );
}