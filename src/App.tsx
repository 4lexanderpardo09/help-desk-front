import { useRoutes, BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './modules/auth/context/AuthProvider';
import { appRoutes } from './routes/app.routes';

function AppRoutes() {
  const element = useRoutes(appRoutes);
  return element;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
