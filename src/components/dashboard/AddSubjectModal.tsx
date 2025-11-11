import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, isPublic: boolean) => void;
}

const AddSubjectModal = ({ isOpen, onClose, onAdd }: AddSubjectModalProps) => {
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Please enter a subject name");
      return;
    }

    onAdd(name, isPublic);
    toast.success(`Subject "${name}" added successfully`);
    
    // Reset form
    setName("");
    setIsPublic(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
          <DialogDescription>
            Create a new subject to organize your study materials
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="subjectName">Subject Name</Label>
            <Input
              id="subjectName"
              placeholder="e.g., Data Structures"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="visibility">Public Subject</Label>
              <p className="text-sm text-muted-foreground">
                Allow others to view this subject
              </p>
            </div>
            <Switch
              id="visibility"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Subject
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubjectModal;
