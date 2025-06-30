import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MenuItem } from '@/types/menu';
import { Order } from '@/types/order';
import { useToast } from '@/hooks/use-toast';

interface SupabaseDataContextType {
  menuItems: MenuItem[];
  orders: Order[];
  addMenuItem: (item: Omit<MenuItem, 'id' | 'createdAt'>) => Promise<void>;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  loading: boolean;
  refreshData: () => Promise<void>;
}

const SupabaseDataContext = createContext<SupabaseDataContextType | undefined>(undefined);

export const SupabaseDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedItems: MenuItem[] = data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: parseFloat(item.price.toString()),
        category: item.category,
        available: item.available || false,
        createdAt: new Date(item.created_at || '')
      }));

      setMenuItems(formattedItems);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast({
        title: "Error",
        description: "Failed to fetch menu items",
        variant: "destructive"
      });
    }
  };

  const fetchOrders = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      const formattedOrders: Order[] = ordersData.map(order => ({
        id: order.id,
        customerName: order.customer_name,
        customerPhone: order.customer_phone || '',
        tableNumber: order.table_number || '',
        orderType: order.order_type as Order['orderType'],
        status: order.status as Order['status'],
        totalAmount: parseFloat(order.total_amount.toString()),
        notes: order.notes || '',
        takenBy: order.taken_by,
        createdAt: new Date(order.created_at),
        items: order.order_items.map((item: any) => ({
          menuItemId: item.menu_item_id || '',
          menuItemName: item.menu_item_name,
          quantity: item.quantity,
          price: parseFloat(item.price.toString()),
          total: parseFloat(item.total.toString())
        }))
      }));

      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive"
      });
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchMenuItems(), fetchOrders()]);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();

    // Set up real-time subscription for orders
    const ordersChannel = supabase
      .channel('orders-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders'
      }, () => {
        fetchOrders();
      })
      .subscribe();

    const menuChannel = supabase
      .channel('menu-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'menu_items'
      }, () => {
        fetchMenuItems();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(menuChannel);
    };
  }, []);

  const addMenuItem = async (item: Omit<MenuItem, 'id' | 'createdAt'>) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .insert({
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          available: item.available
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Menu item added successfully"
      });

      await fetchMenuItems();
    } catch (error) {
      console.error('Error adding menu item:', error);
      toast({
        title: "Error",
        description: "Failed to add menu item",
        variant: "destructive"
      });
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({
          name: updates.name,
          description: updates.description,
          price: updates.price,
          category: updates.category,
          available: updates.available
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Menu item updated successfully"
      });

      await fetchMenuItems();
    } catch (error) {
      console.error('Error updating menu item:', error);
      toast({
        title: "Error",
        description: "Failed to update menu item",
        variant: "destructive"
      });
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Menu item deleted successfully"
      });

      await fetchMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive"
      });
    }
  };

  const addOrder = async (order: Omit<Order, 'id' | 'createdAt'>) => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: order.customerName,
          customer_phone: order.customerPhone,
          table_number: order.tableNumber,
          order_type: order.orderType,
          status: order.status,
          total_amount: order.totalAmount,
          notes: order.notes,
          taken_by: order.takenBy
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Add order items
      const orderItemsToInsert = order.items.map(item => ({
        order_id: orderData.id,
        menu_item_id: item.menuItemId,
        menu_item_name: item.menuItemName,
        quantity: item.quantity,
        price: item.price,
        total: item.total
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (itemsError) throw itemsError;

      toast({
        title: "Success",
        description: "Order placed successfully"
      });

      await fetchOrders();
    } catch (error) {
      console.error('Error adding order:', error);
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive"
      });
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      console.log('Updating order status:', { id, status });
      
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Update successful:', data);

      toast({
        title: "Success",
        description: status === 'paid' ? "Order marked as paid successfully" : "Order status updated successfully"
      });

      await fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: `Failed to update order status: ${error.message || 'Unknown error'}`,
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order completed and removed"
      });

      await fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: "Error",
        description: "Failed to complete order",
        variant: "destructive"
      });
    }
  };

  return (
    <SupabaseDataContext.Provider value={{
      menuItems,
      orders,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      addOrder,
      updateOrderStatus,
      deleteOrder,
      loading,
      refreshData
    }}>
      {children}
    </SupabaseDataContext.Provider>
  );
};

export const useSupabaseData = () => {
  const context = useContext(SupabaseDataContext);
  if (context === undefined) {
    throw new Error('useSupabaseData must be used within a SupabaseDataProvider');
  }
  return context;
};
