import { Routes, Route, Navigate } from 'react-router-dom';
import MainPage from '../pages/MainPage/index';
import AHPCalculator from '../pages/AHPCalculator/index';
import NotFound from '../pages/NotFound/index';
import Layout from '../components/Layout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/calculator" element={<AHPCalculator />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 