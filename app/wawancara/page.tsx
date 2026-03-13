"use client";

import { Navbar } from "@/components/Navbar";
import { Mic, ArrowRight, UserSquare2, ShieldAlert, SkipForward, Play, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { evaluateAnswer, calculateFinalInterviewScore, saveInterviewResult, interviewQuestions } from "@/lib/ai/interviewAI";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

// imported from lib/interviewAI

export default function Wawancara() {
  const [step, setStep] = useState(0); // 0 = intro, 1-5 = q1-q5, 6 = result
  const [answer, setAnswer] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid || null);
    });
    return unsub;
  }, []);

  const handleStart = () => setStep(1);

  const handleSubmitValue = async () => {
    if (!answer.trim()) return;
    setIsAnalyzing(true);
    
    try {
      const evaluation = await evaluateAnswer(interviewQuestions[step - 1], answer);
      
      const newFeedback = {
        question: interviewQuestions[step - 1],
        answer,
        score: evaluation.score,
        strength: evaluation.strengths,
        improvement: evaluation.improvements
      };
      
      const updatedFeedbacks = [...feedbacks, newFeedback];
      setFeedbacks(updatedFeedbacks);
      setAnswer("");
      
      if (step < 5) {
        setStep(step + 1);
      } else {
        if (auth.currentUser) {
           await saveInterviewResult(auth.currentUser.uid, updatedFeedbacks);
        }
        setStep(6);
      }
    } catch (error) {
       console.error(error);
    } finally {
       setIsAnalyzing(false);
    }
  };

  const handleSkip = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      if (step < 5) {
        setStep(step + 1);
      } else {
        setStep(6);
      }
    }, 500);
  };

  if (step === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-bg">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-card border border-border-color rounded-2xl shadow-xl overflow-hidden text-center relative p-8 md:p-12">
             <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-accent"></div>
             
             <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mic size={40} className="text-primary" />
             </div>
             
             <h1 className="text-3xl font-extrabold text-text-primary mb-4">Simulasi Wawancara AI</h1>
             <p className="text-lg text-text-muted mb-8 leading-relaxed">
               Gugup sebelum interview asli? Latih kemampuanmu menjawab pertanyaan sulit. AI kami beraksen natural dan akan menilai dari artikulasi, struktur, dan inti jawaban.
             </p>
             
             <div className="bg-surface border border-border-color p-4 rounded-xl text-left mb-8 flex gap-4 text-sm text-text-primary items-start">
               <AlertTriangle className="text-warning shrink-0" size={20} />
               <div>
                 <strong>Tips:</strong> Gunakan metode STAR dan jangan ragu untuk mengambil jeda 1-2 detik sebelum menjawab.
               </div>
             </div>

             <button onClick={handleStart} className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg btn-hover shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
               Mulai Sesi <ArrowRight size={20}/>
             </button>
          </div>
        </main>
      </div>
    );
  }

  if (step === 6) {
    return (
      <div className="min-h-screen flex flex-col bg-bg">
        <Navbar />
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12">
          <div className="bg-card border border-border-color rounded-2xl shadow-sm p-8 md:p-12 text-center mb-8 relative overflow-hidden">
             {/* Decorative */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-[100px] -z-10 rotate-12"></div>
             
             <h2 className="text-xl font-bold text-text-primary mb-2">Hasil Wawancara</h2>
             <div className="font-mono text-[80px] leading-none font-bold text-primary mb-6">{calculateFinalInterviewScore(feedbacks)}</div>
             
             {/* Dummy Radar Chart placeholder using SVG dots */}
             <div className="w-48 h-48 mx-auto mb-8 bg-surface rounded-full border border-border-color relative border-dashed flex items-center justify-center">
                 <div className="text-text-muted text-xs font-bold tracking-widest absolute">RADAR CHART</div>
                 {/* Decorative radar lines */}
                 <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-20"></div>
                 <div className="w-32 h-32 border border-primary/30 rounded-full absolute"></div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8 text-center text-sm font-medium">
               <div className="bg-surface p-3 rounded-xl border border-border-color">Struktur: 85%</div>
               <div className="bg-surface p-3 rounded-xl border border-border-color">Kejelasan: 90%</div>
               <div className="bg-surface p-3 rounded-xl border border-border-color">Relevansi: 80%</div>
               <div className="bg-surface p-3 rounded-xl border border-border-color">Empati: 82%</div>
             </div>

             <div className="flex justify-center gap-4">
               <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold btn-hover shadow-lg shadow-primary/20">
                 Bagikan ke HRD
               </button>
               <button onClick={() => {setStep(0); setFeedbacks([]);}} className="bg-surface text-text-primary border border-border-color px-8 py-3 rounded-xl font-bold hover:bg-border-color transition-colors">
                 Latihan Lagi
               </button>
             </div>
          </div>

          <h3 className="text-xl font-bold text-text-primary mb-6 px-2">Feedback Detail AI</h3>
          <div className="space-y-6">
            {feedbacks.map((f, i) => (
              <div key={i} className="bg-card border border-border-color rounded-xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-bold text-text-primary">Q{i+1}: {f.question}</h4>
                  <div className="font-mono text-success bg-success/10 px-2 py-0.5 rounded font-bold text-sm shrink-0">{f.score}/100</div>
                </div>
                
                <div className="bg-surface p-4 rounded-lg mb-4 italic text-text-muted text-sm border-l-4 border-border-color">
                  "{f.answer}"
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="bg-success/5 border border-success/20 p-4 rounded-lg">
                      <div className="text-xs font-bold text-success uppercase tracking-wider mb-1">Kekuatan</div>
                      <p className="text-sm text-text-primary">{f.strength}</p>
                   </div>
                   <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <div className="text-xs font-bold text-warning uppercase tracking-wider mb-1">Area Perbaikan</div>
                      <p className="text-sm text-text-primary">{f.improvement}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 lg:py-12 flex flex-col">
        {/* Progress Bar */}
        <div className="w-full bg-surface h-2 rounded-full overflow-hidden mb-8">
           <div className="h-full bg-primary transition-all duration-500" style={{width: `${(step / 5) * 100}%`}}></div>
        </div>

        <div className="flex-1 flex flex-col">
          {/* Question Box */}
          <div className="bg-card border border-border-color rounded-2xl p-8 shadow-sm mb-6 flex-1 flex flex-col justify-center items-center text-center">
             <div className="text-primary font-bold tracking-wider text-sm uppercase mb-4">Pertanyaan {step} dari 5</div>
             <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary leading-snug">
               {interviewQuestions[step - 1]}
             </h2>
          </div>

          {/* Answer Action Area */}
          <div className="bg-card border border-border-color rounded-2xl p-6 shadow-sm">
            {isAnalyzing ? (
              <div className="py-12 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <div className="font-bold text-primary">AI Sedang Mengevaluasi...</div>
              </div>
            ) : (
              <div>
                <textarea 
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full h-32 bg-surface border border-border-color rounded-xl p-4 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none mb-4"
                  placeholder="Ketik jawaban Anda di sini (Simulasi text untuk kompetisi ini. Mode suara cooming soon!)"
                ></textarea>
                
                <div className="flex justify-between items-center">
                   <button onClick={handleSkip} className="text-sm font-medium text-text-muted hover:text-text-primary px-4 py-2 flex items-center gap-1">
                     <SkipForward size={16}/> Lewati
                   </button>
                   
                   <button 
                    onClick={handleSubmitValue}
                    disabled={!answer.trim()}
                    className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold btn-hover shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     Submit Jawaban <ArrowRight size={20}/>
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
