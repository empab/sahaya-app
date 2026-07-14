import React from 'react';
import { Home as HomeIcon, Briefcase, Shield } from 'lucide-react';

export default function Landing({ onSelect }) {
  return (
    <div className="sh-landing">
      <div className="sh-brand-mark">
        <HomeIcon size={22} color="#fff" />
      </div>
      <h1 className="sh-display">Sahaya</h1>
      <p className="sh-tag">
        One platform, three sides of the same job: customers who need help at home,
        verified providers who do the work, and the team keeping it all running.
      </p>

      <div className="sh-portal-grid">
        <div className="sh-portal-card" onClick={() => onSelect('user')} id="portal-customer">
          <div className="sh-picon"><HomeIcon size={20} /></div>
          <b>Customer App</b>
          <span>Book a service</span>
        </div>
        <div className="sh-portal-card" onClick={() => onSelect('provider')} id="portal-provider">
          <div className="sh-picon"><Briefcase size={20} /></div>
          <b>Partner App</b>
          <span>Accept &amp; complete jobs</span>
        </div>
        <div className="sh-portal-card" onClick={() => onSelect('admin')} id="portal-admin">
          <div className="sh-picon"><Shield size={20} /></div>
          <b>Admin Panel</b>
          <span>Run the platform</span>
        </div>
      </div>

      <p className="sh-landing-footer">Prototype · all three portals share one live booking pipeline</p>
    </div>
  );
}
