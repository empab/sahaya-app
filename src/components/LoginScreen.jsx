import React, { useState } from 'react';
import { Phone, Lock, ArrowLeft } from 'lucide-react';
import Field from './Field.jsx';

export default function LoginScreen({ roleLabel, hint, RoleIcon, onLogin, onExit }) {
  const [phone, setPhone] = useState('');
  return (
    <div style={{ padding: '20px 4px' }}>
      <div className="sh-patch lg teal" style={{ marginBottom: 16 }}>
        <RoleIcon size={26} color="var(--teal)" />
      </div>
      <h2 className="sh-h1">Log in to {roleLabel}</h2>
      <p className="sh-sub">{hint}</p>
      <Field
        label="Phone number"
        icon={Phone}
        placeholder="98650 xxxxx"
        value={phone}
        onChange={e => setPhone(e.target.value)}
      />
      <Field label="Password" icon={Lock} type="password" placeholder="••••••••" />
      <button className="sh-btn sh-btn-primary" style={{ marginTop: 6 }} onClick={onLogin}>
        Log in
      </button>
      <p className="sh-demo-note">This is a prototype — any details will log you in as a demo account.</p>
      {onExit && (
        <div style={{ marginTop: 14 }}>
          <button className="sh-btn sh-btn-ghost" onClick={onExit}>
            <ArrowLeft size={15} /> Back to portal picker
          </button>
        </div>
      )}
    </div>
  );
}
