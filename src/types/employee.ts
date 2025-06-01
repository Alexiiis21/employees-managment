export interface Employee {
    id: string;
    name: string;
    phone: string;
    address: string;
    email: string; 
    position: string;
    department: string;
    dateOfJoining: string;
    status: "Active" | "Inactive" | "On Leave";
    hireDate: string; 
}

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: "ADMIN" | "USER";
}