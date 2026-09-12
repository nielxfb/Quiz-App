import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@/components/protected-route';
import { GuestRoute } from '@/components/guest-route';
import { AppLayout } from '@/components/app-layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { QuizList } from './pages/QuizList';

function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<QuizList />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
