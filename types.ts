
export type UserRole = 'Admin' | 'Manager' | 'Staff' | 'Guest';
export type UserStatus = 'Active' | 'Inactive' | 'Pending';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  department?: string;
  lastLogin?: string;
  avatar?: string;
}

export interface Company {
  name: string;
  industry: string;
  size: string;
}

export type TaskStatus = 'Todo' | 'In Progress' | 'Review' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  tags?: string[];
}

export interface KPIData {
  label: string;
  value: string;
  trend: number;
  type: 'currency' | 'number' | 'percentage';
}

export interface ChartDataPoint {
  name: string;
  revenue: number;
  expenses: number;
}

export type FinanceType = 'revenue' | 'expense';

export interface FinanceEntry {
  id: string;
  type: FinanceType;
  amount: number;
  date: string;
  category: string;
  notes?: string;
}
