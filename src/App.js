import React, { useState,useEffect ,useRef} from 'react';
// import { Legend, ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area } from 'recharts';

 import RSIComponent from './components/DefaultRSIRoute';


import { FaDropbox,FaLayerGroup,FaCalendar } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaArrowTrendUp,FaChartSimple } from "react-icons/fa6";
import { BsBarChartLine } from "react-icons/bs";
import { IoClose,IoTrendingUpOutline ,IoCloudUploadOutline} from "react-icons/io5";
import { GoDash } from "react-icons/go";

import { MdOutlineCandlestickChart, MdCandlestickChart } from 'react-icons/md';
import { PiColumns } from 'react-icons/pi';
import { IoAnalyticsOutline } from 'react-icons/io5';
import { FaChartArea } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { FcComboChart } from "react-icons/fc";

import { RiArrowDropUpLine } from "react-icons/ri";
import { MdAreaChart } from "react-icons/md";







import './App.css';

import { IgrFinancialChart } from 'igniteui-react-charts';
import { IgrFinancialChartModule } from 'igniteui-react-charts';

IgrFinancialChartModule.register();


const DurationsList = {
  
  'Minutes':[
    { id: 1, text: '1 minute' },
    { id: 2, text: '5 minutes' },
    { id: 3, text: '10 minutes' },
    {id:4,text:'15 minutes'},
    {id:5, text:'20 minutes'},
    {id:6, text:'30 minutes'},
    {id:7, text:'35 minutes'},
    {id:8, text:'40 minutes'},
    {id:9, text:'45 minutes'},
  ],
  'Hours':[
    { id: 1, text: '1 hour' },
    { id: 2, text: '2 hours' },
    { id: 3, text: '3 hours' },
    {id:4,text:'4 hours'},
  ],
  'Days':[
    { id: 1, text: '1 day' },
    { id: 2, text: '1 week' },
    { id: 3, text: '1 month' },
    {id:4,text:'3 months'},
    {id:5, text:'6 months'},
    {id:6, text:'12 months'},
  ],
  'Ranges':[
    { id: 1, text: '1 Range' },
    { id: 2, text: '10 Range' },
    { id: 3, text: '100 Range' },
    {id:4,text:'1000 Range'}, 
  ]
};




