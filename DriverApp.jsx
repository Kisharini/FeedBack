import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Clock, CheckCircle, Package, Navigation, Phone, AlertCircle } from 'lucide-react';

// Main Driver App Component
const DriverApp = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [tasks, setTasks] = useState({
    available: [
      {
        id: 1,
        orderNumber: 'ORD-2401',
        merchantName: 'Olive Garden Restaurant',
        merchantAddress: '123 Main St, Klang',
        merchantPhone: '+60 12-345 6789',
        recipientName: 'Sarah Ahmad',
        recipientAddress: '456 Park Lane, Shah Alam',
        recipientPhone: '+60 11-222 3333',
        recipientType: 'Customer',
        foodItems: ['Pasta Carbonara (2 portions)', 'Garlic Bread (4 pieces)'],
        pickupTime: '2:30 PM',
        estimatedDistance: '3.2 km',
        priority: 'high',
        expiryTime: '4:00 PM'
      },
      {
        id: 2,
        orderNumber: 'ORD-2402',
        merchantName: 'Green Leaf Café',
        merchantAddress: '789 Garden Ave, Petaling Jaya',
        merchantPhone: '+60 13-456 7890',
        recipientName: 'Food Bank Selangor',
        recipientAddress: '321 Charity Road, Subang Jaya',
        recipientPhone: '+60 14-555 6666',
        recipientType: 'NGO',
        foodItems: ['Mixed Sandwiches (10 pcs)', 'Fresh Salads (5 boxes)'],
        pickupTime: '3:00 PM',
        estimatedDistance: '5.1 km',
        priority: 'medium',
        expiryTime: '5:30 PM'
      }
    ],
    ongoing: [],
    completed: []
  });

  // Mock user data
  const driverProfile = {
    name: 'Ahmad Ibrahim',
    id: 'DRV-001',
    rating: 4.8,
    totalDeliveries: 127,
    vehicle: 'Motorcycle'
  };

  const acceptTask = (task) => {
    setTasks(prev => ({
      ...prev,
      available: prev.available.filter(t => t.id !== task.id),
      ongoing: [...prev.ongoing, { ...task, status: 'accepted', acceptedTime: new Date().toLocaleTimeString() }]
    }));
    setActiveTab('ongoing');
  };

  const startPickup = (task) => {
    setTasks(prev => ({
      ...prev,
      ongoing: prev.ongoing.map(t => 
        t.id === task.id ? { ...t, status: 'picking-up' } : t
      )
    }));
  };

  const completePickup = (task) => {
    setSelectedTask(task);
    setShowUploadModal(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmPickup = () => {
    if (uploadedImage && selectedTask) {
      setTasks(prev => ({
        ...prev,
        ongoing: prev.ongoing.map(t => 
          t.id === selectedTask.id ? { ...t, status: 'delivering', pickupProof: uploadedImage } : t
        )
      }));
      setShowUploadModal(false);
      setUploadedImage(null);
      setSelectedTask(null);
    }
  };

  const completeDelivery = (task) => {
    setTasks(prev => ({
      ...prev,
      ongoing: prev.ongoing.filter(t => t.id !== task.id),
      completed: [...prev.completed, { 
        ...task, 
        status: 'completed', 
        completedTime: new Date().toLocaleTimeString(),
        completedDate: new Date().toLocaleDateString()
      }]
    }));
    setActiveTab('completed');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9f5e9 100%)',
      fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
        padding: '1.5rem',
        boxShadow: '0 4px 20px rgba(255, 107, 53, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'white',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.5rem',
                color: '#FF6B35',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                F
              </div>
              <div>
                <h1 style={{ 
                  margin: 0, 
                  color: 'white', 
                  fontSize: '1.8rem', 
                  fontWeight: 800,
                  letterSpacing: '-0.5px'
                }}>
                  Feedback
                </h1>
                <p style={{ 
                  margin: 0, 
                  color: 'rgba(255,255,255,0.9)', 
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}>
                  Giving Surplus a Purpose
                </p>
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
              <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>
                {driverProfile.name}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>
                ⭐ {driverProfile.rating} • {driverProfile.totalDeliveries} deliveries
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <StatsCard 
            icon={<Package size={24} />}
            label="Available Tasks"
            value={tasks.available.length}
            color="#FF6B35"
          />
          <StatsCard 
            icon={<Navigation size={24} />}
            label="Ongoing"
            value={tasks.ongoing.length}
            color="#4CAF50"
          />
          <StatsCard 
            icon={<CheckCircle size={24} />}
            label="Completed Today"
            value={tasks.completed.length}
            color="#2196F3"
          />
        </div>

        {/* Tab Navigation */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '0.5rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          display: 'flex',
          gap: '0.5rem'
        }}>
          <TabButton 
            active={activeTab === 'available'} 
            onClick={() => setActiveTab('available')}
            count={tasks.available.length}
          >
            Available Tasks
          </TabButton>
          <TabButton 
            active={activeTab === 'ongoing'} 
            onClick={() => setActiveTab('ongoing')}
            count={tasks.ongoing.length}
          >
            Ongoing
          </TabButton>
          <TabButton 
            active={activeTab === 'completed'} 
            onClick={() => setActiveTab('completed')}
            count={tasks.completed.length}
          >
            Completed
          </TabButton>
        </div>

        {/* Task Lists */}
        {activeTab === 'available' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {tasks.available.length === 0 ? (
              <EmptyState message="No available tasks at the moment" />
            ) : (
              tasks.available.map(task => (
                <AvailableTaskCard 
                  key={task.id} 
                  task={task} 
                  onAccept={() => acceptTask(task)}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'ongoing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {tasks.ongoing.length === 0 ? (
              <EmptyState message="No ongoing deliveries" />
            ) : (
              tasks.ongoing.map(task => (
                <OngoingTaskCard 
                  key={task.id} 
                  task={task}
                  onStartPickup={() => startPickup(task)}
                  onCompletePickup={() => completePickup(task)}
                  onCompleteDelivery={() => completeDelivery(task)}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'completed' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {tasks.completed.length === 0 ? (
              <EmptyState message="No completed deliveries yet" />
            ) : (
              tasks.completed.map(task => (
                <CompletedTaskCard key={task.id} task={task} />
              ))
            )}
          </div>
        )}
      </main>

      {/* Upload Proof Modal */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{
              margin: '0 0 1.5rem 0',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#2C3E50'
            }}>
              Upload Pickup Proof
            </h3>
            
            <div style={{
              border: '2px dashed #FF6B35',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              marginBottom: '1.5rem',
              background: uploadedImage ? 'transparent' : '#FFF8F5'
            }}>
              {uploadedImage ? (
                <img 
                  src={uploadedImage} 
                  alt="Upload preview" 
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: '8px'
                  }}
                />
              ) : (
                <>
                  <Camera size={48} color="#FF6B35" style={{ marginBottom: '1rem' }} />
                  <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
                    Take a photo of the collected food
                  </p>
                </>
              )}
            </div>

            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="image-upload"
            />
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadedImage(null);
                }}
                style={{
                  flex: 1,
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '2px solid #E0E0E0',
                  background: 'white',
                  color: '#666',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              {!uploadedImage ? (
                <label
                  htmlFor="image-upload"
                  style={{
                    flex: 1,
                    padding: '1rem',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'center',
                    border: 'none'
                  }}
                >
                  Take Photo
                </label>
              ) : (
                <button
                  onClick={confirmPickup}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none'
                  }}
                >
                  Confirm Pickup
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ icon, label, value, color }) => (
  <div style={{
    background: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    border: '1px solid #f0f0f0',
    transition: 'transform 0.2s',
    cursor: 'pointer'
  }}
  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
  >
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '0.75rem'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color
      }}>
        {icon}
      </div>
      <div>
        <div style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: '#2C3E50',
          lineHeight: 1
        }}>
          {value}
        </div>
      </div>
    </div>
    <div style={{
      color: '#666',
      fontSize: '0.9rem',
      fontWeight: 500
    }}>
      {label}
    </div>
  </div>
);

