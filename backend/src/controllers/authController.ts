import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '588392418317-p/4n04nuo/kbkb8hmva1nq6bgb2qm/82.apps.googleusercontent.com';

interface GoogleUserInfo {
  email: string;
  name: string;
  picture: string;
  [key: string]: any;  // for any additional fields from Google
}

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Add Gmail validation helper function
const isValidGmailFormat = (email: string): boolean => {
  if (!email.toLowerCase().endsWith('@gmail.com')) return true; // Not a Gmail address
  
  const localPart = email.split('@')[0].toLowerCase();
  return !(
    localPart.includes('..') || 
    localPart.startsWith('.') || 
    localPart.endsWith('.') ||
    localPart.length < 6 || 
    /[^a-z0-9._]/i.test(localPart) || 
    localPart.length > 30
  );
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Basic email format validation
    if (!email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Determine role based on email domain
    const role = email.endsWith('@techcurators.in') ? 'admin' : 'user';

    // Create new user
    const user = new User({
      email,
      password,
      role
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error: any) {
    console.error('Signup error details:', error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Basic email format validation
    if (!email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { token } = req.body; // This is the access token from frontend

    // Fetch user info using the access token
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user info from Google');
    }

    const data = await response.json() as GoogleUserInfo;
    const { email, name, picture } = data;

    if (!email) {
      return res.status(401).json({ message: 'Google authentication failed: email not provided' });
    }

    // Ensure the email is actually a Gmail address
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      return res.status(400).json({ message: 'Only Gmail accounts can use Google Sign-in' });
    }

    // Validate Gmail format
    if (!isValidGmailFormat(email)) {
      return res.status(400).json({ message: 'Invalid Gmail address format' });
    }

    // Check if user exists in your database
    let user = await User.findOne({ email });

    if (!user) {
      // If user doesn't exist, create a new one
      user = new User({
        email,
        password: 'google-auth-' + Math.random().toString(36).slice(-8),
        role: email.endsWith('@techcurators.in') ? 'admin' : 'user',
        name: name,
        picture: picture,
      });
      await user.save();
    }

    // Generate JWT token
    const appToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Google authentication successful',
      token: appToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        picture: user.picture,
      },
      redirectUrl: '/blueprint' // Adding redirect URL to the response
    });

  } catch (error: any) {
    console.error('Google authentication error:', error);
    res.status(500).json({ 
      message: 'Internal server error during Google authentication',
      error: error.message 
    });
  }
};