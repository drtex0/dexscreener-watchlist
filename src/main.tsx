import React from 'react';
import ReactDOM from 'react-dom/client';
import MainLayout from './layout/Main';
import App from './pages/App/App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MainLayout>
      <App />
    </MainLayout>
  </React.StrictMode>,
);
