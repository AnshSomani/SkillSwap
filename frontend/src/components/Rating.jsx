import React from 'react';
import { Star } from 'lucide-react';

const Rating = ({ value }) => (
    <div className="flex items-center">
        <Star className="text-yellow-400 mr-1" size={16} fill="currentColor" />
        <span className="text-white font-bold">{value ? value.toFixed(1) : '0.0'}/5</span>
    </div>
);

export default Rating;
