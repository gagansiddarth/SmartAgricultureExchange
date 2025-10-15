import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Smart Agriculture Exchange</h3>
            <p className="text-gray-300 text-sm">
              Connecting farmers with buyers through verified, transparent crop listings.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Farmers</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Post Your Crops</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Get Crop Advice</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Track Your Deals</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Buyers</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Search Crops</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Connect with Farmers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Verified Listings</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-300">
          <p>&copy; 2024 Smart Agriculture Exchange. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
