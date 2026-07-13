import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Field({ label, icon: Icon, type: initialType, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = initialType === 'password';
  const type = isPassword ? (showPassword ? 'text' : 'password') : initialType;

  return (
    <div className="sh-field">
      <label className="sh-label">{label}</label>
      <div className="sh-input-wrap">
        {Icon && <Icon size={16} />}
        <input type={type} className={'sh-input' + (Icon ? '' : ' sh-input-noicon')} {...props} />
        {isPassword && (
          <div 
            onClick={() => setShowPassword(!showPassword)} 
            style={{ position: 'absolute', right: 12, top: 12, cursor: 'pointer', color: 'var(--ink-soft)' }}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </div>
        )}
      </div>
    </div>
  );
}
