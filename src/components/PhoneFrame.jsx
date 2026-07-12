import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function PhoneFrame({ time = '14:31', title, onBack, children, nav, active, onNav }) {
  return (
    <div className="sh-phone-wrap">
      <div className="sh-phone">
        {/* Status bar */}
        <div className="sh-statusbar">
          <span>{time}</span>
          <span>5G · 77%</span>
        </div>

        {/* Top bar */}
        {title && (
          <div className="sh-topbar">
            {onBack && (
              <span className="sh-back" onClick={onBack}>
                <ArrowLeft size={19} />
              </span>
            )}
            <b>{title}</b>
          </div>
        )}

        {/* Scrollable body */}
        <div className="sh-body">{children}</div>

        {/* Bottom navigation */}
        {nav && (
          <div className="sh-bottomnav">
            {nav.map(item => (
              <div
                key={item.key}
                className={'sh-nav-item' + (active === item.key ? ' active' : '')}
                onClick={() => onNav(item.key)}
              >
                {item.badge ? (
                  <span className="sh-nav-badge-wrap">
                    <item.icon size={18} />
                    <span className="sh-badge">{item.badge}</span>
                  </span>
                ) : (
                  <item.icon size={18} />
                )}
                {item.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
