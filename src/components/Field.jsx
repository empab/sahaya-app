import React from 'react';

export default function Field({ label, icon: Icon, ...props }) {
  return (
    <div className="sh-field">
      <label className="sh-label">{label}</label>
      <div className="sh-input-wrap">
        {Icon && <Icon size={16} />}
        <input className={'sh-input' + (Icon ? '' : ' sh-input-noicon')} {...props} />
      </div>
    </div>
  );
}
