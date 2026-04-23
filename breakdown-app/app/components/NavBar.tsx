"use client";

import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Link, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export default function NavBar() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      setLoginError('');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Handle successful login
      setLoginOpen(false);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setIsSignUp(false);
      setConfirmPassword('');
      setIsSignUp(false);
    } catch (error: any) {
      setLoginError(error.message || 'Login failed');
    }
  };

  const handleSignUp = async () => {
    try {
      setLoginError('');
      
      if (password !== confirmPassword) {
        setLoginError('Passwords do not match');
        return;
      }

      if (password.length < 6) {
        setLoginError('Password must be at least 6 characters');
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Handle successful sign up
      setLoginOpen(false);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setIsSignUp(false);
      
      // Note: User will need to check their email for confirmation
      alert('Please check your email to confirm your account!');
      
    } catch (error: any) {
      setLoginError(error.message || 'Sign up failed');
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AppBar sx={{ 
        position: 'sticky', 
        top: 0, 
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #1d2d4478',
        boxShadow: 'none',
        }}>
      <Toolbar sx={{ gap: '5px', marginLeft: '40px', marginRight: '40px' }}>
        
          <Typography variant="h6" component="div" sx={{ 
              flexGrow: 1, 
              fontFamily: 'calibri, sans-serif',
              color: '#1D2D44',
              }}>
              <Link href="/" style={{ textDecoration: 'none', fontFamily: 'calibri, sans-serif',
              color: '#1D2D44', }}>
                BreakdownLing
              </Link>
            </Typography>
        <Link href="/about" style={{ textDecoration: 'none' }}>
            <Button 
            sx={{ 
                color: '#1D2D44',
                backgroundColor: '#ffffff',
                fontSize: '1rem',
                fontWeight: '500',
                textTransform: 'capitalize',
                border: '1px solid #1D2D44',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                }
            }}
            >
            About
            </Button>
        </Link>
        <Link href="/tool" style={{ textDecoration: 'none' }}>
            <Button 
            sx={{ 
                color: '#ffffff',
                backgroundColor: '#1D2D44',
                fontSize: '1rem',
                fontWeight: '500',
                textTransform: 'capitalize',
                '&:hover': {
                  backgroundColor: '#153854',
                }
            }}
            >
            Use the Tool
            </Button>
        </Link>
        <Button 
            sx={{ 
                color: '#1D2D44',
                backgroundColor: '#ffffff',
                fontSize: '1rem',
                fontWeight: '500',
                textTransform: 'capitalize',
                border: '1px solid #1D2D44',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                }
            }}
            onClick={user ? handleLogout : () => setLoginOpen(true)}
        >
            {user ? 'Logout' : 'Login'}
        </Button>
      </Toolbar>

      <Dialog open={loginOpen} onClose={() => setLoginOpen(false)}>
        <DialogTitle>{isSignUp ? 'Sign Up' : 'Login'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            autoComplete="email"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            autoComplete={isSignUp ? "new-password" : "current-password"}
          />
          {isSignUp && (
            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              margin="normal"
              autoComplete="new-password"
            />
          )}
          {loginError && (
            <Typography color="error" sx={{ mt: 1 }}>
              {loginError}
            </Typography>
          )}
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setLoginError('');
                setConfirmPassword('');
              }}
              sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}
            >
              {isSignUp ? 'Login' : 'Sign up'}
            </Button>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setLoginOpen(false);
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setLoginError('');
            setIsSignUp(false);
          }}>Cancel</Button>
          <Button 
            onClick={isSignUp ? handleSignUp : handleLogin}
            variant="contained"
            disabled={!email || !password || (isSignUp && !confirmPassword)}
          >
            {isSignUp ? 'Sign Up' : 'Login'}
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}

