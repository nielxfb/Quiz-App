import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Choice, Question, Quiz } from '@/lib/types';

const QUIZZES_KEY = ['quizzes'];
const quizKey = (id: string) => ['quiz', id];
const questionsKey = (quizId: string) => ['quiz', quizId, 'questions'];

export function useAdminQuizzes() {
  return useQuery({
    queryKey: QUIZZES_KEY,
    queryFn: () => api<Quiz[]>('/quizzes'),
  });
}

export function useQuiz(id: string) {
  return useQuery({
    queryKey: quizKey(id),
    queryFn: () => api<Quiz>(`/quizzes/${id}`),
  });
}

export function useQuestions(quizId: string) {
  return useQuery({
    queryKey: questionsKey(quizId),
    queryFn: () => api<Question[]>(`/quizzes/${quizId}/questions`),
  });
}

export function useCreateQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { title: string; description?: string }) =>
      api<Quiz>('/quizzes', { method: 'POST', body: JSON.stringify(input) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUIZZES_KEY }),
  });
}

export function useUpdateQuiz(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { title: string; description?: string }) =>
      api<Quiz>(`/quizzes/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUIZZES_KEY });
      queryClient.invalidateQueries({ queryKey: quizKey(id) });
    },
  });
}

export function useDeleteQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<void>(`/quizzes/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUIZZES_KEY }),
  });
}

export function useCreateQuestion(quizId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (text: string) =>
      api<Question>(`/quizzes/${quizId}/questions`, {
        method: 'POST',
        body: JSON.stringify({ text }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: questionsKey(quizId) }),
  });
}

export function useUpdateQuestion(quizId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) =>
      api<Question>(`/questions/${id}`, { method: 'PATCH', body: JSON.stringify({ text }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: questionsKey(quizId) }),
  });
}

export function useDeleteQuestion(quizId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<void>(`/questions/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: questionsKey(quizId) }),
  });
}

export function useCreateChoice(quizId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      questionId,
      text,
      isCorrect,
    }: {
      questionId: string;
      text: string;
      isCorrect: boolean;
    }) =>
      api<Choice>(`/questions/${questionId}/choices`, {
        method: 'POST',
        body: JSON.stringify({ text, isCorrect }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: questionsKey(quizId) }),
  });
}

export function useUpdateChoice(quizId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, text, isCorrect }: { id: string; text?: string; isCorrect?: boolean }) =>
      api<Choice>(`/choices/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ text, isCorrect }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: questionsKey(quizId) }),
  });
}

export function useDeleteChoice(quizId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<void>(`/choices/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: questionsKey(quizId) }),
  });
}
