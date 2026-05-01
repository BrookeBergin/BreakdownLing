"use client";

import { useState } from "react";
import Image from 'next/image';
import { Typography, Button, Link } from '@mui/material';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabase";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


const CardStyle = styled(Paper)(({ theme }) => ({
  minHeight: 100,
  padding: theme.spacing(2),
  ...theme.typography.body2,
  textAlign: 'center',
  border: '1px solid #748cabff',
  position: 'relative',

  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    right: -10,
    transform: 'translateY(-50%)',
    width: 0,
    height: 0,
    borderTop: '8px solid transparent',
    borderBottom: '8px solid transparent',
    borderLeft: '10px solid #748cabff',
  },
}));

export default function Home() {
  const router = useRouter();

  return (
    <div>
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
                    color:`#1D2D44`
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
                <Link href="/about" style={{ textDecoration: 'none' }}>
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
                    <Button 
                    onClick={async () => {
                    const { data } = await supabase.auth.getUser();

                    if (!data.user) {
                    window.dispatchEvent(new Event("open-login"));
                    } else {
                    router.push("/tool");
                    }
                }}
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
    <div style={{margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingBottom: 64}}>
        <p
                style={{
                    fontSize: 40,
                    marginBottom: 24,
                    letterSpacing: '-0.04em',
                    color:`#1D2D44`
                }}
                >
                    How does it work?
                </p>
        <Stack direction="row" spacing={2}>
            <CardStyle variant="elevation">
                <p
                    style={{
                        fontSize: 30,
                        marginBottom: 24,
                        letterSpacing: '-0.04em',
                        color: `#1D2D44`,
                    }}
                >
                    1: Make a free account
                </p>
            </CardStyle>
            <CardStyle variant="elevation">
                <p
                    style={{
                        fontSize: 30,
                        marginBottom: 24,
                        letterSpacing: '-0.04em',
                        color: `#1D2D44`,
                    }}
                >
                    2: Upload a research paper
                </p>
            </CardStyle>
            <CardStyle variant="elevation">
                <p
                    style={{
                        fontSize: 30,
                        marginBottom: 24,
                        letterSpacing: '-0.04em',
                        color: `#1D2D44`,
                    }}
                >
                    3: Receive a Breakdown
                </p>
            </CardStyle>
            <CardStyle variant="elevation">
                <p
                    style={{
                        fontSize: 30,
                        marginBottom: 24,
                        letterSpacing: '-0.04em',
                        color: `#1D2D44`,
                    }}
                >
                    4: Join the discussion
                </p>
            </CardStyle>
        
                    
                </Stack>
    </div>
    </div>
    );
}