import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, MapPin, DollarSign, Clock, Star, Bell, Check, X } from 'lucide-react';

const LeftoverFoodApp = () => {
  const [currentView, setCurrentView] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    category: '',
    freshness: '',
    priceRange: '',
    halal: ''
  });
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [checkoutData, setCheckoutData] = useState({
    paymentMethod: '',
    pickupTime: ''
  });

  // Mock food items data
  const [foodItems] = useState([
    {
      id: 1,
      name: 'Fresh Bakery Bundle',
      merchant: 'Corner Bakery',
      location: 'Downtown',
      category: 'Bakery',
      freshness: 'Same Day',
      price: 25.99,
      originalPrice: 69.99,
      image: '🥖',
      available: true,
      description: 'Assorted breads and pastries',
      pickupTimes: ['5:00 PM', '6:00 PM', '7:00 PM'],
      halal: true,
      expirationDate: 'Jan 14, 2026'
    },
    {
      id: 2,
      name: 'Veggie Surplus Box',
      merchant: 'Green Grocer',
      location: 'Midtown',
      category: 'Vegetables',
      freshness: 'Fresh',
      price: 39.99,
      originalPrice: 89.00,
      image: '🥗',
      available: true,
      description: 'Mixed seasonal vegetables',
      pickupTimes: ['4:00 PM', '5:00 PM', '6:00 PM'],
      halal: true,
      expirationDate: 'Jan 15, 2026'
    },
    {
      id: 3,
      name: 'Pizza Slices',
      merchant: 'Marios Pizzeria',
      location: 'Downtown',
      category: 'Prepared Food',
      freshness: 'Today',
      price: 19.50,
      originalPrice: 52.00,
      image: '🍕',
      available: true,
      description: '4 assorted pizza slices',
      pickupTimes: ['8:00 PM', '9:00 PM'],
      halal: false,
      expirationDate: 'Jan 14, 2026'
    },
    {
      id: 4,
      name: 'Fruit Mix',
      merchant: 'Fresh Market',
      location: 'Uptown',
      category: 'Fruits',
      freshness: 'Fresh',
      price: 30.99,
      originalPrice: 70.00,
      image: '🍎',
      available: true,
      description: 'Seasonal fruit assortment',
      pickupTimes: ['3:00 PM', '4:00 PM', '5:00 PM'],
      halal: true,
      expirationDate: 'Jan 16, 2026'
    }
  ]);

  // Filter and search logic
  const filteredItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.merchant.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !filters.location || item.location === filters.location;
    const matchesCategory = !filters.category || item.category === filters.category;
    const matchesFreshness = !filters.freshness || item.freshness === filters.freshness;
    const matchesHalal = !filters.halal || 
                        (filters.halal === 'halal' && item.halal) ||
                        (filters.halal === 'non-halal' && !item.halal);
    const matchesPrice = !filters.priceRange || 
                        (filters.priceRange === 'under5' && item.price < 22) ||
                        (filters.priceRange === '5to10' && item.price >= 22 && item.price <= 44) ||
                        (filters.priceRange === 'over10' && item.price > 44);
    
    return matchesSearch && matchesLocation && matchesCategory && matchesFreshness && matchesHalal && matchesPrice;
  });

  const addToCart = (item) => {
    setCart([...cart, { ...item, cartId: Date.now() }]);
    addNotification('Item added to cart!', 'success');
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const addNotification = (message, type = 'info') => {
    const newNotif = { id: Date.now(), message, type, read: false };
    setNotifications([newNotif, ...notifications]);
  };

  const placeOrder = () => {
    if (!checkoutData.paymentMethod || !checkoutData.pickupTime) {
      alert('Please select payment method and pickup time');
      return;
    }

    const newOrder = {
      id: Date.now(),
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price, 0),
      paymentMethod: checkoutData.paymentMethod,
      pickupTime: checkoutData.pickupTime,
      status: 'confirmed',
      date: new Date().toLocaleDateString(),
      rated: false
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    setCheckoutData({ paymentMethod: '', pickupTime: '' });
    setCurrentView('orders');
    addNotification(`Order #${newOrder.id} confirmed! Pickup at ${newOrder.pickupTime}`, 'success');
  };

  const submitRating = (orderId, rating, feedback) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, rating, feedback, rated: true }
        : order
    ));
    addNotification('Thank you for your feedback!', 'success');
  };

  // Browse View
  const BrowseView = () => (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search for food..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={20} className="text-gray-600" />
          <h3 className="font-semibold">Filters</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
          >
            <option value="">All Locations</option>
            <option value="Downtown">Downtown</option>
            <option value="Midtown">Midtown</option>
            <option value="Uptown">Uptown</option>
          </select>

          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="">All Categories</option>
            <option value="Bakery">Bakery</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Prepared Food">Prepared Food</option>
          </select>

          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            value={filters.freshness}
            onChange={(e) => setFilters({...filters, freshness: e.target.value})}
          >
            <option value="">All Freshness</option>
            <option value="Fresh">Fresh</option>
            <option value="Same Day">Same Day</option>
            <option value="Today">Today</option>
          </select>

          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            value={filters.halal}
            onChange={(e) => setFilters({...filters, halal: e.target.value})}
          >
            <option value="">All Food</option>
            <option value="halal">Halal Only</option>
            <option value="non-halal">Non-Halal</option>
          </select>

          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm col-span-2"
            value={filters.priceRange}
            onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
          >
            <option value="">All Prices</option>
            <option value="under5">Under RM22</option>
            <option value="5to10">RM22 - RM44</option>
            <option value="over10">Over RM44</option>
          </select>
        </div>
      </div>

      {/* Food Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="text-4xl">{item.image}</div>
                <div className="flex flex-col gap-1 items-end">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    {item.freshness}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.halal ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {item.halal ? '✓ Halal' : 'Non-Halal'}
                  </span>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-1">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                <MapPin size={14} />
                <span>{item.merchant} • {item.location}</span>
              </div>
              <div className="text-sm text-gray-500 mb-1">{item.category}</div>
              <div className="text-xs text-orange-600 mb-3 flex items-center gap-1">
                <Clock size={12} />
                <span>Expires: {item.expirationDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-green-600">RM{item.price}</span>
                  <span className="text-sm text-gray-400 line-through ml-2">RM{item.originalPrice}</span>
                </div>
                <button
                  onClick={() => addToCart(item)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <ShoppingCart size={16} />
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No items found matching your criteria
        </div>
      )}
    </div>
  );

  // Cart & Checkout View
  const CartView = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      
      {cart.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Your cart is empty
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {cart.map(item => (
              <div key={item.cartId} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{item.image}</span>
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.merchant}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-green-600">RM{item.price}</span>
                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold mb-3">Payment Method</h3>
            <div className="space-y-2">
              {['Credit Card', 'Debit Card', 'PayPal', 'Apple Pay'].map(method => (
                <label key={method} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={checkoutData.paymentMethod === method}
                    onChange={(e) => setCheckoutData({...checkoutData, paymentMethod: e.target.value})}
                    className="text-green-600"
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold mb-3">Pickup Time</h3>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={checkoutData.pickupTime}
              onChange={(e) => setCheckoutData({...checkoutData, pickupTime: e.target.value})}
            >
              <option value="">Select a time</option>
              {['3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'].map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">RM{cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-green-600">RM{cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={placeOrder}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
          >
            Confirm Payment & Place Order
          </button>
        </>
      )}
    </div>
  );

  // Orders View
  const OrdersView = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No orders yet
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold">Order #{order.id}</h3>
                <p className="text-sm text-gray-600">{order.date}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                {order.status}
              </span>
            </div>

            <div className="space-y-2 mb-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="text-sm flex justify-between">
                  <span>{item.name}</span>
                  <span className="font-semibold">RM{item.price}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Pickup Time:</span>
                <span className="font-semibold">{order.pickupTime}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Payment:</span>
                <span className="font-semibold">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span className="text-green-600">RM{order.total.toFixed(2)}</span>
              </div>
            </div>

            {!order.rated && (
              <RatingForm orderId={order.id} onSubmit={submitRating} />
            )}

            {order.rated && (
              <div className="bg-gray-50 p-3 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="text-yellow-500 fill-yellow-500" size={16} />
                  <span className="font-semibold">Rated: {order.rating}/5</span>
                </div>
                <p className="text-sm text-gray-600">{order.feedback}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  // Rating Form Component
  const RatingForm = ({ orderId, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const handleSubmit = () => {
      if (rating === 0) {
        alert('Please select a rating');
        return;
      }
      onSubmit(orderId, rating, feedback);
      setRating(0);
      setFeedback('');
    };

    return (
      <div className="bg-blue-50 p-3 rounded space-y-3">
        <h4 className="font-semibold text-sm">Rate this order</h4>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <Star
                size={24}
                className={star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
              />
            </button>
          ))}
        </div>
        <textarea
          placeholder="Leave your feedback..."
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          rows="2"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Submit Rating
        </button>
      </div>
    );
  };

  // Notifications View
  const NotificationsView = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      
      {notifications.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No notifications
        </div>
      ) : (
        notifications.map(notif => (
          <div
            key={notif.id}
            className={`p-4 rounded-lg border ${
              notif.type === 'success' ? 'bg-green-50 border-green-200' :
              notif.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
              'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <Bell size={20} className="text-gray-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm">{notif.message}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">FeedBack</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentView('notifications')}
              className="relative"
            >
              <Bell size={24} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto flex">
          <button
            onClick={() => setCurrentView('browse')}
            className={`flex-1 py-3 text-center font-semibold ${
              currentView === 'browse' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'
            }`}
          >
            Browse
          </button>
          <button
            onClick={() => setCurrentView('cart')}
            className={`flex-1 py-3 text-center font-semibold relative ${
              currentView === 'cart' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'
            }`}
          >
            Cart
            {cart.length > 0 && (
              <span className="absolute top-2 right-1/3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setCurrentView('orders')}
            className={`flex-1 py-3 text-center font-semibold ${
              currentView === 'orders' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'
            }`}
          >
            Orders
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4">
        {currentView === 'browse' && <BrowseView />}
        {currentView === 'cart' && <CartView />}
        {currentView === 'orders' && <OrdersView />}
        {currentView === 'notifications' && <NotificationsView />}
      </main>
    </div>
  );
};

export default LeftoverFoodApp;
