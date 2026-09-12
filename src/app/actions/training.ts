"use server";

import { mockStore } from "@/lib/mock-data";
import { headers } from "next/headers";
import { getClientIp } from "@/lib/rate-limiter";
import { sanitizeCsvField } from "@/lib/utils";

export interface SubmitQuizInput {
  slug: string;
  trainingId: string;
  employeeId?: string;
  fullName?: string;
  cpf?: string;
  role?: string;
  answers: { [questionIndex: number]: number };
}

export async function submitQuizAndCertifyAction(data: SubmitQuizInput) {
  try {
    const reqHeaders = await headers();
    const serverIp = getClientIp(reqHeaders);
    const userAgent = reqHeaders.get("user-agent") || "Navegador Web";

    const trainings = mockStore.getTrainings();
    const training = trainings.find((t) => t.id === data.trainingId) || trainings[0];
    const questions = training.questions || [];

    if (questions.length === 0) {
      return { success: false, error: "Treinamento sem questões cadastradas." };
    }

    // 1. Validação do gabarito EXCLUSIVAMENTE NO SERVIDOR
    let correctCount = 0;
    questions.forEach((q, idx) => {
      const selected = data.answers[idx];
      if (selected !== undefined && selected === q.correct_option_index) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);

    // Exige pontuação mínima de 70% para aprovação
    if (score < 70) {
      return {
        success: false,
        score,
        approved: false,
        error: `Pontuação obtida (${score}%) insuficiente para aprovação. O aproveitamento mínimo exigido é de 70%.`,
      };
    }

    // 2. Localiza ou cadastra o colaborador
    let employee = data.employeeId ? mockStore.getEmployeeById(data.employeeId) : null;

    if (!employee && data.fullName && data.cpf) {
      const cleanName = sanitizeCsvField(data.fullName.trim());
      const cleanRole = sanitizeCsvField(data.role?.trim() || "Colaborador");
      const cleanCpf = data.cpf.replace(/\D/g, "");

      employee = mockStore.addEmployee({
        full_name: cleanName,
        cpf: cleanCpf,
        role: cleanRole,
        phone: "Mobile",
      });
    }

    if (!employee) {
      return { success: false, error: "Identificação do colaborador não fornecida." };
    }

    // 3. Registra o aceite e emite o certificado com metadados do SERVIDOR
    mockStore.acceptPolicy(employee.id, serverIp);
    const completion = mockStore.completeTraining(employee.id, training.id, score, serverIp);

    return {
      success: true,
      approved: true,
      score,
      certificateCode: completion.certificate_code,
      completedAt: completion.completed_at,
      recordedIp: serverIp,
    };
  } catch (err: any) {
    return { success: false, error: "Falha ao processar avaliação no servidor." };
  }
}
