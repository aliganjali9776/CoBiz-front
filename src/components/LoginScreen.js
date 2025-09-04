// src/components/LoginScreen.js

import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import logo from '../Logo.jpg'; // مطمئن شوید مسیر لوگوی شما درست است

// به صورت هوشمند آدرس بک‌اند را بر اساس محیط (لوکال یا آنلاین) انتخاب می‌کند
const BACKEND_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5001' // آدرس برای تست روی کامپیوتر شما
  : 'https://cobiz.onrender.com'; // آدرس برای سایت آنلاین

function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState('login'); 
  
  // استیت‌های مشترک
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // استیت‌های مخصوص فراموشی رمز
  const [verificationCode, setVerificationCode] = useState('');

  const switchMode = (newMode) => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
    setPhone('');
    setPassword('');
    setName('');
    setVerificationCode('');
  };

  const handleRequestResetCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/users/request-reset-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'خطا در ارسال کد.');
      
      setSuccess('کد تایید با موفقیت به شماره شما ارسال شد.');
      setMode('resetPassword');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/users/reset-password-with-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: verificationCode, newPassword: password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'کد تایید نامعتبر است.');

      setSuccess('رمز عبور شما با موفقیت تغییر کرد. اکنون می‌توانید وارد شوید.');
      switchMode('login');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const endpoint = mode === 'login' ? 'login' : 'register';
    const payload = mode === 'login' ? { phone, password } : { name, phone, password };

    try {
      const response = await fetch(`${BACKEND_URL}/api/users/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'یک خطای ناشناخته رخ داد.');
      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError(null);
    try {
      const googleToken = credentialResponse.credential;
      const response = await fetch(`${BACKEND_URL}/api/users/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: googleToken }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'خطا در ارتباط با سرور');
      }
      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleLoginError = () => {
    setError('خطا در ورود با گوگل. لطفاً دوباره تلاش کنید.');
  };

  const renderFormContent = () => {
    if (mode === 'forgotPassword') {
      return (
        <form onSubmit={handleRequestResetCode} className="login-form">
          <div className="input-group">
            <i className="fa-solid fa-phone"></i>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="شماره تلفن همراه خود را وارد کنید" required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'در حال ارسال...' : 'ارسال کد تایید'}
          </button>
        </form>
      );
    }

    if (mode === 'resetPassword') {
      return (
        <form onSubmit={handleResetPassword} className="login-form">
          <div className="input-group">
            <i className="fa-solid fa-key"></i>
            <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} placeholder="کد تایید دریافت شده" required />
          </div>
          <div className="input-group">
            <i className="fa-solid fa-lock"></i>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="رمز عبور جدید" required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'در حال بررسی...' : 'تغییر رمز عبور'}
          </button>
        </form>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="login-form">
        {mode === 'register' && (
          <div className="input-group"><i className="fa-solid fa-user"></i><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="نام و نام خانوادگی" required /></div>
        )}
        <div className="input-group"><i className="fa-solid fa-phone"></i><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="شماره تلفن همراه" required /></div>
        <div className="input-group"><i className="fa-solid fa-lock"></i><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="رمز عبور" required /></div>
        {mode === 'login' && <span className="forgot-password-link" onClick={() => switchMode('forgotPassword')}>فراموشی رمز عبور؟</span>}
        <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? 'در حال ارسال...' : (mode === 'login' ? 'ورود' : 'ثبت‌نام')}</button>
      </form>
    );
  };

  return (
    <div className="login-container">
      <div className="login-logo-container"><img src={logo} alt="لوگو CoBiz" className="login-logo" /></div>
      <div className="login-header">
        <h1>
          {mode === 'login' && 'ورود به حساب کاربری'}
          {mode === 'register' && 'ایجاد حساب کاربری'}
          {mode === 'forgotPassword' && 'بازیابی رمز عبور'}
          {mode === 'resetPassword' && 'تنظیم رمز عبور جدید'}
        </h1>
        <p>
          {mode === 'login' && 'خوش آمدید! لطفاً وارد شوید.'}
          {mode === 'register' && 'برای شروع، اطلاعات خود را وارد کنید.'}
          {mode === 'forgotPassword' && 'شماره تلفن خود را برای دریافت کد تایید وارد کنید.'}
          {mode === 'resetPassword' && 'کد دریافت شده و رمز جدید را وارد نمایید.'}
        </p>
      </div>
      
      {renderFormContent()}
      
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      {(mode === 'login' || mode === 'register') && (
        <>
          <div className="divider">یا</div>
          <div className="google-login-container">
            <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={handleGoogleLoginError} useOneTap />
          </div>
        </>
      )}

      <div className="toggle-mode">
        {mode === 'login' && <p>حساب کاربری ندارید؟ <span onClick={() => switchMode('register')}>ثبت‌نام کنید</span></p>}
        {mode === 'register' && <p>قبلاً ثبت‌نام کرده‌اید؟ <span onClick={() => switchMode('login')}>وارد شوید</span></p>}
        {(mode === 'forgotPassword' || mode === 'resetPassword') && <p><span onClick={() => switchMode('login')}>بازگشت به صفحه ورود</span></p>}
      </div>
    </div>
  );
}

export default LoginScreen;

