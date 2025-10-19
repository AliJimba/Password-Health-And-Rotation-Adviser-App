require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✓ MongoDB Connected');
    } catch (error) {
        console.error('✗ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

// User Schema (copy from your User model)
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    walletAddress: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    }
});

const User = mongoose.model('User', userSchema);

// Mock users data
const mockUsers = [
    {
        username: 'admin',
        email: 'admin@passwordhealth.com',
        password: 'admin123',
        walletAddress: '0x1234567890123456789012345678901234567890'
    },
    {
        username: 'testuser',
        email: 'test@example.com',
        password: 'test123',
        walletAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'
    },
    {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123',
        walletAddress: null
    },
    {
        username: 'alice_wonder',
        email: 'alice@example.com',
        password: 'secure456',
        walletAddress: '0x9876543210987654321098765432109876543210'
    }
];

// Seed function
const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing users
        console.log('Clearing existing users...');
        await User.deleteMany({});
        console.log('✓ Existing users cleared');

        // Hash passwords and insert users
        console.log('Creating mock users...');
        
        for (const userData of mockUsers) {
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);
            
            // Create user
            const user = await User.create({
                ...userData,
                password: hashedPassword
            });
            
            console.log(`✓ Created user: ${user.username} (${user.email})`);
        }

        console.log('\n=== Database Seeded Successfully ===');
        console.log('Mock users created:');
        console.log('1. admin@passwordhealth.com / admin123');
        console.log('2. test@example.com / test123');
        console.log('3. john@example.com / password123');
        console.log('4. alice@example.com / secure456');
        console.log('\nYou can now login with any of these accounts!');

        process.exit(0);
    } catch (error) {
        console.error('✗ Error seeding database:', error.message);
        process.exit(1);
    }
};

// Run seed
seedDatabase();
