import type { JSX } from 'react';
import { Routes, Route } from 'react-router-dom';
import GarageView from './features/garage/GarageView';
import WinnersView from './features/winners/WinnersView';
import NavBar from './components/NavBar';
import './App.css';

function App(): JSX.Element {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<GarageView />} />
        <Route path="/winners" element={<WinnersView />} />
      </Routes>
    </>
  );
}

export default App;
