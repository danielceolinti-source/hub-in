import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Define user state and authentication functions
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data on component mount
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
        return;
      }
      setUser(data.user);
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (username, password) => {
    const { data, error } = await supabase.auth.signIn({ email: username, password });
    if (error) {
      console.error('Login error:', error);
      return;
    }
    setUser(data.user);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
      return;
    }
    setUser(null);
  };

  return { user, loading, login, logout };
};