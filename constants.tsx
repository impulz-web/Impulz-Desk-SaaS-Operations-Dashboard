
import { KPIData, Task, ChartDataPoint, FinanceEntry, User } from './types';

export const COLORS = {
  primary: '#6366f1', // Indigo 500
  secondary: '#94a3b8', // Slate 400
  success: '#10b981', // Emerald 500
  warning: '#f59e0b', // Amber 500
  error: '#ef4444', // Red 500
  bg: '#f8fafc',
};

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Alex Sterling', email: 'founder@flowdesk.com', role: 'Admin', status: 'Active', department: 'Executive', lastLogin: '2023-11-20 09:45' },
  { id: '2', name: 'Sarah Chen', email: 'sarah.c@flowdesk.com', role: 'Manager', status: 'Active', department: 'Operations', lastLogin: '2023-11-20 10:12' },
  { id: '3', name: 'Alex Miller', email: 'alex.m@flowdesk.com', role: 'Staff', status: 'Active', department: 'Customer Success', lastLogin: '2023-11-19 16:30' },
  { id: '4', name: 'Marcus Aurelius', email: 'marcus@flowdesk.com', role: 'Staff', status: 'Pending', department: 'Marketing', lastLogin: '-' },
  { id: '5', name: 'Elena Rodriguez', email: 'elena@flowdesk.com', role: 'Guest', status: 'Inactive', department: 'Consultancy', lastLogin: '2023-10-05 11:00' },
];

export const MOCK_FINANCE_ENTRIES: FinanceEntry[] = [
  { id: 'f1', type: 'revenue', amount: 4000, date: '2023-01-15', category: 'Sales' },
  { id: 'f2', type: 'expense', amount: 2400, date: '2023-01-20', category: 'Payroll' },
  { id: 'f3', type: 'revenue', amount: 3000, date: '2023-02-10', category: 'Subscription' },
  { id: 'f4', type: 'expense', amount: 1398, date: '2023-02-25', category: 'Tools' },
  { id: 'f5', type: 'revenue', amount: 2000, date: '2023-03-05', category: 'Service' },
  { id: 'f6', type: 'expense', amount: 9800, date: '2023-03-28', category: 'Operations' },
  { id: 'f7', type: 'revenue', amount: 2780, date: '2023-04-12', category: 'Sales' },
  { id: 'f8', type: 'expense', amount: 3908, date: '2023-04-22', category: 'Marketing' },
  { id: 'f9', type: 'revenue', amount: 1890, date: '2023-05-02', category: 'Subscription' },
  { id: 'f10', type: 'expense', amount: 4800, date: '2023-05-18', category: 'Payroll' },
  { id: 'f11', type: 'revenue', amount: 2390, date: '2023-06-14', category: 'Sales' },
  { id: 'f12', type: 'expense', amount: 3800, date: '2023-06-25', category: 'Operations' },
  { id: 'f13', type: 'revenue', amount: 3490, date: '2023-07-10', category: 'Service' },
  { id: 'f14', type: 'expense', amount: 4300, date: '2023-07-28', category: 'Marketing' },
];

export const MOCK_KPI_DATA: KPIData[] = [
  { label: 'Monthly Revenue', value: '$45,231.00', trend: 12.5, type: 'currency' },
  { label: 'Active Tasks', value: '124', trend: -4.2, type: 'number' },
  { label: 'Operational Efficiency', value: '92%', trend: 2.1, type: 'percentage' },
  { label: 'Customer Growth', value: '18%', trend: 5.4, type: 'percentage' },
];

export const MOCK_TASKS: Task[] = [
  { 
    id: '1', 
    title: 'Q3 Financial Audit Preparation', 
    description: 'Gather all receipts and bank statements from July to September. Ensure reconciliation is complete before the external audit starts.',
    assignee: 'Sarah Chen', 
    status: 'In Progress', 
    priority: 'High', 
    dueDate: '2023-11-15',
    createdAt: '2023-10-01'
  },
  { 
    id: '2', 
    title: 'Update Onboarding Documentation', 
    description: 'The current onboarding slides are outdated. We need to include the new HR policy and the updated benefits package overview.',
    assignee: 'Alex Miller', 
    status: 'Todo', 
    priority: 'Medium', 
    dueDate: '2023-11-20',
    createdAt: '2023-10-05'
  },
  { 
    id: '3', 
    title: 'Fix Dashboard Loading Latency', 
    description: 'Users are reporting slow load times on the main dashboard. Investigation suggests some SQL queries are not indexed properly.',
    assignee: 'Dev Team', 
    status: 'Review', 
    priority: 'High', 
    dueDate: '2023-11-12',
    createdAt: '2023-10-10'
  },
  { 
    id: '4', 
    title: 'New Customer Success Playbook', 
    description: 'Draft the 2024 playbook for high-touch accounts. Include strategies for retention and upsell opportunities.',
    assignee: 'Sarah Chen', 
    status: 'Done', 
    priority: 'Low', 
    dueDate: '2023-11-10',
    createdAt: '2023-09-15'
  },
  { 
    id: '5', 
    title: 'Final Website Content Audit', 
    description: 'Please review the new landing page copy and imagery. Specifically check the mobile responsiveness of the hero section.',
    assignee: 'Marcus Aurelius', 
    status: 'Review', 
    priority: 'Medium', 
    dueDate: '2023-11-18',
    createdAt: '2023-11-01'
  },
];
