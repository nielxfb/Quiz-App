import { useState } from 'react';
import { Check, Pencil, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface InlineEditTextProps {
  value: string;
  onSave: (value: string) => void;
  isSaving?: boolean;
}

export function InlineEditText({ value, onSave, isSaving }: InlineEditTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (!editing) {
    return (
      <div className="flex items-center gap-1.5">
        <span>{value}</span>
        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          aria-label="Edit"
          onClick={() => {
            setDraft(value);
            setEditing(true);
          }}
        >
          <Pencil className="size-3.5" />
        </Button>
      </div>
    );
  }

  function handleSave() {
    if (draft.trim() && draft !== value) {
      onSave(draft);
    }
    setEditing(false);
  }

  return (
    <div className="flex items-center gap-1.5">
      <Input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
          }
          if (e.key === 'Escape') setEditing(false);
        }}
        className="h-8"
      />
      <Button
        variant="ghost"
        size="icon"
        className="size-6"
        aria-label="Save"
        onClick={handleSave}
        disabled={isSaving}
      >
        <Check className="size-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-6"
        aria-label="Cancel"
        onClick={() => setEditing(false)}
      >
        <X className="size-3.5" />
      </Button>
    </div>
  );
}
