import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

interface Quiz {
  id: string;
  title: string;
  description?: string;
}

export function QuizList() {
  const { data: quizzes, isLoading, error } = useQuery({
    queryKey: ['quizzes'],
    queryFn: () => api<Quiz[]>('/quizzes'),
  });

  if (isLoading) return <p>Loading quizzes...</p>;
  if (error) return <p>Failed to load quizzes: {error.message}</p>;

  return (
    <ul>
      {quizzes?.map((quiz) => (
        <li key={quiz.id}>
          <strong>{quiz.title}</strong>
          {quiz.description && <p>{quiz.description}</p>}
        </li>
      ))}
    </ul>
  );
}
