import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Employee } from '@/types/employee';

interface StatusBadgeProps {
  status: Employee['status'];
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let variant: "outline" | "default" | "destructive" | "secondary" = "default";
  
  switch (status) {
    case 'Active':
      variant = "default";
      break;
    case 'Inactive':
      variant = "destructive";
      break;
    case 'On Leave':
      variant = "secondary";
      break;
  }

  return <Badge variant={variant}>{status}</Badge>;
};