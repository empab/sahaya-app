import React, { useState } from 'react';
import { Mail, Phone, Lock, ArrowLeft, KeyRound } from 'lucide-react';
import Field from './Field.jsx';

export default function LoginScreen({ roleLabel, hint, icon: RoleIcon, onLogin, onSendOtp, onVerifyOtp, onExit, useOtp }) {
  const isEmail = roleLabel?.toLowerCase().includes('admin');
  
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState('credentials'); // credentials, otp

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (useOtp && step === 'credentials') {
      const { error: otpError } = await onSendOtp(id);
      if (otpError) {
        setError(otpError.message || 'Failed to send OTP.');
      } else {
        setStep('otp');
      }
      return;
    }

    if (useOtp && step === 'otp') {
      const { error: verifyError } = await onVerifyOtp(id, otp);
      if (verifyError) {
        setError(verifyError.message || 'Invalid verification code.');
      }
      return;
    }

    // Password login
    const success = await onLogin(id, password);
    if (success === false) {
      setError('Invalid credentials.');
    }
  };

  return (
    <div style={{ padding: '20px 4px' }}>
      <div className="sh-patch lg teal" style={{ marginBottom: 16 }}>
        <RoleIcon size={26} color="var(--teal)" />
      </div>
      <h2 className="sh-h1">Log in to {roleLabel}</h2>
      <p className="sh-sub">{hint}</p>
      
      {error && <div style={{ color: 'red', fontSize: 13, marginBottom: 10, fontWeight: 600 }}>{error}</div>}

      <form onSubmit={handleLogin}>
        {step === 'credentials' && (
          <Field
            label="Email Address"
            icon={Mail}
            type="email"
            required
            placeholder={isEmail ? "admin@example.com" : "you@example.com"}
            value={id}
            onChange={e => setId(e.target.value)}
          />
        )}
        
        {step === 'credentials' && !useOtp && (
          <Field 
            label="Password" 
            icon={Lock} 
            type="password" 
            required
            placeholder="••••••••" 
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        )}

        {step === 'otp' && (
          <Field 
            label="Verification Code" 
            icon={KeyRound} 
            type="text" 
            required
            placeholder="6-digit code" 
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />
        )}

        <button type="submit" className="sh-btn sh-btn-primary" style={{ marginTop: 6 }}>
          {step === 'credentials' && useOtp ? 'Send OTP' : (step === 'otp' ? 'Verify Code' : 'Log in')}
        </button>
      </form>
      {!isEmail && step === 'credentials' && <p className="sh-demo-note">Enter your email to receive a secure login code.</p>}
      
      {step === 'otp' && (
        <div style={{ marginTop: 14 }}>
          <button type="button" className="sh-btn sh-btn-ghost" onClick={() => setStep('credentials')}>
            <ArrowLeft size={15} /> Back to email
          </button>
        </div>
      )}
      
      {onExit && step === 'credentials' && (
        <div style={{ marginTop: 14 }}>
          <button type="button" className="sh-btn sh-btn-ghost" onClick={onExit}>
            <ArrowLeft size={15} /> Back to portal picker
          </button>
        </div>
      )}
    </div>
  );
}
