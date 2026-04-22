"use client";

import { useState } from "react";
import Image from 'next/image';
import { Typography, Button, Link } from '@mui/material';


export default function Home() {
  

  return (
    <div style={{ 
        padding: 64,
        height: 636,
        display: 'flex',
        }}>
        <div style={{maxWidth: '65%'}}>
            <div>
                <p
                style={{
                    fontSize: 56,
                    fontWeight: 'bold',
                    marginBottom: 24,
                    letterSpacing: '-0.04em',
                }}
                >
                    Breakdown: Demystify Linguistics Research
                </p>
                <p
                style={{
                    fontSize: 24,
                    marginBottom: 24,
                    letterSpacing: '-0.04em',
                    color: 'rgba(0, 0, 0, 0.5)',
                }}
                >Summarize and comprehend research papers in just a few clicks</p>
            </div>
            <div style={{display: 'flex', gap: '16px'}}>
                <Link href="/" style={{ textDecoration: 'none' }}>
                    <Button 
                    variant="contained"
                    sx={{ 
                        color: '#ffffff',
                        fontSize: '1rem',
                        backgroundColor: '#3E5C76'
                    }}
                    >
                    About
                    </Button>
                </Link>
                <Link href="/tool" style={{ textDecoration: 'none' }}>
                    <Button 
                    variant="outlined"
                    sx={{ 
                        color: '#3E5C76',
                        fontSize: '1rem',
                        backgroundColor: '#ffffff',
                        borderColor: '#3E5C76',
                        '&:hover': {
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                        }
                    }}
                    >
                    Use the tool
                    </Button>
                </Link>
            </div>
        </div>
        <div style={{ position: 'relative', width: '400px', height: '400px' }}>
            <Image
            src="/static/people-icon.png"
            alt="Landing Image: an icon of cartoon people around a computer screen"
            fill
            style={{ objectFit: 'contain' }}
            />
        </div>
      
    </div>
  );
}