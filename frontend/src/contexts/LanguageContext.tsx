import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Simple translations object - in production, this would be loaded from JSON files
const translations = {
  en: {
    'app.title': 'Smart Agriculture Exchange',
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.post_crop': 'Post Crop',
    'nav.my_posts': 'My Posts',
    'nav.advice': 'Crop Advice',
    'nav.search': 'Search',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'auth.phone': 'Phone Number',
    'auth.otp': 'OTP',
    'auth.send_otp': 'Send OTP',
    'auth.verify_otp': 'Verify OTP',
    'auth.register': 'Register',
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.name': 'Name',
    'auth.email': 'Email',
    'auth.role': 'Role',
    'auth.farmer': 'Farmer',
    'auth.buyer': 'Buyer',
    'auth.village': 'Village',
    'auth.district': 'District',
    'auth.state': 'State',
    'crop.type': 'Crop Type',
    'crop.variety': 'Variety',
    'crop.sow_date': 'Sow Date',
    'crop.harvest_date': 'Expected Harvest Date',
    'crop.yield': 'Expected Yield (kg/acre)',
    'crop.price': 'Minimum Expected Price (₹)',
    'crop.quantity': 'Quantity',
    'crop.description': 'Description',
    'crop.photos': 'Photos',
    'crop.take_photo': 'Take Photo',
    'crop.location': 'Location',
    'post.create': 'Create Crop Post',
    'post.update': 'Update Post',
    'post.status.pending': 'Pending Verification',
    'post.status.approved': 'Approved',
    'post.status.rejected': 'Rejected',
    'post.status.live': 'Live',
    'post.status.deal_locked': 'Deal Locked',
    'post.status.harvesting': 'Harvesting',
    'post.status.completed': 'Completed',
    'features.verified_crops': 'Verified Crops',
    'features.verified_crops_desc': 'All crop listings are verified with geotagged photos and location data',
    'features.direct_connection': 'Direct Connection',
    'features.direct_connection_desc': 'Connect directly with farmers without middlemen',
    'features.fair_pricing': 'Fair Pricing',
    'features.fair_pricing_desc': 'Transparent pricing with fair market rates',
    'features.secure_transactions': 'Secure Transactions',
    'features.secure_transactions_desc': 'Safe and secure payment processing',
    'nav.register': 'Register'
  },
  hi: {
    'app.title': 'स्मार्ट कृषि एक्सचेंज',
    'nav.home': 'होम',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.post_crop': 'फसल पोस्ट करें',
    'nav.my_posts': 'मेरे पोस्ट',
    'nav.advice': 'फसल सलाह',
    'nav.search': 'खोजें',
    'nav.login': 'लॉगिन',
    'nav.logout': 'लॉगआउट',
    'common.submit': 'जमा करें',
    'common.cancel': 'रद्द करें',
    'common.save': 'सेव करें',
    'common.delete': 'डिलीट करें',
    'common.edit': 'एडिट करें',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'auth.phone': 'फोन नंबर',
    'auth.otp': 'OTP',
    'auth.send_otp': 'OTP भेजें',
    'auth.verify_otp': 'OTP वेरिफाई करें',
    'auth.register': 'रजिस्टर करें',
    'auth.login': 'लॉगिन',
    'auth.logout': 'लॉगआउट',
    'auth.name': 'नाम',
    'auth.email': 'ईमेल',
    'auth.role': 'भूमिका',
    'auth.farmer': 'किसान',
    'auth.buyer': 'खरीदार',
    'auth.village': 'गाँव',
    'auth.district': 'जिला',
    'auth.state': 'राज्य',
    'crop.type': 'फसल का प्रकार',
    'crop.variety': 'किस्म',
    'crop.sow_date': 'बुवाई की तारीख',
    'crop.harvest_date': 'अपेक्षित कटाई की तारीख',
    'crop.yield': 'अपेक्षित उपज (किलो/एकड़)',
    'crop.price': 'न्यूनतम अपेक्षित मूल्य (₹)',
    'crop.quantity': 'मात्रा',
    'crop.description': 'विवरण',
    'crop.photos': 'तस्वीरें',
    'crop.take_photo': 'तस्वीर लें',
    'crop.location': 'स्थान',
    'post.create': 'फसल पोस्ट बनाएं',
    'post.update': 'पोस्ट अपडेट करें',
    'post.status.pending': 'सत्यापन लंबित',
    'post.status.approved': 'अनुमोदित',
    'post.status.rejected': 'अस्वीकृत',
    'post.status.live': 'लाइव',
    'post.status.deal_locked': 'डील लॉक',
    'post.status.harvesting': 'कटाई',
    'post.status.completed': 'पूर्ण',
    'features.verified_crops': 'सत्यापित फसलें',
    'features.verified_crops_desc': 'सभी फसल सूचियां भू-टैग की गई तस्वीरों और स्थान डेटा के साथ सत्यापित हैं',
    'features.direct_connection': 'प्रत्यक्ष संबंध',
    'features.direct_connection_desc': 'बिचौलियों के बिना सीधे किसानों से जुड़ें',
    'features.fair_pricing': 'उचित मूल्य निर्धारण',
    'features.fair_pricing_desc': 'उचित बाजार दरों के साथ पारदर्शी मूल्य निर्धारण',
    'features.secure_transactions': 'सुरक्षित लेनदेन',
    'features.secure_transactions_desc': 'सुरक्षित भुगतान प्रसंस्करण',
    'nav.register': 'रजिस्टर करें'
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>('en');

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage: handleSetLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
