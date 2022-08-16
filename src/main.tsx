import { MantineProvider } from '@mantine/core';
import React from 'react';
import ReactDOM from 'react-dom/client';
import MainLayout from './layout/Main';
import App from './pages/App/App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>
      <MainLayout>
        <App />
      </MainLayout>
    </MantineProvider>
  </React.StrictMode>,
);
