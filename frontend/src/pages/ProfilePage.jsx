import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import SkillTag from '../components/SkillTag';

const ProfilePage = () => {
    const { currentUser, updateUser, showNotification } = useAuth();
    const navigate = useNavigate();
    
    const [profileData, setProfileData] = useState(currentUser);
    const [newSkillOffered, setNewSkillOffered] = useState('');
    const [newSkillWanted, setNewSkillWanted] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setProfileData(currentUser);
    }, [currentUser]);

    if (!profileData) return <p className="text-center text-white mt-8">Loading profile...</p>;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const handleSkillAdd = (type) => {
        const skillToAdd = type === 'offered' ? newSkillOffered.trim() : newSkillWanted.trim();
        const existingSkills = type === 'offered' ? profileData.skillsOffered : profileData.skillsWanted;

        if (skillToAdd && !existingSkills.includes(skillToAdd)) {
            const updatedSkills = [...existingSkills, skillToAdd];
            if (type === 'offered') {
                setProfileData({ ...profileData, skillsOffered: updatedSkills });
                setNewSkillOffered('');
            } else {
                setProfileData({ ...profileData, skillsWanted: updatedSkills });
                setNewSkillWanted('');
            }
        }
    };

    const handleSkillRemove = (skillToRemove, type) => {
        if (type === 'offered') {
            setProfileData({ ...profileData, skillsOffered: profileData.skillsOffered.filter(s => s !== skillToRemove) });
        } else {
            setProfileData({ ...profileData, skillsWanted: profileData.skillsWanted.filter(s => s !== skillToRemove) });
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const { data } = await api.put('/users/profile', profileData);
            updateUser(data);
            showNotification('Profile updated successfully!');
        } catch (error) {
            console.error("Failed to update profile", error);
            showNotification('Failed to update profile.', 'error');
        }
        setLoading(false);
    };

    // --- NEW: Function to handle profile photo change ---
    const handlePhotoChange = async () => {
        const newPhotoUrl = prompt("Please enter the URL for your new profile photo:");
        if (newPhotoUrl && newPhotoUrl.trim() !== '') {
            setLoading(true);
            try {
                // We can use the same update profile route
                const { data } = await api.put('/users/profile', { profilePhoto: newPhotoUrl });
                updateUser(data); // Update context to show new photo immediately
                showNotification('Profile photo updated!');
            } catch (error) {
                console.error("Failed to update photo", error);
                showNotification('Failed to update photo.', 'error');
            }
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex justify-end space-x-4 mb-4">
                    <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white font-bold">Discard</button>
                    <button onClick={handleSave} disabled={loading} className="text-green-400 hover:text-green-300 font-bold disabled:opacity-50">
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        {/* Form fields */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                            <input type="text" name="name" value={profileData.name} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                            <input type="text" name="location" value={profileData.location || ''} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Skills Offered</label>
                            <div className="flex flex-wrap gap-2 p-2 bg-gray-900 rounded-lg border border-gray-600 min-h-[40px]">
                                {profileData.skillsOffered.map(skill => <SkillTag key={skill} skill={skill} onRemove={(s) => handleSkillRemove(s, 'offered')} editable />)}
                            </div>
                             <div className="flex mt-2">
                                <input type="text" value={newSkillOffered} onChange={(e) => setNewSkillOffered(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSkillAdd('offered')} placeholder="Add a skill..." className="flex-grow bg-gray-700 border border-gray-600 rounded-l-lg px-3 py-2 text-white"/>
                                <button onClick={() => handleSkillAdd('offered')} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-r-lg">Add</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Skills Wanted</label>
                            <div className="flex flex-wrap gap-2 p-2 bg-gray-900 rounded-lg border border-gray-600 min-h-[40px]">
                                {profileData.skillsWanted.map(skill => <SkillTag key={skill} skill={skill} onRemove={(s) => handleSkillRemove(s, 'wanted')} editable />)}
                            </div>
                             <div className="flex mt-2">
                                <input type="text" value={newSkillWanted} onChange={(e) => setNewSkillWanted(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSkillAdd('wanted')} placeholder="Add a skill..." className="flex-grow bg-gray-700 border border-gray-600 rounded-l-lg px-3 py-2 text-white"/>
                                <button onClick={() => handleSkillAdd('wanted')} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-r-lg">Add</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Availability</label>
                            <select name="availability" value={profileData.availability} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                                <option>Weekends</option>
                                <option>Evenings</option>
                                <option>Weekdays</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Profile Visibility</label>
                            <select name="isPublic" value={profileData.isPublic} onChange={(e) => setProfileData({...profileData, isPublic: e.target.value === 'true'})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                                <option value="true">Public</option>
                                <option value="false">Private</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col items-center space-y-4">
                        <img src={profileData.profilePhoto} alt="Profile" className="w-32 h-32 rounded-full border-4 border-purple-500" />
                        {/* UPDATED: Added onClick handler */}
                        <button onClick={handlePhotoChange} className="text-sm text-blue-400 hover:underline">Add/Edit/Remove</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
