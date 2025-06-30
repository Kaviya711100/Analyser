
export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  available: boolean;
  createdAt: Date;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}
