// Sample orders data import script
console.log("Starting orders data import...")

// Sample order data
const sampleOrders = [
  {
    order_number: "ORD-2024-001",
    pos_system: "square",
    pos_order_id: "sq_12345",
    customer_name: "John Doe",
    customer_phone: "+91-9876543210",
    customer_email: "john@example.com",
    order_type: "dine_in",
    order_status: "completed",
    subtotal: 850.0,
    tax_amount: 76.5,
    discount_amount: 0,
    delivery_fee: 0,
    total_amount: 926.5,
    payment_method: "card",
    payment_status: "paid",
    table_number: "12",
    order_date: new Date("2024-01-15T19:30:00"),
    estimated_ready_time: new Date("2024-01-15T20:00:00"),
    actual_ready_time: new Date("2024-01-15T19:55:00"),
    items: [
      {
        item_name: "Butter Chicken",
        item_category: "Main Course",
        quantity: 2,
        unit_price: 320.0,
        total_price: 640.0,
        modifications: JSON.stringify(["Extra spicy", "No onions"]),
        special_requests: "Please serve hot",
      },
      {
        item_name: "Garlic Naan",
        item_category: "Bread",
        quantity: 3,
        unit_price: 70.0,
        total_price: 210.0,
        modifications: JSON.stringify([]),
        special_requests: "",
      },
    ],
  },
  {
    order_number: "ORD-2024-002",
    pos_system: "toast",
    pos_order_id: "toast_67890",
    customer_name: "Sarah Wilson",
    customer_phone: "+91-9876543211",
    customer_email: "sarah@example.com",
    order_type: "delivery",
    order_status: "completed",
    subtotal: 1200.0,
    tax_amount: 108.0,
    discount_amount: 120.0,
    delivery_fee: 50.0,
    total_amount: 1238.0,
    payment_method: "upi",
    payment_status: "paid",
    delivery_address: "123 Main Street, Bangalore 560001",
    special_instructions: "Ring the bell twice",
    order_date: new Date("2024-01-15T20:15:00"),
    estimated_ready_time: new Date("2024-01-15T21:00:00"),
    actual_ready_time: new Date("2024-01-15T20:50:00"),
    delivery_time: new Date("2024-01-15T21:20:00"),
    items: [
      {
        item_name: "Chicken Biryani",
        item_category: "Rice",
        quantity: 2,
        unit_price: 450.0,
        total_price: 900.0,
        modifications: JSON.stringify(["Extra raita", "Medium spice"]),
        special_requests: "Pack separately",
      },
      {
        item_name: "Paneer Tikka",
        item_category: "Appetizer",
        quantity: 1,
        unit_price: 300.0,
        total_price: 300.0,
        modifications: JSON.stringify(["Extra mint chutney"]),
        special_requests: "",
      },
    ],
  },
  {
    order_number: "ORD-2024-003",
    pos_system: "square",
    pos_order_id: "sq_11111",
    customer_name: "Mike Chen",
    customer_phone: "+91-9876543212",
    order_type: "takeaway",
    order_status: "completed",
    subtotal: 650.0,
    tax_amount: 58.5,
    discount_amount: 65.0,
    delivery_fee: 0,
    total_amount: 643.5,
    payment_method: "cash",
    payment_status: "paid",
    order_date: new Date("2024-01-15T18:45:00"),
    estimated_ready_time: new Date("2024-01-15T19:15:00"),
    actual_ready_time: new Date("2024-01-15T19:10:00"),
    items: [
      {
        item_name: "Masala Dosa",
        item_category: "South Indian",
        quantity: 2,
        unit_price: 180.0,
        total_price: 360.0,
        modifications: JSON.stringify(["Extra sambar"]),
        special_requests: "Crispy please",
      },
      {
        item_name: "Filter Coffee",
        item_category: "Beverages",
        quantity: 2,
        unit_price: 80.0,
        total_price: 160.0,
        modifications: JSON.stringify(["Less sugar"]),
        special_requests: "",
      },
      {
        item_name: "Vada",
        item_category: "South Indian",
        quantity: 2,
        unit_price: 65.0,
        total_price: 130.0,
        modifications: JSON.stringify([]),
        special_requests: "",
      },
    ],
  },
  {
    order_number: "ORD-2024-004",
    pos_system: "toast",
    pos_order_id: "toast_22222",
    customer_name: "Emma Johnson",
    customer_phone: "+91-9876543213",
    customer_email: "emma@example.com",
    order_type: "dine_in",
    order_status: "completed",
    subtotal: 1450.0,
    tax_amount: 130.5,
    discount_amount: 0,
    delivery_fee: 0,
    total_amount: 1580.5,
    payment_method: "card",
    payment_status: "paid",
    table_number: "8",
    order_date: new Date("2024-01-15T19:00:00"),
    estimated_ready_time: new Date("2024-01-15T19:45:00"),
    actual_ready_time: new Date("2024-01-15T19:40:00"),
    items: [
      {
        item_name: "Tandoori Chicken",
        item_category: "Tandoor",
        quantity: 1,
        unit_price: 550.0,
        total_price: 550.0,
        modifications: JSON.stringify(["Full portion", "Medium spice"]),
        special_requests: "Well cooked",
      },
      {
        item_name: "Dal Makhani",
        item_category: "Dal",
        quantity: 1,
        unit_price: 280.0,
        total_price: 280.0,
        modifications: JSON.stringify(["Extra butter"]),
        special_requests: "",
      },
      {
        item_name: "Butter Naan",
        item_category: "Bread",
        quantity: 4,
        unit_price: 75.0,
        total_price: 300.0,
        modifications: JSON.stringify([]),
        special_requests: "Fresh and hot",
      },
      {
        item_name: "Basmati Rice",
        item_category: "Rice",
        quantity: 2,
        unit_price: 160.0,
        total_price: 320.0,
        modifications: JSON.stringify(["Jeera rice"]),
        special_requests: "",
      },
    ],
  },
  {
    order_number: "ORD-2024-005",
    pos_system: "square",
    pos_order_id: "sq_33333",
    customer_name: "David Kumar",
    customer_phone: "+91-9876543214",
    order_type: "delivery",
    order_status: "completed",
    subtotal: 890.0,
    tax_amount: 80.1,
    discount_amount: 89.0,
    delivery_fee: 40.0,
    total_amount: 921.1,
    payment_method: "wallet",
    payment_status: "paid",
    delivery_address: "456 Park Avenue, Mumbai 400001",
    special_instructions: "Leave at door",
    order_date: new Date("2024-01-15T20:30:00"),
    estimated_ready_time: new Date("2024-01-15T21:15:00"),
    actual_ready_time: new Date("2024-01-15T21:10:00"),
    delivery_time: new Date("2024-01-15T21:45:00"),
    items: [
      {
        item_name: "Chicken Curry",
        item_category: "Main Course",
        quantity: 1,
        unit_price: 350.0,
        total_price: 350.0,
        modifications: JSON.stringify(["Boneless", "Mild spice"]),
        special_requests: "Extra gravy",
      },
      {
        item_name: "Mutton Biryani",
        item_category: "Rice",
        quantity: 1,
        unit_price: 480.0,
        total_price: 480.0,
        modifications: JSON.stringify(["Extra raita", "Boiled egg"]),
        special_requests: "Pack rice and curry separately",
      },
      {
        item_name: "Gulab Jamun",
        item_category: "Dessert",
        quantity: 2,
        unit_price: 30.0,
        total_price: 60.0,
        modifications: JSON.stringify([]),
        special_requests: "Warm",
      },
    ],
  },
]

