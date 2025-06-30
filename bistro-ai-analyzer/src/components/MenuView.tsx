
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabaseData } from '@/contexts/SupabaseDataContext';

const MenuView = () => {
  const { menuItems, loading } = useSupabaseData();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const availableItems = menuItems.filter(item => item.available);
  const categories = [...new Set(availableItems.map(item => item.category))];

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="text-slate-800">Restaurant Menu</CardTitle>
      </CardHeader>
      <CardContent>
        {categories.map(category => (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 capitalize">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableItems
                .filter(item => item.category === category)
                .map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <span className="text-blue-600 font-semibold">₹{item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      available
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
        
        {availableItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No menu items available.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MenuView;
