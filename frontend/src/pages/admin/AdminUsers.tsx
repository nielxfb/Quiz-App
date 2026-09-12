import { useAdminUsers, useDeleteUser, useUpdateUserRole } from '@/hooks/use-admin-users';
import { useCurrentUser } from '@/hooks/use-auth';
import { ConfirmDeleteButton } from '@/components/confirm-delete-button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function AdminUsers() {
  const { data: users, isLoading, error } = useAdminUsers();
  const { data: currentUser } = useCurrentUser();
  const deleteUser = useDeleteUser();
  const updateRole = useUpdateUserRole();

  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Loading users...</p>;
  }

  if (error) {
    return <p className="text-destructive text-sm">Failed to load users: {error.message}</p>;
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Users</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => {
            const isSelf = user.id === currentUser?.id;
            return (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    disabled={isSelf || updateRole.isPending}
                    onValueChange={(role) =>
                      updateRole.mutate({ id: user.id, role: role as 'user' | 'admin' })
                    }
                  >
                    <SelectTrigger size="sm" className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <ConfirmDeleteButton
                    description={`This permanently deletes ${user.username}'s account.`}
                    onConfirm={() => deleteUser.mutate(user.id)}
                    disabled={isSelf || deleteUser.isPending}
                  >
                    Delete
                  </ConfirmDeleteButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
