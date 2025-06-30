
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { message } = await req.json();

    // Fetch restaurant data for analysis
    const { data: orders } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    const { data: menuItems } = await supabase
      .from('menu_items')
      .select('*');

    // Process data for AI analysis
    const totalOrders = orders?.length || 0;
    const paidOrders = orders?.filter(order => order.status === 'paid') || [];
    const totalRevenue = paidOrders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);

    // Top selling items analysis
    const itemSales: { [key: string]: { count: number; revenue: number; name: string } } = {};
    paidOrders.forEach(order => {
      order.order_items?.forEach((item: any) => {
        if (!itemSales[item.menu_item_id]) {
          itemSales[item.menu_item_id] = { count: 0, revenue: 0, name: item.menu_item_name };
        }
        itemSales[item.menu_item_id].count += item.quantity;
        itemSales[item.menu_item_id].revenue += parseFloat(item.total);
      });
    });

    const topItems = Object.values(itemSales)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Peak hours analysis
    const hourlyOrders: { [hour: number]: number } = {};
    orders?.forEach(order => {
      const hour = new Date(order.created_at).getHours();
      hourlyOrders[hour] = (hourlyOrders[hour] || 0) + 1;
    });

    const peakHour = Object.entries(hourlyOrders)
      .sort(([,a], [,b]) => b - a)[0];

    // Prepare context for AI
    const analysisData = {
      totalOrders,
      totalRevenue: totalRevenue.toFixed(2),
      averageOrderValue: totalOrders > 0 ? (totalRevenue / paidOrders.length).toFixed(2) : '0',
      topSellingItems: topItems.slice(0, 5),
      peakHour: peakHour ? `${peakHour[0]}:00 with ${peakHour[1]} orders` : 'No data',
      menuItemsCount: menuItems?.length || 0,
      statusDistribution: {
        pending: orders?.filter(o => o.status === 'pending').length || 0,
        preparing: orders?.filter(o => o.status === 'preparing').length || 0,
        ready: orders?.filter(o => o.status === 'ready').length || 0,
        delivered: orders?.filter(o => o.status === 'delivered').length || 0,
        paid: paidOrders.length,
        cancelled: orders?.filter(o => o.status === 'cancelled').length || 0
      }
    };

    const systemPrompt = `You are an AI restaurant business analyst assistant. You have access to real restaurant data and should provide insights, suggestions, and analysis based on the following data:

Restaurant Analytics Data:
- Total Orders: ${analysisData.totalOrders}
- Total Revenue: ₹${analysisData.totalRevenue}
- Average Order Value: ₹${analysisData.averageOrderValue}
- Total Menu Items: ${analysisData.menuItemsCount}
- Peak Hour: ${analysisData.peakHour}

Top Selling Items:
${analysisData.topSellingItems.map((item, i) => `${i+1}. ${item.name} - ${item.count} orders, ₹${item.revenue.toFixed(2)} revenue`).join('\n')}

Order Status Distribution:
- Pending: ${analysisData.statusDistribution.pending}
- Preparing: ${analysisData.statusDistribution.preparing}
- Ready: ${analysisData.statusDistribution.ready}
- Delivered: ${analysisData.statusDistribution.delivered}
- Paid: ${analysisData.statusDistribution.paid}
- Cancelled: ${analysisData.statusDistribution.cancelled}

Provide helpful insights about:
- Menu optimization suggestions
- Peak hour staffing recommendations
- Revenue improvement strategies
- Popular vs underperforming items
- Operational efficiency tips
- Customer service improvements

Be concise, actionable, and data-driven in your responses. Use the actual data provided to give specific recommendations.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error');
    }

    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in restaurant-ai-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
