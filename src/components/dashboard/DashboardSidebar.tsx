import { Plus, BookMarked, Lock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Subject {
  id: string;
  name: string;
  is_public: boolean;
  semester: string;
  user_id: string;
}

interface DashboardSidebarProps {
  subjects: Subject[];
  selectedSubject: string | null;
  onSelectSubject: (id: string) => void;
  onAddSubject: () => void;
}

const DashboardSidebar = ({
  subjects,
  selectedSubject,
  onSelectSubject,
  onAddSubject,
}: DashboardSidebarProps) => {
  return (
    <aside className="w-80 border-r bg-sidebar text-sidebar-foreground">
      <div className="p-6">
        <Button 
          onClick={onAddSubject}
          className="w-full bg-sidebar-primary hover:bg-sidebar-accent"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Subject
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="px-4 pb-4">
          <h3 className="mb-4 text-sm font-semibold text-sidebar-foreground/70 px-2">
            YOUR SUBJECTS
          </h3>
          <div className="space-y-2">
            {subjects.length === 0 ? (
              <div className="text-center py-8 text-sidebar-foreground/50">
                <BookMarked className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No subjects yet</p>
                <p className="text-xs mt-1">Click "Add Subject" to start</p>
              </div>
            ) : (
              subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => onSelectSubject(subject.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg transition-all",
                    "hover:bg-sidebar-accent/50",
                    selectedSubject === subject.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                      : "text-sidebar-foreground"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{subject.name}</span>
                    {subject.is_public ? (
                      <Globe className="h-4 w-4 opacity-60" />
                    ) : (
                      <Lock className="h-4 w-4 opacity-60" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default DashboardSidebar;