// Tab Button Component
const TabButton = ({ active, onClick, children, count }) => (
  <button
    onClick={onClick}
    style={{
      flex: 1,
      padding: '0.875rem 1.5rem',
      borderRadius: '12px',
      border: 'none',
      background: active 
        ? 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)' 
        : 'transparent',
      color: active ? 'white' : '#666',
      fontSize: '0.95rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s',
      position: 'relative',
      boxShadow: active ? '0 4px 12px rgba(255, 107, 53, 0.3)' : 'none'
    }}
  >
    {children}
    {count > 0 && (
      <span style={{
        marginLeft: '0.5rem',
        background: active ? 'rgba(255,255,255,0.3)' : '#FF6B35',
        color: active ? 'white' : 'white',
        padding: '0.125rem 0.5rem',
        borderRadius: '10px',
        fontSize: '0.8rem',
        fontWeight: 700
      }}>
        {count}
      </span>
    )}
  </button>
);

// Available Task Card Component
const AvailableTaskCard = ({ task, onAccept }) => {
  const priorityColors = {
    high: { bg: '#FFEBEE', color: '#D32F2F', label: 'Urgent' },
    medium: { bg: '#FFF3E0', color: '#F57C00', label: 'Normal' },
    low: { bg: '#E8F5E9', color: '#388E3C', label: 'Low Priority' }
  };

  const priority = priorityColors[task.priority];

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      padding: '1.5rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '2px solid #f0f0f0',
      transition: 'all 0.3s'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        marginBottom: '1.25rem'
      }}>
        <div>
          <div style={{
            display: 'inline-block',
            background: priority.bg,
            color: priority.color,
            padding: '0.375rem 0.875rem',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '0.75rem'
          }}>
            {priority.label}
          </div>
          <h3 style={{
            margin: '0 0 0.25rem 0',
            fontSize: '1.3rem',
            fontWeight: 700,
            color: '#2C3E50'
          }}>
            {task.orderNumber}
          </h3>
          <div style={{
            color: '#666',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Clock size={16} />
            Pickup: {task.pickupTime} • Expires: {task.expiryTime}
          </div>
        </div>
        <div style={{
          background: task.recipientType === 'NGO' 
            ? 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)'
            : 'linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '10px',
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          {task.recipientType}
        </div>
      </div>

      {/* Merchant Info */}
      <div style={{
        background: '#FFF8F5',
        borderRadius: '12px',
        padding: '1rem',
        marginBottom: '1rem',
        border: '1px solid #FFE8DC'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '0.75rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700
          }}>
            <Package size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontWeight: 700,
              color: '#2C3E50',
              marginBottom: '0.25rem'
            }}>
              {task.merchantName}
            </div>
            <div style={{
              color: '#666',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <MapPin size={14} />
              {task.merchantAddress}
            </div>
          </div>
          <a href={`tel:${task.merchantPhone}`} style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FF6B35',
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <Phone size={18} />
          </a>
        </div>
        
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '0.75rem',
          fontSize: '0.85rem'
        }}>
          <div style={{ fontWeight: 600, color: '#666', marginBottom: '0.5rem' }}>
            Food Items:
          </div>
          {task.foodItems.map((item, idx) => (
            <div key={idx} style={{
              color: '#2C3E50',
              padding: '0.25rem 0',
              borderBottom: idx < task.foodItems.length - 1 ? '1px solid #f0f0f0' : 'none'
            }}>
              • {item}
            </div>
          ))}
        </div>
      </div>

      {/* Recipient Info */}
      <div style={{
        background: task.recipientType === 'NGO' ? '#E8F5E9' : '#E3F2FD',
        borderRadius: '12px',
        padding: '1rem',
        marginBottom: '1rem',
        border: task.recipientType === 'NGO' ? '1px solid #C8E6C9' : '1px solid #BBDEFB'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: task.recipientType === 'NGO' 
              ? 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)'
              : 'linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: '1.2rem'
          }}>
            {task.recipientName.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontWeight: 700,
              color: '#2C3E50',
              marginBottom: '0.25rem'
            }}>
              {task.recipientName}
            </div>
            <div style={{
              color: '#666',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <MapPin size={14} />
              {task.recipientAddress}
            </div>
          </div>
          <a href={`tel:${task.recipientPhone}`} style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: task.recipientType === 'NGO' ? '#4CAF50' : '#2196F3',
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <Phone size={18} />
          </a>
        </div>
      </div>

      {/* Distance */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem',
        background: '#F5F5F5',
        borderRadius: '10px',
        marginBottom: '1.25rem'
      }}>
        <Navigation size={18} color="#FF6B35" />
        <span style={{ color: '#666', fontSize: '0.9rem' }}>
          Estimated Distance: <strong style={{ color: '#2C3E50' }}>{task.estimatedDistance}</strong>
        </span>
      </div>

      {/* Accept Button */}
      <button
        onClick={onAccept}
        style={{
          width: '100%',
          padding: '1rem',
          borderRadius: '12px',
          border: 'none',
          background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
          color: 'white',
          fontSize: '1rem',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(255, 107, 53, 0.3)',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        Accept Task
      </button>
    </div>
  );
};

// Ongoing Task Card Component
const OngoingTaskCard = ({ task, onStartPickup, onCompletePickup, onCompleteDelivery }) => {
  const getStatusInfo = () => {
    switch(task.status) {
      case 'accepted':
        return {
          label: 'Accepted',
          color: '#2196F3',
          bg: '#E3F2FD',
          action: 'Start Pickup',
          onAction: onStartPickup
        };
      case 'picking-up':
        return {
          label: 'Picking Up',
          color: '#FF9800',
          bg: '#FFF3E0',
          action: 'Complete Pickup',
          onAction: onCompletePickup
        };
      case 'delivering':
        return {
          label: 'Delivering',
          color: '#4CAF50',
          bg: '#E8F5E9',
          action: 'Complete Delivery',
          onAction: onCompleteDelivery
        };
      default:
        return null;
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      padding: '1.5rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: `2px solid ${statusInfo.color}20`
    }}>
      {/* Status Badge */}
      <div style={{
        display: 'inline-block',
        background: statusInfo.bg,
        color: statusInfo.color,
        padding: '0.5rem 1rem',
        borderRadius: '10px',
        fontSize: '0.85rem',
        fontWeight: 700,
        marginBottom: '1rem',
        animation: 'pulse 2s infinite'
      }}>
        ● {statusInfo.label}
      </div>

      <h3 style={{
        margin: '0 0 1rem 0',
        fontSize: '1.3rem',
        fontWeight: 700,
        color: '#2C3E50'
      }}>
        {task.orderNumber}
      </h3>

      {/* Progress Steps */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1.5rem',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          height: '2px',
          background: '#E0E0E0',
          zIndex: 0
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #FF6B35 0%, #4CAF50 100%)',
            width: task.status === 'accepted' ? '0%' : task.status === 'picking-up' ? '50%' : '100%',
            transition: 'width 0.5s'
          }} />
        </div>

        {['Pickup', 'Collected', 'Delivered'].map((step, idx) => {
          const isComplete = (
            (idx === 0 && task.status !== 'accepted') ||
            (idx === 1 && task.status === 'delivering') ||
            (idx === 2 && false)
          );
          const isCurrent = (
            (idx === 0 && task.status === 'picking-up') ||
            (idx === 1 && task.status === 'delivering')
          );

          return (
            <div key={step} style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 1
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: isComplete || isCurrent 
                  ? 'linear-gradient(135deg, #FF6B35 0%, #4CAF50 100%)'
                  : 'white',
                border: '3px solid',
                borderColor: isComplete || isCurrent ? 'transparent' : '#E0E0E0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isComplete || isCurrent ? 'white' : '#999',
                fontWeight: 700,
                marginBottom: '0.5rem',
                boxShadow: isComplete || isCurrent ? '0 4px 12px rgba(255,107,53,0.3)' : 'none'
              }}>
                {isComplete ? <CheckCircle size={20} /> : idx + 1}
              </div>
              <div style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: isComplete || isCurrent ? '#2C3E50' : '#999'
              }}>
                {step}
              </div>
            </div>
          );
        })}
      </div>

      {/* Location Info */}
      <div style={{
        background: '#F8F9FA',
        borderRadius: '12px',
        padding: '1rem',
        marginBottom: '1rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'start',
          gap: '1rem',
          marginBottom: '0.75rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid #E0E0E0'
        }}>
          <MapPin size={20} color="#FF6B35" style={{ marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: '#666', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              Pickup Location
            </div>
            <div style={{ color: '#2C3E50', fontWeight: 600 }}>
              {task.merchantName}
            </div>
            <div style={{ color: '#666', fontSize: '0.85rem' }}>
              {task.merchantAddress}
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'start',
          gap: '1rem'
        }}>
          <MapPin size={20} color="#4CAF50" style={{ marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: '#666', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              Delivery Location
            </div>
            <div style={{ color: '#2C3E50', fontWeight: 600 }}>
              {task.recipientName}
            </div>
            <div style={{ color: '#666', fontSize: '0.85rem' }}>
              {task.recipientAddress}
            </div>
          </div>
        </div>
      </div>

      {/* Pickup Proof */}
      {task.pickupProof && (
        <div style={{
          marginBottom: '1rem',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '2px solid #E0E0E0'
        }}>
          <img 
            src={task.pickupProof} 
            alt="Pickup proof" 
            style={{
              width: '100%',
              maxHeight: '200px',
              objectFit: 'cover'
            }}
          />
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={statusInfo.onAction}
        style={{
          width: '100%',
          padding: '1rem',
          borderRadius: '12px',
          border: 'none',
          background: `linear-gradient(135deg, ${statusInfo.color} 0%, ${statusInfo.color}dd 100%)`,
          color: 'white',
          fontSize: '1rem',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: `0 4px 16px ${statusInfo.color}40`,
          transition: 'transform 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        {statusInfo.action}
      </button>
    </div>
  );
};

// Completed Task Card Component
const CompletedTaskCard = ({ task }) => (
  <div style={{
    background: 'white',
    borderRadius: '20px',
    padding: '1.5rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    border: '2px solid #E8F5E9'
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1rem'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <CheckCircle size={24} />
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{
          margin: '0 0 0.25rem 0',
          fontSize: '1.2rem',
          fontWeight: 700,
          color: '#2C3E50'
        }}>
          {task.orderNumber}
        </h3>
        <div style={{ color: '#666', fontSize: '0.85rem' }}>
          Completed on {task.completedDate} at {task.completedTime}
        </div>
      </div>
      <div style={{
        background: '#E8F5E9',
        color: '#4CAF50',
        padding: '0.5rem 1rem',
        borderRadius: '10px',
        fontSize: '0.85rem',
        fontWeight: 700
      }}>
        ✓ Delivered
      </div>
    </div>

    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
      padding: '1rem',
      background: '#F8F9FA',
      borderRadius: '12px'
    }}>
      <div>
        <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>
          From
        </div>
        <div style={{ fontWeight: 600, color: '#2C3E50' }}>
          {task.merchantName}
        </div>
      </div>
      <div>
        <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>
          To
        </div>
        <div style={{ fontWeight: 600, color: '#2C3E50' }}>
          {task.recipientName}
        </div>
      </div>
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ message }) => (
  <div style={{
    background: 'white',
    borderRadius: '20px',
    padding: '4rem 2rem',
    textAlign: 'center',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
  }}>
    <div style={{
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1.5rem',
      opacity: 0.3
    }}>
      <Package size={40} color="white" />
    </div>
    <p style={{
      margin: 0,
      color: '#999',
      fontSize: '1.1rem',
      fontWeight: 500
    }}>
      {message}
    </p>
  </div>
);

export default DriverApp;
