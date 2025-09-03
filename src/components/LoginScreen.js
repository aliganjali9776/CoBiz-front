// src/components/LoginScreen.js

import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import logo from '../Logo.jpg'; // ۱. ایمپورت لوگو

const BACKEND_URL = 'https://cobiz.onrender.com';

function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState('login');
  
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const endpoint = mode === 'login' ? 'login' : 'register';
    const payload = mode === 'login' 
      ? { phone, password } 
      : { name, phone, password };

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
  
  const handleGoogleLoginSuccess = (credentialResponse) => {
    const token = credentialResponse.credential;
    const decodedToken = jwtDecode(token);
    
    console.log("اطلاعات دریافت شده از گوگل:", decodedToken);
    alert('ورود با گوگل موفقیت‌آمیز بود! (اطلاعات در کنسول نمایش داده شد)');
  };
  
  const handleGoogleLoginError = () => {
    setError('خطا در ورود با گوگل. لطفاً دوباره تلاش کنید.');
  };

  return (
    <div className="login-container">
      {/* ۲. افزودن بخش لوگو */}
      <div className="login-logo-container">
        <img src={logo} alt="لوگو CoBiz" className="login-logo" />
      </div>

      <div className="login-header">
        <h1>{mode === 'login' ? 'ورود به حساب کاربری' : 'ایجاد حساب کاربری'}</h1>
        <p>{mode === 'login' ? 'خوش آمدید! لطفاً وارد شوید.' : 'برای شروع، اطلاعات خود را وارد کنید.'}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="login-form">
        {mode === 'register' && (
          <div className="input-group">
            <i className="fa-solid fa-user"></i>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="نام و نام خانوادگی" required />
          </div>
        )}
        <div className="input-group">
          <i className="fa-solid fa-phone"></i>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="شماره تلفن همراه" required />
        </div>
        <div className="input-group">
          <i className="fa-solid fa-lock"></i>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="رمز عبور" required />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'در حال ارسال...' : (mode === 'login' ? 'ورود' : 'ثبت‌نام')}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>

      <div className="divider">یا</div>
      
      <div className="google-login-container">
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginError}
          useOneTap
        />
      </div>

      <div className="toggle-mode">
        {mode === 'login' ? (
          <p>حساب کاربری ندارید؟ <span onClick={() => { setMode('register'); setError(null); }}>ثبت‌نام کنید</span></p>
        ) : (
          <p>قبلاً ثبت‌نام کرده‌اید؟ <span onClick={() => { setMode('login'); setError(null); }}>وارد شوید</span></p>
        )}
      </div>
    </div>
  );
}

export default LoginScreen;

