import React from 'react';
import LoginPage from './pages/LoginPage';
import CreateUserPage from './pages/CreateUserPage';
import DashboardPage from './pages/DashboardPage';
import { useUserContext } from './context/UserContext';
import { Routes,Route } from 'react-router-dom';

function App() {
  const { isLoggedIn } = useUserContext();
  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <CreateUserPage /> : <LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/create-user" element={<CreateUserPage />} />
      <Route path="/dashboard" element={isLoggedIn ? <DashboardPage/> : <LoginPage />} />
    </Routes>)
}
export default App;
