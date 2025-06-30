
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSupabaseData } from '@/contexts/SupabaseDataContext';
import { MenuItem } from '@/types/menu';

const MenuManagement = () => {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, loading } = useSupabaseData();
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    price: 0,
    description: '',
    available: true
  });

  const categories = [...new Set(menuItems.map(item => item.category))];

  const handleAddItem = async () => {
    if (newItem.name && newItem.category && newItem.price > 0) {
      await addMenuItem(newItem);
      setNewItem({ name: '', category: '', price: 0, description: '', available: true });
      setIsAddingItem(false);
    }
  };

  const toggleAvailability = async (item: MenuItem) => {
    await updateMenuItem(item.id, { available: !item.available });
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      await deleteMenuItem(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show menu creation form if no menu items exist
  if (menuItems.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Create Your Menu</CardTitle>
            <p className="text-slate-600">Start by adding your first menu item to get started.</p>
          </CardHeader>
          <CardContent>
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h3 className="text-lg font-semibold mb-4">Add New Menu Item</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="itemName">Item Name</Label>
                  <Input
                    id="itemName"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Enter item name"
                  />
                </div>
                <div>
                  <Label htmlFor="itemCategory">Category</Label>
                  <Input
                    id="itemCategory"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    placeholder="e.g., Appetizers, Main Course, Beverages"
                  />
                </div>
                <div>
                  <Label htmlFor="itemPrice">Price (₹)</Label>
                  <Input
                    id="itemPrice"
                    type="number"
                    step="0.01"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="itemAvailable">Availability</Label>
                  <Select 
                    value={newItem.available.toString()} 
                    onValueChange={(value) => setNewItem({ ...newItem, available: value === 'true' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Available</SelectItem>
                      <SelectItem value="false">Not Available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="itemDescription">Description</Label>
                  <Textarea
                    id="itemDescription"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Describe the item..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddItem} className="bg-blue-600 hover:bg-blue-700">
                  Add Item
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show category-wise menu view
  return (
    <div className="space-y-6">
      <Card className="border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-800">Menu Management</CardTitle>
            <Button 
              onClick={() => setIsAddingItem(true)} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add New Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAddingItem && (
            <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h3 className="text-lg font-semibold mb-4">Add New Menu Item</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="itemName">Item Name</Label>
                  <Input
                    id="itemName"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Enter item name"
                  />
                </div>
                <div>
                  <Label htmlFor="itemCategory">Category</Label>
                  <Input
                    id="itemCategory"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    placeholder="e.g., Appetizers, Main Course, Beverages"
                  />
                </div>
                <div>
                  <Label htmlFor="itemPrice">Price (₹)</Label>
                  <Input
                    id="itemPrice"
                    type="number"
                    step="0.01"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="itemAvailable">Availability</Label>
                  <Select 
                    value={newItem.available.toString()} 
                    onValueChange={(value) => setNewItem({ ...newItem, available: value === 'true' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Available</SelectItem>
                      <SelectItem value="false">Not Available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="itemDescription">Description</Label>
                  <Textarea
                    id="itemDescription"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Describe the item..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddItem} className="bg-blue-600 hover:bg-blue-700">
                  Add Item
                </Button>
                <Button onClick={() => setIsAddingItem(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Category-wise menu display */}
          <div className="space-y-8">
            {categories.map(category => (
              <div key={category} className="border border-slate-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-blue-600 mb-4 capitalize">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menuItems
                    .filter(item => item.category === category)
                    .map(item => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-800">{item.name}</h3>
                          <span className="text-blue-600 font-semibold">₹{item.price.toFixed(2)}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                        <div className="flex justify-between items-center">
                          <span className={`inline-block px-2 py-1 text-xs rounded ${
                            item.available 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.available ? 'Available' : 'Unavailable'}
                          </span>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleAvailability(item)}
                            >
                              {item.available ? 'Disable' : 'Enable'}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuManagement;