// Sample analytics data
const sampleAnalytics = [
  {
    pos_system: "square",
    date_range: "daily",
    period_start: "2024-01-15",
    period_end: "2024-01-15",
    total_orders: 4247,
    total_revenue: 142750.0,
    avg_order_value: 33.62,
    dine_in_orders: 1911,
    dine_in_revenue: 64237.5,
    takeaway_orders: 1486,
    takeaway_revenue: 49962.5,
    delivery_orders: 850,
    delivery_revenue: 28550.0,
    peak_hour_start: "19:00:00",
    peak_hour_end: "21:00:00",
    peak_hour_orders: 1274,
    top_selling_items: JSON.stringify([
      { name: "Butter Chicken", orders: 156 },
      { name: "Garlic Naan", orders: 134 },
      { name: "Chicken Biryani", orders: 98 },
      { name: "Paneer Tikka", orders: 87 },
    ]),
    payment_methods: JSON.stringify({
      card: { count: 2758, percentage: 65 },
      upi: { count: 1062, percentage: 25 },
      cash: { count: 424, percentage: 10 },
    }),
  },
  {
    pos_system: "toast",
    date_range: "daily",
    period_start: "2024-01-15",
    period_end: "2024-01-15",
    total_orders: 8600,
    total_revenue: 142000.0,
    avg_order_value: 16.51,
    dine_in_orders: 3870,
    dine_in_revenue: 63840.0,
    takeaway_orders: 3010,
    takeaway_revenue: 49680.0,
    delivery_orders: 1720,
    delivery_revenue: 28480.0,
    peak_hour_start: "12:00:00",
    peak_hour_end: "14:00:00",
    peak_hour_orders: 2580,
    top_selling_items: JSON.stringify([
      { name: "Masala Dosa", orders: 234 },
      { name: "Filter Coffee", orders: 198 },
      { name: "Idli Sambar", orders: 176 },
      { name: "Vada", orders: 145 },
    ]),
    payment_methods: JSON.stringify({
      upi: { count: 4300, percentage: 50 },
      card: { count: 2580, percentage: 30 },
      cash: { count: 1720, percentage: 20 },
    }),
  },
]

// Simulate data insertion
console.log("Inserting sample orders...")
sampleOrders.forEach((order, index) => {
  console.log(`Order ${index + 1}: ${order.order_number} - ${order.order_type} - ₹${order.total_amount}`)
  order.items.forEach((item, itemIndex) => {
    console.log(`  Item ${itemIndex + 1}: ${item.quantity}x ${item.item_name} - ₹${item.total_price}`)
  })
})

console.log("\nInserting analytics data...")
sampleAnalytics.forEach((analytics, index) => {
  console.log(
    `Analytics ${index + 1}: ${analytics.pos_system} - ${analytics.total_orders} orders - ₹${analytics.total_revenue}`,
  )
})

console.log("\nOrders data import completed successfully!")
console.log(`Total orders imported: ${sampleOrders.length}`)
console.log(`Total analytics records: ${sampleAnalytics.length}`)

// Summary statistics
const totalRevenue = sampleOrders.reduce((sum, order) => sum + order.total_amount, 0)
const avgOrderValue = totalRevenue / sampleOrders.length
const orderTypes = sampleOrders.reduce((acc, order) => {
  acc[order.order_type] = (acc[order.order_type] || 0) + 1
  return acc
}, {})

console.log("\n--- Import Summary ---")
console.log(`Total Revenue: ₹${totalRevenue.toFixed(2)}`)
console.log(`Average Order Value: ₹${avgOrderValue.toFixed(2)}`)
console.log("Order Types:", orderTypes)
console.log("POS Systems:", [...new Set(sampleOrders.map((o) => o.pos_system))])
