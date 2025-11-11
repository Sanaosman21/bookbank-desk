import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import PDFGrid from "@/components/dashboard/PDFGrid";
import AddSubjectModal from "@/components/dashboard/AddSubjectModal";
import UploadPDFModal from "@/components/dashboard/UploadPDFModal";

export interface Subject {
  id: string;
  name: string;
  isPublic: boolean;
  semester: string;
}

export interface PDF {
  id: string;
  title: string;
  subjectId: string;
  uploadDate: string;
  fileUrl: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isUploadPDFOpen, setIsUploadPDFOpen] = useState(false);

  // Check authentication
  useEffect(() => {
    const user = localStorage.getItem("bookbank_user");
    if (!user) {
      navigate("/login");
    }

    // Load saved semester
    const savedSemester = localStorage.getItem("bookbank_semester");
    if (savedSemester) {
      setSelectedSemester(savedSemester);
    } else {
      setSelectedSemester("1");
    }

    // Load mock data
    loadMockData();
  }, [navigate]);

  const loadMockData = () => {
    // Mock subjects
    const mockSubjects: Subject[] = [
      { id: "1", name: "Data Structures", isPublic: true, semester: "1" },
      { id: "2", name: "Operating Systems", isPublic: false, semester: "1" },
      { id: "3", name: "Database Management", isPublic: true, semester: "2" },
      { id: "4", name: "Computer Networks", isPublic: true, semester: "3" },
    ];

    // Mock PDFs
    const mockPDFs: PDF[] = [
      { id: "1", title: "Arrays and Linked Lists", subjectId: "1", uploadDate: "2024-01-15", fileUrl: "#" },
      { id: "2", title: "Trees and Graphs", subjectId: "1", uploadDate: "2024-01-20", fileUrl: "#" },
      { id: "3", title: "Process Management", subjectId: "2", uploadDate: "2024-01-18", fileUrl: "#" },
      { id: "4", title: "SQL Fundamentals", subjectId: "3", uploadDate: "2024-02-01", fileUrl: "#" },
    ];

    setSubjects(mockSubjects);
    setPdfs(mockPDFs);
    
    // Select first subject of current semester by default
    const firstSubject = mockSubjects.find(s => s.semester === "1");
    if (firstSubject) {
      setSelectedSubject(firstSubject.id);
    }
  };

  const handleSemesterChange = (semester: string) => {
    setSelectedSemester(semester);
    localStorage.setItem("bookbank_semester", semester);
    
    // Select first subject of new semester
    const firstSubject = subjects.find(s => s.semester === semester);
    setSelectedSubject(firstSubject?.id || null);
  };

  const handleAddSubject = (name: string, isPublic: boolean) => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      name,
      isPublic,
      semester: selectedSemester,
    };
    setSubjects([...subjects, newSubject]);
    setSelectedSubject(newSubject.id);
  };

  const handleUploadPDF = (title: string, file: File) => {
    if (!selectedSubject) return;
    
    const newPDF: PDF = {
      id: Date.now().toString(),
      title,
      subjectId: selectedSubject,
      uploadDate: new Date().toISOString().split("T")[0],
      fileUrl: URL.createObjectURL(file),
    };
    setPdfs([...pdfs, newPDF]);
  };

  const currentSubjects = subjects.filter(s => s.semester === selectedSemester);
  const currentPDFs = selectedSubject ? pdfs.filter(p => p.subjectId === selectedSubject) : [];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        selectedSemester={selectedSemester}
        onSemesterChange={handleSemesterChange}
      />
      
      <div className="flex">
        <DashboardSidebar
          subjects={currentSubjects}
          selectedSubject={selectedSubject}
          onSelectSubject={setSelectedSubject}
          onAddSubject={() => setIsAddSubjectOpen(true)}
        />
        
        <main className="flex-1 p-8">
          <PDFGrid 
            pdfs={currentPDFs}
            onUploadClick={() => setIsUploadPDFOpen(true)}
          />
        </main>
      </div>

      <AddSubjectModal
        isOpen={isAddSubjectOpen}
        onClose={() => setIsAddSubjectOpen(false)}
        onAdd={handleAddSubject}
      />

      <UploadPDFModal
        isOpen={isUploadPDFOpen}
        onClose={() => setIsUploadPDFOpen(false)}
        onUpload={handleUploadPDF}
      />
    </div>
  );
};

export default Dashboard;
