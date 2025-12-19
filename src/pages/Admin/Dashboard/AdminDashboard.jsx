import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  BarChart3,
  TrendingUp,
  Users,
  Package,
  CreditCard,
  Watch,
  Shield,
  Settings,
  PlusCircle,
  Edit3,
  Trash2,
  Eye,
  Download,
  Filter,
  Search,
  Calendar,
  DollarSign,
  PieChart,
  BarChart,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical,
  RefreshCw,
  Upload,
  Bell,
  User,
  LogOut,
  Zap,
  Home,
  ShoppingBag,
  Tag,
  Layers,
  Database,
  Truck,
  MessageSquare,
  FileText,
  Globe,
  Star,
  Award,
  Clock,
  Heart,
  ShoppingCart,
  TrendingDown,
  Target
} from 'lucide-react';

const AdminDashboard = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    activeAdmins: 0,
    lowStockItems: 0,
    pendingOrders: 0,
    todayRevenue: 0
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [adminActivities, setAdminActivities] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Modal states
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // Form states
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    description: '',
    images: []
  });
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('soleitic_admin_token');
      // console.log("Token is : ", token)
      
      const [
        statsRes,
        ordersRes,
        productsRes,
        topProductsRes,
        activitiesRes,
        salesRes
      ] = await Promise.all([
        axios.get('/api/admin/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/admin/orders/recent?limit=5', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/admin/inventory/low-stock?limit=5', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/admin/products/top-selling?limit=5', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/admin/activities/recent?limit=10', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/admin/analytics/sales?period=7d', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats(statsRes.data.data);
      setRecentOrders(ordersRes.data.data);
      setLowStockProducts(productsRes.data.data);
      setTopProducts(topProductsRes.data.data);
      setAdminActivities(activitiesRes.data.data);
      setSalesData(salesRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load dashboard data'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      const token = localStorage.getItem('soleitic_admin_token');
      await axios.post('/api/admin/products', newProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Product added successfully'
      });
      setShowAddProductModal(false);
      setNewProduct({
        name: '',
        brand: '',
        category: '',
        price: '',
        description: '',
        images: []
      });
      fetchDashboardData();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to add product'
      });
    }
  };

  const handleUpdateProduct = async () => {
    try {
      const token = localStorage.getItem('soleitic_admin_token');
      await axios.put(`/api/admin/products/${selectedProduct._id}`, selectedProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Product updated successfully'
      });
      setShowEditProductModal(false);
      fetchDashboardData();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update product'
      });
    }
  };

  const handleDeleteProduct = async (productId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('soleitic_admin_token');
        await axios.delete(`/api/admin/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        Swal.fire('Deleted!', 'Product has been deleted.', 'success');
        fetchDashboardData();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to delete product'
        });
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('soleitic_admin_token');
      await axios.put(`/api/admin/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Order status updated'
      });
      fetchDashboardData();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update order'
      });
    }
  };

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <div className={`SoleiTic-Admin-Dashboard-stat-card ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="SoleiTic-Admin-Dashboard-stat-icon" style={{ backgroundColor: `${color}20` }}>
        <Icon size={24} color={color} />
      </div>
      <div className="SoleiTic-Admin-Dashboard-stat-content">
        <h3>{title}</h3>
        <div className="SoleiTic-Admin-Dashboard-stat-value">{value}</div>
        {change && (
          <div className={`SoleiTic-Admin-Dashboard-stat-change ${change > 0 ? 'positive' : 'negative'}`}>
            {change > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`SoleiTic-Admin-Dashboard-loading ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="SoleiTic-Admin-Dashboard-loader"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className={`SoleiTic-Admin-Dashboard-container ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Header */}
      <header className="SoleiTic-Admin-Dashboard-header">
        <div className="SoleiTic-Admin-Dashboard-header-left">
          <h1>SoleiTic Admin Dashboard</h1>
          <p className="SoleiTic-Admin-Dashboard-subtitle">
            Luxury Watch Management Portal • Real-time Analytics & Control
          </p>
        </div>
        <div className="SoleiTic-Admin-Dashboard-header-right">
          <button className="SoleiTic-Admin-Dashboard-refresh-btn" onClick={fetchDashboardData}>
            <RefreshCw size={20} />
            Refresh
          </button>
          <div className="SoleiTic-Admin-Dashboard-admin-info">
            <User size={20} />
            <span>Admin User</span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="SoleiTic-Admin-Dashboard-tabs">
        {['overview', 'products', 'orders', 'customers', 'inventory', 'analytics', 'settings'].map((tab) => (
          <button
            key={tab}
            className={`SoleiTic-Admin-Dashboard-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' && <Home size={18} />}
            {tab === 'products' && <Package size={18} />}
            {tab === 'orders' && <ShoppingBag size={18} />}
            {tab === 'customers' && <Users size={18} />}
            {tab === 'inventory' && <Database size={18} />}
            {tab === 'analytics' && <BarChart3 size={18} />}
            {tab === 'settings' && <Settings size={18} />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="SoleiTic-Admin-Dashboard-main">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="SoleiTic-Admin-Dashboard-stats-grid">
              <StatCard
                icon={DollarSign}
                title="Total Revenue"
                value={`$${stats.totalRevenue?.toLocaleString() || '0'}`}
                change={12.5}
                color="#10B981"
              />
              <StatCard
                icon={ShoppingBag}
                title="Total Orders"
                value={stats.totalOrders?.toLocaleString() || '0'}
                change={8.3}
                color="#3B82F6"
              />
              <StatCard
                icon={Watch}
                title="Total Products"
                value={stats.totalProducts?.toLocaleString() || '0'}
                change={5.2}
                color="#8B5CF6"
              />
              <StatCard
                icon={Users}
                title="Total Customers"
                value={stats.totalCustomers?.toLocaleString() || '0'}
                change={15.7}
                color="#EC4899"
              />
              <StatCard
                icon={Shield}
                title="Active Admins"
                value={stats.activeAdmins?.toLocaleString() || '0'}
                color="#F59E0B"
              />
              <StatCard
                icon={AlertCircle}
                title="Low Stock Items"
                value={stats.lowStockItems?.toLocaleString() || '0'}
                change={-3.2}
                color="#EF4444"
              />
              <StatCard
                icon={Clock}
                title="Pending Orders"
                value={stats.pendingOrders?.toLocaleString() || '0'}
                change={2.1}
                color="#F97316"
              />
              <StatCard
                icon={Target}
                title="Today's Revenue"
                value={`$${stats.todayRevenue?.toLocaleString() || '0'}`}
                change={18.4}
                color="#06B6D4"
              />
            </div>

            {/* Charts and Tables Grid */}
            <div className="SoleiTic-Admin-Dashboard-content-grid">
              {/* Sales Chart */}
              <div className={`SoleiTic-Admin-Dashboard-card ${isDarkMode ? 'dark' : 'light'}`}>
                <div className="SoleiTic-Admin-Dashboard-card-header">
                  <h3><BarChart3 /> Sales Analytics</h3>
                  <select className="SoleiTic-Admin-Dashboard-period-select">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Last Quarter</option>
                    <option>Last Year</option>
                  </select>
                </div>
                <div className="SoleiTic-Admin-Dashboard-chart">
                  <div className="SoleiTic-Admin-Dashboard-chart-placeholder">
                    {/* In production, integrate with Chart.js or similar */}
                    <BarChart size={48} />
                    <p>Interactive chart showing sales trends over selected period</p>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className={`SoleiTic-Admin-Dashboard-card ${isDarkMode ? 'dark' : 'light'}`}>
                <div className="SoleiTic-Admin-Dashboard-card-header">
                  <h3><ShoppingBag /> Recent Orders</h3>
                  <button className="SoleiTic-Admin-Dashboard-view-all">View All</button>
                </div>
                <div className="SoleiTic-Admin-Dashboard-table-container">
                  <table className="SoleiTic-Admin-Dashboard-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order._id}>
                          <td>#{order.orderNumber}</td>
                          <td>{order.customerName}</td>
                          <td>${order.total?.toFixed(2)}</td>
                          <td>
                            <span className={`SoleiTic-Admin-Dashboard-status-badge ${order.status}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="SoleiTic-Admin-Dashboard-action-btn"
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderDetailsModal(true);
                              }}
                            >
                              <Eye size={16} />
                            </button>
                            <button className="SoleiTic-Admin-Dashboard-action-btn">
                              <Edit3 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Low Stock Products */}
              <div className={`SoleiTic-Admin-Dashboard-card ${isDarkMode ? 'dark' : 'light'}`}>
                <div className="SoleiTic-Admin-Dashboard-card-header">
                  <h3><AlertCircle /> Low Stock Alert</h3>
                  <button 
                    className="SoleiTic-Admin-Dashboard-add-btn"
                    onClick={() => setShowInventoryModal(true)}
                  >
                    <PlusCircle size={18} /> Manage
                  </button>
                </div>
                <div className="SoleiTic-Admin-Dashboard-table-container">
                  <table className="SoleiTic-Admin-Dashboard-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>SKU</th>
                        <th>Current Stock</th>
                        <th>Threshold</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockProducts.map((product) => (
                        <tr key={product._id}>
                          <td>
                            <div className="SoleiTic-Admin-Dashboard-product-info">
                              <img 
                                src={product.image || '/api/placeholder/40/40'} 
                                alt={product.name}
                                className="SoleiTic-Admin-Dashboard-product-img"
                              />
                              <span>{product.name}</span>
                            </div>
                          </td>
                          <td>{product.sku}</td>
                          <td>
                            <span className={`SoleiTic-Admin-Dashboard-stock-level ${product.stock <= 5 ? 'critical' : 'low'}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td>{product.threshold}</td>
                          <td>
                            <button 
                              className="SoleiTic-Admin-Dashboard-action-btn"
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowEditProductModal(true);
                              }}
                            >
                              <Edit3 size={16} />
                            </button>
                            <button 
                              className="SoleiTic-Admin-Dashboard-action-btn danger"
                              onClick={() => handleDeleteProduct(product._id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Products */}
              <div className={`SoleiTic-Admin-Dashboard-card ${isDarkMode ? 'dark' : 'light'}`}>
                <div className="SoleiTic-Admin-Dashboard-card-header">
                  <h3><Star /> Top Selling Products</h3>
                  <button 
                    className="SoleiTic-Admin-Dashboard-add-btn"
                    onClick={() => setShowAddProductModal(true)}
                  >
                    <PlusCircle size={18} /> Add New
                  </button>
                </div>
                <div className="SoleiTic-Admin-Dashboard-top-products">
                  {topProducts.map((product, index) => (
                    <div key={product._id} className="SoleiTic-Admin-Dashboard-top-product-item">
                      <div className="SoleiTic-Admin-Dashboard-rank">{index + 1}</div>
                      <img 
                        src={product.image || '/api/placeholder/50/50'} 
                        alt={product.name}
                        className="SoleiTic-Admin-Dashboard-product-img"
                      />
                      <div className="SoleiTic-Admin-Dashboard-product-details">
                        <h4>{product.name}</h4>
                        <p>{product.brand}</p>
                      </div>
                      <div className="SoleiTic-Admin-Dashboard-sales-info">
                        <span className="SoleiTic-Admin-Dashboard-sales-count">
                          {product.sold} sold
                        </span>
                        <span className="SoleiTic-Admin-Dashboard-revenue">
                          ${product.revenue?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activities */}
              <div className={`SoleiTic-Admin-Dashboard-card ${isDarkMode ? 'dark' : 'light'}`}>
                <div className="SoleiTic-Admin-Dashboard-card-header">
                  <h3><Activity /> Recent Activities</h3>
                </div>
                <div className="SoleiTic-Admin-Dashboard-activities">
                  {adminActivities.map((activity) => (
                    <div key={activity._id} className="SoleiTic-Admin-Dashboard-activity-item">
                      <div className="SoleiTic-Admin-Dashboard-activity-icon">
                        {activity.action === 'login' && <User size={16} />}
                        {activity.action === 'create' && <PlusCircle size={16} />}
                        {activity.action === 'update' && <Edit3 size={16} />}
                        {activity.action === 'delete' && <Trash2 size={16} />}
                      </div>
                      <div className="SoleiTic-Admin-Dashboard-activity-content">
                        <p>{activity.description}</p>
                        <span className="SoleiTic-Admin-Dashboard-activity-time">
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className={`SoleiTic-Admin-Dashboard-card ${isDarkMode ? 'dark' : 'light'}`}>
                <div className="SoleiTic-Admin-Dashboard-card-header">
                  <h3><Zap /> Quick Actions</h3>
                </div>
                <div className="SoleiTic-Admin-Dashboard-quick-actions">
                  <button 
                    className="SoleiTic-Admin-Dashboard-quick-action-btn"
                    onClick={() => setShowAddProductModal(true)}
                  >
                    <PlusCircle size={20} />
                    <span>Add Product</span>
                  </button>
                  <button 
                    className="SoleiTic-Admin-Dashboard-quick-action-btn"
                    onClick={() => setShowOrderDetailsModal(true)}
                  >
                    <ShoppingBag size={20} />
                    <span>Process Orders</span>
                  </button>
                  <button 
                    className="SoleiTic-Admin-Dashboard-quick-action-btn"
                    onClick={() => setShowCustomerModal(true)}
                  >
                    <Users size={20} />
                    <span>Manage Customers</span>
                  </button>
                  <button 
                    className="SoleiTic-Admin-Dashboard-quick-action-btn"
                    onClick={() => setShowSettingsModal(true)}
                  >
                    <Settings size={20} />
                    <span>Settings</span>
                  </button>
                  <button className="SoleiTic-Admin-Dashboard-quick-action-btn">
                    <Download size={20} />
                    <span>Export Data</span>
                  </button>
                  <button className="SoleiTic-Admin-Dashboard-quick-action-btn">
                    <FileText size={20} />
                    <span>Generate Report</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className={`SoleiTic-Admin-Dashboard-card ${isDarkMode ? 'dark' : 'light'}`}>
            <div className="SoleiTic-Admin-Dashboard-card-header">
              <h3><Package /> Product Management</h3>
              <div className="SoleiTic-Admin-Dashboard-actions">
                <button 
                  className="SoleiTic-Admin-Dashboard-primary-btn"
                  onClick={() => setShowAddProductModal(true)}
                >
                  <PlusCircle size={18} /> Add Product
                </button>
                <div className="SoleiTic-Admin-Dashboard-search">
                  <Search size={18} />
                  <input type="text" placeholder="Search products..." />
                </div>
                <button className="SoleiTic-Admin-Dashboard-action-btn">
                  <Filter size={18} />
                </button>
              </div>
            </div>
            {/* Product table would go here */}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className={`SoleiTic-Admin-Dashboard-card ${isDarkMode ? 'dark' : 'light'}`}>
            <div className="SoleiTic-Admin-Dashboard-card-header">
              <h3><ShoppingBag /> Order Management</h3>
              {/* Order management content */}
            </div>
          </div>
        )}
      </main>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="SoleiTic-Admin-Dashboard-modal-overlay">
          <div className={`SoleiTic-Admin-Dashboard-modal ${isDarkMode ? 'dark' : 'light'}`}>
            <div className="SoleiTic-Admin-Dashboard-modal-header">
              <h3><PlusCircle /> Add New Product</h3>
              <button 
                className="SoleiTic-Admin-Dashboard-modal-close"
                onClick={() => setShowAddProductModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="SoleiTic-Admin-Dashboard-modal-body">
              <div className="SoleiTic-Admin-Dashboard-form-group">
                <label>Product Name</label>
                <input 
                  type="text" 
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="Enter product name"
                />
              </div>
              <div className="SoleiTic-Admin-Dashboard-form-group">
                <label>Brand</label>
                <select 
                  value={newProduct.brand}
                  onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                >
                  <option value="">Select Brand</option>
                  <option value="rolex">Rolex</option>
                  <option value="omega">Omega</option>
                  <option value="patek">Patek Philippe</option>
                  <option value="audemars">Audemars Piguet</option>
                </select>
              </div>
              <div className="SoleiTic-Admin-Dashboard-form-group">
                <label>Category</label>
                <select 
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                >
                  <option value="">Select Category</option>
                  <option value="luxury">Luxury</option>
                  <option value="sports">Sports</option>
                  <option value="dress">Dress</option>
                  <option value="diving">Diving</option>
                </select>
              </div>
              <div className="SoleiTic-Admin-Dashboard-form-group">
                <label>Price ($)</label>
                <input 
                  type="number" 
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  placeholder="Enter price"
                />
              </div>
              <div className="SoleiTic-Admin-Dashboard-form-group">
                <label>Description</label>
                <textarea 
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  rows="4"
                  placeholder="Enter product description"
                />
              </div>
              <div className="SoleiTic-Admin-Dashboard-form-group">
                <label>Upload Images</label>
                <div className="SoleiTic-Admin-Dashboard-upload-area">
                  <Upload size={24} />
                  <p>Drag & drop images or click to browse</p>
                </div>
              </div>
            </div>
            <div className="SoleiTic-Admin-Dashboard-modal-footer">
              <button 
                className="SoleiTic-Admin-Dashboard-secondary-btn"
                onClick={() => setShowAddProductModal(false)}
              >
                Cancel
              </button>
              <button 
                className="SoleiTic-Admin-Dashboard-primary-btn"
                onClick={handleAddProduct}
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProductModal && selectedProduct && (
        <div className="SoleiTic-Admin-Dashboard-modal-overlay">
          <div className={`SoleiTic-Admin-Dashboard-modal ${isDarkMode ? 'dark' : 'light'}`}>
            <div className="SoleiTic-Admin-Dashboard-modal-header">
              <h3><Edit3 /> Edit Product</h3>
              <button 
                className="SoleiTic-Admin-Dashboard-modal-close"
                onClick={() => setShowEditProductModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="SoleiTic-Admin-Dashboard-modal-body">
              {/* Similar form fields as add product */}
            </div>
            <div className="SoleiTic-Admin-Dashboard-modal-footer">
              <button 
                className="SoleiTic-Admin-Dashboard-secondary-btn"
                onClick={() => setShowEditProductModal(false)}
              >
                Cancel
              </button>
              <button 
                className="SoleiTic-Admin-Dashboard-primary-btn"
                onClick={handleUpdateProduct}
              >
                Update Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderDetailsModal && selectedOrder && (
        <div className="SoleiTic-Admin-Dashboard-modal-overlay">
          <div className={`SoleiTic-Admin-Dashboard-modal large ${isDarkMode ? 'dark' : 'light'}`}>
            <div className="SoleiTic-Admin-Dashboard-modal-header">
              <h3><ShoppingBag /> Order Details #{selectedOrder.orderNumber}</h3>
              <button 
                className="SoleiTic-Admin-Dashboard-modal-close"
                onClick={() => setShowOrderDetailsModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="SoleiTic-Admin-Dashboard-modal-body">
              {/* Order details content */}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="SoleiTic-Admin-Dashboard-footer">
        <p>SoleiTic Luxury Watches Admin Dashboard v2.0 • © {new Date().getFullYear()} All Rights Reserved</p>
        <div className="SoleiTic-Admin-Dashboard-footer-links">
          <span>Last Updated: {new Date().toLocaleString()}</span>
          <span>Server Status: <span className="status-online">Online</span></span>
          <span>Version: 2.1.4</span>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;