import React, { useState } from 'react';
import { Phone, Lock, ArrowLeft, Mail } from 'lucide-react';
import Field from './Field.jsx';

export default function LoginScreen({ roleLabel, hint, RoleIcon, onLogin, onExit, isEmail = false }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    // Pass credentials to parent. If parent returns false, show an error.
    const success = onLogin(id, password);
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
        <Field
          label={isEmail ? "Email Address" : "Phone number"}
          icon={isEmail ? Mail : Phone}
          placeholder={isEmail ? "admin@example.com" : "98650 xxxxx"}
          value={id}
          onChange={e => setId(e.target.value)}
        />
        <Field 
          label="Password" 
          icon={Lock} 
          type="password" 
          placeholder="••••••••" 
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className="sh-btn sh-btn-primary" style={{ marginTop: 6 }}>
          Log in
        </button>
      </form>
      {!isEmail && <p className="sh-demo-note">This is a prototype — any details will log you in as a demo account.</p>}
      {onExit && (
        <div style={{ marginTop: 14 }}>
          <button type="button" className="sh-btn sh-btn-ghost" onClick={onExit}>
            <ArrowLeft size={15} /> Back to portal picker
          </button>
        </div>
      )}
    </div>
  );
}
