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
} from "lucide-react";
import { mockStore } from "@/lib/mock-data";
import { Employee, Training, EmployeeTraining } from "@/types";
import { formatCPF, maskCPF } from "@/lib/utils";
import { generateCertificatePDF } from "@/lib/pdf-generator";
import { submitQuizAndCertifyAction } from "@/app/actions/training";

export default function EmployeeTrainingFlowPage({ params }: { params: Promise<{ accessToken: string }> }) {
  const resolvedParams = use(params);
  const company = mockStore.getCompany();
  const policy = mockStore.getPolicy();
  const trainings = mockStore.getTrainings();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<"TERMO" | "TREINAMENTO" | "CERTIFICADOS">("TERMO");
  
  // Trilha ativa no fluxo de estudo
  const [selectedTraining, setSelectedTraining] = useState<Training>(trainings[0]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [inQuiz, setInQuiz] = useState(false);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIndex: number]: number }>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  // Certificados obtidos
  const [certificates, setCertificates] = useState<EmployeeTraining[]>([]);

  useEffect(() => {
    const emp = mockStore.getEmployeeByToken(resolvedParams.accessToken);
    if (emp) {
      setEmployee(emp);
      const certs = mockStore.getEmployeeCertificates(emp.id);
      setCertificates(certs);

      if (emp.policy_accepted_at) {
        setActiveTab("TREINAMENTO");
      }
    }
  }, [resolvedParams.accessToken]);

  const handleAcceptPolicy = () => {
    if (!employee) return;
    const updated = mockStore.acceptPolicy(employee.id, "189.40.112.5");
    if (updated) {
      setEmployee({ ...updated });
      setActiveTab("TREINAMENTO");
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (showFeedback) return;
    setSelectedAnswers((prev) => ({ ...prev, [quizQuestionIndex]: optionIndex }));
    setShowFeedback(true);
  };

  const handleNextQuestion = async () => {
    setShowFeedback(false);
    if (selectedTraining.questions && quizQuestionIndex < selectedTraining.questions.length - 1) {
      setQuizQuestionIndex((prev) => prev + 1);
    } else {
      // Quiz concluído - Validação e certificação segura no servidor
      setQuizFinished(true);
      if (employee) {
        const result = await submitQuizAndCertifyAction({
          slug: company.slug,
          trainingId: selectedTraining.id,
          employeeId: employee.id,
          answers: selectedAnswers,
        });

        if (result.success) {
          const allCerts = mockStore.getEmployeeCertificates(employee.id);
          setCertificates([...allCerts]);
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch {
            // ignore
          }
        }
      }
    }
  };

  const startTraining = (t: Training) => {
    setSelectedTraining(t);
    setCurrentCardIndex(0);
    setInQuiz(false);
    setQuizQuestionIndex(0);
    setSelectedAnswers({});
    setShowFeedback(false);
    setQuizFinished(false);
    setActiveTab("TREINAMENTO");
  };

  if (!employee) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Link de Acesso Inválido</h2>
          <p className="text-xs text-slate-600">
            Não foi possível identificar seu cadastro com este link. Entre em contato com a equipe de RH/Compliance da sua empresa.
          </p>
        </div>
      </div>
    );
  }

  const currentQuestions = selectedTraining.questions || [];
  const currentQ = currentQuestions[quizQuestionIndex];
  const isTrainingCompleted = certificates.some((c) => c.training_id === selectedTraining.id);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans max-w-md mx-auto shadow-2xl border-x border-slate-200">
      {/* Topo Mobile */}
      <header className="bg-slate-900 text-white p-4 sticky top-0 z-40 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-blue-400">Programa de Integridade & NR-1</div>
            <div className="text-xs font-bold text-white truncate max-w-[210px]">{company.trade_name}</div>
          </div>
        </div>
        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded font-mono">
          {maskCPF(employee.cpf)}
        </span>
      </header>

      {/* Identificação do Colaborador */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-bold text-slate-900">{employee.full_name}</h1>
          <p className="text-xs text-slate-500">{employee.role}</p>
        </div>
        <div className="flex items-center gap-1">
          {employee.policy_accepted_at ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Conforme
            </span>
          ) : (
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Pendente Aceite
            </span>
          )}
        </div>
      </div>

      {/* Abas Mobile */}
      <div className="bg-white border-b border-slate-200 grid grid-cols-3 text-center text-xs font-bold">
        <button
          onClick={() => setActiveTab("TERMO")}
          className={`py-3 border-b-2 transition-all ${
            activeTab === "TERMO"
              ? "border-blue-600 text-blue-600 bg-blue-50/30"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          1. Código
        </button>
        <button
          onClick={() => setActiveTab("TREINAMENTO")}
          disabled={!employee.policy_accepted_at}
          className={`py-3 border-b-2 transition-all ${
            activeTab === "TREINAMENTO"
              ? "border-blue-600 text-blue-600 bg-blue-50/30"
              : "border-transparent text-slate-500 hover:text-slate-800 disabled:opacity-40"
          }`}
        >
          2. Trilhas
        </button>
        <button
          onClick={() => setActiveTab("CERTIFICADOS")}
          disabled={certificates.length === 0}
          className={`py-3 border-b-2 transition-all ${
            activeTab === "CERTIFICADOS"
              ? "border-blue-600 text-blue-600 bg-blue-50/30"
              : "border-transparent text-slate-500 hover:text-slate-800 disabled:opacity-40"
          }`}
        >
          3. Certificados ({certificates.length})
        </button>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="p-4 flex-1 overflow-y-auto space-y-4">
        {/* ABA 1: ACEITE DA POLÍTICA / CÓDIGO */}
        {activeTab === "TERMO" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                Passo Obrigatório 1 de 3
              </span>
              <h2 className="text-base font-bold text-slate-900 pt-1">{policy.title}</h2>
              <p className="text-xs text-slate-500">
                Leia os termos abaixo e confirme o seu aceite formal para liberar as trilhas de capacitação.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 max-h-72 overflow-y-auto space-y-3 leading-relaxed">
              <div className="whitespace-pre-line">
                {policy.content}
              </div>
            </div>

            {employee.policy_accepted_at ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Termo Assinado Eletronicamente
                </div>
                <div className="text-[11px] text-emerald-700">
                  Data: {new Date(employee.policy_accepted_at).toLocaleString("pt-BR")} | IP: {employee.policy_acceptance_ip || "189.40.112.5"}
                </div>
                <button
                  onClick={() => setActiveTab("TREINAMENTO")}
                  className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  Continuar para o Treinamento <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="text-[11px] text-slate-500 leading-snug">
                  Ao clicar em aceitar, será registrado formalmente seu aceite com timestamp e endereço IP para auditoria do Programa de Integridade (Lei 14.133/2021).
                </div>
                <button
                  onClick={handleAcceptPolicy}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md text-sm transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Li e Concordo com os Termos
                </button>
              </div>
            )}
          </div>
        )}

        {/* ABA 2: TRILHAS DE MICROLEARNING EM TEXTO + QUIZ */}
        {activeTab === "TREINAMENTO" && (
          <div className="space-y-4">
            {/* Seletor de Trilha */}
            <div className="grid grid-cols-2 gap-2">
              {trainings.map((t) => {
                const done = certificates.some((c) => c.training_id === t.id);
                const isSelected = selectedTraining.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => startTraining(t)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold uppercase text-slate-500">
                        {t.track === "INTEGRIDADE_14133" ? "Lei 14.133" : "NR-1 Assédio"}
                      </span>
                      {done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <div className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                      {t.title}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* FLUXO DO TREINAMENTO SELECIONADO */}
            {quizFinished ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center space-y-4 animate-in fade-in">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Parabéns, {employee.full_name}!</h3>
                  <p className="text-xs text-slate-600">
                    Você concluiu com 100% de aproveitamento a capacitação em:
                  </p>
                  <p className="text-xs font-bold text-blue-900">{selectedTraining.title}</p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => setActiveTab("CERTIFICADOS")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Award className="w-4 h-4" />
                    Visualizar e Baixar Certificado
                  </button>
                  {trainings.some((t) => !certificates.some((c) => c.training_id === t.id)) && (
                    <button
                      onClick={() => {
                        const next = trainings.find((t) => !certificates.some((c) => c.training_id === t.id));
                        if (next) startTraining(next);
                      }}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs"
                    >
                      Fazer Próxima Trilha Pendente
                    </button>
                  )}
                </div>
              </div>
            ) : inQuiz ? (
              /* TELA DO QUIZ DE FIXAÇÃO */
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                    Quiz de Fixação • Pergunta {quizQuestionIndex + 1} de {currentQuestions.length}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {Math.round(((quizQuestionIndex + 1) / currentQuestions.length) * 100)}%
                  </span>
                </div>

                <div className="text-sm font-bold text-slate-900 leading-snug">
                  {currentQ?.question_text}
                </div>

                <div className="space-y-2 pt-1">
                  {currentQ?.options.map((option, idx) => {
                    const isSelected = selectedAnswers[quizQuestionIndex] === idx;
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
                        onClick={() => handleSelectOption(idx)}
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
                        selectedAnswers[quizQuestionIndex] === currentQ.correct_option_index
                          ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                          : "bg-red-50 border border-red-200 text-red-900"
                      }`}
                    >
                      <div className="font-bold">
                        {selectedAnswers[quizQuestionIndex] === currentQ.correct_option_index
                          ? "✓ Resposta Correta!"
                          : "✗ Atenção à regra ética:"}
                      </div>
                      <p className="leading-relaxed">{currentQ.explanation}</p>
                    </div>

                    <button
                      onClick={handleNextQuestion}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      {quizQuestionIndex < currentQuestions.length - 1 ? "Próxima Pergunta" : "Finalizar e Emitir Certificado"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* LEITURA DE CARDS RÁPIDOS (2 A 3 MINUTOS) */
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Card de Leitura Rápida ({currentCardIndex + 1}/{(selectedTraining.cards || []).length})</span>
                  </div>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                    ~2 min leitura
                  </span>
                </div>

                {selectedTraining.cards && selectedTraining.cards[currentCardIndex] && (
                  <div className="space-y-3 py-1">
                    <h3 className="text-base font-bold text-slate-900">
                      {selectedTraining.cards[currentCardIndex].title}
                    </h3>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                      {selectedTraining.cards[currentCardIndex].content}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setCurrentCardIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentCardIndex === 0}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 px-3 py-1.5"
                  >
                    Anterior
                  </button>

                  {selectedTraining.cards && currentCardIndex < selectedTraining.cards.length - 1 ? (
                    <button
                      onClick={() => setCurrentCardIndex((prev) => prev + 1)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      Próximo Card <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setInQuiz(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      Iniciar Quiz de Fixação <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ABA 3: CERTIFICADOS DIGITAIS */}
        {activeTab === "CERTIFICADOS" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <Award className="w-5 h-5 text-amber-500" />
                <h2>Seus Certificados Oficiais</h2>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Estes certificados comprovam a capacitação do colaborador para órgãos licitantes e comissões contratuais.
              </p>

              <div className="space-y-3">
                {certificates.map((cert) => {
                  const training = trainings.find((t) => t.id === cert.training_id);
                  return (
                    <div
                      key={cert.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                            {training?.track === "INTEGRIDADE_14133" ? "Lei 14.133/2021" : "NR-1 Prevenção ao Assédio"}
                          </div>
                          <div className="text-xs font-bold text-slate-900 mt-0.5">
                            {training?.title}
                          </div>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full shrink-0">
                          100% Aprovado
                        </span>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                        <span className="font-mono">{cert.certificate_code}</span>
                        <Link
                          href={`/validar/${cert.certificate_code}`}
                          target="_blank"
                          className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
                        >
                          Verificar <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>

                      <button
                        onClick={() =>
                          generateCertificatePDF(
                            employee.full_name,
                            employee.cpf,
                            training?.title || "Treinamento de Integridade",
                            cert.completed_at,
                            cert.certificate_code
                          )
                        }
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Baixar Certificado Oficial (PDF)
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Mobile */}
      <footer className="p-3 bg-white border-t border-slate-200 text-center text-[11px] text-slate-400">
        TechCompliance • Plataforma Segura para Colaboradores
      </footer>
    </div>
  );
}
