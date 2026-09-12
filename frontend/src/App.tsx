import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@/components/protected-route';
import { GuestRoute } from '@/components/guest-route';
import { AdminRoute } from '@/components/admin-route';
import { AppLayout } from '@/components/app-layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { QuizList } from './pages/QuizList';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminQuizzes } from './pages/admin/AdminQuizzes';
import { AdminQuizDetail } from './pages/admin/AdminQuizDetail';
import { AdminUsers } from './pages/admin/AdminUsers';

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
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="quizzes" replace />} />
              <Route path="quizzes" element={<AdminQuizzes />} />
              <Route path="quizzes/:id" element={<AdminQuizDetail />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
