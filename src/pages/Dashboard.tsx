import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import PDFGrid from "@/components/dashboard/PDFGrid";
import AddSubjectModal from "@/components/dashboard/AddSubjectModal";
import UploadPDFModal from "@/components/dashboard/UploadPDFModal";

export interface Subject {
  id: string;
  name: string;
  is_public: boolean;
  semester: string;
  user_id: string;
}

export interface PDF {
  id: string;
  title: string;
  subject_id: string;
  upload_date: string;
  file_url: string;
  user_id: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isUploadPDFOpen, setIsUploadPDFOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication and load data
  useEffect(() => {
    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate("/login");
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/login");
      } else {
        // Load saved semester
        const savedSemester = localStorage.getItem("bookbank_semester");
        if (savedSemester) {
          setSelectedSemester(savedSemester);
        } else {
          setSelectedSemester("1");
        }
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Load subjects when semester changes
  useEffect(() => {
    if (user && selectedSemester) {
      loadSubjects();
    }
  }, [user, selectedSemester]);

  // Load PDFs when subject changes
  useEffect(() => {
    if (user && selectedSubject) {
      loadPDFs();
    }
  }, [user, selectedSubject]);

  const loadSubjects = async () => {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .eq("semester", selectedSemester)
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("Failed to load subjects");
      console.error(error);
    } else {
      setSubjects(data || []);
      
      // Select first subject if none selected
      if (!selectedSubject && data && data.length > 0) {
        setSelectedSubject(data[0].id);
      }
    }
  };

  const loadPDFs = async () => {
    if (!selectedSubject) return;

    const { data, error } = await supabase
      .from("pdfs")
      .select("*")
      .eq("subject_id", selectedSubject)
      .order("upload_date", { ascending: false });

    if (error) {
      toast.error("Failed to load PDFs");
      console.error(error);
    } else {
      setPdfs(data || []);
    }
  };

  const handleSemesterChange = (semester: string) => {
    setSelectedSemester(semester);
    localStorage.setItem("bookbank_semester", semester);
    setSelectedSubject(null);
  };

  const handleAddSubject = async (name: string, isPublic: boolean) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("subjects")
      .insert([
        {
          user_id: user.id,
          name,
          is_public: isPublic,
          semester: selectedSemester,
        },
      ])
      .select()
      .single();

    if (error) {
      toast.error("Failed to add subject");
      console.error(error);
    } else {
      toast.success(`Subject "${name}" added successfully`);
      setSubjects([...subjects, data]);
      setSelectedSubject(data.id);
    }
  };

  const handleUploadPDF = async (title: string, file: File) => {
    if (!selectedSubject || !user) return;
    
    // For now, we'll use object URLs. In production, upload to Supabase Storage
    const fileUrl = URL.createObjectURL(file);

    const { data, error } = await supabase
      .from("pdfs")
      .insert([
        {
          user_id: user.id,
          subject_id: selectedSubject,
          title,
          file_url: fileUrl,
        },
      ])
      .select()
      .single();

    if (error) {
      toast.error("Failed to upload PDF");
      console.error(error);
    } else {
      toast.success("PDF uploaded successfully");
      setPdfs([data, ...pdfs]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        user={user}
        selectedSemester={selectedSemester}
        onSemesterChange={handleSemesterChange}
      />
      
      <div className="flex">
        <DashboardSidebar
          subjects={subjects}
          selectedSubject={selectedSubject}
          onSelectSubject={setSelectedSubject}
          onAddSubject={() => setIsAddSubjectOpen(true)}
        />
        
        <main className="flex-1 p-8">
          <PDFGrid 
            pdfs={pdfs}
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
