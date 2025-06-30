
export interface OrderItem {
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled' | 'paid';
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  tableNumber?: string;
  notes?: string;
  createdAt: Date;
  takenBy: string;
}
