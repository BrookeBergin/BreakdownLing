"use client";

import { AppBar, Toolbar, Typography, Button, Link } from '@mui/material';

export default function NavBar() {
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
          BreakdownLing
        </Typography>
        <Link href="/" style={{ textDecoration: 'none' }}>
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
      </Toolbar>
    </AppBar>
  );
}

