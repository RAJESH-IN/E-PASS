// ── Employee ──────────────────────────────────────────────────────────
export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  personType: 'Employee' | 'Contractor';
  company?: string;
  department?: string;
  jobTitle?: string;
  badgeNumber?: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  photoUrl?: string;
  startDate?: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployee {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  personType: string;
  company?: string;
  department?: string;
  jobTitle?: string;
  badgeNumber?: string;
  status: string;
  photoUrl?: string;
  startDate?: string;
  expiryDate?: string;
}

// ── Equipment ─────────────────────────────────────────────────────────
export interface Equipment {
  id: number;
  name: string;
  category: string;
  serialNumber?: string;
  assetTag?: string;
  manufacturer?: string;
  model?: string;
  location?: string;
  assignedToId?: number;
  assignedToName?: string;
  status: 'Available' | 'In Use' | 'Maintenance' | 'Retired';
  purchaseDate?: string;
  warrantyExpiry?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEquipment {
  name: string;
  category: string;
  serialNumber?: string;
  assetTag?: string;
  manufacturer?: string;
  model?: string;
  location?: string;
  assignedToId?: number;
  status: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  notes?: string;
}

// ── Vehicle ───────────────────────────────────────────────────────────
export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  color?: string;
  vehicleType: string;
  department?: string;
  assignedToId?: number;
  assignedToName?: string;
  status: 'Available' | 'In Use' | 'Maintenance' | 'Out of Service';
  insuranceExpiry?: string;
  registrationExp?: string;
  odometer: number;
  fuelType?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicle {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  color?: string;
  vehicleType: string;
  department?: string;
  assignedToId?: number;
  status: string;
  insuranceExpiry?: string;
  registrationExp?: string;
  odometer: number;
  fuelType?: string;
  notes?: string;
}

// ── API Wrapper ───────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface SearchResult {
  employees: Employee[];
  equipment: Equipment[];
  vehicles: Vehicle[];
}

export type SearchCategory = 'All' | 'Employees' | 'Contractors' | 'Equipment' | 'Vehicles';
