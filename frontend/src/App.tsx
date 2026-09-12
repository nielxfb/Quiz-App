import { Route, Routes } from 'react-router-dom';
import { QuizList } from './pages/QuizList';

function App() {
  return (
    <Routes>
      <Route path="/" element={<QuizList />} />
    </Routes>
  );
}

export default App;
