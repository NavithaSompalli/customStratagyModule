import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ReferenceLine, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Bar,BarChart, BarCartesianGrid } from 'recharts';

import { IoSettingsOutline } from "react-icons/io5";

import SettingsModal from '../SettingsModal';


function RSIComponent({ data }) {

  const [rsiPeriod, setRsiPeriod] = useState(14);
  const [overboughtLevel, setOverboughtLevel] = useState(70);
  const [oversoldLevel, setOversoldLevel] = useState(30);
  const [rsiValues, setRsiValues] = useState([]);
  const [zoomLevel, setZoomLevel] = useState("date");
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  console.log(data)

  const calculateRSI = (data, rsiPeriod) => {
    let gains = 0;
    let losses = 0;
    for (let i = 1; i < data.length; i++) {
      const change = data[i].close - data[i - 1].close;
      if (i <= rsiPeriod) {
        if (change > 0) {
          gains += change;
        } else {
          losses -= change;
        }
      }
    }

    let avgGain = gains / rsiPeriod;
    let avgLoss = losses / rsiPeriod;
    let rsiArray = [];

    for (let i = rsiPeriod; i < data.length; i++) {
      const change = data[i].close - data[i - 1].close;
      let gain = change > 0 ? change : 0;
      let loss = change < 0 ? -change : 0;

      avgGain = (avgGain * (rsiPeriod - 1) + gain) / rsiPeriod;
      avgLoss = (avgLoss * (rsiPeriod - 1) + loss) / rsiPeriod;

      const rs = avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));

      rsiArray.push({ date: data[i].date, value: rsi });
    }

    setRsiValues(rsiArray);
  };

  useEffect(() => {
    if (!data || data.length < rsiPeriod) {
      console.error('Data is empty, undefined, or not enough to calculate RSI');
      return;
    }

    calculateRSI(data, rsiPeriod);
  }, [data, rsiPeriod]);

  const formatTick = (tick) => {
    const date = new Date(tick);

    switch (zoomLevel) {
      case "Year":
        return date.getFullYear();
      case "Month":
        return date.toLocaleString('default', { month: 'short' }) + ' ' + date.getFullYear();
      case "Day":
        return `${date.getDate()}/${date.getMonth() + 1}`;
      case "Hour":
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      default:
        return date.toLocaleString('default', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  const handleRsiPeriodChange = (event) => {
    setRsiPeriod(Number(event.target.value));
  };

  const handleOverboughtLevelChange = (event) => {
    setOverboughtLevel(Number(event.target.value));
  };

  const handleOversoldLevelChange = (event) => {
    setOversoldLevel(Number(event.target.value));
  };

  const handleZoomLevelChange = (event) => {
    setZoomLevel(event.target.value);
  };

  const toggleSettingsModal = () => {
    setSettingsOpen(!isSettingsOpen);
  };

  return (
    <div className='rsi-bg-container'>
      <button onClick={toggleSettingsModal}><IoSettingsOutline/></button>
      <SettingsModal isOpen={isSettingsOpen} onClose={toggleSettingsModal} />
      <div className="rsi-settings">
        <label>
          RSI Period:
          <input type="number" value={rsiPeriod} onChange={handleRsiPeriodChange} />
        </label>
        <label>
          Overbought Level:
          <input type="number" value={overboughtLevel} onChange={handleOverboughtLevelChange} />
        </label>
        <label>
          Oversold Level:
          <input type="number" value={oversoldLevel} onChange={handleOversoldLevelChange} />
        </label>
        <label>
          Zoom Level:
          <select value={zoomLevel} onChange={handleZoomLevelChange}>
            <option value="Year">Year</option>
            <option value="Month">Month</option>
            <option value="Day">Day</option>
            <option value="Hour">Hour</option>
            <option value="date">Date</option>
          </select>
        </label>
      </div>
      

      <div style={{ width: '90%', height: '200px' }}>
        <ResponsiveContainer>
          <LineChart data={rsiValues}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatTick} />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <ReferenceLine y={overboughtLevel}  stroke="red" strokeDasharray="3 3" />
            <ReferenceLine y={oversoldLevel}  stroke="green" strokeDasharray="3 3" />
            <Line type="linear" dataKey="value" stroke="#8884d8" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <ResponsiveContainer width="100%" height={200}>
    <BarChart
      data={data}
      margin={{
        top: 10, right: 30, left: 0, bottom: 0,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="volume" fill="#82ca9d" />
    </BarChart>
  </ResponsiveContainer>
    </div>
  );
}

export default RSIComponent;


