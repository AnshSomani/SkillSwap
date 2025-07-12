import React from 'react';
import { X } from 'lucide-react';

const SkillTag = ({ skill, onRemove, editable }) => (
    <div className="bg-gray-600 text-white text-sm font-medium px-3 py-1 rounded-full flex items-center">
        {skill}
        {editable && (
            <button onClick={() => onRemove(skill)} className="ml-2 text-gray-400 hover:text-white">
                <X size={14} />
            </button>
        )}
    </div>
);

export default SkillTag;
