import { AppBar, Toolbar, Typography, Button, Link } from '@mui/material';

export default function NavBar() {
  return (
    <AppBar sx={{ 
        position: 'sticky', 
        top: 0, 
        backgroundColor: '#1D2D44',
        }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ 
            flexGrow: 1, 
            fontFamily: 'calibri, sans-serif',
            }}>
          BreakdownLing
        </Typography>
        <Link href="/" style={{ textDecoration: 'none' }}>
            <Button 
            sx={{ 
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: '500',
                textTransform: 'capitalize',
                '&:hover': {
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
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
                fontSize: '1rem',
                fontWeight: '500',
                textTransform: 'capitalize',
                '&:hover': {
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
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

