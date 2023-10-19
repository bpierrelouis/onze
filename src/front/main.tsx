import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './selfthinker-CSS-Playing-Cards/cards.css'
import "./selfthinker-CSS-Playing-Cards/faces/JC.gif"
import "./selfthinker-CSS-Playing-Cards/faces/JD.gif"
import "./selfthinker-CSS-Playing-Cards/faces/JH.gif"
import "./selfthinker-CSS-Playing-Cards/faces/JS.gif"
import "./selfthinker-CSS-Playing-Cards/faces/QC.gif"
import "./selfthinker-CSS-Playing-Cards/faces/QD.gif"
import "./selfthinker-CSS-Playing-Cards/faces/QH.gif"
import "./selfthinker-CSS-Playing-Cards/faces/QS.gif"
import "./selfthinker-CSS-Playing-Cards/faces/KC.gif"
import "./selfthinker-CSS-Playing-Cards/faces/KD.gif"
import "./selfthinker-CSS-Playing-Cards/faces/KH.gif"
import "./selfthinker-CSS-Playing-Cards/faces/KS.gif"
import { GameContextProvider } from './hooks/useGame.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <GameContextProvider>
            <App />
        </GameContextProvider>
    </React.StrictMode>,
)
