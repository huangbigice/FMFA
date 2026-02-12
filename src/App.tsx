import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { BrowserRouter } from 'react-router-dom';
// import { GoogleOAuthProvider } from '@react-oauth/google';
import { Router } from './Router/index';
import ScrollToTop from './Router/ScrollToTop';
import { VirtualOrderProvider } from './contexts/VirtualOrderContext';
// import { AuthProvider } from './contexts/AuthContext';

const theme = createTheme({
  /** Put your mantine theme override here */
});

function App() {
  // 從環境變數獲取 Google OAuth Client ID
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  console.log(googleClientId,'googleClientId');
  // 檢查 Client ID 是否設置
  if (!googleClientId) {
    console.warn('Google OAuth Client ID 未設置，請檢查 .env 文件');
  }

  return (
    // <GoogleOAuthProvider clientId={googleClientId}>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <Notifications />
        <BrowserRouter>
          <ScrollToTop />
          <VirtualOrderProvider>
            <Router />
          </VirtualOrderProvider>
        </BrowserRouter>
      </MantineProvider>
    // </GoogleOAuthProvider>
  );
}

export default App;
