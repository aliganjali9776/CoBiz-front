// src/components/AIScreen.js

import React, { useState, useEffect, useRef } from 'react';

// URL بک‌اند را به صورت ثابت تعریف می‌کنیم
const BACKEND_URL = 'http://localhost:5001';

function AIScreen({ onGoToDashboard }) {
  const [messages, setMessages] = useState([
    { text: 'سلام! من دستیار هوش مصنوعی شما هستم. چطور می‌توانم در چالش‌های مدیریتی امروز به شما کمک کنم؟', sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // استفاده از endpoint جدید برای هوش مصنوعی چند-ایجنت
      const response = await fetch(`${BACKEND_URL}/api/business-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentInput }),
      });

      if (!response.ok) {
        throw new Error('مشکلی در پاسخ سرور بک‌اند وجود دارد.');
      }

      const data = await response.json();
      const aiMessage = { text: data.response, sender: 'ai' };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error fetching from backend:", error);
      const errorMessage = { text: 'متاسفانه در ارتباط با سرور بک‌اند مشکلی پیش آمد. لطفاً مطمئن شوید سرور شما در حال اجراست.', sender: 'ai' };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const renderMessageContent = (text) => {
    // از dangerouslySetInnerHTML برای نمایش Markdown استفاده می‌کنیم
    // این کار برای نمایش بهتر پاسخ‌های چند-ایجنت ضروری است
    return { __html: text.replace(/\n/g, '<br/>') };
  };

  return (
    <div className="ai-container">
      <div className="page-header">
        <h1>دستیار هوش مصنوعی مدیر</h1>
        <button onClick={onGoToDashboard} className="back-to-dashboard-btn minimal">
          <i className="fa-solid fa-arrow-right"></i> بازگشت به منوی اصلی
        </button>
      </div>
      <div className="chat-window">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <p dangerouslySetInnerHTML={renderMessageContent(msg.text)}></p>
            </div>
          ))}
          {isLoading && <div className="message ai typing-indicator"><span>.</span><span>.</span><span>.</span></div>}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="chat-input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="سوال مدیریتی خود را بپرسید..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
}

export default AIScreen;
