import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from './StatusBadge';
import { Employee } from '@/types/employee';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  onEdit,
  onDelete
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Employee</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Hire Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((employee) => (
          <TableRow key={employee.id}>
            <TableCell>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>
                    {employee.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-sm text-muted-foreground">{employee.email}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>{employee.phone || 'N/A'}</TableCell>
            <TableCell>{employee.address || 'N/A'}</TableCell>
            <TableCell>{employee.position}</TableCell>
            <TableCell>{employee.department}</TableCell>
            <TableCell>
              <StatusBadge status={employee.status} />
            </TableCell>
            <TableCell>
              {employee.hireDate ? 
                new Date(employee.hireDate).toLocaleDateString() : 
                (employee.dateOfJoining ? 
                  new Date(employee.dateOfJoining).toLocaleDateString() : 
                  'N/A')
              }
            </TableCell>
            <TableCell className="text-right">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                onClick={() => onEdit(employee)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-red-600 hover:text-red-900 hover:bg-red-50"
                onClick={() => onDelete(employee)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};