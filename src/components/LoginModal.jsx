import React, { useState } from 'react';
import { X, Lock, Mail, Shield, AlertCircle } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter your institutional email and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    // Simulate login verification
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Institutional Sign-In initiated for ${email}. Single Sign-On verification complete.`);
      onClose();
    }, 800);
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="login-modal-close" onClick={onClose} aria-label="Close dialog">
          <X size={18} />
        </button>

        <div className="login-modal-header">
          <div className="login-modal-icon">
            <Shield size={24} />
          </div>
          <h2 className="login-modal-title">Researcher Sign In</h2>
          <p className="login-modal-subtitle">
            Single Sign-On (SSO) for Faculty of Engineering researchers, scholars, and administrators.
          </p>
        </div>

        {errorMsg && (
          <div className="login-error-alert">
            <AlertCircle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-modal-form">
          <div className="form-group">
            <label htmlFor="login-email">Institutional Email or ID</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input
                id="login-email"
                type="email"
                placeholder="faculty.name@balamand.edu.lb"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                id="login-password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              <span>Remember this device</span>
            </label>
            <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password recovery link sent to IT Helpdesk.'); }} className="forgot-link">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="btn-login-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Authenticating...' : 'Sign In via UOB SSO'}
          </button>
        </form>

        <div className="login-modal-footer">
          <p>Protected by University of Balamand IT & Security Governance.</p>
        </div>
      </div>
    </div>
  );
}
