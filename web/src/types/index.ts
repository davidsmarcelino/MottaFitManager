export interface User {
  id: string;
  nome: string;
  email: string;
  tipoUsuario: 'Professor' | 'Aluno';
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  id: string;
  token: string;
  nome: string;
  tipoUsuario: string;
}

export interface Exercicio {
  id: string;
  nome: string;
  categoria: string;
  videoUrl?: string;
  idProfessor: string;
  dataCriacao: string;
}

export interface ExercicioRequest {
  nome: string;
  categoria: string;
  videoUrl?: string;
}

export interface Treino {
  id: string;
  nome: string;
  alunoId: string;
  professorId: string;
  exercicios: ExercicioTreino[];
  exerciciosPorDia?: { [dia: string]: ExercicioTreino[] };
  treinoSemanal: boolean;
  dataCriacao: string;
}

export interface ExercicioTreino {
  exercicioId: string;
  nome: string;
  categoria: string;
  series: number;
  repeticoes: number;
  carga: number;
  videoUrl?: string;
  observacoes?: string;
}

export interface CriarTreinoRequest {
  nome: string;
  alunoId: string;
  treinoSemanal: boolean;
  exercicios?: {
    exercicioId: string;
    series: number;
    repeticoes: number;
    carga: number;
    observacoes?: string;
  }[];
  exerciciosPorDia?: {
    [dia: string]: {
      exercicioId: string;
      series: number;
      repeticoes: number;
      carga: number;
      observacoes?: string;
    }[];
  };
}

export interface ConviteRequest {
  nomeAluno: string;
  emailAluno: string;
}

export interface AceitarConviteRequest {
  token: string;
  nome: string;
  senha: string;
}