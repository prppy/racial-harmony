import React from 'react';
import { FaCheck } from 'react-icons/fa';
import '../styles/buttonStyles.css';

const SubmitButton = ({ handleSubmitBackground, externalStyle}) => {
  return (
    <button className="submit-button" onClick={handleSubmitBackground} style={externalStyle}>
      <div className="button-content">
        <FaCheck color="white" />
        <span>Select</span>
      </div>
    </button>
  );
};

export default SubmitButton;
