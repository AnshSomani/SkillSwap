import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Swap from './models/Swap.js';

dotenv.config();

const MONGO_URI = 'mongodb+srv://Imagine_Ansh:Amita123@cluster0.6d5hiu3.mongodb.net/skillswap?retryWrites=true&w=majority&appName=Cluster0';

async function seed() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected ✅');

    // Clean existing data
    console.log('Clearing old database collections...');
    await User.deleteMany({});
    await Swap.deleteMany({});
    console.log('Cleared ✅');

    // 1. Create Users
    console.log('Creating Users...');

    // User: Admin
    const adminUser = new User({
      name: 'Admin',
      email: 'admin@skillswap.com',
      password: 'supersecretpassword', // will be hashed automatically by pre-save
      role: 'admin',
      isPublic: false,
    });

    // User: Ansh Somani
    const anshUser = new User({
      name: 'Ansh Somani',
      email: 'dadgem@gmail.com',
      password: 'Password123',
      role: 'user',
      location: 'New Delhi',
      skillsOffered: ['C++', 'Java'],
      skillsWanted: ['CSS', 'HTML'],
      availability: 'Weekends',
      profilePhoto: 'https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-00ad7368d1b3/displayicon.png', // Valorant profile photo
    });

    // User: Ambuj
    const ambujUser = new User({
      name: 'ambuj',
      email: 'ambuj@gmail.com',
      password: 'Password123',
      role: 'user',
      location: 'Mumbai',
      skillsOffered: ['Java', 'react'],
      skillsWanted: ['C++'],
      availability: 'Weekdays',
    });

    // User: Vanshikaaa
    const vanshikaUser = new User({
      name: 'vanshikaaa',
      email: 'van@gmail.com',
      password: 'Password123',
      role: 'user',
      location: 'Bangalore',
      skillsOffered: ['C++'],
      skillsWanted: ['Java'],
      availability: 'Weekends',
    });

    // Users that will be deleted to simulate "(Deleted User)"
    const tempUser1 = new User({
      name: 'Temp User 1',
      email: 'temp1@gmail.com',
      password: 'Password123',
      role: 'user',
      isPublic: false,
    });

    const tempUser2 = new User({
      name: 'Temp User 2',
      email: 'temp2@gmail.com',
      password: 'Password123',
      role: 'user',
      isPublic: false,
    });

    // Save all to database (triggers password hashing)
    await adminUser.save();
    await anshUser.save();
    await ambujUser.save();
    await vanshikaUser.save();
    await tempUser1.save();
    await tempUser2.save();

    console.log('Users created successfully! Add ratings...');

    // Add Ratings:
    // ambuj has a rating of 4.8. We can add ratings of 5.0 and 4.6.
    ambujUser.ratings.push({ rater: vanshikaUser._id, value: 5, feedback: 'Great teacher!' });
    ambujUser.ratings.push({ rater: anshUser._id, value: 4.6, feedback: 'Very helpful' });
    ambujUser.avgRating = 4.8;
    await ambujUser.save();

    // vanshikaaa has a rating of 4.5.
    vanshikaUser.ratings.push({ rater: ambujUser._id, value: 4.5, feedback: 'Good explanation' });
    vanshikaUser.avgRating = 4.5;
    await vanshikaUser.save();

    console.log('Ratings added ✅');

    // 2. Create Swaps
    console.log('Creating Swaps...');

    const swaps = [
      // 1. Ansh Somani -> vanshikaaa (PENDING)
      {
        requester: anshUser._id,
        responder: vanshikaUser._id,
        requesterSkills: ['Java'],
        responderSkills: ['C++'],
        message: 'Please, it would be great if you helped me out in my College Assignment. I would help in yours.',
        status: 'pending',
      },
      // 2. Ansh Somani -> ambuj (COMPLETED)
      {
        requester: anshUser._id,
        responder: ambujUser._id,
        requesterSkills: ['C++'],
        responderSkills: ['CSS', 'HTML'],
        message: 'Hi, good pp!',
        status: 'completed',
      },
      // 3. ambuj -> vanshikaaa (COMPLETED)
      {
        requester: ambujUser._id,
        responder: vanshikaUser._id,
        requesterSkills: ['Java', 'react'],
        responderSkills: ['C++'],
        message: "Hi, let's swap skills!",
        status: 'completed',
      },
      // 4. ambuj -> tempUser1 (Deleted User) (PENDING)
      {
        requester: ambujUser._id,
        responder: tempUser1._id,
        requesterSkills: ['Java'],
        responderSkills: ['C++'],
        message: 'Hey, want to swap?',
        status: 'pending',
      },
      // 5. ambuj -> vanshikaaa (COMPLETED)
      {
        requester: ambujUser._id,
        responder: vanshikaUser._id,
        requesterSkills: ['react'],
        responderSkills: ['C++'],
        message: 'Great swap!',
        status: 'completed',
      },
      // 6. tempUser2 (Deleted User) -> ambuj (COMPLETED)
      {
        requester: tempUser2._id,
        responder: ambujUser._id,
        requesterSkills: ['C++'],
        responderSkills: ['Java'],
        message: 'Thanks!',
        status: 'completed',
      },
      // 7. vanshikaaa -> ambuj (COMPLETED)
      {
        requester: vanshikaUser._id,
        responder: ambujUser._id,
        requesterSkills: ['C++'],
        responderSkills: ['react'],
        message: 'Awesome session!',
        status: 'completed',
      },
      // 8. ambuj -> vanshikaaa (COMPLETED)
      {
        requester: ambujUser._id,
        responder: vanshikaUser._id,
        requesterSkills: ['Java'],
        responderSkills: ['C++'],
        message: "Let's do this again!",
        status: 'completed',
      },
    ];

    await Swap.insertMany(swaps);
    console.log('Swaps inserted ✅');

    // 3. Delete the temporary users to simulate "(Deleted User)" in the swap history.
    // The references in the Swap collection will remain, but the User documents will be gone.
    console.log('Deleting temporary users to create "(Deleted User)" status...');
    await User.deleteOne({ _id: tempUser1._id });
    await User.deleteOne({ _id: tempUser2._id });
    console.log('Deleted temp users ✅');

    console.log('Database seeded successfully! 🎉');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database ❌:', error);
    process.exit(1);
  }
}

seed();
