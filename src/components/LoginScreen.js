// src/components/LoginScreen.js

import React, { useState } from 'react';
import logo from '../Logo.jpg';

const BACKEND_URL = 'https://cobiz.onrender.com';

function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState('login');
  
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [position, setPosition] = useState('');
  
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const endpoint = mode === 'login' ? 'login' : 'register';
    const payload = mode === 'login' 
      ? { phone, password } 
      : { name, phone, password, companyName, companySize, position };

    try {
      const response = await fetch(`${BACKEND_URL}/api/users/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'یک خطای ناشناخته رخ داد.');
      }
      
      onLogin(data.user || data);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="لوگو" className="app-logo" />
      <h1>{mode === 'login' ? 'ورود به حساب کاربری' : 'ساخت حساب کاربری جدید'}</h1>
      
      <form onSubmit={handleSubmit} className="login-form">
        {mode === 'register' && (
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="نام و نام خانوادگی" required />
        )}
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="شماره تلفن همراه" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="رمز عبور" required />
        {mode === 'register' && (
          <>
            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="نام شرکت" required />
            <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="پوزیشن کاری شما" required />
            <input type="number" value={companySize} onChange={(e) => setCompanySize(e.target.value)} placeholder="تعداد نفرات شرکت" required />
          </>
        )}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'در حال ارسال...' : (mode === 'login' ? 'ورود' : 'ثبت‌نام')}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>

      <div className="toggle-mode">
        {mode === 'login' ? (
          <p>حساب کاربری ندارید؟ <span onClick={() => setMode('register')}>ثبت‌نام کنید</span></p>
        ) : (
          <p>قبلاً ثبت‌نام کرده‌اید؟ <span onClick={() => setMode('login')}>وارد شوید</span></p>
        )}
      </div>
    </div>
  );
}

export default LoginScreen;