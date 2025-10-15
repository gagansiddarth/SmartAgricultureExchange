import React, { useState } from 'react';
import { Search as SearchIcon, Filter, MapPin, Calendar, DollarSign, Star, Truck, Shield } from 'lucide-react';

interface CropListing {
  id: string;
  name: string;
  variety: string;
  quantity: number;
  unit: string;
  price: number;
  farmer: {
    name: string;
    location: string;
    state: string;
    district: string;
    rating: number;
    verified: boolean;
  };
  harvestDate: string;
  certification: string[];
  images: string[];
  description: string;
  availableUntil: string;
  minimumOrder: number;
}

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [sortBy, setSortBy] = useState('price');

  // Auto-generated Indian crop data
  const cropListings: CropListing[] = [
    {
      id: '1',
      name: 'Basmati Rice',
      variety: 'Pusa Basmati 1121',
      quantity: 500,
      unit: 'quintals',
      price: 3200,
      farmer: {
        name: 'Rajesh Kumar',
        location: 'Karnal',
        state: 'Haryana',
        district: 'Karnal',
        rating: 4.8,
        verified: true
      },
      harvestDate: '2024-11-15',
      certification: ['Organic', 'FSSAI'],
      images: ['rice1.jpg'],
      description: 'Premium quality Basmati rice with excellent aroma and long grain. Grown using traditional methods.',
      availableUntil: '2025-02-15',
      minimumOrder: 10
    },
    {
      id: '2',
      name: 'Wheat',
      variety: 'HD-3086',
      quantity: 800,
      unit: 'quintals',
      price: 2200,
      farmer: {
        name: 'Suresh Patel',
        location: 'Meerut',
        state: 'Uttar Pradesh',
        district: 'Meerut',
        rating: 4.6,
        verified: true
      },
      harvestDate: '2024-04-20',
      certification: ['FSSAI'],
      images: ['wheat1.jpg'],
      description: 'High-quality wheat suitable for flour production. Good protein content and yield.',
      availableUntil: '2025-01-20',
      minimumOrder: 20
    },
    {
      id: '3',
      name: 'Sugarcane',
      variety: 'Co-86032',
      quantity: 1200,
      unit: 'tons',
      price: 2800,
      farmer: {
        name: 'Manoj Singh',
        location: 'Muzaffarnagar',
        state: 'Uttar Pradesh',
        district: 'Muzaffarnagar',
        rating: 4.7,
        verified: true
      },
      harvestDate: '2024-12-01',
      certification: ['FSSAI'],
      images: ['sugarcane1.jpg'],
      description: 'High sucrose content sugarcane, perfect for sugar mills and jaggery production.',
      availableUntil: '2025-03-01',
      minimumOrder: 50
    },
    {
      id: '4',
      name: 'Cotton',
      variety: 'Bt Cotton',
      quantity: 300,
      unit: 'quintals',
      price: 6500,
      farmer: {
        name: 'Kiran Reddy',
        location: 'Guntur',
        state: 'Andhra Pradesh',
        district: 'Guntur',
        rating: 4.9,
        verified: true
      },
      harvestDate: '2024-10-15',
      certification: ['Organic', 'GOTS'],
      images: ['cotton1.jpg'],
      description: 'Premium quality Bt cotton with excellent fiber length and strength.',
      availableUntil: '2025-02-15',
      minimumOrder: 5
    },
    {
      id: '5',
      name: 'Maize',
      variety: 'Hybrid Maize',
      quantity: 600,
      unit: 'quintals',
      price: 1800,
      farmer: {
        name: 'Ravi Sharma',
        location: 'Nashik',
        state: 'Maharashtra',
        district: 'Nashik',
        rating: 4.5,
        verified: true
      },
      harvestDate: '2024-09-30',
      certification: ['FSSAI'],
      images: ['maize1.jpg'],
      description: 'High-yield hybrid maize suitable for both human consumption and animal feed.',
      availableUntil: '2025-01-30',
      minimumOrder: 15
    },
    {
      id: '6',
      name: 'Potato',
      variety: 'Kufri Jyoti',
      quantity: 200,
      unit: 'quintals',
      price: 1500,
      farmer: {
        name: 'Amit Kumar',
        location: 'Hooghly',
        state: 'West Bengal',
        district: 'Hooghly',
        rating: 4.4,
        verified: true
      },
      harvestDate: '2024-12-10',
      certification: ['FSSAI'],
      images: ['potato1.jpg'],
      description: 'Fresh potatoes with good starch content, suitable for both table and processing.',
      availableUntil: '2025-02-10',
      minimumOrder: 25
    },
    {
      id: '7',
      name: 'Tomato',
      variety: 'Pusa Ruby',
      quantity: 150,
      unit: 'quintals',
      price: 2500,
      farmer: {
        name: 'Sunita Devi',
        location: 'Kolar',
        state: 'Karnataka',
        district: 'Kolar',
        rating: 4.6,
        verified: true
      },
      harvestDate: '2024-11-25',
      certification: ['Organic', 'FSSAI'],
      images: ['tomato1.jpg'],
      description: 'Fresh, juicy tomatoes with excellent color and taste. Perfect for both fresh consumption and processing.',
      availableUntil: '2025-01-25',
      minimumOrder: 10
    },
    {
      id: '8',
      name: 'Onion',
      variety: 'Nashik Red',
      quantity: 400,
      unit: 'quintals',
      price: 1800,
      farmer: {
        name: 'Vikram Jadhav',
        location: 'Nashik',
        state: 'Maharashtra',
        district: 'Nashik',
        rating: 4.7,
        verified: true
      },
      harvestDate: '2024-11-20',
      certification: ['FSSAI'],
      images: ['onion1.jpg'],
      description: 'Premium quality red onions with strong flavor and good storage life.',
      availableUntil: '2025-02-20',
      minimumOrder: 20
    },
    {
      id: '9',
      name: 'Turmeric',
      variety: 'Kasturi',
      quantity: 80,
      unit: 'quintals',
      price: 12000,
      farmer: {
        name: 'Lakshmi Nair',
        location: 'Erode',
        state: 'Tamil Nadu',
        district: 'Erode',
        rating: 4.8,
        verified: true
      },
      harvestDate: '2024-11-05',
      certification: ['Organic', 'FSSAI'],
      images: ['turmeric1.jpg'],
      description: 'Premium quality Kasturi turmeric with high curcumin content and excellent aroma.',
      availableUntil: '2025-03-05',
      minimumOrder: 2
    },
    {
      id: '10',
      name: 'Chilli',
      variety: 'Guntur Sannam',
      quantity: 100,
      unit: 'quintals',
      price: 8000,
      farmer: {
        name: 'Ramesh Babu',
        location: 'Guntur',
        state: 'Andhra Pradesh',
        district: 'Guntur',
        rating: 4.9,
        verified: true
      },
      harvestDate: '2024-10-30',
      certification: ['FSSAI'],
      images: ['chilli1.jpg'],
      description: 'High pungency Guntur chillies, perfect for spice industry and culinary use.',
      availableUntil: '2025-02-28',
      minimumOrder: 5
    }
  ];

  const categories = ['all', 'cereals', 'vegetables', 'spices', 'cash-crops'];
  const states = ['all', 'Haryana', 'Uttar Pradesh', 'Andhra Pradesh', 'Maharashtra', 'West Bengal', 'Karnataka', 'Tamil Nadu'];

  const filteredCrops = cropListings.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.farmer.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           (selectedCategory === 'cereals' && ['Rice', 'Wheat', 'Maize'].includes(crop.name)) ||
                           (selectedCategory === 'vegetables' && ['Tomato', 'Onion', 'Potato'].includes(crop.name)) ||
                           (selectedCategory === 'spices' && ['Turmeric', 'Chilli'].includes(crop.name)) ||
                           (selectedCategory === 'cash-crops' && ['Cotton', 'Sugarcane'].includes(crop.name));
    const matchesState = selectedState === 'all' || crop.farmer.state === selectedState;
    
    return matchesSearch && matchesCategory && matchesState;
  });

  const sortedCrops = [...filteredCrops].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'quantity':
        return b.quantity - a.quantity;
      case 'rating':
        return b.farmer.rating - a.farmer.rating;
      default:
        return 0;
    }
  });

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🛒 Marketplace</h1>
          <p className="text-gray-600">Discover and buy verified crops from farmers across India</p>
          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              328 verified listings
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              127 active farmers
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Bar */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search crops, varieties, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="cereals">Cereals</option>
              <option value="vegetables">Vegetables</option>
              <option value="spices">Spices</option>
              <option value="cash-crops">Cash Crops</option>
            </select>

            {/* State Filter */}
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All States</option>
              {states.slice(1).map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="price">Sort by Price</option>
              <option value="quantity">Sort by Quantity</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{sortedCrops.length}</span> crops
            {searchTerm && ` matching "${searchTerm}"`}
            {selectedState !== 'all' && ` from ${selectedState}`}
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Crop Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedCrops.map((crop) => (
            <div key={crop.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Crop Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">🌾</div>
                  <div className="text-sm opacity-90">{crop.name}</div>
                </div>
              </div>

              {/* Crop Details */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{crop.name}</h3>
                  <span className="text-2xl font-bold text-green-600">{formatPrice(crop.price)}</span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{crop.variety}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {crop.quantity} {crop.unit} • {crop.farmer.location}, {crop.farmer.state}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Harvested: {formatDate(crop.harvestDate)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Truck className="w-4 h-4 mr-2" />
                    Available until: {formatDate(crop.availableUntil)}
                  </div>
                </div>

                {/* Farmer Info */}
                <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 font-semibold text-sm">
                        {crop.farmer.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{crop.farmer.name}</div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                        {crop.farmer.rating}
                        {crop.farmer.verified && (
                          <Shield className="w-4 h-4 ml-2 text-green-500" title="Verified Farmer" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {crop.certification.map((cert, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {cert}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{crop.description}</p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    Contact Farmer
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    View Details
                  </button>
                </div>

                {/* Minimum Order */}
                <div className="mt-3 text-center">
                  <span className="text-xs text-gray-500">
                    Minimum order: {crop.minimumOrder} {crop.unit}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {sortedCrops.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No crops found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
