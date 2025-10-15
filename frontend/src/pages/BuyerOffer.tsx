import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft,
  Package,
  DollarSign,
  Calendar,
  MapPin,
  User,
  CheckCircle,
  AlertTriangle,
  Clock,
  Truck,
  CreditCard,
  FileText,
  Star,
  Phone,
  MessageSquare,
  LogOut
} from 'lucide-react';

interface CropPost {
  id: string;
  farmer_id: string;
  crop_name: string;
  variety_name?: string;
  description?: string;
  quantity: number;
  quantity_unit: string;
  price_per_unit: number;
  location: {
    village: string;
    district: string;
    state: string;
    pincode: string;
  };
  expected_harvest_date?: string;
  farmer_name?: string;
  farmer_phone?: string;
  verification_score?: number;
}

interface OfferData {
  crop_post_id: string;
  farmer_id: string;
  buyer_id: string;
  offer_price: number;
  offer_quantity: number;
  total_amount: number;
  pickup_date?: string;
  delivery_method: 'pickup' | 'delivery';
  delivery_address?: string;
  payment_terms: 'advance' | 'on_delivery' | 'escrow';
  advance_amount?: number;
  notes?: string;
  terms_and_conditions: boolean;
}

const BuyerOffer: React.FC = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const [cropPost, setCropPost] = useState<CropPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const [offerData, setOfferData] = useState<OfferData>({
    crop_post_id: postId || '',
    farmer_id: '',
    buyer_id: '',
    offer_price: 0,
    offer_quantity: 0,
    total_amount: 0,
    delivery_method: 'pickup',
    payment_terms: 'advance',
    terms_and_conditions: false
  });

  useEffect(() => {
    if (postId) {
      fetchCropPost();
    }
  }, [postId]);

  useEffect(() => {
    // Calculate total amount when price or quantity changes
    setOfferData(prev => ({
      ...prev,
      total_amount: prev.offer_price * prev.offer_quantity
    }));
  }, [offerData.offer_price, offerData.offer_quantity]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('demo_user');
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    }
  };

  const fetchCropPost = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockPost: CropPost = {
        id: postId || '',
        farmer_id: 'farmer-1',
        crop_name: 'Basmati Rice',
        variety_name: 'Pusa Basmati 1121',
        description: 'Premium quality basmati rice with excellent aroma and long grain. Grown using traditional methods.',
        quantity: 50,
        quantity_unit: 'quintals',
        price_per_unit: 3500,
        location: {
          village: 'Karnal Village',
          district: 'Karnal',
          state: 'Haryana',
          pincode: '132001'
        },
        expected_harvest_date: '2024-12-15',
        farmer_name: 'Rajesh Kumar',
        farmer_phone: '+919876543210',
        verification_score: 0.95
      };

      setCropPost(mockPost);
      setOfferData(prev => ({
        ...prev,
        farmer_id: mockPost.farmer_id,
        offer_price: mockPost.price_per_unit,
        offer_quantity: Math.min(mockPost.quantity, 10) // Default to 10 or available quantity
      }));
    } catch (error) {
      console.error('Error fetching crop post:', error);
      setError('Failed to load crop details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOffer = async () => {
    if (!offerData.terms_and_conditions) {
      setError('Please accept the terms and conditions');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Offer submitted:', offerData);
      
      // Navigate to success page or chat
      navigate(`/buyer-chat/${offerData.farmer_id}?offer=submitted`);
    } catch (error) {
      console.error('Error submitting offer:', error);
      setError('Failed to submit offer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading crop details...</p>
        </div>
      </div>
    );
  }

  if (!cropPost) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Crop Not Found</h3>
        <p className="text-gray-600">The requested crop post could not be found.</p>
        <button
          onClick={() => navigate('/buyer-dashboard')}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Black/White Theme */}
      <div className="bg-black">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/buyer-dashboard')}
                className="p-3 hover:bg-gray-800 rounded-2xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Make an Offer</h1>
                <p className="text-gray-300">Submit your offer for {cropPost.crop_name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-sm text-gray-300">Live Market</span>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Crop Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Crop Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-800">{cropPost.crop_name}</p>
                    <p className="text-sm text-gray-600">{cropPost.variety_name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-800">₹{cropPost.price_per_unit.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">per {cropPost.quantity_unit}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-800">{cropPost.quantity} {cropPost.quantity_unit}</p>
                    <p className="text-sm text-gray-600">Available</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-gray-800">{cropPost.location.district}</p>
                    <p className="text-sm text-gray-600">{cropPost.location.state}</p>
                  </div>
                </div>

                {cropPost.expected_harvest_date && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-800">Harvest Date</p>
                      <p className="text-sm text-gray-600">
                        {new Date(cropPost.expected_harvest_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Farmer</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>
                  <p className="font-medium text-gray-800">{cropPost.farmer_name}</p>
                  <p className="text-sm text-gray-600">{cropPost.farmer_phone}</p>
                </div>

                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800">
                      {Math.round((cropPost.verification_score || 0.8) * 100)}% Verified
                    </span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    Geotagged photos, identity & location verified
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Offer Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              {/* Progress Steps */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  {[1, 2, 3].map((stepNumber) => (
                    <div key={stepNumber} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step >= stepNumber 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {stepNumber}
                      </div>
                      {stepNumber < 3 && (
                        <div className={`w-16 h-1 mx-2 ${
                          step > stepNumber ? 'bg-blue-500' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  <span>Offer Details</span>
                  <span>Delivery & Payment</span>
                  <span>Review & Submit</span>
                </div>
              </div>

              {/* Step Content */}
              <div className="p-6">
                {step === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800">Offer Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Offer Price per {cropPost.quantity_unit}
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="number"
                            value={offerData.offer_price}
                            onChange={(e) => setOfferData({
                              ...offerData,
                              offer_price: Number(e.target.value) || 0
                            })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your offer price"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Farmer's asking price: ₹{cropPost.price_per_unit.toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantity ({cropPost.quantity_unit})
                        </label>
                        <div className="relative">
                          <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="number"
                            value={offerData.offer_quantity}
                            onChange={(e) => setOfferData({
                              ...offerData,
                              offer_quantity: Number(e.target.value) || 0
                            })}
                            max={cropPost.quantity}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter quantity"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Available: {cropPost.quantity} {cropPost.quantity_unit}
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-blue-800">Total Offer Amount</span>
                        <span className="text-xl font-bold text-blue-800">
                          {formatCurrency(offerData.total_amount)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        value={offerData.notes || ''}
                        onChange={(e) => setOfferData({
                          ...offerData,
                          notes: e.target.value
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        placeholder="Add any special requirements or comments..."
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800">Delivery & Payment</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Delivery Method
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="delivery_method"
                            value="pickup"
                            checked={offerData.delivery_method === 'pickup'}
                            onChange={(e) => setOfferData({
                              ...offerData,
                              delivery_method: e.target.value as 'pickup' | 'delivery'
                            })}
                            className="w-4 h-4 text-blue-600"
                          />
                          <div className="ml-3">
                            <div className="flex items-center">
                              <Truck className="w-5 h-5 text-gray-600 mr-2" />
                              <span className="font-medium">Pickup from Farm</span>
                            </div>
                            <p className="text-sm text-gray-600">You will arrange pickup from the farmer's location</p>
                          </div>
                        </label>

                        <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="delivery_method"
                            value="delivery"
                            checked={offerData.delivery_method === 'delivery'}
                            onChange={(e) => setOfferData({
                              ...offerData,
                              delivery_method: e.target.value as 'pickup' | 'delivery'
                            })}
                            className="w-4 h-4 text-blue-600"
                          />
                          <div className="ml-3">
                            <div className="flex items-center">
                              <Truck className="w-5 h-5 text-gray-600 mr-2" />
                              <span className="font-medium">Delivery to Location</span>
                            </div>
                            <p className="text-sm text-gray-600">Farmer will arrange delivery to your location</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {offerData.delivery_method === 'delivery' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Delivery Address
                        </label>
                        <textarea
                          value={offerData.delivery_address || ''}
                          onChange={(e) => setOfferData({
                            ...offerData,
                            delivery_address: e.target.value
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                          placeholder="Enter your delivery address..."
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expected Pickup/Delivery Date
                      </label>
                      <input
                        type="date"
                        value={offerData.pickup_date || ''}
                        onChange={(e) => setOfferData({
                          ...offerData,
                          pickup_date: e.target.value
                        })}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Payment Terms
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="payment_terms"
                            value="advance"
                            checked={offerData.payment_terms === 'advance'}
                            onChange={(e) => setOfferData({
                              ...offerData,
                              payment_terms: e.target.value as 'advance' | 'on_delivery' | 'escrow'
                            })}
                            className="w-4 h-4 text-blue-600"
                          />
                          <div className="ml-3">
                            <div className="flex items-center">
                              <CreditCard className="w-5 h-5 text-gray-600 mr-2" />
                              <span className="font-medium">Advance Payment</span>
                            </div>
                            <p className="text-sm text-gray-600">Pay a portion upfront, rest on delivery</p>
                          </div>
                        </label>

                        <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="payment_terms"
                            value="on_delivery"
                            checked={offerData.payment_terms === 'on_delivery'}
                            onChange={(e) => setOfferData({
                              ...offerData,
                              payment_terms: e.target.value as 'advance' | 'on_delivery' | 'escrow'
                            })}
                            className="w-4 h-4 text-blue-600"
                          />
                          <div className="ml-3">
                            <div className="flex items-center">
                              <CreditCard className="w-5 h-5 text-gray-600 mr-2" />
                              <span className="font-medium">Payment on Delivery</span>
                            </div>
                            <p className="text-sm text-gray-600">Pay full amount when goods are delivered</p>
                          </div>
                        </label>

                        <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="payment_terms"
                            value="escrow"
                            checked={offerData.payment_terms === 'escrow'}
                            onChange={(e) => setOfferData({
                              ...offerData,
                              payment_terms: e.target.value as 'advance' | 'on_delivery' | 'escrow'
                            })}
                            className="w-4 h-4 text-blue-600"
                          />
                          <div className="ml-3">
                            <div className="flex items-center">
                              <CreditCard className="w-5 h-5 text-gray-600 mr-2" />
                              <span className="font-medium">Escrow Service</span>
                            </div>
                            <p className="text-sm text-gray-600">Secure payment held until delivery confirmation</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {offerData.payment_terms === 'advance' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Advance Amount (₹)
                        </label>
                        <input
                          type="number"
                          value={offerData.advance_amount || ''}
                          onChange={(e) => setOfferData({
                            ...offerData,
                            advance_amount: Number(e.target.value) || 0
                          })}
                          max={offerData.total_amount}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter advance amount"
                        />
                      </div>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800">Review & Submit</h3>
                    
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-4">Offer Summary</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Crop</span>
                          <span className="font-medium">{cropPost.crop_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Quantity</span>
                          <span className="font-medium">{offerData.offer_quantity} {cropPost.quantity_unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price per {cropPost.quantity_unit}</span>
                          <span className="font-medium">{formatCurrency(offerData.offer_price)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Delivery Method</span>
                          <span className="font-medium capitalize">{offerData.delivery_method}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Terms</span>
                          <span className="font-medium capitalize">{offerData.payment_terms.replace('_', ' ')}</span>
                        </div>
                        <div className="border-t border-gray-300 pt-3">
                          <div className="flex justify-between">
                            <span className="text-lg font-semibold text-gray-800">Total Amount</span>
                            <span className="text-xl font-bold text-blue-600">{formatCurrency(offerData.total_amount)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={offerData.terms_and_conditions}
                          onChange={(e) => setOfferData({
                            ...offerData,
                            terms_and_conditions: e.target.checked
                          })}
                          className="w-4 h-4 text-blue-600 mt-1"
                        />
                        <span className="text-sm text-gray-600">
                          I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and 
                          <a href="#" className="text-blue-600 hover:underline"> Privacy Policy</a>. I understand that this offer is binding and may be accepted by the farmer.
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      {error}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setStep(Math.max(1, step - 1))}
                    disabled={step === 1}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  
                  {step < 3 ? (
                    <button
                      onClick={() => setStep(step + 1)}
                      className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitOffer}
                      disabled={submitting || !offerData.terms_and_conditions}
                      className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg transition-colors flex items-center"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        'Submit Offer'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerOffer;
