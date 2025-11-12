import { FileText, Download, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PDF {
  id: string;
  title: string;
  subject_id: string;
  upload_date: string;
  file_url: string;
  user_id: string;
}

interface PDFGridProps {
  pdfs: PDF[];
  onUploadClick: () => void;
}

const PDFGrid = ({ pdfs, onUploadClick }: PDFGridProps) => {
  return (
    <div className="relative">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Study Materials</h2>
        <Button onClick={onUploadClick} size="lg" className="shadow-md">
          <Plus className="mr-2 h-5 w-5" />
          Upload PDF
        </Button>
      </div>

      {pdfs.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No PDFs yet</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Upload your first study material to get started organizing your notes
            </p>
            <Button onClick={onUploadClick} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Upload Your First PDF
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pdfs.map((pdf) => (
            <Card key={pdf.id} className="group hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1 truncate">
                      {pdf.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(pdf.upload_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => window.open(pdf.file_url, '_blank')}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PDFGrid;
