"use client";

import { useState, useEffect } from "react";
import { Clock, AlertCircle, CheckCircle2, ChevronRight, XCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { updateSkillScores, createUserProfile } from "@/lib/firebase/users";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getSkillTestQuestions } from "@/lib/firebase/skillTest";

// Removed placeholder questions

const tabs = [
  { id: "excel", label: "Microsoft Excel" },
  { id: "canva", label: "Canva Design" },
  { id: "english", label: "Bahasa Inggris" },
  { id: "digitalLiteracy", label: "Literasi Digital" }
];

export default function Tes() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("excel");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number[]>>({ excel: [], canva: [], english: [], digitalLiteracy: [] });
  const [questionsData, setQuestionsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSkillTestQuestions().then((data) => {
      setQuestionsData(data);
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (timeLeft <= 0 || isFinished) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQuestions = questionsData ? questionsData[activeTab as keyof typeof questionsData] || [] : [];
  const currentQ = currentQuestions[currentIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const newAnswers = { ...answers };
    newAnswers[activeTab] = [...(newAnswers[activeTab] || []), idx === currentQ.correct ? 1 : 0];
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIdx < currentQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Pindah tab atau selesai
      const currentTabIndex = tabs.findIndex(t => t.id === activeTab);
      if (currentTabIndex < tabs.length - 1) {
        setActiveTab(tabs[currentTabIndex + 1].id);
        setCurrentIdx(0);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        handleFinish();
      }
    }
  };

  const handleFinish = async () => {
    setIsFinished(true);

    // Calculate scores
    const calculateScore = (category: string) => {
      const arr = answers[category] || [];
      if (arr.length === 0) return 0;
      const sum = arr.reduce((a, b) => a + b, 0);
      return Math.round((sum / currentQuestions.length) * 100);
    };

    const scores = {
      excel: calculateScore("excel"),
      canva: calculateScore("canva"),
      english: calculateScore("english"),
      digital: calculateScore("digitalLiteracy")
    };

    const matchScore = Math.round((scores.excel + scores.canva + scores.english + scores.digital) / 4);

    try {
      if (auth.currentUser) {
        const uid = auth.currentUser.uid;
        await updateSkillScores(uid, scores);
        
        await updateDoc(doc(db, "users", uid), {
          matchScore,
          recommendedJob: matchScore > 80 ? "Social Media Specialist" : "Digital Marketing Assistant",
          locationPreference: "Batam"
        });
      }
    } catch (err) {
      console.error("Failed to save scores:", err);
    }

    setTimeout(() => {
      router.push("/hasil");
    }, 2000);
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">AI Menganalisis...</h2>
          <p className="text-text-muted">Menghitung Match Score dan menyusun rencana karir yang dipersonalisasi untuk Anda.</p>
        </div>
      </div>
    );
  }

  if (loading || !questionsData) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Memuat Soal...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 bg-card border-b border-border-color px-4 py-4 md:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="font-bold text-primary-dark dark:text-primary text-xl tracking-tight hidden sm:block">KerjaKamu</div>
          
          <div className="flex-1 max-w-xs mx-4 sm:mx-8">
            <div className="flex justify-between text-xs font-medium mb-1 text-text-muted">
              <span>Progres Keseluruhan</span>
              <span>40%</span>
            </div>
            <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
               <div className="h-full bg-primary rounded-full w-[40%] transition-all duration-300"></div>
            </div>
          </div>

          <div className={`flex items-center gap-2 font-mono font-bold text-lg ${timeLeft < 60 ? 'text-error animate-pulse' : 'text-text-primary'}`}>
            <Clock size={20} />
            {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar border-b border-border-color mb-8 gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              disabled
              className={`px-4 py-3 whitespace-nowrap text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.id 
                ? 'border-primary text-primary' 
                : 'border-transparent text-text-muted opacity-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Question Area */}
        <div className="bg-card border border-border-color rounded-2xl shadow-sm p-6 md:p-10">
          <div className="text-sm font-medium text-primary mb-4 uppercase tracking-wider">
            Pertanyaan {currentIdx + 1} dari {currentQuestions.length}
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-8 leading-relaxed">
            {currentQ.q}
          </h2>

          <div className="space-y-3">
            {currentQ?.options?.map((opt: string, idx: number) => {
              let btnClass = "w-full text-left p-4 rounded-xl border transition-all duration-200 text-text-primary font-medium flex items-center justify-between ";
              if (!isAnswered) {
                btnClass += "border-border-color hover:border-primary hover:bg-primary/5 bg-surface";
              } else if (idx === currentQ.correct) {
                btnClass += "border-success bg-success/10"; // Correct
              } else if (idx === selectedOption) {
                btnClass += "border-error bg-error/10"; // Incorrect selection
              } else {
                btnClass += "border-border-color bg-surface opacity-50";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isAnswered}
                  className={btnClass}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-background border border-border-color flex items-center justify-center text-sm">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </span>
                  
                  {isAnswered && idx === currentQ.correct && <CheckCircle2 className="text-success" />}
                  {isAnswered && idx === selectedOption && idx !== currentQ.correct && <XCircle className="text-error" />}
                </button>
              );
            })}
          </div>

          {/* Feedback & Actions */}
          {isAnswered && (
            <div className={`mt-6 p-4 rounded-xl border animate-fade-in ${
              selectedOption === currentQ.correct 
              ? 'bg-success/5 border-success/20 text-success-dark' 
              : 'bg-error/5 border-error/20 text-error-dark'
            }`}>
              <div className="flex items-start gap-3">
                {selectedOption === currentQ.correct ? (
                  <CheckCircle2 className="text-success shrink-0" />
                ) : (
                  <AlertCircle className="text-error shrink-0" />
                )}
                <div>
                  <h4 className="font-bold mb-1">
                    {selectedOption === currentQ.correct ? 'Tepat Sekali!' : 'Belum Tepat'}
                  </h4>
                  <p className="text-sm text-text-muted">{currentQ.explanation || currentQ.exp}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${
                isAnswered 
                ? 'bg-primary text-white hover:brightness-90 shadow-lg shadow-primary/20' 
                : 'bg-surface text-text-muted cursor-not-allowed border border-border-color'
              }`}
            >
              Lanjut <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
