'use client';

import dynamic from 'next/dynamic';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import the App component dynamically to avoid SSR issues with browser APIs
const App = dynamic(() => import('../components/App'), { 
  ssr: false,
  loading: () => <div>Loading...</div> 
});

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
});

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}
