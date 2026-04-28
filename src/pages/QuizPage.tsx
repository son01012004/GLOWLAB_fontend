import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, ArrowLeft, Loader2, Sparkles, ClipboardList } from 'lucide-react';
import { message, Progress } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { quizService } from '../services/quiz.service';

const QuizPage: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    quizService.getQuestions()
      .then((res: any) => {
        // Hỗ trợ cả trường hợp res trả về object quiz hoặc mảng câu hỏi
        const fetchedQuestions = res?.questions || (Array.isArray(res) ? res : []);
        setQuestions(fetchedQuestions);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi tải Quiz:", err);
        message.error("Không thể kết nối Server Quiz!");
        setLoading(false);
      });
  }, []);

  const handleSelect = (questionId: number, optionId: string) => {
    setAnswers({ ...answers, [questionId]: optionId });
    // Auto-advance to next question after a short delay
    if (currentStep < questions.length - 1) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 500);
    }
  };

  const handleNext = async () => {
    const currentQuestion = questions[currentStep];
    
    if (!answers[currentQuestion.id]) {
      message.warning("Vui lòng chọn một câu trả lời!");
      return;
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      if (!isAuthenticated && !localStorage.getItem('token')) {
        message.success("Hoàn thành bài trắc nghiệm! Vui lòng đăng nhập để nhận phân tích chi tiết.");
        navigate('/login');
        return;
      }

      setSubmitting(true);
      try {
        // Đóng gói Payload theo chuẩn QuizSubmitRequest: { answerIds: [...] }
        const payload = {
          answerIds: Object.values(answers)
        };
        
        await quizService.submitQuiz(payload);
        message.success("Phân tích da hoàn tất!");
        
        // Chuyển hướng sang trang hồ sơ da
        setTimeout(() => navigate('/skin-profile'), 1000);
      } catch (error: any) {
        console.error("Lỗi nộp bài:", error);
        message.error(error.response?.data?.message || "Lỗi khi gửi kết quả!");
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-[#86C2A1] w-12 h-12" />
      <p className="text-[#86C2A1] font-bold tracking-widest animate-pulse uppercase text-xs">Đang tải dữ liệu...</p>
    </div>
  );

  if (questions.length === 0) return (
    <div className="h-screen flex flex-col items-center justify-center gap-6">
      <ClipboardList className="w-16 h-16 text-gray-200" />
      <h3 className="text-xl font-bold text-[#1E293B]">Không tìm thấy bài trắc nghiệm</h3>
      <button onClick={() => navigate('/')} className="px-8 py-3 bg-[#1E293B] text-white rounded-xl font-bold">QUAY LẠI</button>
    </div>
  );

  const currentQuestion = questions[currentStep];
  const options = currentQuestion?.options || currentQuestion?.answers || [];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen pt-32 px-4 pb-20 relative">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 space-y-4">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2 text-[#86C2A1]">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Skin Analysis AI</span>
            </div>
            <span className="text-sm font-bold text-[#1E293B]">Câu {currentStep + 1} / {questions.length}</span>
          </div>
          <div className="h-1.5 w-full bg-white/40 rounded-full overflow-hidden border border-white/20">
            <motion.div className="h-full bg-glow-gradient" animate={{ width: `${progress}%` }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-effect p-10 md:p-14 border-white/80 shadow-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-12 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {currentQuestion?.content}
            </h2>

            <div className="grid gap-4">
              {options.map((opt: any) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(currentQuestion.id, opt.id)}
                  className={`group flex items-center justify-between p-6 rounded-2xl border-2 transition-all duration-300 ${
                    answers[currentQuestion.id] === opt.id
                      ? 'border-[#86C2A1] bg-white shadow-lg'
                      : 'border-white/60 bg-white/30 hover:border-[#86C2A1]/40'
                  }`}
                >
                  <span className={`font-semibold text-lg ${answers[currentQuestion.id] === opt.id ? 'text-[#1E293B]' : 'text-[#64748B]'}`}>
                    {opt.content}
                  </span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${answers[currentQuestion.id] === opt.id ? 'bg-[#86C2A1] border-[#86C2A1]' : 'border-gray-300'}`}>
                    {answers[currentQuestion.id] === opt.id && <CheckCircle2 className="text-white w-4 h-4" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center mt-16 pt-8 border-t border-gray-100">
              <button onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)} className={`flex items-center gap-2 text-[#64748B] font-bold text-xs tracking-widest ${currentStep === 0 ? 'opacity-0' : 'hover:text-[#1E293B]'}`}>
                <ArrowLeft className="w-4 h-4" /> QUAY LẠI
              </button>
              <button onClick={handleNext} disabled={submitting} className="flex items-center gap-3 px-10 py-4 bg-[#1E293B] text-white rounded-2xl font-bold text-xs tracking-widest shadow-xl hover:-translate-y-1 transition-all">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{currentStep === questions.length - 1 ? (isAuthenticated || localStorage.getItem('token') ? 'XEM KẾT QUẢ' : 'ĐĂNG NHẬP ĐỂ XEM') : 'TIẾP THEO'} <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuizPage;