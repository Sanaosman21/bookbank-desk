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
import { Upload, FileText } from "lucide-react";
import { toast } from "sonner";

interface UploadPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (title: string, file: File) => void;
}

const UploadPDFModal = ({ isOpen, onClose, onUpload }: UploadPDFModalProps) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast.error("Please select a PDF file");
        return;
      }
      setFile(selectedFile);
      // Auto-fill title from filename if empty
      if (!title) {
        setTitle(selectedFile.name.replace(".pdf", ""));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!file) {
      toast.error("Please select a PDF file");
      return;
    }

    onUpload(title, file);
    toast.success("PDF uploaded successfully");
    
    // Reset form
    setTitle("");
    setFile(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload PDF</DialogTitle>
          <DialogDescription>
            Add a new study material to your current subject
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pdfTitle">Document Title</Label>
            <Input
              id="pdfTitle"
              placeholder="e.g., Chapter 3 - Binary Trees"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pdfFile">PDF File</Label>
            <div className="relative">
              <Input
                id="pdfFile"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {file && (
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{file.name}</span>
                  <span className="text-xs">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadPDFModal;
