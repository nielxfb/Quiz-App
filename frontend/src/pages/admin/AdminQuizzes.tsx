import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAdminQuizzes, useCreateQuiz, useDeleteQuiz } from '@/hooks/use-admin-quizzes';
import { ConfirmDeleteButton } from '@/components/confirm-delete-button';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

function NewQuizDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const createQuiz = useCreateQuiz();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    createQuiz.mutate(
      { title, description: description || undefined },
      {
        onSuccess: () => {
          setOpen(false);
          setTitle('');
          setDescription('');
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New quiz</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New quiz</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="quiz-title">Title</Label>
              <Input
                id="quiz-title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="quiz-description">Description</Label>
              <Textarea
                id="quiz-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createQuiz.isPending}>
              {createQuiz.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AdminQuizzes() {
  const { data: quizzes, isLoading, error } = useAdminQuizzes();
  const deleteQuiz = useDeleteQuiz();

  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Loading quizzes...</p>;
  }

  if (error) {
    return <p className="text-destructive text-sm">Failed to load quizzes: {error.message}</p>;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Quizzes</h1>
        <NewQuizDialog />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quizzes?.map((quiz) => (
            <TableRow key={quiz.id}>
              <TableCell>
                <Link to={`/admin/quizzes/${quiz.id}`} className="underline underline-offset-4">
                  {quiz.title}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">{quiz.description}</TableCell>
              <TableCell>{new Date(quiz.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <ConfirmDeleteButton
                  description={`This permanently deletes "${quiz.title}" and all of its questions.`}
                  onConfirm={() => deleteQuiz.mutate(quiz.id)}
                  disabled={deleteQuiz.isPending}
                >
                  Delete
                </ConfirmDeleteButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
