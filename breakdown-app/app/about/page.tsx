"use client";

import { useState } from "react";
import Image from 'next/image';
import { Typography, Button, Link, autocompleteClasses } from '@mui/material';
import { Directions } from "@mui/icons-material";
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { motion } from "framer-motion";


const CardStyle = styled(Paper)(({ theme }) => ({
  minHeight: 420,
  padding: theme.spacing(2),
  ...theme.typography.body2,
  textAlign: 'center',
}));

export default function Home() {
  
  return (
    <div style={{ 
        padding: 64,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        }}>
        <div>
            <p
            style={{
                fontSize: 56,
                fontWeight: 'bold',
                marginBottom: 24,
                letterSpacing: '-0.04em',
                color:`#1D2D44`,
                marginTop: 0,
            }}
            >
                The Research-Practice Interface
            </p>
        </div>

        <Stack direction="column" spacing={4}>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.5 }}
                transition={{ duration: 0.6 }}
                >
              <CardStyle variant="elevation">
                  <p
                      style={{
                          fontSize: 36,
                          marginBottom: 24,
                          letterSpacing: '-0.04em',
                          color: `#1D2D44`,
                      }}
                  >
                      Card 1 Header
                  </p>
                  <p>
                      Text text text text text Text text text text text Text text text text text Text text text text textText text text text text Text text text text text
                  </p>
                  default variant
              </CardStyle>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
                >
              <CardStyle variant="elevation">
                  <p
                      style={{
                          fontSize: 36,
                          marginBottom: 24,
                          letterSpacing: '-0.04em',
                          color: `#1D2D44`,
                      }}
                  >
                      Card 1 Header
                  </p>
                  <p>
                      Text text text text text Text text text text text Text text text text text Text text text text textText text text text text Text text text text text
                  </p>
                  default variant
              </CardStyle>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
                >
              <CardStyle variant="elevation">
                  <p
                      style={{
                          fontSize: 36,
                          marginBottom: 24,
                          letterSpacing: '-0.04em',
                          color: `#1D2D44`,
                      }}
                  >
                      Card 1 Header
                  </p>
                  <p>
                      Text text text text text Text text text text text Text text text text text Text text text text textText text text text text Text text text text text
                  </p>
                  default variant
              </CardStyle>
            </motion.div>
            
        </Stack>            
        
      
    </div>
  );
}