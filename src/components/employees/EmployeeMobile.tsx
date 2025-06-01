import React, { useState } from 'react';
import { Pencil, Trash2, ChevronDown, ChevronRight, Phone, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from './StatusBadge';
import { Employee } from '@/types/employee';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface EmployeeMobileListProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const EmployeeMobileList: React.FC<EmployeeMobileListProps> = ({
  employees,
  onEdit,
  onDelete
}) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRowExpand = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="divide-y">
      {employees.map((employee) => (
        <Collapsible 
          key={employee.id} 
          open={expandedRows[employee.id]}
          onOpenChange={() => toggleRowExpand(employee.id)}
          className="px-4 py-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback>
                  {employee.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{employee.name}</p>
                <p className="text-sm text-muted-foreground">{employee.position}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <StatusBadge status={employee.status} />
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon">
                  {expandedRows[employee.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          
          <CollapsibleContent className="mt-2">
            <div className="grid gap-2 pl-12">
              <div className="grid grid-cols-3 items-center text-sm">
                <span className="text-muted-foreground">Email:</span>
                <span className="col-span-2">{employee.email}</span>
              </div>
              
              <div className="grid grid-cols-3 items-center text-sm">
                <span className="text-muted-foreground">Phone:</span>
                <span className="col-span-2 flex items-center">
                  <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                  {employee.phone || 'N/A'}
                </span>
              </div>
              
              <div className="grid grid-cols-3 items-center text-sm">
                <span className="text-muted-foreground">Address:</span>
                <span className="col-span-2 flex items-center">
                  <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                  {employee.address || 'N/A'}
                </span>
              </div>
              
              <div className="grid grid-cols-3 items-center text-sm">
                <span className="text-muted-foreground">Department:</span>
                <span className="col-span-2">{employee.department}</span>
              </div>
              
              <div className="grid grid-cols-3 items-center text-sm">
                <span className="text-muted-foreground">Hire Date:</span>
                <span className="col-span-2">
                  {employee.hireDate ? 
                    new Date(employee.hireDate).toLocaleDateString() : 
                    (employee.dateOfJoining ? 
                      new Date(employee.dateOfJoining).toLocaleDateString() : 
                      'N/A')
                  }
                </span>
              </div>
              
              <div className="flex justify-end space-x-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-blue-600"
                  onClick={() => onEdit(employee)}
                >
                  <Pencil className="h-3 w-3 mr-1" /> Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-600"
                  onClick={() => onDelete(employee)}
                >
                  <Trash2 className="h-3 w-3 mr-1" /> Delete
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};