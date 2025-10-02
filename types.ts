
export enum Role {
  Customer = 'CUSTOMER',
  Admin = 'ADMIN',
}

export enum Category {
  Coffee = 'Coffee',
  Dessert = 'Dessert',
}

export enum OrderStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Ready = 'Ready',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export interface MenuItem {
  id: number;
  name: string;
  category: Category;
  price: number;
  imageUrl: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: number;
  notes?: string;
}