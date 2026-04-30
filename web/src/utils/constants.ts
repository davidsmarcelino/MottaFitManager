// Exercícios
export const CATEGORIAS_EXERCICIO = [
  'Peito',
  'Costas', 
  'Ombros',
  'Bíceps',
  'Tríceps',
  'Pernas',
  'Abdômen',
  'Aeróbico'
] as const;

// Treinos
export const DIAS_SEMANA = [
  'Segunda',
  'Terça', 
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
  'Domingo'
] as const;

// Aulas
export const STATUS_AULA = {
  AGENDADA: 'Agendada',
  REALIZADA: 'Realizada', 
  FALTOU: 'Faltou',
  REMARCADA: 'Remarcada'
} as const;

export const TIPO_RECORRENCIA = {
  NENHUMA: 'Nenhuma',
  DIARIA: 'Diaria',
  SEMANAL: 'Semanal',
  QUINZENAL: 'Quinzenal',
  MENSAL: 'Mensal'
} as const;

// Pagamentos
export const FORMAS_PAGAMENTO = [
  'PIX',
  'Dinheiro',
  'Cartão de Débito',
  'Cartão de Crédito',
  'Transferência'
] as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN_PROFESSOR: '/api/auth/login/professor',
    LOGIN_ALUNO: '/api/auth/login/aluno'
  },
  EXERCICIOS: '/api/exercicio',
  TREINOS: '/api/treino',
  ALUNOS: '/api/aluno',
  AULAS: '/api/aula',
  CONVITES: '/api/convite',
  BIOIMPEDANCIA: '/api/bioimpedancia',
  PROFESSOR: '/api/professor'
} as const;