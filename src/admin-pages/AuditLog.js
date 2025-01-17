import React from 'react';
import AuditLogTable from '../components/AuditLogTable';

const AuditLog = () => {
  return (
    <div style={pageStyles.pageContainer}>
     <AuditLogTable />
    </div>
  );
};

const pageStyles = {
  pageContainer: {
    padding: '20px',
  },
};

export default AuditLog