import * as React from "react";

interface OrderConfirmationEmailProps {
  orderData: {
    name: string;
    email?: string | null;
    phone: string;
    streetAddress?: string | null;
    city?: string | null;
    state?: string | null;
    category?: string | null;
    subCategory?: string | null;
    quantity?: string | null;
    totalAmount?: number | null;
    items?: string | null;
    deliveryOption: string;
    notes?: string | null;
  };
}

export const OrderConfirmationEmail: React.FC<OrderConfirmationEmailProps> = ({
  orderData,
}) => {
  const items = Array.isArray(orderData.items) 
    ? orderData.items 
    : (typeof orderData.items === 'string' ? JSON.parse(orderData.items) : []);

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
          <h1 style={{ color: '#ffffff', margin: 0, fontSize: '24px', fontWeight: '700' }}>Order Confirmed!</h1>
          <p style={{ color: '#d1fae5', margin: '8px 0 0 0' }}>Thank you for shopping with CCB Farms</p>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          <p style={{ fontSize: '16px', lineHeight: '24px', margin: '0 0 24px 0' }}>
            Hi {orderData.name},<br />
            We&apos;ve received your order and we&apos;re getting it ready for you.
          </p>

          <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0' }}>Order Details</h2>
            
            {items.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>
                    <th style={{ paddingBottom: '8px' }}>Category</th>
                    <th style={{ paddingBottom: '8px' }}>Size/Type</th>
                    <th style={{ paddingBottom: '8px', textAlign: 'right' }}>Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any, index: number) => {
                    const categoryName = item.name || (item.categoryId ? item.categoryId.charAt(0).toUpperCase() + item.categoryId.slice(1) : 'Product');
                    return (
                      <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '12px 0', fontSize: '14px', fontWeight: '600' }}>{categoryName}</td>
                        <td style={{ padding: '12px 0', fontSize: '14px' }}>{item.subCategory || 'Standard'}</td>
                        <td style={{ padding: '12px 0', fontSize: '14px', textAlign: 'right' }}>{item.quantity}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p style={{ fontSize: '14px' }}>
                {orderData.category} - {orderData.subCategory} ({orderData.quantity})
              </p>
            )}

            {orderData.totalAmount && (
              <div style={{ marginTop: '16px', textAlign: 'right' }}>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>Total Amount</p>
                <p style={{ fontSize: '20px', fontWeight: '700', color: '#166534', margin: '4px 0 0 0' }}>
                  ₦{orderData.totalAmount.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', margin: '0 0 8px 0' }}>Delivery Method</h3>
              <p style={{ fontSize: '14px', margin: 0 }}>{orderData.deliveryOption}</p>
            </div>
            {orderData.streetAddress && (
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', margin: '0 0 8px 0' }}>Delivery Address</h3>
                <p style={{ fontSize: '14px', margin: 0 }}>
                  {orderData.streetAddress}<br />
                  {orderData.city}, {orderData.state}
                </p>
              </div>
            )}
          </div>

          {orderData.notes && (
            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', margin: '0 0 4px 0' }}>Notes</h3>
              <p style={{ fontSize: '14px', margin: 0, fontStyle: 'italic' }}>&quot;{orderData.notes}&quot;</p>
            </div>
          )}

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 16px 0' }}>
              If you have any questions, feel free to contact us at 09093009400
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
              Visit Storefront
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
          <p style={{ margin: '4px 0 0 0' }}>Providing fresh and healthy farm products.</p>
        </div>
      </div>
    </div>
  );
};
