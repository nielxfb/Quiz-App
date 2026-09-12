import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useCurrentUser } from '@/hooks/use-auth';
import type { Quiz } from '@/lib/types';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function QuizList() {
  const { data: currentUser } = useCurrentUser();
  const {
    data: quizzes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['quizzes'],
    queryFn: () => api<Quiz[]>('/quizzes'),
  });

  if (currentUser?.role === 'admin') {
    return <Navigate to="/admin/quizzes" replace />;
  }

  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Loading quizzes...</p>;
  }

  if (error) {
    return <p className="text-destructive text-sm">Failed to load quizzes: {error.message}</p>;
  }

  if (!quizzes?.length) {
    return <p className="text-muted-foreground text-sm">No quizzes yet.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <Card key={quiz.id}>
          <CardHeader>
            <CardTitle>{quiz.title}</CardTitle>
            {quiz.description && <CardDescription>{quiz.description}</CardDescription>}
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
