import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { createCropPost } from '../services/cropPostService';
import { 
  ArrowLeft, 
  Camera, 
  MapPin, 
  Calendar,
  Package,
  DollarSign,
  Upload,
  Plus,
  X,
  CheckCircle
} from 'lucide-react';

interface CropPostData {
  cropType: string;
  variety: string;
  sowDate: string;
  expectedHarvestDate: string;
  expectedYield: string;
  expectedPrice: string;
  quantity: string;
  quantityUnit: string;
  packaging: string;
  description: string;
  phone: string;
  images: File[];
  location: {
    lat: number;
    lng: number;
    address: string;
  } | null;
}

const CropPost: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<CropPostData>({
    cropType: '',
    variety: '',
    sowDate: '',
    expectedHarvestDate: '',
    expectedYield: '',
    expectedPrice: '',
    quantity: '',
    quantityUnit: 'kg',
    packaging: 'bulk',
    description: '',
    phone: '',
    images: [],
    location: null
  });

  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);

  // Indian crop types for dropdown
  const cropTypes = [
    'Rice', 'Wheat', 'Maize', 'Bajra', 'Jowar', 'Ragi', 'Cotton', 'Sugarcane',
    'Potato', 'Onion', 'Tomato', 'Brinjal', 'Cabbage', 'Cauliflower', 'Carrot',
    'Radish', 'Beetroot', 'Spinach', 'Coriander', 'Mint', 'Turmeric', 'Ginger',
    'Garlic', 'Chilli', 'Cardamom', 'Pepper', 'Cumin', 'Fenugreek', 'Mustard',
    'Sunflower', 'Soybean', 'Groundnut', 'Chickpea', 'Lentil', 'Green Gram',
    'Black Gram', 'Pigeon Pea', 'Cowpea', 'Other'
  ];

  const quantityUnits = ['kg', 'quintal', 'ton', 'acre', 'hectare'];
  const packagingOptions = ['bulk', 'boxed', 'bagged', 'loose'];

  const handleInputChange = (field: keyof CropPostData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files].slice(0, 3) // Max 3 images
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding to get address
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          
          setFormData(prev => ({
            ...prev,
            location: {
              lat: latitude,
              lng: longitude,
              address: `${data.locality || ''}, ${data.principalSubdivision || ''}, ${data.countryName || ''}`.trim()
            }
          }));
          setLocationPermission(true);
        } catch (err) {
          setFormData(prev => ({
            ...prev,
            location: {
              lat: latitude,
              lng: longitude,
              address: 'Location captured'
            }
          }));
          setLocationPermission(true);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setError('Unable to get your location. Please enable location access.');
        setLocationPermission(false);
        setLoading(false);
      }
    );
  };

  const validateForm = () => {
    if (!formData.cropType) {
      setError('Please select a crop type');
      return false;
    }
    if (!formData.variety) {
      setError('Please enter the variety');
      return false;
    }
    if (!formData.expectedHarvestDate) {
      setError('Please select expected harvest date');
      return false;
    }
    if (!formData.expectedPrice) {
      setError('Please enter expected price');
      return false;
    }
    if (!formData.quantity) {
      setError('Please enter quantity');
      return false;
    }
    if (formData.images.length === 0) {
      setError('Please upload at least one photo');
      return false;
    }
    if (!formData.location) {
      setError('Please capture your location');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Create crop post using the service
      const result = await createCropPost(formData);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/farmer-dashboard');
        }, 3000);
      } else {
        setError(result.message || 'Failed to create crop post. Please try again.');
      }

    } catch (err) {
      setError('Failed to create crop post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.cropType || !formData.variety || !formData.expectedHarvestDate) {
        setError('Please fill in all required fields');
        return;
      }
    } else if (step === 2) {
      if (!formData.expectedPrice || !formData.quantity) {
        setError('Please fill in price and quantity');
        return;
      }
    } else if (step === 3) {
      if (formData.images.length === 0) {
        setError('Please upload at least one photo');
        return;
      }
    }
    setError('');
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#dcfce7',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem auto',
            fontSize: '2.5rem'
          }}>
            ✅
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#15803d',
            marginBottom: '1rem'
          }}>
            Crop Post Created!
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            Your crop listing has been submitted for verification. You'll be notified once it's approved.
          </p>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <button
            onClick={() => navigate('/farmer-dashboard')}
            style={{
              backgroundColor: '#f3f4f6',
              border: 'none',
              borderRadius: '12px',
              padding: '0.75rem',
              cursor: 'pointer',
              marginRight: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ArrowLeft size={20} color="#6b7280" />
          </button>
          <div>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: 'bold',
              color: '#15803d',
              marginBottom: '0.25rem'
            }}>
              Post New Crop
            </h1>
            <p style={{ color: '#6b7280' }}>
              Step {step} of 4: {step === 1 ? 'Crop Details' : step === 2 ? 'Pricing & Quantity' : step === 3 ? 'Photos & Location' : 'Review & Submit'}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '16px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            {[1, 2, 3, 4].map((stepNum) => (
              <div
                key={stepNum}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: step >= stepNum ? '#16a34a' : '#e5e7eb',
                  color: step >= stepNum ? 'white' : '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.125rem'
                }}
              >
                {stepNum}
              </div>
            ))}
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(step / 4) * 100}%`,
              height: '100%',
              backgroundColor: '#16a34a',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>

        {/* Form Content */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          
          {/* Step 1: Crop Details */}
          {step === 1 && (
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#15803d',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Package style={{ marginRight: '0.75rem' }} size={24} />
                Crop Information
              </h2>
              
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {/* Crop Type */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Crop Type *
                  </label>
                  <select
                    value={formData.cropType}
                    onChange={(e) => handleInputChange('cropType', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #d1d5db',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      backgroundColor: 'white',
                      outline: 'none'
                    }}
                  >
                    <option value="">Select crop type</option>
                    {cropTypes.map((crop) => (
                      <option key={crop} value={crop}>{crop}</option>
                    ))}
                  </select>
                </div>

                {/* Variety */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Variety *
                  </label>
                  <input
                    type="text"
                    value={formData.variety}
                    onChange={(e) => handleInputChange('variety', e.target.value)}
                    placeholder="e.g., Basmati 1121, Kharif Wheat"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #d1d5db',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Sow Date */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Sowing Date
                  </label>
                  <input
                    type="date"
                    value={formData.sowDate}
                    onChange={(e) => handleInputChange('sowDate', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #d1d5db',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Expected Harvest Date */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Expected Harvest Date *
                  </label>
                  <input
                    type="date"
                    value={formData.expectedHarvestDate}
                    onChange={(e) => handleInputChange('expectedHarvestDate', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #d1d5db',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Expected Yield */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Expected Yield (kg/acre)
                  </label>
                  <input
                    type="number"
                    value={formData.expectedYield}
                    onChange={(e) => handleInputChange('expectedYield', e.target.value)}
                    placeholder="e.g., 2500"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #d1d5db',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your crop, farming practices, quality, etc."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #d1d5db',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Pricing & Quantity */}
          {step === 2 && (
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#15803d',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                <DollarSign style={{ marginRight: '0.75rem' }} size={24} />
                Pricing & Quantity
              </h2>
              
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {/* Expected Price */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Minimum Expected Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.expectedPrice}
                    onChange={(e) => handleInputChange('expectedPrice', e.target.value)}
                    placeholder="e.g., 3200"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #d1d5db',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Quantity */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Quantity *
                    </label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      placeholder="e.g., 500"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #d1d5db',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Unit
                    </label>
                    <select
                      value={formData.quantityUnit}
                      onChange={(e) => handleInputChange('quantityUnit', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #d1d5db',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        backgroundColor: 'white',
                        outline: 'none'
                      }}
                    >
                      {quantityUnits.map((unit) => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Packaging */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Required Packaging
                  </label>
                  <select
                    value={formData.packaging}
                    onChange={(e) => handleInputChange('packaging', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #d1d5db',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      backgroundColor: 'white',
                      outline: 'none'
                    }}
                  >
                    {packagingOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Phone */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="e.g., +91 98765 43210"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #d1d5db',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Photos & Location */}
          {step === 3 && (
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#15803d',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Camera style={{ marginRight: '0.75rem' }} size={24} />
                Photos & Location
              </h2>
              
              <div style={{ display: 'grid', gap: '2rem' }}>
                {/* Photo Upload */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Crop Photos (3 recommended) *
                  </label>
                  
                  {/* Upload Button */}
                  <div style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '12px',
                    padding: '2rem',
                    textAlign: 'center',
                    marginBottom: '1rem',
                    backgroundColor: '#f9fafb'
                  }}>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      style={{
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Upload size={32} color="#6b7280" />
                      <span style={{ color: '#6b7280', fontWeight: '500' }}>
                        Click to upload photos
                      </span>
                      <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                        PNG, JPG up to 10MB each
                      </span>
                    </label>
                  </div>

                  {/* Image Preview */}
                  {formData.images.length > 0 && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '1rem'
                    }}>
                      {formData.images.map((image, index) => (
                        <div key={index} style={{ position: 'relative' }}>
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Crop ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '150px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: '2px solid #d1d5db'
                            }}
                          />
                          <button
                            onClick={() => removeImage(index)}
                            style={{
                              position: 'absolute',
                              top: '0.5rem',
                              right: '0.5rem',
                              backgroundColor: 'rgba(239, 68, 68, 0.9)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '24px',
                              height: '24px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Field Location *
                  </label>
                  
                  {!formData.location ? (
                    <button
                      onClick={getCurrentLocation}
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        backgroundColor: '#16a34a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <MapPin size={20} />
                      {loading ? 'Getting Location...' : 'Capture My Location'}
                    </button>
                  ) : (
                    <div style={{
                      padding: '1rem',
                      backgroundColor: '#dcfce7',
                      borderRadius: '12px',
                      border: '2px solid #16a34a'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem'
                      }}>
                        <CheckCircle size={20} color="#16a34a" />
                        <span style={{ fontWeight: '600', color: '#15803d' }}>
                          Location Captured
                        </span>
                      </div>
                      <p style={{ color: '#15803d', fontSize: '0.875rem' }}>
                        {formData.location.address}
                      </p>
                      <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                        Lat: {formData.location.lat.toFixed(6)}, Lng: {formData.location.lng.toFixed(6)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#15803d',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                <CheckCircle style={{ marginRight: '0.75rem' }} size={24} />
                Review & Submit
              </h2>
              
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {/* Crop Details Review */}
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '1rem'
                  }}>
                    Crop Information
                  </h3>
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    <p><strong>Crop:</strong> {formData.cropType} - {formData.variety}</p>
                    <p><strong>Harvest Date:</strong> {formData.expectedHarvestDate}</p>
                    <p><strong>Expected Yield:</strong> {formData.expectedYield} kg/acre</p>
                    {formData.description && <p><strong>Description:</strong> {formData.description}</p>}
                  </div>
                </div>

                {/* Pricing Review */}
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '1rem'
                  }}>
                    Pricing & Quantity
                  </h3>
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    <p><strong>Price:</strong> ₹{formData.expectedPrice} per {formData.quantityUnit}</p>
                    <p><strong>Quantity:</strong> {formData.quantity} {formData.quantityUnit}</p>
                    <p><strong>Packaging:</strong> {formData.packaging}</p>
                    {formData.phone && <p><strong>Contact:</strong> {formData.phone}</p>}
                  </div>
                </div>

                {/* Photos Review */}
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '1rem'
                  }}>
                    Photos ({formData.images.length})
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                    gap: '0.5rem'
                  }}>
                    {formData.images.map((image, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(image)}
                        alt={`Crop ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '6px'
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Location Review */}
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '1rem'
                  }}>
                    Location
                  </h3>
                  <p style={{ color: '#6b7280' }}>
                    {formData.location?.address}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #ef4444',
              color: '#dc2626',
              padding: '1rem',
              borderRadius: '12px',
              marginTop: '1rem'
            }}>
              ❌ {error}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          {step > 1 ? (
            <button
              onClick={prevStep}
              style={{
                padding: '1rem 2rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                flex: '1'
              }}
            >
              ← Previous
            </button>
          ) : (
            <div></div>
          )}
          
          {step < 4 ? (
            <button
              onClick={nextStep}
              style={{
                padding: '1rem 2rem',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                flex: '1'
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: '1rem 2rem',
                backgroundColor: loading ? '#9ca3af' : '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                flex: '1'
              }}
            >
              {loading ? 'Creating Post...' : 'Submit Crop Post'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropPost;