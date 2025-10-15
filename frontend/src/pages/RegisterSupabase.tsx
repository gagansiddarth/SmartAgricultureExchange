import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContextSupabase';
import { UserPlus, Mail, Shield, MapPin, Bank, Building } from 'lucide-react';

const RegisterSupabase: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { signUp, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'farmer' as 'farmer' | 'buyer',
    village: '',
    district: '',
    state: '',
    pincode: '',
    languages: ['en'],
    bank_details: {
      account_number: '',
      ifsc_code: '',
      bank_name: '',
      branch: ''
    },
    organization_details: {
      company_name: '',
      gst_number: '',
      business_type: '',
      established_year: ''
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLanguageChange = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (formData.languages.length === 0) {
      setError('Please select at least one language');
      setIsLoading(false);
      return;
    }

    try {
      // Prepare user data for Supabase
      const userData = {
        name: formData.name,
        role: formData.role,
        village: formData.village || undefined,
        district: formData.district || undefined,
        state: formData.state || undefined,
        pincode: formData.pincode || undefined,
        languages: formData.languages,
        is_verified: false,
        verification_status: 'pending',
        ...(formData.role === 'farmer' ? { bank_details: formData.bank_details } : {}),
        ...(formData.role === 'buyer' ? { organization_details: formData.organization_details } : {})
      };

      const { error } = await signUp(formData.email, formData.password, userData);
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err: any) {
      setError('An unexpected error occurred');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200 text-center">
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
            <p className="text-gray-600 mb-6">
              Please check your email to verify your account before logging in.
            </p>
            <Link
              to="/login"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-3 rounded-full shadow-md">
            <UserPlus className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {t('auth.register_title')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 max-w-md mx-auto">
          {t('auth.register_subtitle')}{' '}
          <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
            {t('auth.login_here')}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.name')} <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder={t('auth.enter_your_name')}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.email')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.select_role')} <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'farmer' }))}
                  className={`w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium transition-colors ${
                    formData.role === 'farmer'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <UserPlus className="h-5 w-5 mr-2" /> {t('roles.farmer')}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'buyer' }))}
                  className={`w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium transition-colors ${
                    formData.role === 'buyer'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Building className="h-5 w-5 mr-2" /> {t('roles.buyer')}
                </button>
              </div>
            </div>

            {/* Location Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="village" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.village')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="village"
                    name="village"
                    type="text"
                    value={formData.village}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder={t('auth.enter_village')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.district')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="district"
                    name="district"
                    type="text"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder={t('auth.enter_district')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.state')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder={t('auth.enter_state')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.pincode')}
                </label>
                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder={t('auth.enter_pincode')}
                />
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.preferred_languages')} <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {['en', 'hi', 'te', 'ta'].map((langCode) => (
                  <button
                    key={langCode}
                    type="button"
                    onClick={() => handleLanguageChange(langCode)}
                    className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium transition-colors ${
                      formData.languages.includes(langCode)
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {t(`languages.${langCode}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Farmer Specific Fields */}
            {formData.role === 'farmer' && (
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900">{t('auth.bank_details')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bank_details.account_number" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('auth.account_number')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Bank className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="bank_details.account_number"
                        name="bank_details.account_number"
                        type="text"
                        value={formData.bank_details.account_number}
                        onChange={handleInputChange}
                        className="input-field pl-10"
                        placeholder={t('auth.enter_account_number')}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="bank_details.ifsc_code" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('auth.ifsc_code')}
                    </label>
                    <input
                      id="bank_details.ifsc_code"
                      name="bank_details.ifsc_code"
                      type="text"
                      value={formData.bank_details.ifsc_code}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder={t('auth.enter_ifsc_code')}
                    />
                  </div>

                  <div>
                    <label htmlFor="bank_details.bank_name" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('auth.bank_name')}
                    </label>
                    <input
                      id="bank_details.bank_name"
                      name="bank_details.bank_name"
                      type="text"
                      value={formData.bank_details.bank_name}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder={t('auth.enter_bank_name')}
                    />
                  </div>

                  <div>
                    <label htmlFor="bank_details.branch" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('auth.bank_branch')}
                    </label>
                    <input
                      id="bank_details.branch"
                      name="bank_details.branch"
                      type="text"
                      value={formData.bank_details.branch}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder={t('auth.enter_bank_branch')}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Buyer Specific Fields */}
            {formData.role === 'buyer' && (
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900">{t('auth.organization_details')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="organization_details.company_name" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('auth.company_name')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="organization_details.company_name"
                        name="organization_details.company_name"
                        type="text"
                        value={formData.organization_details.company_name}
                        onChange={handleInputChange}
                        className="input-field pl-10"
                        placeholder={t('auth.enter_company_name')}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="organization_details.gst_number" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('auth.gst_number')}
                    </label>
                    <input
                      id="organization_details.gst_number"
                      name="organization_details.gst_number"
                      type="text"
                      value={formData.organization_details.gst_number}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder={t('auth.enter_gst_number')}
                    />
                  </div>

                  <div>
                    <label htmlFor="organization_details.business_type" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('auth.business_type')}
                    </label>
                    <input
                      id="organization_details.business_type"
                      name="organization_details.business_type"
                      type="text"
                      value={formData.organization_details.business_type}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder={t('auth.enter_business_type')}
                    />
                  </div>

                  <div>
                    <label htmlFor="organization_details.established_year" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('auth.established_year')}
                    </label>
                    <input
                      id="organization_details.established_year"
                      name="organization_details.established_year"
                      type="number"
                      value={formData.organization_details.established_year}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="YYYY"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading || loading ? t('common.loading') : t('auth.register')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterSupabase;
