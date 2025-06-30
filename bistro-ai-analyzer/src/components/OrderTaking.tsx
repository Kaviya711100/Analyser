
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabaseData } from '@/contexts/SupabaseDataContext';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { OrderItem } from '@/types/order';

const OrderTaking = () => {
  const { menuItems, addOrder, loading } = useSupabaseData();
  const { user } = useSupabaseAuth();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [tableNumber, setTableNumber] = useState('');

  const availableItems = menuItems.filter(item => item.available);
  const categories = [...new Set(availableItems.map(item => item.category))];

  const addItemToOrder = (menuItemId: string) => {
    const menuItem = menuItems.find(item => item.id === menuItemId);
    if (!menuItem) return;

    const existingItem = orderItems.find(item => item.menuItemId === menuItemId);
    
    if (existingItem) {
      setOrderItems(prev => prev.map(item => 
        item.menuItemId === menuItemId 
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      setOrderItems(prev => [...prev, {
        menuItemId: menuItem.id,
        menuItemName: menuItem.name,
        quantity: 1,
        price: menuItem.price,
        total: menuItem.price
      }]);
    }
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setOrderItems(prev => prev.filter(item => item.menuItemId !== menuItemId));
    } else {
      setOrderItems(prev => prev.map(item => 
        item.menuItemId === menuItemId 
          ? { ...item, quantity, total: quantity * item.price }
          : item
      ));
    }
  };

  const getTotalAmount = () => {
    return orderItems.reduce((sum, item) => sum + item.total, 0);
  };

  const handlePlaceOrder = async () => {
    if (orderItems.length === 0 || !tableNumber) return;

    await addOrder({
      customerName: `Table ${tableNumber}`,
      customerPhone: '',
      items: orderItems,
      totalAmount: getTotalAmount(),
      status: 'pending',
      orderType: 'dine-in',
      tableNumber: tableNumber,
      notes: '',
      takenBy: user?.name || 'Staff'
    });

    // Reset form
    setOrderItems([]);
    setTableNumber('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Menu Items */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-slate-800">Menu Items</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.map(category => (
            <div key={category} className="mb-6">
              <h3 className="font-semibold text-lg mb-3 text-blue-600 capitalize">{category}</h3>
              <div className="space-y-2">
                {availableItems
                  .filter(item => item.category === category)
                  .map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-slate-600">{item.description}</p>
                        <p className="text-blue-600 font-semibold">₹{item.price.toFixed(2)}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addItemToOrder(item.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Add
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          ))}
          
          {availableItems.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No menu items available. Please contact the manager.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-slate-800">Current Order</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Table Number */}
            <div>
              <Label htmlFor="tableNumber">Table Number *</Label>
              <Input
                id="tableNumber"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Enter table number"
              />
            </div>

            {/* Order Items */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Order Items</h3>
              {orderItems.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No items added yet</p>
              ) : (
                <div className="space-y-2">
                  {orderItems.map(item => (
                    <div key={item.menuItemId} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <div>
                        <span className="font-medium">{item.menuItemName}</span>
                        <span className="text-slate-600 ml-2">₹{item.price.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                        >
                          +
                        </Button>
                        <span className="ml-2 font-semibold">₹{item.total.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total and Submit */}
            {orderItems.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-xl font-bold text-blue-600">₹{getTotalAmount().toFixed(2)}</span>
                </div>
                <Button
                  onClick={handlePlaceOrder}
                  disabled={!tableNumber || orderItems.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Place Order
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderTaking;
