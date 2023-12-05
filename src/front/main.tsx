import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './cards.css'
import "./../../templates/favicon-dark.png"
import "./../../templates/favicon-light.png"
import { GameContextProvider } from './hooks/useGame.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <GameContextProvider>
            <App />
        </GameContextProvider>
    </React.StrictMode>,
)
