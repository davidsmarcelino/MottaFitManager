// Export all services from a single entry point
export { authService } from './modules/authService';
export { exercicioService } from './modules/exercicioService';
export { treinoService } from './modules/treinoService';
export { alunoService } from './modules/alunoService';
export { conviteService } from './modules/conviteService';
export { aulaService } from './modules/aulaService';
export { bioimpedanciaService } from './modules/bioimpedanciaService';
export { professorService } from './modules/professorService';

// Re-export api for direct usage if needed
export { default as api } from './api';