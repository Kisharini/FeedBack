import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Car, Camera, Save, X, Edit2, CheckCircle, AlertCircle } from 'lucide-react';

const DriverProfileEdit = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({});

  // Driver profile data
  const [profile, setProfile] = useState({
    name: 'Ahmad Ibrahim',
    id: 'DRV-001',
    email: 'ahmad.ibrahim@feedback.com',
    phone: '+60 12-345 6789',
    address: '123 Jalan Merdeka, Klang, Selangor',
    vehicleType: 'Motorcycle',
    vehicleNumber: 'WA 1234 X',
    rating: 4.8,
    totalDeliveries: 127,
    emergencyContact: '+60 11-222 3333',
    emergencyName: 'Fatimah Ibrahim',
    bankName: 'Maybank',
    accountNumber: '1234567890',
    joinDate: 'January 15, 2024'
  });

  const [editedProfile, setEditedProfile] = useState({ ...profile });

  const vehicleTypes = ['Motorcycle', 'Car', 'Van', 'Bicycle', 'Walking'];

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!editedProfile.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!editedProfile.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editedProfile.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!editedProfile.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[0-9\s\-]+$/.test(editedProfile.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    if (!editedProfile.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!editedProfile.vehicleNumber.trim()) {
      newErrors.vehicleNumber = 'Vehicle number is required';
    }

    if (!editedProfile.emergencyContact.trim()) {
      newErrors.emergencyContact = 'Emergency contact is required';
    }

    if (!editedProfile.emergencyName.trim()) {
      newErrors.emergencyName = 'Emergency contact name is required';
    }

    if (!editedProfile.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      setProfile({ ...editedProfile });
      setIsEditing(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
    setErrors({});
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9f5e9 100%)',
      fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
      paddingBottom: '2rem'
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                  Driver Profile
                </h1>
                <p style={{ 
                  margin: 0, 
                  color: 'rgba(255,255,255,0.9)', 
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}>
                  Manage your information
                </p>
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Success Message */}
      {showSuccessMessage && (
        <div style={{
          position: 'fixed',
          top: '100px',
          right: '20px',
          background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease-out'
        }}>
          <CheckCircle size={24} />
          <span style={{ fontWeight: 600 }}>Profile updated successfully!</span>
        </div>
      )}

      {/* Main Content */}
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Profile Picture Section */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          textAlign: 'center'
        }}>
          <div style={{
            position: 'relative',
            display: 'inline-block',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: profileImage 
                ? `url(${profileImage})` 
                : 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '3rem',
              fontWeight: 800,
              boxShadow: '0 8px 24px rgba(255, 107, 53, 0.3)',
              border: '4px solid white'
            }}>
              {!profileImage && profile.name.charAt(0)}
            </div>

            {isEditing && (
              <label style={{
                position: 'absolute',
                bottom: '5px',
                right: '5px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
                border: '3px solid white'
              }}>
                <Camera size={16} color="white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>

          <h2 style={{
            margin: '0 0 0.5rem 0',
            fontSize: '1.8rem',
            fontWeight: 800,
            color: '#2C3E50'
          }}>
            {profile.name}
          </h2>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#FFF8F5',
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            color: '#FF6B35',
            fontWeight: 600,
            marginBottom: '1rem'
          }}>
            <User size={16} />
            {profile.id}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            paddingTop: '1rem',
            borderTop: '1px solid #f0f0f0'
          }}>
            <div>
              <div style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                color: '#FF6B35'
              }}>
                {profile.rating}
              </div>
              <div style={{
                fontSize: '0.85rem',
                color: '#666',
                fontWeight: 500
              }}>
                ⭐ Rating
              </div>
            </div>
            <div style={{
              width: '1px',
              background: '#E0E0E0'
            }} />
            <div>
              <div style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                color: '#4CAF50'
              }}>
                {profile.totalDeliveries}
              </div>
              <div style={{
                fontSize: '0.85rem',
                color: '#666',
                fontWeight: 500
              }}>
                Deliveries
              </div>
            </div>
            <div style={{
              width: '1px',
              background: '#E0E0E0'
            }} />
            <div>
              <div style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                color: '#2196F3'
              }}>
                {profile.joinDate.split(' ')[2]}
              </div>
              <div style={{
                fontSize: '0.85rem',
                color: '#666',
                fontWeight: 500
              }}>
                Joined
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
        }}>
          <h3 style={{
            margin: '0 0 1.5rem 0',
            fontSize: '1.3rem',
            fontWeight: 700,
            color: '#2C3E50',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <User size={18} />
            </div>
            Personal Information
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            <FormField
              label="Full Name"
              icon={<User size={18} />}
              value={isEditing ? editedProfile.name : profile.name}
              isEditing={isEditing}
              onChange={(value) => handleInputChange('name', value)}
              error={errors.name}
              required
            />

            <FormField
              label="Email Address"
              icon={<Mail size={18} />}
              value={isEditing ? editedProfile.email : profile.email}
              isEditing={isEditing}
              onChange={(value) => handleInputChange('email', value)}
              error={errors.email}
              type="email"
              required
            />

            <FormField
              label="Phone Number"
              icon={<Phone size={18} />}
              value={isEditing ? editedProfile.phone : profile.phone}
              isEditing={isEditing}
              onChange={(value) => handleInputChange('phone', value)}
              error={errors.phone}
              type="tel"
              required
            />

            <FormField
              label="Address"
              icon={<MapPin size={18} />}
              value={isEditing ? editedProfile.address : profile.address}
              isEditing={isEditing}
              onChange={(value) => handleInputChange('address', value)}
              error={errors.address}
              fullWidth
              required
            />
          </div>
        </div>

        {/* Vehicle Information */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
        }}>
          <h3 style={{
            margin: '0 0 1.5rem 0',
            fontSize: '1.3rem',
            fontWeight: 700,
            color: '#2C3E50',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Car size={18} />
            </div>
            Vehicle Information
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {isEditing ? (
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 600,
                  color: '#2C3E50',
                  fontSize: '0.9rem'
                }}>
                  Vehicle Type <span style={{ color: '#FF6B35' }}>*</span>
                </label>
                <select
                  value={editedProfile.vehicleType}
                  onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    borderRadius: '12px',
                    border: '2px solid #E0E0E0',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    background: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            ) : (
              <FormField
                label="Vehicle Type"
                icon={<Car size={18} />}
                value={profile.vehicleType}
                isEditing={false}
              />
            )}

            <FormField
              label="Vehicle Number"
              icon={<Car size={18} />}
              value={isEditing ? editedProfile.vehicleNumber : profile.vehicleNumber}
              isEditing={isEditing}
              onChange={(value) => handleInputChange('vehicleNumber', value)}
              error={errors.vehicleNumber}
              required
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
        }}>
          <h3 style={{
            margin: '0 0 1.5rem 0',
            fontSize: '1.3rem',
            fontWeight: 700,
            color: '#2C3E50',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <AlertCircle size={18} />
            </div>
            Emergency Contact
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            <FormField
              label="Emergency Contact Name"
              icon={<User size={18} />}
              value={isEditing ? editedProfile.emergencyName : profile.emergencyName}
              isEditing={isEditing}
              onChange={(value) => handleInputChange('emergencyName', value)}
              error={errors.emergencyName}
              required
            />

            <FormField
              label="Emergency Contact Number"
              icon={<Phone size={18} />}
              value={isEditing ? editedProfile.emergencyContact : profile.emergencyContact}
              isEditing={isEditing}
              onChange={(value) => handleInputChange('emergencyContact', value)}
              error={errors.emergencyContact}
              type="tel"
              required
            />
          </div>
        </div>

        {/* Bank Information */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: isEditing ? '1.5rem' : '0',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
        }}>
          <h3 style={{
            margin: '0 0 1.5rem 0',
            fontSize: '1.3rem',
            fontWeight: 700,
            color: '#2C3E50',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: 800
            }}>
              $
            </div>
            Bank Information
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            <FormField
              label="Bank Name"
              icon={<Mail size={18} />}
              value={isEditing ? editedProfile.bankName : profile.bankName}
              isEditing={isEditing}
              onChange={(value) => handleInputChange('bankName', value)}
            />

            <FormField
              label="Account Number"
              icon={<Phone size={18} />}
              value={isEditing ? editedProfile.accountNumber : profile.accountNumber}
              isEditing={isEditing}
              onChange={(value) => handleInputChange('accountNumber', value)}
              error={errors.accountNumber}
              required
            />
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={handleCancel}
              style={{
                padding: '1rem 2rem',
                borderRadius: '12px',
                border: '2px solid #E0E0E0',
                background: 'white',
                color: '#666',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#f5f5f5';
                e.currentTarget.style.borderColor = '#ccc';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#E0E0E0';
              }}
            >
              <X size={18} />
              Cancel
            </button>

            <button
              onClick={handleSave}
              style={{
                padding: '1rem 2rem',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 16px rgba(76, 175, 80, 0.3)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        )}
      </main>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

// Form Field Component
const FormField = ({ 
  label, 
  icon, 
  value, 
  isEditing, 
  onChange, 
  error, 
  type = 'text', 
  fullWidth = false,
  required = false 
}) => (
  <div style={fullWidth ? { gridColumn: '1 / -1' } : {}}>
    <label style={{
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: 600,
      color: '#2C3E50',
      fontSize: '0.9rem'
    }}>
      {label} {required && <span style={{ color: '#FF6B35' }}>*</span>}
    </label>

    {isEditing ? (
      <>
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            position: 'absolute',
            left: '1rem',
            color: error ? '#f44336' : '#999',
            display: 'flex',
            alignItems: 'center'
          }}>
            {icon}
          </div>
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.875rem 1rem 0.875rem 3rem',
              borderRadius: '12px',
              border: `2px solid ${error ? '#f44336' : '#E0E0E0'}`,
              fontSize: '0.95rem',
              fontFamily: 'inherit',
              transition: 'all 0.3s',
              background: error ? '#FFEBEE' : 'white'
            }}
            onFocus={(e) => {
              if (!error) e.currentTarget.style.borderColor = '#FF6B35';
            }}
            onBlur={(e) => {
              if (!error) e.currentTarget.style.borderColor = '#E0E0E0';
            }}
          />
        </div>
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.5rem',
            color: '#f44336',
            fontSize: '0.85rem',
            fontWeight: 500
          }}>
            <AlertCircle size={14} />
            {error}
          </div>
        )}
      </>
    ) : (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.875rem 1rem',
        background: '#F8F9FA',
        borderRadius: '12px',
        border: '1px solid #E0E0E0'
      }}>
        <div style={{ color: '#666' }}>
          {icon}
        </div>
        <span style={{
          color: '#2C3E50',
          fontSize: '0.95rem',
          fontWeight: 500
        }}>
          {value}
        </span>
      </div>
    )}
  </div>
);

export default DriverProfileEdit;