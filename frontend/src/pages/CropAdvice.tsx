import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Droplets, 
  Sun, 
  TreePine, 
  MessageCircle,
  CheckCircle,
  LogOut,
  Globe,
  Menu
} from 'lucide-react';

interface FarmAssessment {
  farmSize: string;
  location: string;
  soilType: string;
  irrigation: string;
  experience: string;
  currentCrops: string[];
  challenges: string[];
}

const CropAdvice: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [language, setLanguage] = useState<'english' | 'hindi' | 'tamil'>('english');
  const [showMenu, setShowMenu] = useState(false);
  const [assessment, setAssessment] = useState<FarmAssessment>({
    farmSize: '',
    location: '',
    soilType: '',
    irrigation: '',
    experience: '',
    currentCrops: [],
    challenges: []
  });
  const [showAdvice, setShowAdvice] = useState(false);

  const translations = {
    english: {
      cropAdvice: 'Crop Advice',
      farmAssessment: 'Farm Assessment',
      completeAssessment: 'Complete your farm assessment to get personalized crop advice',
      farmSize: 'Farm Size',
      farmSizePlaceholder: 'Select your farm size',
      location: 'Location',
      locationPlaceholder: 'Enter your village/district',
      soilType: 'Soil Type',
      soilTypePlaceholder: 'Select soil type',
      irrigation: 'Irrigation',
      irrigationPlaceholder: 'Select irrigation method',
      experience: 'Farming Experience',
      experiencePlaceholder: 'Select your experience level',
      currentCrops: 'Current Crops',
      currentCropsPlaceholder: 'Select crops you grow',
      challenges: 'Main Challenges',
      challengesPlaceholder: 'Select your main challenges',
      next: 'Next',
      previous: 'Previous',
      getAdvice: 'Get Advice',
      chatWithExpert: 'Chat with Expert',
      expertAdvice: 'Expert Advice',
      basedOnAssessment: 'Based on your farm assessment',
      personalizedAdvice: 'Here\'s your personalized crop advice',
      recommendedCrops: 'Recommended Crops',
      cultivationTips: 'Cultivation Tips',
      marketInsights: 'Market Insights',
      logout: 'Logout',
      english: 'English',
      hindi: 'हिंदी',
      tamil: 'தமிழ்'
    },
    hindi: {
      cropAdvice: 'फसल सलाह',
      farmAssessment: 'खेत मूल्यांकन',
      completeAssessment: 'व्यक्तिगत फसल सलाह के लिए अपना खेत मूल्यांकन पूरा करें',
      farmSize: 'खेत का आकार',
      farmSizePlaceholder: 'अपने खेत का आकार चुनें',
      location: 'स्थान',
      locationPlaceholder: 'अपना गाँव/जिला दर्ज करें',
      soilType: 'मिट्टी का प्रकार',
      soilTypePlaceholder: 'मिट्टी का प्रकार चुनें',
      irrigation: 'सिंचाई',
      irrigationPlaceholder: 'सिंचाई का तरीका चुनें',
      experience: 'खेती का अनुभव',
      experiencePlaceholder: 'अपना अनुभव स्तर चुनें',
      currentCrops: 'वर्तमान फसलें',
      currentCropsPlaceholder: 'उगाई जाने वाली फसलें चुनें',
      challenges: 'मुख्य चुनौतियां',
      challengesPlaceholder: 'अपनी मुख्य चुनौतियां चुनें',
      next: 'अगला',
      previous: 'पिछला',
      getAdvice: 'सलाह लें',
      chatWithExpert: 'विशेषज्ञ से चैट करें',
      expertAdvice: 'विशेषज्ञ सलाह',
      basedOnAssessment: 'आपके खेत मूल्यांकन के आधार पर',
      personalizedAdvice: 'यहाँ आपकी व्यक्तिगत फसल सलाह है',
      recommendedCrops: 'अनुशंसित फसलें',
      cultivationTips: 'खेती के सुझाव',
      marketInsights: 'बाजार अंतर्दृष्टि',
      logout: 'लॉगआउट',
      english: 'अंग्रेजी',
      hindi: 'हिंदी',
      tamil: 'தமிழ்'
    },
    tamil: {
      cropAdvice: 'பயிர் ஆலோசனை',
      farmAssessment: 'விவசாய நில மதிப்பீடு',
      completeAssessment: 'தனிப்பட்ட பயிர் ஆலோசனையைப் பெற உங்கள் விவசாய நில மதிப்பீட்டை முடிக்கவும்',
      farmSize: 'விவசாய நில அளவு',
      farmSizePlaceholder: 'உங்கள் விவசாய நில அளவைத் தேர்ந்தெடுக்கவும்',
      location: 'இடம்',
      locationPlaceholder: 'உங்கள் கிராமம்/மாவட்டத்தை உள்ளிடவும்',
      soilType: 'மண் வகை',
      soilTypePlaceholder: 'மண் வகையைத் தேர்ந்தெடுக்கவும்',
      irrigation: 'பாசனம்',
      irrigationPlaceholder: 'பாசன முறையைத் தேர்ந்தெடுக்கவும்',
      experience: 'விவசாய அனுபவம்',
      experiencePlaceholder: 'உங்கள் அனுபவ நிலையைத் தேர்ந்தெடுக்கவும்',
      currentCrops: 'தற்போதைய பயிர்கள்',
      currentCropsPlaceholder: 'நீங்கள் வளர்க்கும் பயிர்களைத் தேர்ந்தெடுக்கவும்',
      challenges: 'முக்கிய சவால்கள்',
      challengesPlaceholder: 'உங்கள் முக்கிய சவால்களைத் தேர்ந்தெடுக்கவும்',
      next: 'அடுத்து',
      previous: 'முந்தைய',
      getAdvice: 'ஆலோசனை பெறுங்கள்',
      chatWithExpert: 'நிபுணருடன் அரட்டை',
      expertAdvice: 'நிபுணர் ஆலோசனை',
      basedOnAssessment: 'உங்கள் விவசாய நில மதிப்பீட்டின் அடிப்படையில்',
      personalizedAdvice: 'இங்கே உங்கள் தனிப்பட்ட பயிர் ஆலோசனை',
      recommendedCrops: 'பரிந்துரைக்கப்பட்ட பயிர்கள்',
      cultivationTips: 'வளர்ப்பு குறிப்புகள்',
      marketInsights: 'சந்தை நுண்ணறிவு',
      logout: 'வெளியேறு',
      english: 'English',
      hindi: 'हिंदी',
      tamil: 'தமிழ்'
    }
  };

  const t = translations[language];

  const handleLogout = async () => {
    try {
      localStorage.removeItem('demo_user');
      await import('../lib/supabase').then(({ supabase }) => supabase.auth.signOut());
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    }
  };

  const farmSizeOptions = [
    { value: 'small', label: language === 'english' ? 'Less than 1 acre' : language === 'hindi' ? '1 एकड़ से कम' : '1 ஏக்கருக்கும் குறைவு' },
    { value: 'medium', label: language === 'english' ? '1-5 acres' : language === 'hindi' ? '1-5 एकड़' : '1-5 ஏக்கர்கள்' },
    { value: 'large', label: language === 'english' ? '5-20 acres' : language === 'hindi' ? '5-20 एकड़' : '5-20 ஏக்கர்கள்' },
    { value: 'very-large', label: language === 'english' ? 'More than 20 acres' : language === 'hindi' ? '20 एकड़ से अधिक' : '20 ஏக்கர்களுக்கும் மேல்' }
  ];

  const soilTypeOptions = [
    { value: 'clay', label: language === 'english' ? 'Clay Soil' : language === 'hindi' ? 'चिकनी मिट्टी' : 'களிமண் மண்' },
    { value: 'sandy', label: language === 'english' ? 'Sandy Soil' : language === 'hindi' ? 'बलुई मिट्टी' : 'மணல் மண்' },
    { value: 'loamy', label: language === 'english' ? 'Loamy Soil' : language === 'hindi' ? 'दोमट मिट्टी' : 'வளமான மண்' },
    { value: 'red', label: language === 'english' ? 'Red Soil' : language === 'hindi' ? 'लाल मिट्टी' : 'சிவப்பு மண்' },
    { value: 'black', label: language === 'english' ? 'Black Soil' : language === 'hindi' ? 'काली मिट्टी' : 'கருப்பு மண்' }
  ];

  const irrigationOptions = [
    { value: 'rain-fed', label: language === 'english' ? 'Rain-fed' : language === 'hindi' ? 'वर्षा आधारित' : 'மழை சார்ந்த' },
    { value: 'well', label: language === 'english' ? 'Well/Borewell' : language === 'hindi' ? 'कुआं/बोरवेल' : 'கிணறு/குழாய்' },
    { value: 'canal', label: language === 'english' ? 'Canal Irrigation' : language === 'hindi' ? 'नहर सिंचाई' : 'கால்வாய் பாசனம்' },
    { value: 'drip', label: language === 'english' ? 'Drip Irrigation' : language === 'hindi' ? 'ड्रिप सिंचाई' : 'டிரிப் பாசனம்' },
    { value: 'sprinkler', label: language === 'english' ? 'Sprinkler System' : language === 'hindi' ? 'स्प्रिंकलर सिस्टम' : 'ஸ்பிரிங்லர் அமைப்பு' }
  ];

  const experienceOptions = [
    { value: 'beginner', label: language === 'english' ? 'Beginner (0-2 years)' : language === 'hindi' ? 'शुरुआती (0-2 वर्ष)' : 'தொடக்கநிலை (0-2 வருடங்கள்)' },
    { value: 'intermediate', label: language === 'english' ? 'Intermediate (2-10 years)' : language === 'hindi' ? 'मध्यम (2-10 वर्ष)' : 'நடுத்தர (2-10 வருடங்கள்)' },
    { value: 'experienced', label: language === 'english' ? 'Experienced (10+ years)' : language === 'hindi' ? 'अनुभवी (10+ वर्ष)' : 'அனுபவம் (10+ வருடங்கள்)' }
  ];

  const cropOptions = [
    { value: 'rice', label: language === 'english' ? 'Rice' : language === 'hindi' ? 'चावल' : 'அரிசி' },
    { value: 'wheat', label: language === 'english' ? 'Wheat' : language === 'hindi' ? 'गेहूं' : 'கோதுமை' },
    { value: 'maize', label: language === 'english' ? 'Maize' : language === 'hindi' ? 'मक्का' : 'சோளம்' },
    { value: 'cotton', label: language === 'english' ? 'Cotton' : language === 'hindi' ? 'कपास' : 'பருத்தி' },
    { value: 'sugarcane', label: language === 'english' ? 'Sugarcane' : language === 'hindi' ? 'गन्ना' : 'கரும்பு' },
    { value: 'vegetables', label: language === 'english' ? 'Vegetables' : language === 'hindi' ? 'सब्जियां' : 'காய்கறிகள்' },
    { value: 'fruits', label: language === 'english' ? 'Fruits' : language === 'hindi' ? 'फल' : 'பழங்கள்' },
    { value: 'pulses', label: language === 'english' ? 'Pulses' : language === 'hindi' ? 'दालें' : 'பருப்பு வகைகள்' }
  ];

  const challengeOptions = [
    { value: 'pests', label: language === 'english' ? 'Pest Control' : language === 'hindi' ? 'कीट नियंत्रण' : 'பூச்சி கட்டுப்பாடு' },
    { value: 'diseases', label: language === 'english' ? 'Plant Diseases' : language === 'hindi' ? 'पौध रोग' : 'தாவர நோய்கள்' },
    { value: 'weather', label: language === 'english' ? 'Weather Issues' : language === 'hindi' ? 'मौसम की समस्या' : 'வானிலை பிரச்சினைகள்' },
    { value: 'water', label: language === 'english' ? 'Water Management' : language === 'hindi' ? 'पानी प्रबंधन' : 'நீர் மேலாண்மை' },
    { value: 'soil', label: language === 'english' ? 'Soil Fertility' : language === 'hindi' ? 'मिट्टी की उर्वरता' : 'மண் வளம்' },
    { value: 'market', label: language === 'english' ? 'Market Access' : language === 'hindi' ? 'बाजार पहुंच' : 'சந்தை அணுகல்' }
  ];

  const steps = [
    { key: 'farmSize', icon: TreePine },
    { key: 'location', icon: MapPin },
    { key: 'soilType', icon: Droplets },
    { key: 'irrigation', icon: Sun },
    { key: 'experience', icon: CheckCircle },
    { key: 'currentCrops', icon: TreePine },
    { key: 'challenges', icon: MessageCircle }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowAdvice(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleMultiSelect = (key: keyof FarmAssessment, value: string) => {
    const currentValues = assessment[key] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    setAssessment(prev => ({ ...prev, [key]: newValues }));
  };

  const handleSingleSelect = (key: keyof FarmAssessment, value: string) => {
    setAssessment(prev => ({ ...prev, [key]: value }));
  };

  const renderStep = () => {
    const step = steps[currentStep];
    const Icon = step.icon;

    switch (step.key) {
      case 'farmSize':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.farmSize}</h2>
              <p className="text-gray-600">{t.farmSizePlaceholder}</p>
            </div>
            <div className="space-y-3">
              {farmSizeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSingleSelect('farmSize', option.value)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    assessment.farmSize === option.value
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-emerald-300 text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.location}</h2>
              <p className="text-gray-600">{t.locationPlaceholder}</p>
            </div>
            <input
              type="text"
              value={assessment.location}
              onChange={(e) => handleSingleSelect('location', e.target.value)}
              placeholder={t.locationPlaceholder}
              className="w-full p-4 border-2 border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
        );

      case 'soilType':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.soilType}</h2>
              <p className="text-gray-600">{t.soilTypePlaceholder}</p>
            </div>
            <div className="space-y-3">
              {soilTypeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSingleSelect('soilType', option.value)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    assessment.soilType === option.value
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-emerald-300 text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        );

      case 'irrigation':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.irrigation}</h2>
              <p className="text-gray-600">{t.irrigationPlaceholder}</p>
            </div>
            <div className="space-y-3">
              {irrigationOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSingleSelect('irrigation', option.value)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    assessment.irrigation === option.value
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-emerald-300 text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.experience}</h2>
              <p className="text-gray-600">{t.experiencePlaceholder}</p>
            </div>
            <div className="space-y-3">
              {experienceOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSingleSelect('experience', option.value)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    assessment.experience === option.value
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-emerald-300 text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        );

      case 'currentCrops':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.currentCrops}</h2>
              <p className="text-gray-600">{t.currentCropsPlaceholder}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {cropOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleMultiSelect('currentCrops', option.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-all text-sm ${
                    assessment.currentCrops.includes(option.value)
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-emerald-300 text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        );

      case 'challenges':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.challenges}</h2>
              <p className="text-gray-600">{t.challengesPlaceholder}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {challengeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleMultiSelect('challenges', option.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-all text-sm ${
                    assessment.challenges.includes(option.value)
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-emerald-300 text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (showAdvice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-emerald-100">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowAdvice(false)}
                  className="p-3 hover:bg-emerald-50 rounded-2xl transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-emerald-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{t.expertAdvice}</h1>
                  <p className="text-gray-600">{t.basedOnAssessment}</p>
                </div>
              </div>
              
              {/* Language Toggle & Logout */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center space-x-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {language === 'english' ? 'EN' : language === 'hindi' ? 'हिं' : 'த'}
                    </span>
                    <Menu className="w-4 h-4" />
                  </button>
                  
                  {showMenu && (
                    <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-lg border border-emerald-100 py-1 z-50">
                      <button
                        onClick={() => { setLanguage('english'); setShowMenu(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 ${language === 'english' ? 'text-emerald-700 font-medium' : 'text-gray-700'}`}
                      >
                        {t.english}
                      </button>
                      <button
                        onClick={() => { setLanguage('hindi'); setShowMenu(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 ${language === 'hindi' ? 'text-emerald-700 font-medium' : 'text-gray-700'}`}
                      >
                        {t.hindi}
                      </button>
                      <button
                        onClick={() => { setLanguage('tamil'); setShowMenu(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 ${language === 'tamil' ? 'text-emerald-700 font-medium' : 'text-gray-700'}`}
                      >
                        {t.tamil}
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">{t.logout}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-emerald-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">{t.personalizedAdvice}</h2>
            
            <div className="space-y-8">
              {/* Recommended Crops */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <TreePine className="w-6 h-6 mr-3 text-emerald-600" />
                  {t.recommendedCrops}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['Rice', 'Wheat', 'Vegetables'].map((crop, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 text-center shadow-sm">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <TreePine className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h4 className="font-medium text-gray-800">{crop}</h4>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cultivation Tips */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3 text-blue-600" />
                  {t.cultivationTips}
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Based on your {assessment.soilType} soil, consider adding organic compost</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span>With {assessment.irrigation} irrigation, plan your planting schedule accordingly</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span>For your {assessment.farmSize} farm size, focus on high-value crops</span>
                  </li>
                </ul>
              </div>

              {/* Market Insights */}
              <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <MessageCircle className="w-6 h-6 mr-3 text-orange-600" />
                  {t.marketInsights}
                </h3>
                <p className="text-gray-700 mb-4">
                  Based on your location and current market trends, here are some insights for your farming decisions.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Price Trends</h4>
                    <p className="text-sm text-gray-600">Rice prices are expected to rise 15% in the next season</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Demand Forecast</h4>
                    <p className="text-sm text-gray-600">High demand for organic vegetables in your region</p>
                  </div>
                </div>
              </div>

              {/* Chat with Expert */}
              <div className="text-center pt-6">
                <button
                  onClick={() => navigate('/farmer-dashboard')}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {t.chatWithExpert}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/farmer-dashboard')}
                className="p-3 hover:bg-emerald-50 rounded-2xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-emerald-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t.cropAdvice}</h1>
                <p className="text-gray-600">{t.farmAssessment}</p>
              </div>
            </div>
            
            {/* Language Toggle & Logout */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center space-x-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg transition-all duration-200"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {language === 'english' ? 'EN' : language === 'hindi' ? 'हिं' : 'த'}
                  </span>
                  <Menu className="w-4 h-4" />
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-lg border border-emerald-100 py-1 z-50">
                    <button
                      onClick={() => { setLanguage('english'); setShowMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 ${language === 'english' ? 'text-emerald-700 font-medium' : 'text-gray-700'}`}
                    >
                      {t.english}
                    </button>
                    <button
                      onClick={() => { setLanguage('hindi'); setShowMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 ${language === 'hindi' ? 'text-emerald-700 font-medium' : 'text-gray-700'}`}
                    >
                      {t.hindi}
                    </button>
                    <button
                      onClick={() => { setLanguage('tamil'); setShowMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 ${language === 'tamil' ? 'text-emerald-700 font-medium' : 'text-gray-700'}`}
                    >
                      {t.tamil}
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">{t.logout}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              {language === 'english' ? `Step ${currentStep + 1} of ${steps.length}` : 
               language === 'hindi' ? `चरण ${currentStep + 1} का ${steps.length}` : 
               `படி ${currentStep + 1} இன் ${steps.length}`}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-emerald-100">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            {t.previous}
          </button>
          
          <button
            onClick={handleNext}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {currentStep === steps.length - 1 ? t.getAdvice : t.next}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropAdvice;