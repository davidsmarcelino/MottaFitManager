import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import LoginAluno from './pages/LoginAluno';
import CadastroAluno from './pages/CadastroAluno';
import Dashboard from './pages/Dashboard';
import CriarExercicio from './pages/CriarExercicio';
import GerenciarExercicios from './pages/GerenciarExercicios';
import CriarTreino from './pages/CriarTreino';
import GerenciarTreinos from './pages/GerenciarTreinos';
import MeusTreinos from './pages/MeusTreinos';
import CadastroProfessor from './pages/CadastroProfessor';
import Convites from './pages/Convites';
import Calendario from './pages/Calendario';
import Financeiro from './pages/Financeiro';
import Bioimpedancia from './pages/Bioimpedancia';

// Componente para proteger rotas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

// Componente interno com as rotas
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/login-aluno" element={<LoginAluno />} />
      <Route path="/cadastro-aluno" element={<CadastroAluno />} />
      <Route path="/cadastro-professor" element={<CadastroProfessor />} />
      
      {/* Rotas protegidas */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Rotas de exercícios */}
      <Route 
        path="/exercicios/criar" 
        element={
          <ProtectedRoute>
            <CriarExercicio />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/exercicios" 
        element={
          <ProtectedRoute>
            <GerenciarExercicios />
          </ProtectedRoute>
        } 
      />
      
      {/* Rotas de treinos */}
      <Route 
        path="/treinos/criar" 
        element={
          <ProtectedRoute>
            <CriarTreino />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/treinos" 
        element={
          <ProtectedRoute>
            <GerenciarTreinos />
          </ProtectedRoute>
        } 
      />
      
      {/* Rotas de aluno */}
      <Route 
        path="/meus-treinos" 
        element={
          <ProtectedRoute>
            <MeusTreinos />
          </ProtectedRoute>
        } 
      />
      
      {/* Rotas de convites e calendário */}
      <Route 
        path="/convites" 
        element={
          <ProtectedRoute>
            <Convites />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/calendario" 
        element={
          <ProtectedRoute>
            <Calendario />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/financeiro" 
        element={
          <ProtectedRoute>
            <Financeiro />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/bioimpedancia" 
        element={
          <ProtectedRoute>
            <Bioimpedancia />
          </ProtectedRoute>
        } 
      />

      
      {/* Redirect para login se rota não encontrada */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;