const App = () => {
  const [activePanel, setActivePanel] = useState('market');
  const [activeTab, setActiveTab] = useState('null');
  const [elements, setElements] = useState('null');
  const [data, setData] = useState([]);
    const [symbol, setSymbol] = useState("");
   const [lastRefreshed, setLastRefreshed] = useState("");
   const [indicateActiveTab, setIndicator] = useState('MyScripts')
   const [showRanges, setTimeFrame] = useState(false);
   const [showMinutes, setTimeMinutes] = useState(false);
   const [showHours, setTimeHours] = useState(false);
   const [showDays, setTimeDays] = useState(false);
   const [activeTechnicalTab, setTechnicalTab] = useState('indicator')
   const [saveTemplate, setSaveTemplate] = useState(false)
   const [rsi, setRSI] = useState(false)
   const [rsiValues, setRsiValues] = useState([]);
   const [areaChartData, setAreaChartData] = useState([]);
  const chartRef = useRef(null);
  const [activeChartIcon, setChartValue] = useState("Line")

  
  
  const fetchData = async () => {
    let url = "https://static.infragistics.com/xplatform/data/stocks/stockGoogle.json";
    let response = await fetch(url);
    let jsonData = await response.json();
    console.log(jsonData);
    setAreaChartData(jsonData.map(item => ({ date: item.date, value: item.close })));
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const toggleEvent = (tab) =>{
    setActiveTab(tab)
    setElements(!elements)
  }

  const getTechnicalTab = tab =>{
    setTechnicalTab(tab)
  }

  const onClickIndicator = (indicator) =>{
    setIndicator(indicator)
  }

  const toggleDisplay = (panel) => {
    setActivePanel(panel === activePanel ? null : panel);
   
  };


  useEffect(() => {
    const fetchData = async () => {
        let url = "https://static.infragistics.com/xplatform/data/stocks/stockGoogle.json";
        let response = await fetch(url);
        let jsonData = await response.json();
        console.log(jsonData);
        setData(jsonData);
    };

    fetchData();
}, []);


  const onClickCloseBtn = (activeBtn) =>{
    setElements(activeBtn)
  }

  const onClickRSIButton = () =>{
    setRSI(prevState => !prevState)
  }


  

 

  useEffect(() => {
    const calculateRSI = () => {
      const closePrices = data.map(item => item.close);
      const rsi = [];
      let avgGain = 0;
      let avgLoss = 0;

 

      // Calculate initial average gain and loss (first 14 periods)
      for (let i = 1; i <= 14; i++) {
        const change = closePrices[i] - closePrices[i - 1];
        avgGain += Math.max(change, 0);
        avgLoss += Math.abs(Math.min(change, 0));
      }
      avgGain /= 14;
      avgLoss /= 14;

 

      rsi.push(100 - 100 / (1 + avgGain / avgLoss));

 

      // Calculate subsequent RSI values
      for (let i = 15; i < closePrices.length; i++) {
        const change = closePrices[i] - closePrices[i - 1];
        if (change >= 0) {
          avgGain = (avgGain * 13 + change) / 14;
          avgLoss = (avgLoss * 13) / 14; // No change to average loss
        } else {
          avgLoss = (avgLoss * 13 + Math.abs(change)) / 14;
          avgGain = (avgGain * 13) / 14; // No change to average gain
        }

 

        const rs = avgGain / avgLoss;
        rsi.push(100 - 100 / (1 + rs));
      }

 

      setRsiValues(rsi);
    };

 

    calculateRSI();
  }, [data]);

   

  const getActiveIndicator = () =>{
    switch(indicateActiveTab){
      case 'MyScripts':
      return  <div className='myscripts-container'>
        <div className='my-script-icon-header'> 
        <GoDash/>
        <hr/>
        <div className='making-icon'>
          <p>{'{'}</p>
            <FcComboChart/>
            <p>{'}'}</p>
        </div>
        </div>
        <p className='script-heading'>Pine Scripts<sup>TM</sup></p>
        <p>
          Welcome to the TradingView custom scripting engine. It allows you to create
          your own custom studies or modify existing. You do not have any scripts created.
        </p>
        <button type="button" className='script-btn'>Create your first script now</button>
      </div>
      case 'Technicals':
        return  <div className='technical-container'>
        <div>
          <button type="button" className={activeTechnicalTab === 'indicator'?'technical-btn-container':'technical-active-tab'} onClick = {() => getTechnicalTab("indicator")}>Indicators</button>
          <button type="button" className={activeTechnicalTab === 'stratagies'?'technical-btn-container':'technical-active-tab'} onClick={() => getTechnicalTab("stratagies")}>Stratagies</button>
          <button type="button" className={activeTechnicalTab === 'Profile'?'technical-btn-container':'technical-active-tab'} onClick={() => getTechnicalTab("Profile")}>Profiles</button>
          <button type="button" className={activeTechnicalTab === 'Pattren'?'technical-btn-container':'technical-active-tab'} onClick={() => getTechnicalTab("Pattren")}>Pattren</button>
        </div>
        <div>
          {/* here we need to add indicators code */}
          <div className='indicator-section'>
          <button type="button" className='rsi-btn' onClick = {onClickRSIButton}>Relative Strength Index</button> <br/>
          <button type="button" className='rsi-btn'>24 hours volume</button><br/>
          <button type="button" className='rsi-btn'>Accumulation/Distribution</button><br/>
          <button type="button" className='rsi-btn'>Advanced Decline Line</button><br/>
          <button type="button" className='rsi-btn'>Advance Decline ratio</button><br/>
          <button type="button" className='rsi-btn'>Advance/Decline ratio(Bars)</button><br/>
          <button type="button" className='rsi-btn'>Arnaud Legoux Moving Average</button><br/>
          <button type="button" className='rsi-btn'>Aroon</button><br/>
          <button type="button" className='rsi-btn'>Auto Fib Extension</button><br/>
          <button type="button" className='rsi-btn'>Auto Fib Retracement</button><br/>
          <button type="button" className='rsi-btn'>Auto Pitchfork</button><br/>
          <button type="button" className='rsi-btn'>Auto Trendlines</button><br/>
          <button type="button" className='rsi-btn'>Averge Day Range</button><br/>
          <button type="button" className='rsi-btn'>Average Directional Index</button><br/>
          <div>
              <div ref={chartRef} style={{ height: '400px' }}></div> 
          </div>
        </div>  
        </div>
        
      </div>
        case 'Financials':
          return  <div>
            <h1>Financials</h1>
          </div>
          case 'Community Scripts':
            return  <div>
              <h1>Community Scripts</h1>
            </div>
            default: return null

    }
  }

  const displayTimeRanges = () =>{
    setTimeFrame(prevState => !prevState)
  }

  const displayTimeMinutes = () =>{
    setTimeMinutes(prevState => !prevState)
  }

  const displayTimeHours = () =>{
    setTimeHours(prevState => !prevState)
  }

  const displayTimeDays = () =>{
    setTimeDays(prevState => !prevState)
  }


  const onClickOnSaveTemplate = () =>{
    setSaveTemplate(prevState => !prevState)
  }

  const  onClickChartIcon = chart =>{
    setChartValue(chart)
  }


  const getactiveTabPanel = ()=>{
  

  switch(activeTab){
    case 'Indicators':
      return (<div className={elements === 'Indicators' ? 'functionality':'indicatorContainer'}>
        <div className='tab-container'>
          <div className='header-container'>
          <h1 className='heading'>Indicators, Metrics and stratagies</h1> 
          <button onClick={() => onClickCloseBtn('Indicators')} className='closeButton'>
            <IoClose/>
          </button>
          </div>
          <div className='search-container'>
            <FaSearch className='search-icon'/>
            <input type="search" className='searchBar'   placeholder='Search...' />
          </div>
          <div className='indicators-bg-container'>
            <div className='indicatiors-btn-container'>
              <button type="button" className={indicateActiveTab ==='MyScripts' ?'active-tab indicators-icons' :'indicators-icons'} onClick={() => onClickIndicator('MyScripts')}><FiUser className="icon"/>My Scripts</button>
              <button type="button" className={indicateActiveTab ==='Technicals' ?'active-tab indicators-icons' :'indicators-icons'}   onClick={() => onClickIndicator('Technicals')}><FcComboChart className="icon"/>Technicals</button>
              <button type="button" className={indicateActiveTab ==='Financials' ?'active-tab indicators-icons' :'indicators-icons'}   onClick={() => onClickIndicator('Financials')}><BsBarChartLine className="icon"/>Financials</button>
              <button type="button" className={indicateActiveTab ==='Community Scripts' ?'active-tab indicators-icons' :'indicators-icons'}   onClick={() => onClickIndicator('Community Scripts')}>Community Scripts</button>
            </div>
            <div className='indicator-options-container'>{getActiveIndicator()}</div>
            
          </div>
        </div>
      </div>);
    case 'Templates':
      return <div className={elements === 'Templates' ? 'functionality':'indicatorContainer'}>
        <div>
          <button><IoCloudUploadOutline className='icon' onClick={onClickOnSaveTemplate}/>Save Indicators templates...</button>
          <button onClick={() => onClickCloseBtn('Templates')} className='closeButton'>
            <IoClose/>
          </button>
          </div>
          <div>
            {saveTemplate && <div className='template-option-container'>
              <h1>heelo</h1>
              </div>}
          </div>
          
      </div>;
    case 'Duration':
      return <div className={elements === 'Duration' ? 'functionality':'indicatorContainer-duration'}>
       
        <button onClick={() => onClickCloseBtn('Duration')} className='closeButton'>
            <IoClose/>
          </button>
          <div className='duration-container'>
            
            <div className='timeframe-selection'>
            <button className='time-inputs' onClick={displayTimeMinutes}>
              Minutes <RiArrowDropUpLine/></button>
            <ul className={showMinutes? 'time-display-none':'time-frame-selector'}>
            {DurationsList.Minutes.map(item => <li key={item.id}><button className='duration-time-btn'>{item.text}</button></li>)}
            </ul>
           
            </div>
            <div className='timeframe-selection'>
            <button className='time-inputs' onClick={ displayTimeHours}> Hours <RiArrowDropUpLine/></button>
            <ul className={showHours? 'time-display-none':'time-frame-selector'}>
            {DurationsList.Hours.map(item => <li key={item.id}><button className='duration-time-btn'>{item.text}</button></li>)}
            </ul>
            
            </div>
            <div className='timeframe-selection'>
            <button className='time-inputs' onClick={displayTimeDays}>Days <RiArrowDropUpLine/></button>
            <ul className={showDays ? 'time-display-none':'time-frame-selector'}>
            {DurationsList.Days.map(item => <li key={item.id}><button className='duration-time-btn'>{item.text}</button></li>)}
            </ul>
            </div>
            <div className='timeframe-selection'>
            <button className='time-inputs' onClick={displayTimeRanges}>Ranges <RiArrowDropUpLine/></button>
            <ul className={showRanges ? 'time-display-none':'time-frame-selector'}>
            {DurationsList.Ranges.map(item => <li key={item.id}><button className='duration-time-btn'>{item.text}</button></li>)}
            </ul>
            </div>
          </div>
        </div>;
    case 'Compare':
      return <div className={elements === 'Compare' ? 'functionality':'indicatorContainer'}>
        <h1>Compare</h1>
        <button onClick={() => onClickCloseBtn('Compare')} className='closeButton'>
            <IoClose/>
          </button>
          
        </div>  
    default:
     return null
  }
}

  return (
    <body>
      {/* Header */}
      <header className="header-bg">
        <div className="flex justify-between items-center">
          <h1 className="main-heading">
            U.S. Dollar / Indian Rupee - 1D - ICE
          </h1>
        </div>
        {/* Search bar */}
        <div className="container">
          <form>
            <div className="inputSearch">
              <input className="search" type="text" placeholder="What you're looking for?" />
              <button type="submit">Search</button>
            </div>
          </form>
          <div className="watch">
            <button className="watchbutton" onClick={() => toggleEvent('Indicators')}>
              Indicators
            </button>
            <button className="watchbutton" onClick={() => toggleEvent('Templates')}>
              Templates
            </button>
            <button className="watchbutton" onClick={() => toggleEvent('Duration')}>
              Duration
            </button>
            <button className="watchbutton" onClick={() => toggleEvent('Compare')}>
              Compare
            </button>
          </div>
        </div>
      </header>
      {/* Main content area */}
      <div className='main-bg-container'>
      
        {/* Chart area */}
        <div className='trading-graph-container'>
            <div className='graph' style={{height:"100vh"}}>
            <IgrFinancialChart
    width="100%"
    height="100%"
    chartType={activeChartIcon}
    thickness={2}
    chartTitle={symbol}
    subtitle={lastRefreshed}
    yAxisMode="PercentChange"
    yAxisTitle="Percent Changed"
    dataSource={data}
    isToolbarVisible={false} />
            </div>
           {rsi ? <RSIComponent data={data}/> : <span></span>}
        
        
        </div>
        {/* Side panel */}
        <aside className="side-container1">
          <div className="side-panel">
            <div className="sidebutton-container">
              {activePanel === "market" && <div className="watchlist" id="market">
                <button>The updates from trading market</button>
                {/* Watchlist items */}
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Shares</span>
                  <span className="text-green-500">Prices of Share</span>
                </div>
              </div>}
             {activePanel === "updates" && <div className="forex" id="updates">
                <button>Object Tree</button>
                {/* Forex items */}
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Contains full details of nifty</span>
                  <span className="text-green-500">Profits or Loss</span>
                </div>
              </div>}

              {activePanel=== "calander" && <div className="economic-calander" id="calander">
                <button>Economic Calendar</button>
              </div>}
              {activePanel=== "graph" && 
              <div className="drawing-lines">
                <button>Drawing Lines</button>
              </div>}
              {activePanel === "chart" &&<div className="indicators" id="chart">
                <ul className='ul-container'>
                  
                  <button className='li-element' onClick={() => onClickChartIcon("Candle")}><MdOutlineCandlestickChart className='icon' /> Hollow Candle</button>
                  <button className='li-element' onClick={() => onClickChartIcon("candle")}><MdCandlestickChart className='icon' /> Candles</button>
                  <button className='li-element' onClick={() => onClickChartIcon("column")}><PiColumns className='icon'/> Columns</button>
                  <button className='li-element' onClick={() => onClickChartIcon("bar")}><IoAnalyticsOutline className='icon' /> Bars</button>
                  <button className='li-element' onClick={() => onClickChartIcon("line")}><IoAnalyticsOutline className='icon' /> Line</button>
                  <button className='li-element'  onClick={() => onClickChartIcon("Area")}><FaChartArea className='icon'/> Area</button>
                  <button className='li-element'> <MdAreaChart className='icon'/>HLC Area</button>

                  <button className='li-element'><svg width="20" height="20" viewBox="0 0 24 24" className='icon'>
      <path d="M4,19 L20,19 L20,21 L4,21 L4,19 Z M4,5 L20,5 L20,7 L4,7 L4,5 Z M4,12 L20,12 L20,14 L4,14 L4,12 Z" fill="#000000"/>
    </svg> BaseLine</button>
                  <button className='li-element'><svg width="24" height="24" viewBox="0 0 24 24">
      <path d="M12,2 L12,9 L15,9 L15,15 L9,15 L9,9 L12,9 L12,2 Z M12,22 L12,15 L9,15 L9,9 L15,9 L15,15 L12,15 L12,22 Z" fill="#000000"/>
    </svg>  High-low</button>
                  <button className='li-element'><svg width="24" height="24" viewBox="0 0 24 24">
      <path d="M12,2 L12,4 L14,4 L14,20 L12,20 L12,22 L18,22 L18,20 L16,20 L16,4 L18,4 L18,2 L12,2 Z M10,6 L8,6 L8,18 L10,18 L10,20 L4,20 L4,18 L6,18 L6,6 L4,6 L4,4 L10,4 L10,6 Z" fill="#000000"/>
    </svg> Heikin Ashi</button>
                  <button className='li-element'><svg  viewBox="0 0 24 24" width="20" height="20" className='icon'>
  <path fill="none" d="M0 0h24v24H0z"/>
  <rect x="19" y="5" width="4" height="6" fill="none" stroke="currentColor" stroke-width="2"/>
  <rect x="11" y="11" width="4" height="6" fill="none" stroke="currentColor" stroke-width="2"/>
  <rect x="5" y="19" width="4" height="6" fill="none" stroke="currentColor" stroke-width="2"/>
</svg> Renko</button>
                  <button className='li-element'><svg width="24" height="24" viewBox="0 0 24 24" className='icon'>
      <path d="M4,12 L20,12 M12,4 L12,20" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
    </svg> Line break</button>
                  <button className='li-element'><IoAnalyticsOutline className='icon' /> Kagi</button>
                  <button className='li-element'><svg width="24" height="24" viewBox="0 0 24 24" className='icon'>
      <path d="M12,2 L12,4 L14,4 L14,20 L12,20 L12,22 L18,22 L18,20 L16,20 L16,4 L18,4 L18,2 L12,2 Z M10,6 L8,6 L8,18 L10,18 L10,20 L4,20 L4,18 L6,18 L6,6 L4,6 L4,4 L10,4 L10,6 Z" fill="#000000"/>
    </svg> Point & figure</button>
    <button className='li-element'><svg viewBox="0 0 100 100" width="40" height="40" className='icon'>
  
  <line x1="10" y1="50" x2="90" y2="50" stroke="black" stroke-width="2"/>
  
  <rect x="30" y="40" width="40" height="20" fill="gray"/>
  
  <circle cx="30" cy="50" r="4" fill="black"/>
  
  <circle cx="70" cy="50" r="4" fill="black"/>
</svg> Range</button>
                
                </ul>
              </div>}
            </div>
            <div className="icon-container">
              <button className="icon-btn" onClick={() => toggleDisplay('market')}>
                <FaDropbox/>
              </button>
              <button className="icon-btn" onClick={() => toggleDisplay('updates')}>
                <FaLayerGroup/>
              </button>
              <button className="icon-btn" onClick={() => toggleDisplay('calander')}>
                <FaCalendar/>
              </button>
              <button className="icon-btn" onClick={() => toggleDisplay('graph')}>
                <FaArrowTrendUp/>
              </button>
              <button className="icon-btn" onClick={() => toggleDisplay('chart')}>
                <FaChartSimple/>
              </button>
            </div>
          </div>
          <div className="chat-feed">
            <h3>Chat feed (the updates from the display)</h3>
          </div>
        </aside>
      
      </div>
      
      {getactiveTabPanel()}
    </body>
  );
};

export default App;



