import * as React from "react";

interface ContactNotificationEmailProps {
  name: string;
  subject: string;
  message: string;
}

export const ContactNotificationEmail: React.FC<ContactNotificationEmailProps> = ({
  name,
  subject,
  message,
}) => {
  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f9fafb',
      padding: '40px 20px',
      color: '#111827'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#166534',
          padding: '32px',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#ffffff', margin: 0, fontSize: '24px', fontWeight: '700' }}>Message Received</h1>
          <p style={{ color: '#d1fae5', margin: '8px 0 0 0' }}>We&apos;ll get back to you shortly</p>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          <p style={{ fontSize: '16px', lineHeight: '24px', margin: '0 0 24px 0' }}>
            Hi {name},<br />
            Thank you for reaching out to CCB Farms. We have received your message regarding <strong>&quot;{subject}&quot;</strong> and our team will review it as soon as possible.
          </p>

          <div style={{ backgroundColor: '#f9fafb', padding: '24px', borderRadius: '8px', borderLeft: '4px solid #166534' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', margin: '0 0 8px 0' }}>Your Message:</h3>
            <p style={{ fontSize: '14px', margin: 0, fontStyle: 'italic', color: '#374151' }}>&quot;{message}&quot;</p>
          </div>

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 16px 0' }}>
              If your request is urgent, please call us directly.
            </p>
            <a 
              href="https://ccbfarms.com" 
              style={{
                display: 'inline-block',
                backgroundColor: '#166534',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              Visit Our Website
            </a>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          backgroundColor: '#f3f4f6',
          padding: '24px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#9ca3af'
        }}>
          <p style={{ margin: 0 }}>© {new Date().getFullYear()} CCB Farms. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
