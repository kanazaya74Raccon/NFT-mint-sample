import React from 'react';
import MainComponent from './components/Main'
import { ToastProvider } from 'react-toast-notifications';

function App() {
  return (
    <div className="App">
      <ToastProvider
      >
        <MainComponent />
      </ToastProvider>
    </div>
  );
}

export default App;
