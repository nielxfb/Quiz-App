import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  useCreateChoice,
  useCreateQuestion,
  useDeleteChoice,
  useDeleteQuestion,
  useQuestions,
  useQuiz,
  useUpdateChoice,
  useUpdateQuestion,
  useUpdateQuiz,
} from '@/hooks/use-admin-quizzes';
import type { Question, Quiz } from '@/lib/types';
import { ConfirmDeleteButton } from '@/components/confirm-delete-button';
import { InlineEditText } from '@/components/inline-edit-text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

function QuizDetailsForm({ quizId, quiz }: { quizId: string; quiz: Quiz }) {
  const updateQuiz = useUpdateQuiz(quizId);
  const [title, setTitle] = useState(quiz.title);
  const [description, setDescription] = useState(quiz.description ?? '');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    updateQuiz.mutate({ title, description: description || undefined });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="quiz-title">Title</Label>
            <Input id="quiz-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="quiz-description">Description</Label>
            <Textarea
              id="quiz-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={updateQuiz.isPending} className="self-start">
            {updateQuiz.isPending ? 'Saving...' : 'Save'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function AddChoiceForm({ quizId, questionId }: { quizId: string; questionId: string }) {
  const [text, setText] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const createChoice = useCreateChoice(quizId);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    createChoice.mutate(
      { questionId, text, isCorrect },
      {
        onSuccess: () => {
          setText('');
          setIsCorrect(false);
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        placeholder="Add a choice..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
        className="h-8"
      />
      <Label className="flex items-center gap-1.5 text-sm font-normal whitespace-nowrap">
        <Checkbox checked={isCorrect} onCheckedChange={(v) => setIsCorrect(v === true)} />
        Correct
      </Label>
      <Button type="submit" size="sm" disabled={createChoice.isPending}>
        Add
      </Button>
    </form>
  );
}

function QuestionCard({ quizId, question }: { quizId: string; question: Question }) {
  const updateQuestion = useUpdateQuestion(quizId);
  const deleteQuestion = useDeleteQuestion(quizId);
  const updateChoice = useUpdateChoice(quizId);
  const deleteChoice = useDeleteChoice(quizId);
  const hasCorrectChoice = question.choices.some((choice) => choice.isCorrect);

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between">
        <CardTitle className="text-base font-medium">
          <InlineEditText
            value={question.text}
            onSave={(text) => updateQuestion.mutate({ id: question.id, text })}
            isSaving={updateQuestion.isPending}
          />
        </CardTitle>
        <ConfirmDeleteButton
          description="This permanently deletes the question and all of its choices."
          onConfirm={() => deleteQuestion.mutate(question.id)}
          disabled={deleteQuestion.isPending}
        >
          Delete
        </ConfirmDeleteButton>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {question.choices.length > 0 && !hasCorrectChoice && (
          <p className="text-sm text-amber-600">No choice is marked correct yet.</p>
        )}
        {question.choices.map((choice) => (
          <div key={choice.id} className="flex items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={choice.isCorrect}
                onCheckedChange={(v) =>
                  updateChoice.mutate({ id: choice.id, isCorrect: v === true })
                }
              />
              <InlineEditText
                value={choice.text}
                onSave={(text) => updateChoice.mutate({ id: choice.id, text })}
                isSaving={updateChoice.isPending}
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteChoice.mutate(choice.id)}
              disabled={deleteChoice.isPending}
            >
              Remove
            </Button>
          </div>
        ))}
        <AddChoiceForm quizId={quizId} questionId={question.id} />
      </CardContent>
    </Card>
  );
}

function AddQuestionForm({ quizId }: { quizId: string }) {
  const [text, setText] = useState('');
  const createQuestion = useCreateQuestion(quizId);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    createQuestion.mutate(text, { onSuccess: () => setText('') });
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        placeholder="Add a question..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <Button type="submit" disabled={createQuestion.isPending}>
        Add question
      </Button>
    </form>
  );
}

export function AdminQuizDetail() {
  const { id } = useParams<{ id: string }>();
  const quizId = id!;
  const { data: quiz } = useQuiz(quizId);
  const { data: questions, isLoading, error } = useQuestions(quizId);

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/admin/quizzes"
        className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm"
      >
        <ArrowLeft className="size-4" />
        Back to quizzes
      </Link>

      {quiz && <QuizDetailsForm quizId={quizId} quiz={quiz} />}

      <div>
        <h2 className="mb-4 text-lg font-semibold">Questions</h2>
        {isLoading && <p className="text-muted-foreground text-sm">Loading questions...</p>}
        {error && (
          <p className="text-destructive text-sm">Failed to load questions: {error.message}</p>
        )}
        <div className="flex flex-col gap-4">
          {questions?.map((question) => (
            <QuestionCard key={question.id} quizId={quizId} question={question} />
          ))}
        </div>
        <div className="mt-4">
          <AddQuestionForm quizId={quizId} />
        </div>
      </div>
    </div>
  );
}
