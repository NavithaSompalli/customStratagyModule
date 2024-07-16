import React from 'react';
import './index.css';

const SettingsModal = ({ isOpen, onClose }) => {
  return (
    <div className={`modal ${isOpen ? 'open' : 'closed'}`}>
      <div className="modal-content">
        <div>
          <span className="close" onClick={onClose}>&times;</span>
          <h2>RSI</h2>
        </div>
        <div>
          <span>Inputs</span>
          <span>styles</span>
          <span>Visibility</span>
        </div>
        <div>
          <h5>RSI SETTINGS</h5>
          <form className='rsi-bg-inputs-container'>
            
              <label htmlFor='rsiPeriod'>RSI Length</label>
              <input type='number' id='rsiPeriod' name='rsiPeriod' min='1' max='100' />
            
            <div className='rsi-input'>
              <label htmlFor='rsi-source'>Source</label>
              <select id='rsi-source'>
                <option value='close'>Closing Price</option>
                <option value='volume'>Volume Price</option>
                <option value='open'>Open</option>
                <option value='low'>Low</option>
                <option value='high'>High</option>
                <option value='hl2'>hl2</option>
                <option value='hlc3'>hlc3</option>
                <option value="ohlc4">ohlc4</option>
                <option value="hlcc4">hlcc4</option>
              </select>
            </div>
            <div className='rsi-input'>
              <input type='checkbox' id='checkbox' />
              <label htmlFor="checkbox" className="checkbox-label">Show Divergence</label>
            </div>
            <h5>MULTI TIMEFRAME</h5>
            <div>
              <label>timeframe</label>
              <select>
                
              </select>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
