import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

const Layout = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        style={{ flex: 1 }}
      >
        <Outlet />
      </motion.main>
    </Box>
  );
};

export default Layout; 