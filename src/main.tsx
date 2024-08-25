import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import logger, { setLogLevel } from './utils/logger'

// Set log level based on URL parameter                                                                                                                                            
const urlParams = new URLSearchParams(window.location.search);
const logLevel = urlParams.get('logLevel');
if (logLevel) {
  setLogLevel(logLevel);
  logger.info(`Log level set to ${logLevel}`);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)  
