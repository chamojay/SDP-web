'use client';

export default function OnlineBookingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#006400', // Dark green background color
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: '80px', // Add padding to avoid navbar overlap
      paddingBottom: '20px'
    }}>
      {children}
    </div>
  );
}