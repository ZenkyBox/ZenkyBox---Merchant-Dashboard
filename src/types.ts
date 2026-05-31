export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: 'Active' | 'Draft';
  category: 'Kids' | 'Corporate' | 'Birthday' | 'Personalized';
  description: string;
  image: string;
  itemsInside: string[];
}

export interface Inquiry {
  id: string;
  fullName: string;
  companyName: string;
  eventType: string;
  quantity: number;
  deliveryDate: string;
  requirements: string;
  status: 'New' | 'Replied' | 'Completed';
  createdAt: string;
}

export interface BoxDesign {
  id: string;
  name: string;
  image: string;
  description: string;
}

export interface CustomBox {
  designId: string;
  message: string;
  recipientName: string;
  photos: string[];
  vibe: string;
}

export interface RecentOrder {
  id: string;
  customer: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  total: number;
  date: string;
}
