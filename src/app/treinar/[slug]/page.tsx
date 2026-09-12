"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Award,
  Download,
  AlertTriangle,
  Building2,
  Smartphone,
  HelpCircle,
  Clock,
  ExternalLink,
  User,
  Fingerprint,
} from "lucide-react";
import { mockStore } from "@/lib/mock-data";
import { formatCPF, maskCPF } from "@/lib/utils";
import { generateCertificatePDF } from "@/lib/pdf-generator";
import { submitQuizAndCertifyAction } from "@/app/actions/training";

export default function DirectTrainingPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const company = mockStore.getCompany(resolvedParams.slug);
  const policy = mockStore.getPolicy();
  const trainings = mockStore.getTrainings();

  // 1. DADOS INICIAIS DO COLABORADOR (Sem cadastro prévio)
  const [step, setStep] = useState<"IDENTIFICACAO" | "LEITURA" | "QUIZ" | "CERTIFICADO">("IDENTIFICACAO");
  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [role, setRole] = useState("");

  // Metadados capturados em segundo plano para validade jurídica e auditoria
  const [clientIp, setClientIp] = useState("Carregando IP...");
  const [userAgent, setUserAgent] = useState("");

  // 2. CONTROLE DO MICROLEARNING & QUIZ
  const activeTraining = trainings[0]; // Integridade 14.133 + NR-1
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [q: number]: number }>({});
  const [showFeedback, setShowFeedback] = useState(false);

  // 3. CERTIFICADO FINAL EMITIDO
  const [certificateData, setCertificateData] = useState<{
    code: string;
    completedAt: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserAgent(navigator.userAgent || "Navegador Mobile");
    }
    // Captura do IP real ou simulado em background
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setClientIp(data.ip || "189.40.112.5"))
      .catch(() => setClientIp("189.40.112.5"));
  }, []);

  // Iniciar Treinamento após informar Nome, CPF e Cargo
  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !cpf.trim() || !role.trim()) return;
    setStep("LEITURA");
  };

  const handleSelectQuizOption = (optionIdx: number) => {
    if (showFeedback) return;
    setSelectedAnswers((prev) => ({ ...prev, [quizIndex]: optionIdx }));
    setShowFeedback(true);
  };

  const handleNextQuiz = async () => {
    setShowFeedback(false);
    const questions = activeTraining.questions || [];
    if (quizIndex < questions.length - 1) {
      setQuizIndex((prev) => prev + 1);
    } else {
      // Conclusão e avaliação segura validada no servidor
      const result = await submitQuizAndCertifyAction({
        slug: resolvedParams.slug,
        trainingId: activeTraining.id,
        fullName: fullName.trim(),
        cpf: cpf.trim(),
        role: role.trim(),
        answers: selectedAnswers,
      });

      if (result.success && result.certificateCode) {
        setCertificateData({
          code: result.certificateCode,
          completedAt: result.completedAt || new Date().toISOString(),
        });
        setStep("CERTIFICADO");

        try {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      }
    }
  };

  const currentQuestions = activeTraining.questions || [];
  const currentQ = currentQuestions[quizIndex];
  const totalCards = (activeTraining.cards || []).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans max-w-md mx-auto shadow-2xl border-x border-slate-200">
      {/* Topo Oficial da Empresa */}
      <header className="bg-slate-900 text-white p-4 sticky top-0 z-40 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-semibold text-blue-400">Capacitação Oficial via Link Único</div>
            <div className="text-xs font-bold text-white truncate max-w-[210px]">{company.trade_name}</div>
          </div>
        </div>
        <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800 font-medium">
          Lei 14.133 / NR-1
        </span>
      </header>

      {/* Metadados Auditáveis em Segundo Plano */}
      <div className="bg-slate-800 text-slate-400 text-[10px] px-4 py-1.5 flex items-center justify-between font-mono">
        <div className="flex items-center gap-1.5">
          <Fingerprint className="w-3 h-3 text-emerald-400" />
          <span>Auditoria IP: {clientIp}</span>
        </div>
        <span className="text-emerald-400 font-bold">● Sessão Segura</span>
      </div>

      <main className="p-4 flex-1 overflow-y-auto space-y-4">
        {/* ===================================================================
            ETAPA 1: IDENTIFICAÇÃO DIRETA (Sem cadastro prévio)
            =================================================================== */}
        {step === "IDENTIFICACAO" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm animate-in fade-in">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                Acesso Simplificado no Celular
              </span>
              <h1 className="text-lg font-bold text-slate-900 pt-1">
                Treinamento de Integridade e Prevenção ao Assédio
              </h1>
              <p className="text-xs text-slate-600 leading-relaxed">
                Você está acessando a capacitação da <strong>{company.trade_name}</strong>. Informe seus dados para emissão do seu certificado individual com validade jurídica perante órgãos públicos.
              </p>
            </div>

            <form onSubmit={handleStart} className="space-y-3.5 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Seu Nome Completo
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Carlos Eduardo da Silva"
                  required
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Seu CPF (11 dígitos)
                </label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  required
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Seu Cargo / Função na Empresa
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Ex: Motorista, Auxiliar Operacional, Analista..."
                  required
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50 font-medium"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-700" />
                  Duração Rápida: ~3 minutos
                </div>
                <p>
                  Treinamento 100% em texto direto (sem vídeos). Leitura de cards rápidos e 3 perguntas de fixação.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md text-xs transition-all flex items-center justify-center gap-2"
              >
                Iniciar Capacitação Agora <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* ===================================================================
            ETAPA 2: CARDS DE MICROLEARNING EM TEXTO DIRETO
            =================================================================== */}
        {step === "LEITURA" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="text-xs font-bold text-blue-700">
                Card {currentCardIndex + 1} de {totalCards}
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                Microlearning Texto
              </span>
            </div>

            {activeTraining.cards && activeTraining.cards[currentCardIndex] && (
              <div className="space-y-3 py-1">
                <h2 className="text-base font-bold text-slate-900 leading-snug">
                  {activeTraining.cards[currentCardIndex].title}
                </h2>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium">
                  {activeTraining.cards[currentCardIndex].content}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={() => setCurrentCardIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentCardIndex === 0}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-30"
              >
                Anterior
              </button>

              {currentCardIndex < totalCards - 1 ? (
                <button
                  onClick={() => setCurrentCardIndex((prev) => prev + 1)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  Próximo Card <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setStep("QUIZ")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  Ir para o Quiz de Fixação <HelpCircle className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ===================================================================
            ETAPA 3: QUIZ RÁPIDO DE FIXAÇÃO (3 PERGUNTAS)
            =================================================================== */}
        {step === "QUIZ" && currentQ && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                Quiz de Fixação • Pergunta {quizIndex + 1} de {currentQuestions.length}
              </span>
              <span className="text-xs font-bold text-slate-400">
                {Math.round(((quizIndex + 1) / currentQuestions.length) * 100)}%
              </span>
            </div>

            <div className="text-sm font-bold text-slate-900 leading-snug">
              {currentQ.question_text}
            </div>

            <div className="space-y-2 pt-1">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswers[quizIndex] === idx;
                const isCorrect = idx === currentQ.correct_option_index;

                let btnClass = "border-slate-200 hover:border-slate-300 text-slate-800 bg-white";
                if (showFeedback) {
                  if (isCorrect) {
                    btnClass = "border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold";
                  } else if (isSelected && !isCorrect) {
                    btnClass = "border-red-400 bg-red-50 text-red-950";
                  }
                } else if (isSelected) {
                  btnClass = "border-blue-600 bg-blue-50 text-blue-900 font-semibold";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectQuizOption(idx)}
                    disabled={showFeedback}
                    className={`w-full p-3 text-left rounded-xl border text-xs leading-relaxed transition-all flex items-start gap-2.5 ${btnClass}`}
                  >
                    <span className="w-5 h-5 rounded-full border border-current shrink-0 flex items-center justify-center font-bold text-[10px] mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            {showFeedback && (
              <div className="pt-2 animate-in fade-in space-y-3">
                <div
                  className={`p-3 rounded-xl text-xs space-y-1 ${
                    selectedAnswers[quizIndex] === currentQ.correct_option_index
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                      : "bg-red-50 border border-red-200 text-red-900"
                  }`}
                >
                  <div className="font-bold">
                    {selectedAnswers[quizIndex] === currentQ.correct_option_index
                      ? "✓ Resposta Correta!"
                      : "✗ Atenção à regra ética:"}
                  </div>
                  <p className="leading-relaxed">{currentQ.explanation}</p>
                </div>

                <button
                  onClick={handleNextQuiz}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  {quizIndex < currentQuestions.length - 1 ? (
                    <>
                      Próxima Pergunta <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Confirmar e Aceitar Termos
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            ETAPA 4: CERTIFICADO DIGITAL INDIVIDUAL COM QR CODE
            =================================================================== */}
        {step === "CERTIFICADO" && certificateData && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Award className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Capacitação Concluída com Êxito!</h2>
              <p className="text-xs text-slate-600">
                Parabéns, <strong>{fullName}</strong>. Seu aceite formal ao Código de Conduta e sua capacitação foram auditados e registrados.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
              <div className="text-slate-500 font-medium">Registro de Auditoria Digital:</div>
              <div className="font-mono text-slate-900 font-bold">{certificateData.code}</div>
              <div className="text-[11px] text-slate-500">
                Data: {new Date(certificateData.completedAt).toLocaleString("pt-BR")} | IP: {clientIp}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                Dispositivo: {userAgent}
              </div>
            </div>

            <button
              onClick={() =>
                generateCertificatePDF(
                  fullName,
                  cpf,
                  activeTraining.title,
                  certificateData.completedAt,
                  certificateData.code
                )
              }
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md text-xs transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Baixar Certificado Oficial (PDF)
            </button>

            <Link
              href={`/validar/${certificateData.code}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 pt-1"
            >
              Visualizar Validação Pública QR Code <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-3 bg-white border-t border-slate-200 text-center text-[11px] text-slate-400">
        LicitCompliance • Treinamento sem senha via Link Único
      </footer>
    </div>
  );
}
