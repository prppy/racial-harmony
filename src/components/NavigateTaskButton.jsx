import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavigateTaskButton = ({ task, admin}) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (admin) {
      navigate(`/task/${task.id}`,  { state: { task } });
    } else {
      navigate(`/voucher/${task.id}`,  { state: { task } });
    }
  };

  return (
    <button
      className='button'
      style={{
        fontWeight: 'bold',
        fontSize: 20,
        width: '100%',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      }}
      onClick={handleViewDetails}
    >
      View Details
    </button>
  );
};

export default NavigateTaskButton;
