import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  MapPin,
  Calendar,
  SortAsc,
  SortDesc,
  LogOut,
  Globe,
  Menu
} from 'lucide-react';

interface PriceData {
  id: string;
  crop_name: string;
  variety_name?: string;
  current_price: number;
  unit: string;
  change_percentage: number;
  trend: 'up' | 'down' | 'stable';
  market: string;
  location: string;
  last_updated: string;
  category: 'cereals' | 'vegetables' | 'fruits' | 'pulses' | 'spices' | 'oilseeds';
}

const FindPrice: React.FC = () => {
  const navigate = useNavigate();
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [filteredPrices, setFilteredPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'change'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [language, setLanguage] = useState<'english' | 'hindi' | 'tamil'>('english');
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    fetchPriceData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [prices, searchTerm, selectedCategory, sortBy, sortOrder]);

  const fetchPriceData = async () => {
    try {
      setLoading(true);
      
      // Mock comprehensive price data - 100+ items
      const mockPrices: PriceData[] = [
        // Cereals (25 items)
        { id: '1', crop_name: 'Rice', variety_name: 'Basmati 1121', current_price: 3500, unit: 'quintal', change_percentage: 2.5, trend: 'up', market: 'Delhi APMC', location: 'Delhi', last_updated: '2024-01-15T10:30:00Z', category: 'cereals' },
        { id: '2', crop_name: 'Rice', variety_name: 'Sona Masoori', current_price: 2800, unit: 'quintal', change_percentage: 1.8, trend: 'up', market: 'Andhra Pradesh APMC', location: 'Andhra Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'cereals' },
        { id: '3', crop_name: 'Rice', variety_name: 'Non-Basmati', current_price: 2200, unit: 'quintal', change_percentage: -0.5, trend: 'down', market: 'West Bengal APMC', location: 'West Bengal', last_updated: '2024-01-15T10:30:00Z', category: 'cereals' },
        { id: '4', crop_name: 'Wheat', variety_name: 'Durum', current_price: 2200, unit: 'quintal', change_percentage: 1.2, trend: 'up', market: 'Punjab APMC', location: 'Punjab', last_updated: '2024-01-15T10:30:00Z', category: 'cereals' },
        { id: '5', crop_name: 'Wheat', variety_name: 'Soft Red', current_price: 2100, unit: 'quintal', change_percentage: 0.8, trend: 'up', market: 'Haryana APMC', location: 'Haryana', last_updated: '2024-01-15T10:30:00Z', category: 'cereals' },
        { id: '6', crop_name: 'Wheat', variety_name: 'Hard Red', current_price: 2250, unit: 'quintal', change_percentage: 2.1, trend: 'up', market: 'Uttar Pradesh APMC', location: 'Uttar Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'cereals' },
        { id: '7', crop_name: 'Maize', variety_name: 'Hybrid', current_price: 2100, unit: 'quintal', change_percentage: 2.8, trend: 'up', market: 'Karnataka APMC', location: 'Karnataka', last_updated: '2024-01-15T10:30:00Z', category: 'cereals' },
        { id: '8', crop_name: 'Maize', variety_name: 'Sweet Corn', current_price: 1800, unit: 'quintal', change_percentage: 1.5, trend: 'up', market: 'Maharashtra APMC', location: 'Maharashtra', last_updated: '2024-01-15T10:30:00Z', category: 'cereals' },
        { id: '9', crop_name: 'Sugarcane', variety_name: 'Co 86032', current_price: 3200, unit: 'quintal', change_percentage: 0.5, trend: 'up', market: 'Maharashtra APMC', location: 'Maharashtra', last_updated: '2024-01-15T10:30:00Z', category: 'cereals' },
        { id: '10', crop_name: 'Sugarcane', variety_name: 'Co 8371', current_price: 3150, unit: 'quintal', change_percentage: 0.3, trend: 'up', market: 'Uttar Pradesh APMC', location: 'Uttar Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'cereals' },
        { id: '11', crop_name: 'Barley', variety_name: 'Malting', current_price: 1800, unit: 'quintal', change_percentage: 1.8, trend: 'up', market: 'Rajasthan APMC', location: 'Rajasthan', last_updated: '2024-01-15T10:30:00Z', category: 'cereals' },
        { id: '12', crop_name: 'Barley', variety_name: 'Feed', current_price: 1650, unit: 'quintal', change_percentage: 1.2, trend: 'up', market: 'Haryana APMC', location: 'Haryana', last_updated: '2024-01-15T10:30:00Z', category: 'cereals' },
        { id: '13', crop_name: 'Oats', variety_name: 'Rolled', current_price: 2200, unit: 'quintal', change_percentage: 2.5, trend: 'up', market: 'Himachal Pradesh APMC', location: 'Himachal Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'cereals' },
        { id: '14', crop_name: 'Rye', variety_name: 'Winter', current_price: 2400, unit: 'quintal', change_percentage: 1.9, trend: 'up', market: 'Jammu & Kashmir APMC', location: 'Jammu & Kashmir', last_updated: '2024-01-15T10:30:00Z', category: 'cereals' },
        { id: '15', crop_name: 'Millet', variety_name: 'Pearl', current_price: 1800, unit: 'quintal', change_percentage: 2.2, trend: 'up', market: 'Rajasthan APMC', location: 'Rajasthan', last_updated: '2024-01-15T10:30:00Z', category: 'cereals' },
        { id: '16', crop_name: 'Millet', variety_name: 'Finger', current_price: 2100, unit: 'quintal', change_percentage: 1.8, trend: 'up', market: 'Karnataka APMC', location: 'Karnataka', last_updated: '2024-01-15T10:30:00Z', category: 'cereals' },
        { id: '17', crop_name: 'Millet', variety_name: 'Foxtail', current_price: 1900, unit: 'quintal', change_percentage: 2.1, trend: 'up', market: 'Tamil Nadu APMC', location: 'Tamil Nadu', last_updated: '2024-01-15T10:30:00Z', category: 'cereals' },
        { id: '18', crop_name: 'Sorghum', variety_name: 'Sweet', current_price: 1750, unit: 'quintal', change_percentage: 1.5, trend: 'up', market: 'Maharashtra APMC', location: 'Maharashtra', last_updated: '2024-01-15T10:30:00Z', category: 'cereals' },
        { id: '19', crop_name: 'Sorghum', variety_name: 'Grain', current_price: 1650, unit: 'quintal', change_percentage: 1.2, trend: 'up', market: 'Karnataka APMC', location: 'Karnataka', last_updated: '2024-01-15T10:30:00Z', category: 'cereals' },
        { id: '20', crop_name: 'Quinoa', variety_name: 'Organic', current_price: 4500, unit: 'quintal', change_percentage: 3.5, trend: 'up', market: 'Himachal Pradesh APMC', location: 'Himachal Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'cereals' },
        { id: '21', crop_name: 'Buckwheat', variety_name: 'Common', current_price: 2800, unit: 'quintal', change_percentage: 2.8, trend: 'up', market: 'Uttarakhand APMC', location: 'Uttarakhand', last_updated: '2024-01-15T10:30:00Z', category: 'cereals' },
        { id: '22', crop_name: 'Amaranth', variety_name: 'Grain', current_price: 3200, unit: 'quintal', change_percentage: 3.2, trend: 'up', market: 'Himachal Pradesh APMC', location: 'Himachal Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'cereals' },
        { id: '23', crop_name: 'Teff', variety_name: 'White', current_price: 3800, unit: 'quintal', change_percentage: 4.1, trend: 'up', market: 'Himachal Pradesh APMC', location: 'Himachal Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'cereals' },
        { id: '24', crop_name: 'Spelt', variety_name: 'Ancient', current_price: 2600, unit: 'quintal', change_percentage: 2.9, trend: 'up', market: 'Jammu & Kashmir APMC', location: 'Jammu & Kashmir', last_updated: '2024-01-15T10:30:00Z', category: 'cereals' },
        { id: '25', crop_name: 'Triticale', variety_name: 'Hybrid', current_price: 2000, unit: 'quintal', change_percentage: 1.7, trend: 'up', market: 'Haryana APMC', location: 'Haryana', last_updated: '2024-01-15T10:30:00Z', category: 'cereals' },
        
        // Vegetables (30 items)
        { id: '26', crop_name: 'Tomato', variety_name: 'Hybrid', current_price: 45, unit: 'kg', change_percentage: -3.1, trend: 'down', market: 'Bangalore APMC', location: 'Bangalore', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '27', crop_name: 'Tomato', variety_name: 'Cherry', current_price: 65, unit: 'kg', change_percentage: -2.5, trend: 'down', market: 'Maharashtra APMC', location: 'Maharashtra', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '28', crop_name: 'Tomato', variety_name: 'Roma', current_price: 42, unit: 'kg', change_percentage: -2.8, trend: 'down', market: 'Tamil Nadu APMC', location: 'Tamil Nadu', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '29', crop_name: 'Onion', variety_name: 'Red', current_price: 35, unit: 'kg', change_percentage: 0.8, trend: 'up', market: 'Nashik APMC', location: 'Nashik', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '30', crop_name: 'Onion', variety_name: 'White', current_price: 32, unit: 'kg', change_percentage: 1.2, trend: 'up', market: 'Karnataka APMC', location: 'Karnataka', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '31', crop_name: 'Onion', variety_name: 'Yellow', current_price: 38, unit: 'kg', change_percentage: 0.5, trend: 'up', market: 'Rajasthan APMC', location: 'Rajasthan', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '32', crop_name: 'Potato', variety_name: 'Kufri', current_price: 28, unit: 'kg', change_percentage: 1.5, trend: 'up', market: 'UP APMC', location: 'Uttar Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '33', crop_name: 'Potato', variety_name: 'Russet', current_price: 32, unit: 'kg', change_percentage: 1.8, trend: 'up', market: 'Punjab APMC', location: 'Punjab', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '34', crop_name: 'Potato', variety_name: 'Sweet', current_price: 45, unit: 'kg', change_percentage: 2.5, trend: 'up', market: 'West Bengal APMC', location: 'West Bengal', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '35', crop_name: 'Cabbage', variety_name: 'Golden Acre', current_price: 22, unit: 'kg', change_percentage: -1.2, trend: 'down', market: 'Tamil Nadu APMC', location: 'Tamil Nadu', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '36', crop_name: 'Cabbage', variety_name: 'Red', current_price: 28, unit: 'kg', change_percentage: -0.8, trend: 'down', market: 'Karnataka APMC', location: 'Karnataka', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '37', crop_name: 'Cauliflower', variety_name: 'Snowball', current_price: 38, unit: 'kg', change_percentage: 2.1, trend: 'up', market: 'Haryana APMC', location: 'Haryana', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '38', crop_name: 'Cauliflower', variety_name: 'Purple', current_price: 42, unit: 'kg', change_percentage: 2.8, trend: 'up', market: 'Maharashtra APMC', location: 'Maharashtra', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '39', crop_name: 'Brinjal', variety_name: 'Purple', current_price: 32, unit: 'kg', change_percentage: -0.5, trend: 'down', market: 'West Bengal APMC', location: 'West Bengal', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '40', crop_name: 'Brinjal', variety_name: 'White', current_price: 35, unit: 'kg', change_percentage: 0.3, trend: 'up', market: 'Tamil Nadu APMC', location: 'Tamil Nadu', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '41', crop_name: 'Okra', variety_name: 'Green', current_price: 48, unit: 'kg', change_percentage: 1.8, trend: 'up', market: 'Karnataka APMC', location: 'Karnataka', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '42', crop_name: 'Okra', variety_name: 'Red', current_price: 52, unit: 'kg', change_percentage: 2.2, trend: 'up', market: 'Tamil Nadu APMC', location: 'Tamil Nadu', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '43', crop_name: 'Cucumber', variety_name: 'English', current_price: 25, unit: 'kg', change_percentage: 1.2, trend: 'up', market: 'Haryana APMC', location: 'Haryana', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '44', crop_name: 'Cucumber', variety_name: 'Pickling', current_price: 22, unit: 'kg', change_percentage: 0.8, trend: 'up', market: 'Punjab APMC', location: 'Punjab', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '45', crop_name: 'Bottle Gourd', variety_name: 'Long', current_price: 18, unit: 'kg', change_percentage: 1.5, trend: 'up', market: 'Uttar Pradesh APMC', location: 'Uttar Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '46', crop_name: 'Bottle Gourd', variety_name: 'Round', current_price: 20, unit: 'kg', change_percentage: 1.8, trend: 'up', market: 'Rajasthan APMC', location: 'Rajasthan', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '47', crop_name: 'Ridge Gourd', variety_name: 'Green', current_price: 35, unit: 'kg', change_percentage: 2.1, trend: 'up', market: 'Karnataka APMC', location: 'Karnataka', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '48', crop_name: 'Bitter Gourd', variety_name: 'Indian', current_price: 42, unit: 'kg', change_percentage: 1.9, trend: 'up', market: 'Tamil Nadu APMC', location: 'Tamil Nadu', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '49', crop_name: 'Snake Gourd', variety_name: 'Long', current_price: 38, unit: 'kg', change_percentage: 2.3, trend: 'up', market: 'Kerala APMC', location: 'Kerala', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '50', crop_name: 'Ash Gourd', variety_name: 'White', current_price: 15, unit: 'kg', change_percentage: 1.1, trend: 'up', market: 'Andhra Pradesh APMC', location: 'Andhra Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '51', crop_name: 'Pumpkin', variety_name: 'Orange', current_price: 22, unit: 'kg', change_percentage: 1.4, trend: 'up', market: 'West Bengal APMC', location: 'West Bengal', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '52', crop_name: 'Spinach', variety_name: 'Baby', current_price: 28, unit: 'kg', change_percentage: 2.8, trend: 'up', market: 'Himachal Pradesh APMC', location: 'Himachal Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '53', crop_name: 'Spinach', variety_name: 'Mature', current_price: 25, unit: 'kg', change_percentage: 2.2, trend: 'up', market: 'Haryana APMC', location: 'Haryana', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '54', crop_name: 'Lettuce', variety_name: 'Iceberg', current_price: 35, unit: 'kg', change_percentage: 3.1, trend: 'up', market: 'Himachal Pradesh APMC', location: 'Himachal Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        { id: '55', crop_name: 'Lettuce', variety_name: 'Romaine', current_price: 32, unit: 'kg', change_percentage: 2.8, trend: 'up', market: 'Jammu & Kashmir APMC', location: 'Jammu & Kashmir', last_updated: '2024-01-15T10:30:00Z', category: 'vegetables' },
        
        // Fruits (25 items)
        { id: '56', crop_name: 'Mango', variety_name: 'Alphonso', current_price: 180, unit: 'kg', change_percentage: 5.2, trend: 'up', market: 'Maharashtra APMC', location: 'Maharashtra', last_updated: '2024-01-15T10:30:00Z', category: 'fruits' },
        { id: '57', crop_name: 'Mango', variety_name: 'Kesar', current_price: 160, unit: 'kg', change_percentage: 4.8, trend: 'up', market: 'Gujarat APMC', location: 'Gujarat', last_updated: '2024-01-15T10:30:00Z', category: 'fruits' },
        { id: '58', crop_name: 'Mango', variety_name: 'Dasheri', current_price: 140, unit: 'kg', change_percentage: 4.2, trend: 'up', market: 'Uttar Pradesh APMC', location: 'Uttar Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'fruits' },
        { id: '59', crop_name: 'Mango', variety_name: 'Langra', current_price: 135, unit: 'kg', change_percentage: 3.9, trend: 'up', market: 'West Bengal APMC', location: 'West Bengal', last_updated: '2024-01-15T10:30:00Z', category: 'fruits' },
        { id: '60', crop_name: 'Apple', variety_name: 'Red Delicious', current_price: 120, unit: 'kg', change_percentage: -2.3, trend: 'down', market: 'Himachal APMC', location: 'Himachal Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'fruits' },
        { id: '61', crop_name: 'Apple', variety_name: 'Golden Delicious', current_price: 115, unit: 'kg', change_percentage: -1.8, trend: 'down', market: 'Jammu & Kashmir APMC', location: 'Jammu & Kashmir', last_updated: '2024-01-15T10:30:00Z', category: 'fruits' },
        { id: '62', crop_name: 'Apple', variety_name: 'Granny Smith', current_price: 125, unit: 'kg', change_percentage: -2.1, trend: 'down', market: 'Uttarakhand APMC', location: 'Uttarakhand', last_updated: '2024-01-15T10:30:00Z', category: 'fruits' },
        { id: '63', crop_name: 'Apple', variety_name: 'Fuji', current_price: 130, unit: 'kg', change_percentage: -1.5, trend: 'down', market: 'Himachal Pradesh APMC', location: 'Himachal Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'fruits' },
        { id: '64', crop_name: 'Banana', variety_name: 'Cavendish', current_price: 35, unit: 'kg', change_percentage: 1.8, trend: 'up', market: 'Tamil Nadu APMC', location: 'Tamil Nadu', last_updated: '2024-01-15T10:30:00Z', category: 'fruits' },
        { id: '65', crop_name: 'Banana', variety_name: 'Red', current_price: 42, unit: 'kg', change_percentage: 2.2, trend: 'up', market: 'Kerala APMC', location: 'Kerala', last_updated: '2024-01-15T10:30:00Z', category: 'fruits' },
        { id: '66', crop_name: 'Banana', variety_name: 'Plantain', current_price: 38, unit: 'kg', change_percentage: 1.9, trend: 'up', market: 'Karnataka APMC', location: 'Karnataka', last_updated: '2024-01-15T10:30:00Z', category: 'fruits' },
        { id: '67', crop_name: 'Orange', variety_name: 'Nagpur', current_price: 65, unit: 'kg', change_percentage: 0.3, trend: 'stable', market: 'Maharashtra APMC', location: 'Maharashtra', last_updated: '2024-01-15T10:30:00Z', category: 'fruits' },
        { id: '68', crop_name: 'Orange', variety_name: 'Kinnow', current_price: 70, unit: 'kg', change_percentage: 0.8, trend: 'up', market: 'Punjab APMC', location: 'Punjab', last_updated: '2024-01-15T10:30:00Z', category: 'fruits' },
        { id: '69', crop_name: 'Orange', variety_name: 'Blood', current_price: 75, unit: 'kg', change_percentage: 1.2, trend: 'up', market: 'Himachal Pradesh APMC', location: 'Himachal Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'fruits' },
        { id: '70', crop_name: 'Grape', variety_name: 'Thompson', current_price: 85, unit: 'kg', change_percentage: 2.5, trend: 'up', market: 'Maharashtra APMC', location: 'Maharashtra', last_updated: '2024-01-15T10:30:00Z', category: 'fruits' },
        { id: '71', crop_name: 'Grape', variety_name: 'Black', current_price: 90, unit: 'kg', change_percentage: 2.8, trend: 'up', market: 'Karnataka APMC', location: 'Karnataka', last_updated: '2024-01-15T10:30:00Z', category: 'fruits' },
        { id: '72', crop_name: 'Pomegranate', variety_name: 'Bhagwa', current_price: 95, unit: 'kg', change_percentage: 3.2, trend: 'up', market: 'Maharashtra APMC', location: 'Maharashtra', last_updated: '2024-01-15T10:30:00Z', category: 'fruits' },
        { id: '73', crop_name: 'Pomegranate', variety_name: 'Ganesh', current_price: 88, unit: 'kg', change_percentage: 2.9, trend: 'up', market: 'Gujarat APMC', location: 'Gujarat', last_updated: '2024-01-15T10:30:00Z', category: 'fruits' },
        { id: '74', crop_name: 'Guava', variety_name: 'Allahabad', current_price: 45, unit: 'kg', change_percentage: 1.8, trend: 'up', market: 'Uttar Pradesh APMC', location: 'Uttar Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'fruits' },
        { id: '75', crop_name: 'Guava', variety_name: 'Pink', current_price: 42, unit: 'kg', change_percentage: 1.5, trend: 'up', market: 'Tamil Nadu APMC', location: 'Tamil Nadu', last_updated: '2024-01-15T10:30:00Z', category: 'fruits' },
        { id: '76', crop_name: 'Papaya', variety_name: 'Solo', current_price: 25, unit: 'kg', change_percentage: 1.2, trend: 'up', market: 'Karnataka APMC', location: 'Karnataka', last_updated: '2024-01-15T10:30:00Z', category: 'fruits' },
        { id: '77', crop_name: 'Papaya', variety_name: 'Red Lady', current_price: 28, unit: 'kg', change_percentage: 1.8, trend: 'up', market: 'Tamil Nadu APMC', location: 'Tamil Nadu', last_updated: '2024-01-15T10:30:00Z', category: 'fruits' },
        { id: '78', crop_name: 'Watermelon', variety_name: 'Sugar Baby', current_price: 18, unit: 'kg', change_percentage: 0.8, trend: 'up', market: 'Rajasthan APMC', location: 'Rajasthan', last_updated: '2024-01-15T10:30:00Z', category: 'fruits' },
        { id: '79', crop_name: 'Watermelon', variety_name: 'Crimson Sweet', current_price: 20, unit: 'kg', change_percentage: 1.2, trend: 'up', market: 'Haryana APMC', location: 'Haryana', last_updated: '2024-01-15T10:30:00Z', category: 'fruits' },
        { id: '80', crop_name: 'Muskmelon', variety_name: 'Cantaloupe', current_price: 35, unit: 'kg', change_percentage: 2.1, trend: 'up', market: 'Punjab APMC', location: 'Punjab', last_updated: '2024-01-15T10:30:00Z', category: 'fruits' },
        
        // Pulses (15 items)
        { id: '81', crop_name: 'Lentil', variety_name: 'Masoor', current_price: 85, unit: 'kg', change_percentage: 3.2, trend: 'up', market: 'Madhya Pradesh APMC', location: 'Madhya Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'pulses' },
        { id: '82', crop_name: 'Lentil', variety_name: 'Red', current_price: 88, unit: 'kg', change_percentage: 3.5, trend: 'up', market: 'Uttar Pradesh APMC', location: 'Uttar Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'pulses' },
        { id: '83', crop_name: 'Chickpea', variety_name: 'Desi', current_price: 95, unit: 'kg', change_percentage: 2.1, trend: 'up', market: 'Rajasthan APMC', location: 'Rajasthan', last_updated: '2024-01-15T10:30:00Z', category: 'pulses' },
        { id: '84', crop_name: 'Chickpea', variety_name: 'Kabuli', current_price: 110, unit: 'kg', change_percentage: 2.8, trend: 'up', market: 'Madhya Pradesh APMC', location: 'Madhya Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'pulses' },
        { id: '85', crop_name: 'Black Gram', variety_name: 'Urad', current_price: 110, unit: 'kg', change_percentage: -1.5, trend: 'down', market: 'Andhra Pradesh APMC', location: 'Andhra Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'pulses' },
        { id: '86', crop_name: 'Green Gram', variety_name: 'Moong', current_price: 95, unit: 'kg', change_percentage: 1.8, trend: 'up', market: 'Rajasthan APMC', location: 'Rajasthan', last_updated: '2024-01-15T10:30:00Z', category: 'pulses' },
        { id: '87', crop_name: 'Pigeon Pea', variety_name: 'Arhar', current_price: 120, unit: 'kg', change_percentage: 2.5, trend: 'up', market: 'Maharashtra APMC', location: 'Maharashtra', last_updated: '2024-01-15T10:30:00Z', category: 'pulses' },
        { id: '88', crop_name: 'Kidney Bean', variety_name: 'Rajma', current_price: 105, unit: 'kg', change_percentage: 2.2, trend: 'up', market: 'Himachal Pradesh APMC', location: 'Himachal Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'pulses' },
        { id: '89', crop_name: 'Black Eyed Pea', variety_name: 'Lobia', current_price: 90, unit: 'kg', change_percentage: 1.9, trend: 'up', market: 'Uttar Pradesh APMC', location: 'Uttar Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'pulses' },
        { id: '90', crop_name: 'Lima Bean', variety_name: 'Butter', current_price: 85, unit: 'kg', change_percentage: 1.5, trend: 'up', market: 'Karnataka APMC', location: 'Karnataka', last_updated: '2024-01-15T10:30:00Z', category: 'pulses' },
        { id: '91', crop_name: 'Fava Bean', variety_name: 'Broad', current_price: 92, unit: 'kg', change_percentage: 2.1, trend: 'up', market: 'Tamil Nadu APMC', location: 'Tamil Nadu', last_updated: '2024-01-15T10:30:00Z', category: 'pulses' },
        { id: '92', crop_name: 'Navy Bean', variety_name: 'White', current_price: 88, unit: 'kg', change_percentage: 1.8, trend: 'up', market: 'Andhra Pradesh APMC', location: 'Andhra Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'pulses' },
        { id: '93', crop_name: 'Pinto Bean', variety_name: 'Speckled', current_price: 86, unit: 'kg', change_percentage: 1.7, trend: 'up', market: 'Karnataka APMC', location: 'Karnataka', last_updated: '2024-01-15T10:30:00Z', category: 'pulses' },
        { id: '94', crop_name: 'Adzuki Bean', variety_name: 'Red', current_price: 125, unit: 'kg', change_percentage: 3.2, trend: 'up', market: 'Himachal Pradesh APMC', location: 'Himachal Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'pulses' },
        { id: '95', crop_name: 'Mung Bean', variety_name: 'Whole', current_price: 98, unit: 'kg', change_percentage: 2.3, trend: 'up', market: 'Rajasthan APMC', location: 'Rajasthan', last_updated: '2024-01-15T10:30:00Z', category: 'pulses' },
        
        // Spices (20 items)
        { id: '96', crop_name: 'Turmeric', variety_name: 'Alleppey', current_price: 180, unit: 'kg', change_percentage: 4.5, trend: 'up', market: 'Kerala APMC', location: 'Kerala', last_updated: '2024-01-15T10:30:00Z', category: 'spices' },
        { id: '97', crop_name: 'Turmeric', variety_name: 'Madras', current_price: 175, unit: 'kg', change_percentage: 4.2, trend: 'up', market: 'Tamil Nadu APMC', location: 'Tamil Nadu', last_updated: '2024-01-15T10:30:00Z', category: 'spices' },
        { id: '98', crop_name: 'Chili', variety_name: 'Red', current_price: 120, unit: 'kg', change_percentage: -2.1, trend: 'down', market: 'Andhra Pradesh APMC', location: 'Andhra Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'spices' },
        { id: '99', crop_name: 'Chili', variety_name: 'Green', current_price: 95, unit: 'kg', change_percentage: -1.8, trend: 'down', market: 'Karnataka APMC', location: 'Karnataka', last_updated: '2024-01-15T10:30:00Z', category: 'spices' },
        { id: '100', crop_name: 'Chili', variety_name: 'Bird Eye', current_price: 150, unit: 'kg', change_percentage: -2.5, trend: 'down', market: 'Tamil Nadu APMC', location: 'Tamil Nadu', last_updated: '2024-01-15T10:30:00Z', category: 'spices' },
        { id: '101', crop_name: 'Coriander', variety_name: 'Whole', current_price: 85, unit: 'kg', change_percentage: 1.8, trend: 'up', market: 'Rajasthan APMC', location: 'Rajasthan', last_updated: '2024-01-15T10:30:00Z', category: 'spices' },
        { id: '102', crop_name: 'Coriander', variety_name: 'Powder', current_price: 120, unit: 'kg', change_percentage: 2.2, trend: 'up', market: 'Gujarat APMC', location: 'Gujarat', last_updated: '2024-01-15T10:30:00Z', category: 'spices' },
        { id: '103', crop_name: 'Cumin', variety_name: 'Whole', current_price: 280, unit: 'kg', change_percentage: 3.5, trend: 'up', market: 'Rajasthan APMC', location: 'Rajasthan', last_updated: '2024-01-15T10:30:00Z', category: 'spices' },
        { id: '104', crop_name: 'Cumin', variety_name: 'Powder', current_price: 320, unit: 'kg', change_percentage: 3.8, trend: 'up', market: 'Gujarat APMC', location: 'Gujarat', last_updated: '2024-01-15T10:30:00Z', category: 'spices' },
        { id: '105', crop_name: 'Fennel', variety_name: 'Whole', current_price: 180, unit: 'kg', change_percentage: 2.8, trend: 'up', market: 'Rajasthan APMC', location: 'Rajasthan', last_updated: '2024-01-15T10:30:00Z', category: 'spices' },
        { id: '106', crop_name: 'Fennel', variety_name: 'Powder', current_price: 220, unit: 'kg', change_percentage: 3.1, trend: 'up', market: 'Gujarat APMC', location: 'Gujarat', last_updated: '2024-01-15T10:30:00Z', category: 'spices' },
        { id: '107', crop_name: 'Fenugreek', variety_name: 'Seeds', current_price: 95, unit: 'kg', change_percentage: 2.2, trend: 'up', market: 'Rajasthan APMC', location: 'Rajasthan', last_updated: '2024-01-15T10:30:00Z', category: 'spices' },
        { id: '108', crop_name: 'Fenugreek', variety_name: 'Leaves', current_price: 65, unit: 'kg', change_percentage: 1.8, trend: 'up', market: 'Haryana APMC', location: 'Haryana', last_updated: '2024-01-15T10:30:00Z', category: 'spices' },
        { id: '109', crop_name: 'Cardamom', variety_name: 'Green', current_price: 2800, unit: 'kg', change_percentage: 5.2, trend: 'up', market: 'Kerala APMC', location: 'Kerala', last_updated: '2024-01-15T10:30:00Z', category: 'spices' },
        { id: '110', crop_name: 'Cardamom', variety_name: 'Black', current_price: 1200, unit: 'kg', change_percentage: 4.8, trend: 'up', market: 'Himachal Pradesh APMC', location: 'Himachal Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'spices' },
        { id: '111', crop_name: 'Cinnamon', variety_name: 'Sticks', current_price: 850, unit: 'kg', change_percentage: 3.8, trend: 'up', market: 'Kerala APMC', location: 'Kerala', last_updated: '2024-01-15T10:30:00Z', category: 'spices' },
        { id: '112', crop_name: 'Cinnamon', variety_name: 'Powder', current_price: 950, unit: 'kg', change_percentage: 4.1, trend: 'up', market: 'Tamil Nadu APMC', location: 'Tamil Nadu', last_updated: '2024-01-15T10:30:00Z', category: 'spices' },
        { id: '113', crop_name: 'Cloves', variety_name: 'Whole', current_price: 1200, unit: 'kg', change_percentage: 4.5, trend: 'up', market: 'Kerala APMC', location: 'Kerala', last_updated: '2024-01-15T10:30:00Z', category: 'spices' },
        { id: '114', crop_name: 'Cloves', variety_name: 'Powder', current_price: 1350, unit: 'kg', change_percentage: 4.8, trend: 'up', market: 'Tamil Nadu APMC', location: 'Tamil Nadu', last_updated: '2024-01-15T10:30:00Z', category: 'spices' },
        { id: '115', crop_name: 'Nutmeg', variety_name: 'Whole', current_price: 850, unit: 'kg', change_percentage: 3.2, trend: 'up', market: 'Kerala APMC', location: 'Kerala', last_updated: '2024-01-15T10:30:00Z', category: 'spices' },
        
        // Oilseeds (15 items)
        { id: '116', crop_name: 'Soybean', variety_name: 'JS 335', current_price: 4500, unit: 'quintal', change_percentage: 1.9, trend: 'up', market: 'Madhya Pradesh APMC', location: 'Madhya Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'oilseeds' },
        { id: '117', crop_name: 'Soybean', variety_name: 'PK 1024', current_price: 4650, unit: 'quintal', change_percentage: 2.2, trend: 'up', market: 'Maharashtra APMC', location: 'Maharashtra', last_updated: '2024-01-15T10:30:00Z', category: 'oilseeds' },
        { id: '118', crop_name: 'Mustard', variety_name: 'Pusa Bold', current_price: 5200, unit: 'quintal', change_percentage: -0.7, trend: 'down', market: 'Rajasthan APMC', location: 'Rajasthan', last_updated: '2024-01-15T10:30:00Z', category: 'oilseeds' },
        { id: '119', crop_name: 'Mustard', variety_name: 'Rohini', current_price: 5350, unit: 'quintal', change_percentage: -0.5, trend: 'down', market: 'Haryana APMC', location: 'Haryana', last_updated: '2024-01-15T10:30:00Z', category: 'oilseeds' },
        { id: '120', crop_name: 'Cotton', variety_name: 'BT', current_price: 6800, unit: 'quintal', change_percentage: -1.2, trend: 'down', market: 'Gujarat APMC', location: 'Gujarat', last_updated: '2024-01-15T10:30:00Z', category: 'oilseeds' },
        { id: '121', crop_name: 'Cotton', variety_name: 'Desi', current_price: 6200, unit: 'quintal', change_percentage: -1.5, trend: 'down', market: 'Maharashtra APMC', location: 'Maharashtra', last_updated: '2024-01-15T10:30:00Z', category: 'oilseeds' },
        { id: '122', crop_name: 'Groundnut', variety_name: 'Bold', current_price: 5800, unit: 'quintal', change_percentage: 2.3, trend: 'up', market: 'Gujarat APMC', location: 'Gujarat', last_updated: '2024-01-15T10:30:00Z', category: 'oilseeds' },
        { id: '123', crop_name: 'Groundnut', variety_name: 'Jumbo', current_price: 5950, unit: 'quintal', change_percentage: 2.5, trend: 'up', market: 'Andhra Pradesh APMC', location: 'Andhra Pradesh', last_updated: '2024-01-15T10:30:00Z', category: 'oilseeds' },
        { id: '124', crop_name: 'Sunflower', variety_name: 'Hybrid', current_price: 4800, unit: 'quintal', change_percentage: 1.8, trend: 'up', market: 'Karnataka APMC', location: 'Karnataka', last_updated: '2024-01-15T10:30:00Z', category: 'oilseeds' },
        { id: '125', crop_name: 'Sunflower', variety_name: 'Open Pollinated', current_price: 4650, unit: 'quintal', change_percentage: 1.5, trend: 'up', market: 'Maharashtra APMC', location: 'Maharashtra', last_updated: '2024-01-15T10:30:00Z', category: 'oilseeds' },
        { id: '126', crop_name: 'Sesame', variety_name: 'White', current_price: 8500, unit: 'quintal', change_percentage: 3.2, trend: 'up', market: 'Gujarat APMC', location: 'Gujarat', last_updated: '2024-01-15T10:30:00Z', category: 'oilseeds' },
        { id: '127', crop_name: 'Sesame', variety_name: 'Black', current_price: 9200, unit: 'quintal', change_percentage: 3.5, trend: 'up', market: 'Rajasthan APMC', location: 'Rajasthan', last_updated: '2024-01-15T10:30:00Z', category: 'oilseeds' },
        { id: '128', crop_name: 'Castor', variety_name: 'Hybrid', current_price: 3800, unit: 'quintal', change_percentage: 2.8, trend: 'up', market: 'Gujarat APMC', location: 'Gujarat', last_updated: '2024-01-15T10:30:00Z', category: 'oilseeds' },
        { id: '129', crop_name: 'Castor', variety_name: 'Local', current_price: 3650, unit: 'quintal', change_percentage: 2.5, trend: 'up', market: 'Rajasthan APMC', location: 'Rajasthan', last_updated: '2024-01-15T10:30:00Z', category: 'oilseeds' },
        { id: '130', crop_name: 'Safflower', variety_name: 'Hybrid', current_price: 4200, unit: 'quintal', change_percentage: 2.1, trend: 'up', market: 'Maharashtra APMC', location: 'Maharashtra', last_updated: '2024-01-15T10:30:00Z', category: 'oilseeds' }
      ];

      setPrices(mockPrices);
    } catch (error) {
      console.error('Error fetching price data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = prices;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(price =>
        price.crop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        translateCropName(price.crop_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        price.variety_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        price.market.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(price => price.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'name':
          aValue = a.crop_name;
          bValue = b.crop_name;
          break;
        case 'price':
          aValue = a.current_price;
          bValue = b.current_price;
          break;
        case 'change':
          aValue = a.change_percentage;
          bValue = b.change_percentage;
          break;
        default:
          aValue = a.crop_name;
          bValue = b.crop_name;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredPrices(filtered);
  };

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

  const translations = {
    english: {
      findPrice: 'Find Price',
      marketPrices: 'Today\'s Market Prices',
      search: 'Search crops...',
      category: 'Category',
      all: 'All',
      cereals: 'Cereals',
      vegetables: 'Vegetables',
      fruits: 'Fruits',
      pulses: 'Pulses',
      spices: 'Spices',
      oilseeds: 'Oilseeds',
      sortBy: 'Sort by',
      name: 'Name',
      price: 'Price',
      change: 'Change',
      market: 'Market',
      location: 'Location',
      lastUpdated: 'Last Updated',
      loading: 'Loading market prices...',
      logout: 'Logout',
      english: 'English',
      hindi: 'हिंदी',
      tamil: 'தமிழ்',
      items: 'items',
      // Crop names translations
      rice: 'Rice',
      wheat: 'Wheat',
      maize: 'Maize',
      sugarcane: 'Sugarcane',
      barley: 'Barley',
      oats: 'Oats',
      rye: 'Rye',
      millet: 'Millet',
      sorghum: 'Sorghum',
      quinoa: 'Quinoa',
      buckwheat: 'Buckwheat',
      amaranth: 'Amaranth',
      teff: 'Teff',
      spelt: 'Spelt',
      triticale: 'Triticale',
      tomato: 'Tomato',
      onion: 'Onion',
      potato: 'Potato',
      cabbage: 'Cabbage',
      cauliflower: 'Cauliflower',
      brinjal: 'Brinjal',
      okra: 'Okra',
      cucumber: 'Cucumber',
      bottleGourd: 'Bottle Gourd',
      ridgeGourd: 'Ridge Gourd',
      bitterGourd: 'Bitter Gourd',
      snakeGourd: 'Snake Gourd',
      ashGourd: 'Ash Gourd',
      pumpkin: 'Pumpkin',
      spinach: 'Spinach',
      lettuce: 'Lettuce',
      mango: 'Mango',
      apple: 'Apple',
      banana: 'Banana',
      orange: 'Orange',
      grape: 'Grape',
      pomegranate: 'Pomegranate',
      guava: 'Guava',
      papaya: 'Papaya',
      watermelon: 'Watermelon',
      muskmelon: 'Muskmelon',
      lentil: 'Lentil',
      chickpea: 'Chickpea',
      blackGram: 'Black Gram',
      greenGram: 'Green Gram',
      pigeonPea: 'Pigeon Pea',
      kidneyBean: 'Kidney Bean',
      blackEyedPea: 'Black Eyed Pea',
      limaBean: 'Lima Bean',
      favaBean: 'Fava Bean',
      navyBean: 'Navy Bean',
      pintoBean: 'Pinto Bean',
      adzukiBean: 'Adzuki Bean',
      mungBean: 'Mung Bean',
      turmeric: 'Turmeric',
      chili: 'Chili',
      coriander: 'Coriander',
      cumin: 'Cumin',
      fennel: 'Fennel',
      fenugreek: 'Fenugreek',
      cardamom: 'Cardamom',
      cinnamon: 'Cinnamon',
      cloves: 'Cloves',
      nutmeg: 'Nutmeg',
      soybean: 'Soybean',
      mustard: 'Mustard',
      cotton: 'Cotton',
      groundnut: 'Groundnut',
      sunflower: 'Sunflower',
      sesame: 'Sesame',
      castor: 'Castor',
      safflower: 'Safflower'
    },
    hindi: {
      findPrice: 'मूल्य खोजें',
      marketPrices: 'आज के बाजार भाव',
      search: 'फसलें खोजें...',
      category: 'श्रेणी',
      all: 'सभी',
      cereals: 'अनाज',
      vegetables: 'सब्जियां',
      fruits: 'फल',
      pulses: 'दालें',
      spices: 'मसाले',
      oilseeds: 'तेल बीज',
      sortBy: 'क्रमबद्ध करें',
      name: 'नाम',
      price: 'मूल्य',
      change: 'परिवर्तन',
      market: 'बाजार',
      location: 'स्थान',
      lastUpdated: 'अंतिम अपडेट',
      loading: 'बाजार भाव लोड हो रहे हैं...',
      logout: 'लॉगआउट',
      english: 'अंग्रेजी',
      hindi: 'हिंदी',
      tamil: 'தமிழ்',
      items: 'आइटम',
      // Crop names translations
      rice: 'चावल',
      wheat: 'गेहूं',
      maize: 'मक्का',
      sugarcane: 'गन्ना',
      barley: 'जौ',
      oats: 'जई',
      rye: 'राई',
      millet: 'बाजरा',
      sorghum: 'ज्वार',
      quinoa: 'कीनवा',
      buckwheat: 'कुट्टू',
      amaranth: 'राजगिरा',
      teff: 'टेफ',
      spelt: 'स्पेल्ट',
      triticale: 'ट्रिटिकेल',
      tomato: 'टमाटर',
      onion: 'प्याज',
      potato: 'आलू',
      cabbage: 'पत्ता गोभी',
      cauliflower: 'फूल गोभी',
      brinjal: 'बैंगन',
      okra: 'भिंडी',
      cucumber: 'खीरा',
      bottleGourd: 'लौकी',
      ridgeGourd: 'तुरई',
      bitterGourd: 'करेला',
      snakeGourd: 'चिचिंडा',
      ashGourd: 'पेठा',
      pumpkin: 'कद्दू',
      spinach: 'पालक',
      lettuce: 'लेट्यूस',
      mango: 'आम',
      apple: 'सेब',
      banana: 'केला',
      orange: 'संतरा',
      grape: 'अंगूर',
      pomegranate: 'अनार',
      guava: 'अमरूद',
      papaya: 'पपीता',
      watermelon: 'तरबूज',
      muskmelon: 'खरबूजा',
      lentil: 'मसूर',
      chickpea: 'चना',
      blackGram: 'उड़द',
      greenGram: 'मूंग',
      pigeonPea: 'अरहर',
      kidneyBean: 'राजमा',
      blackEyedPea: 'लोबिया',
      limaBean: 'लिमा बीन',
      favaBean: 'बाकला',
      navyBean: 'नेवी बीन',
      pintoBean: 'पिंटो बीन',
      adzukiBean: 'अज़ुकी बीन',
      mungBean: 'मूंग बीन',
      turmeric: 'हल्दी',
      chili: 'मिर्च',
      coriander: 'धनिया',
      cumin: 'जीरा',
      fennel: 'सौंफ',
      fenugreek: 'मेथी',
      cardamom: 'इलायची',
      cinnamon: 'दालचीनी',
      cloves: 'लौंग',
      nutmeg: 'जायफल',
      soybean: 'सोयाबीन',
      mustard: 'सरसों',
      cotton: 'कपास',
      groundnut: 'मूंगफली',
      sunflower: 'सूरजमुखी',
      sesame: 'तिल',
      castor: 'अरंडी',
      safflower: 'कुसुम'
    },
    tamil: {
      findPrice: 'விலை கண்டுபிடி',
      marketPrices: 'இன்றைய சந்தை விலைகள்',
      search: 'பயிர்களை தேடு...',
      category: 'வகை',
      all: 'அனைத்தும்',
      cereals: 'தானியங்கள்',
      vegetables: 'காய்கறிகள்',
      fruits: 'பழங்கள்',
      pulses: 'பருப்பு வகைகள்',
      spices: 'மசாலாப் பொருட்கள்',
      oilseeds: 'எண்ணெய் விதைகள்',
      sortBy: 'வரிசைப்படுத்து',
      name: 'பெயர்',
      price: 'விலை',
      change: 'மாற்றம்',
      market: 'சந்தை',
      location: 'இடம்',
      lastUpdated: 'கடைசி புதுப்பிப்பு',
      loading: 'சந்தை விலைகள் ஏற்றப்படுகின்றன...',
      logout: 'வெளியேறு',
      english: 'English',
      hindi: 'हिंदी',
      tamil: 'தமிழ்',
      items: 'பொருட்கள்',
      // Crop names translations
      rice: 'அரிசி',
      wheat: 'கோதுமை',
      maize: 'சோளம்',
      sugarcane: 'கரும்பு',
      barley: 'பார்லி',
      oats: 'ஓட்ஸ்',
      rye: 'ரை',
      millet: 'தினை',
      sorghum: 'சோளம்',
      quinoa: 'கினோவா',
      buckwheat: 'பக்வீட்',
      amaranth: 'அமராந்த்',
      teff: 'டெஃப்',
      spelt: 'ஸ்பெல்ட்',
      triticale: 'ட்ரிடிகேல்',
      tomato: 'தக்காளி',
      onion: 'வெங்காயம்',
      potato: 'உருளைக்கிழங்கு',
      cabbage: 'முட்டைக்கோசு',
      cauliflower: 'பூக்கோசு',
      brinjal: 'கத்தரிக்காய்',
      okra: 'வெண்டைக்காய்',
      cucumber: 'வெள்ளரி',
      bottleGourd: 'சுரைக்காய்',
      ridgeGourd: 'பீர்க்கங்காய்',
      bitterGourd: 'பாகற்காய்',
      snakeGourd: 'புடலங்காய்',
      ashGourd: 'நீர்க்காய்',
      pumpkin: 'பூசணிக்காய்',
      spinach: 'பசலைக்கீரை',
      lettuce: 'லெட்டுஸ்',
      mango: 'மாம்பழம்',
      apple: 'ஆப்பிள்',
      banana: 'வாழைப்பழம்',
      orange: 'ஆரஞ்சு',
      grape: 'திராட்சை',
      pomegranate: 'மாதுளை',
      guava: 'கொய்யா',
      papaya: 'பப்பாளி',
      watermelon: 'கொம்மட்டிக்காய்',
      muskmelon: 'முலாம்பழம்',
      lentil: 'மஸூர் பருப்பு',
      chickpea: 'கொண்டைக்கடலை',
      blackGram: 'உளுத்தம்பருப்பு',
      greenGram: 'பச்சை பருப்பு',
      pigeonPea: 'துவரம்பருப்பு',
      kidneyBean: 'ராஜ்மா',
      blackEyedPea: 'கருவாமணி',
      limaBean: 'லிமா பீன்',
      favaBean: 'பவா பீன்',
      navyBean: 'நேவி பீன்',
      pintoBean: 'பிண்டோ பீன்',
      adzukiBean: 'அட்சுகி பீன்',
      mungBean: 'மூங் பீன்',
      turmeric: 'மஞ்சள்',
      chili: 'மிளகாய்',
      coriander: 'கொத்தமல்லி',
      cumin: 'சீரகம்',
      fennel: 'பெருஞ்சீரகம்',
      fenugreek: 'வெந்தயம்',
      cardamom: 'ஏலக்காய்',
      cinnamon: 'லவங்கப்பட்டை',
      cloves: 'கிராம்பு',
      nutmeg: 'ஜாதிக்காய்',
      soybean: 'சோயாபீன்',
      mustard: 'கடுகு',
      cotton: 'பருத்தி',
      groundnut: 'வேர்க்கடலை',
      sunflower: 'சூரியகாந்தி',
      sesame: 'எள்ளு',
      castor: 'ஆமணக்கு',
      safflower: 'குசும்பு'
    }
  };

  const t = translations[language];

  // Function to translate crop names
  const translateCropName = (cropName: string): string => {
    const cropKey = cropName.toLowerCase().replace(/\s+/g, '');
    
    // Handle special cases
    const specialCases: { [key: string]: string } = {
      'rice': 'rice',
      'wheat': 'wheat',
      'maize': 'maize',
      'sugarcane': 'sugarcane',
      'barley': 'barley',
      'oats': 'oats',
      'rye': 'rye',
      'millet': 'millet',
      'sorghum': 'sorghum',
      'quinoa': 'quinoa',
      'buckwheat': 'buckwheat',
      'amaranth': 'amaranth',
      'teff': 'teff',
      'spelt': 'spelt',
      'triticale': 'triticale',
      'tomato': 'tomato',
      'onion': 'onion',
      'potato': 'potato',
      'cabbage': 'cabbage',
      'cauliflower': 'cauliflower',
      'brinjal': 'brinjal',
      'okra': 'okra',
      'cucumber': 'cucumber',
      'bottlegourd': 'bottleGourd',
      'ridgegourd': 'ridgeGourd',
      'bittergourd': 'bitterGourd',
      'snakegourd': 'snakeGourd',
      'ashgourd': 'ashGourd',
      'pumpkin': 'pumpkin',
      'spinach': 'spinach',
      'lettuce': 'lettuce',
      'mango': 'mango',
      'apple': 'apple',
      'banana': 'banana',
      'orange': 'orange',
      'grape': 'grape',
      'pomegranate': 'pomegranate',
      'guava': 'guava',
      'papaya': 'papaya',
      'watermelon': 'watermelon',
      'muskmelon': 'muskmelon',
      'lentil': 'lentil',
      'chickpea': 'chickpea',
      'blackgram': 'blackGram',
      'greengram': 'greenGram',
      'pigeonpea': 'pigeonPea',
      'kidneybean': 'kidneyBean',
      'blackeyedpea': 'blackEyedPea',
      'limabean': 'limaBean',
      'favabean': 'favaBean',
      'navybean': 'navyBean',
      'pintobean': 'pintoBean',
      'adzukibean': 'adzukiBean',
      'mungbean': 'mungBean',
      'turmeric': 'turmeric',
      'chili': 'chili',
      'coriander': 'coriander',
      'cumin': 'cumin',
      'fennel': 'fennel',
      'fenugreek': 'fenugreek',
      'cardamom': 'cardamom',
      'cinnamon': 'cinnamon',
      'cloves': 'cloves',
      'nutmeg': 'nutmeg',
      'soybean': 'soybean',
      'mustard': 'mustard',
      'cotton': 'cotton',
      'groundnut': 'groundnut',
      'sunflower': 'sunflower',
      'sesame': 'sesame',
      'castor': 'castor',
      'safflower': 'safflower'
    };

    const key = specialCases[cropKey] || cropKey;
    return (t as any)[key] || cropName;
  };

  const categories = [
    { value: 'all', label: t.all },
    { value: 'cereals', label: t.cereals },
    { value: 'vegetables', label: t.vegetables },
    { value: 'fruits', label: t.fruits },
    { value: 'pulses', label: t.pulses },
    { value: 'spices', label: t.spices },
    { value: 'oilseeds', label: t.oilseeds }
  ];

  const sortOptions = [
    { value: 'name', label: t.name },
    { value: 'price', label: t.price },
    { value: 'change', label: t.change }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-600 font-medium">{t.loading}</p>
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
                <h1 className="text-2xl font-bold text-gray-900">{t.findPrice}</h1>
                <p className="text-gray-600">{t.marketPrices}</p>
              </div>
            </div>
            
            {/* Language Toggle & Logout */}
            <div className="flex items-center space-x-3">
              {/* Language Toggle */}
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

              {/* Logout Button */}
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'change')}
                className="flex-1 px-4 py-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition-colors"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Price List */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
          <div className="p-6 border-b border-emerald-100">
            <h2 className="text-xl font-bold text-gray-900">
              {filteredPrices.length} {t.items} {selectedCategory === 'all' ? '' : categories.find(c => c.value === selectedCategory)?.label}
            </h2>
          </div>
          
          <div className="divide-y divide-emerald-100">
            {filteredPrices.map((price) => (
              <div key={price.id} className="p-6 hover:bg-emerald-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{translateCropName(price.crop_name)}</h3>
                        {price.variety_name && (
                          <p className="text-sm text-gray-600">{price.variety_name}</p>
                        )}
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-1" />
                            {price.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(price.last_updated).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      ₹{price.current_price.toLocaleString()}
                      <span className="text-sm font-normal text-gray-600 ml-1">/{price.unit}</span>
                    </div>
                    <div className={`flex items-center justify-end mt-1 ${
                      price.trend === 'up' ? 'text-green-600' : 
                      price.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {price.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : 
                       price.trend === 'down' ? <TrendingDown className="w-4 h-4 mr-1" /> : null}
                      <span className="text-sm font-medium">
                        {price.change_percentage > 0 ? '+' : ''}{price.change_percentage}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{price.market}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindPrice;
