import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, List, Grid } from 'lucide-react';

interface Aula {
  id: string;
  professorId: string;
  alunoId: string;
  dataHora: string;
  titulo: string;
  observacoes?: string;
  status: 'Agendada' | 'Realizada' | 'Remarcada' | 'Faltou';
  isAulaOriginal?: boolean;
  dataCriacao: string;
}

interface CalendarioViewProps {
  aulas: Aula[];
  onAulaClick: (aula: Aula) => void;
  getNomeAluno: (alunoId: string) => string;
}

type ViewMode = 'month' | 'week' | 'day';

const CalendarioView: React.FC<CalendarioViewProps> = ({ aulas, onAulaClick, getNomeAluno }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    // Detectar se é mobile e iniciar com visualização diária
    return window.innerWidth < 768 ? 'day' : 'month';
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Realizada': return 'bg-green-500';
      case 'Remarcada': return 'bg-blue-500';
      case 'Faltou': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (viewMode) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setCurrentDate(newDate);
  };

  const getDateTitle = () => {
    switch (viewMode) {
      case 'month':
        return currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      case 'week':
        const startWeek = new Date(currentDate);
        startWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endWeek = new Date(startWeek);
        endWeek.setDate(startWeek.getDate() + 6);
        return `${startWeek.toLocaleDateString('pt-BR')} - ${endWeek.toLocaleDateString('pt-BR')}`;
      case 'day':
        return currentDate.toLocaleDateString('pt-BR', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        });
    }
  };

  const renderMonthView = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDateObj = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dayAulas = aulas.filter(aula => {
        const aulaDate = new Date(aula.dataHora);
        return aulaDate.toDateString() === currentDateObj.toDateString();
      });
      
      days.push(
        <div
          key={i}
          className={`min-h-16 sm:min-h-24 p-1 sm:p-2 border border-gray-200 ${
            currentDateObj.getMonth() !== currentDate.getMonth() 
              ? 'bg-gray-50 text-gray-400' 
              : 'bg-white'
          }`}
        >
          <div className="font-medium text-xs sm:text-sm mb-1">{currentDateObj.getDate()}</div>
          <div className="space-y-1">
            {dayAulas.slice(0, isMobile ? 1 : 3).map(aula => (
              <div
                key={aula.id}
                onClick={() => onAulaClick(aula)}
                className={`text-xs p-1 rounded cursor-pointer text-white ${getStatusColor(aula.status)}`}
              >
                <div className={`truncate ${
                  aula.status === 'Remarcada' 
                    ? 'line-through opacity-75' 
                    : ''
                }`}>
                  <span className="hidden sm:inline">{formatTime(aula.dataHora)} - </span>{getNomeAluno(aula.alunoId)}
                </div>
              </div>
            ))}
            {dayAulas.length > (isMobile ? 1 : 3) && (
              <div className="text-xs text-gray-500">+{dayAulas.length - (isMobile ? 1 : 3)}</div>
            )}
          </div>
        </div>
      );
      
      currentDateObj.setDate(currentDateObj.getDate() + 1);
    }
    
    return (
      <div className="grid grid-cols-7 gap-0 border border-gray-200">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="p-3 bg-gray-100 font-medium text-center text-sm">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const renderWeekView = () => {
    const startWeek = new Date(currentDate);
    startWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startWeek);
      day.setDate(startWeek.getDate() + i);
      
      const dayAulas = aulas.filter(aula => {
        const aulaDate = new Date(aula.dataHora);
        return aulaDate.toDateString() === day.toDateString();
      }).sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
      
      days.push(
        <div key={i} className="border-r border-gray-200 last:border-r-0">
          <div className="p-3 bg-gray-50 font-medium text-center">
            <div className="text-sm">{day.toLocaleDateString('pt-BR', { weekday: 'short' })}</div>
            <div className="text-lg">{day.getDate()}</div>
          </div>
          <div className="p-2 space-y-2 min-h-96">
            {dayAulas.map(aula => (
              <div
                key={aula.id}
                onClick={() => onAulaClick(aula)}
                className={`p-2 rounded cursor-pointer text-white text-sm ${getStatusColor(aula.status)}`}
              >
                <div className="font-medium">{formatTime(aula.dataHora)}</div>
                <div className={`truncate ${
                  aula.status === 'Remarcada' 
                    ? 'line-through opacity-75' 
                    : ''
                }`}>
                  {getNomeAluno(aula.alunoId)}
                </div>

              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-7 border border-gray-200">
        {days}
      </div>
    );
  };

  const renderDayView = () => {
    const dayAulas = aulas.filter(aula => {
      const aulaDate = new Date(aula.dataHora);
      return aulaDate.toDateString() === currentDate.toDateString();
    }).sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
    
    return (
      <div className="space-y-3">
        {dayAulas.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhuma aula agendada para este dia
          </div>
        ) : (
          dayAulas.map(aula => (
            <div
              key={aula.id}
              onClick={() => onAulaClick(aula)}
              className={`p-4 rounded-lg cursor-pointer text-white ${getStatusColor(aula.status)}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className={`font-medium text-lg ${
                    aula.status === 'Remarcada' 
                      ? 'line-through opacity-75' 
                      : ''
                  }`}>
                    {getNomeAluno(aula.alunoId)}
                  </div>

                </div>
                <div className="text-right">
                  <div className="font-medium">{formatTime(aula.dataHora)}</div>
                  <div className="text-xs opacity-90">{aula.status}</div>
                </div>
              </div>
              {aula.observacoes && (
                <div className="text-sm opacity-90">{aula.observacoes}</div>
              )}
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header com controles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 hover:bg-gray-100 rounded flex-shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <h2 className="text-lg sm:text-xl font-semibold capitalize flex-1 text-center sm:text-left">{getDateTitle()}</h2>
          
          <button
            onClick={() => navigateDate('next')}
            className="p-2 hover:bg-gray-100 rounded flex-shrink-0"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex justify-between w-full sm:w-auto gap-2">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="btn-secondary text-sm flex-1 sm:flex-none"
          >
            Hoje
          </button>
          
          <div className="flex space-x-1 sm:space-x-2">
            <button
              onClick={() => setViewMode('month')}
              className={`p-2 rounded text-xs sm:text-sm ${viewMode === 'month' ? 'bg-primary-600 text-white' : 'hover:bg-gray-100'}`}
              title="Mensal"
            >
              <Calendar className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`p-2 rounded text-xs sm:text-sm ${viewMode === 'week' ? 'bg-primary-600 text-white' : 'hover:bg-gray-100'}`}
              title="Semanal"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`p-2 rounded text-xs sm:text-sm ${viewMode === 'day' ? 'bg-primary-600 text-white' : 'hover:bg-gray-100'}`}
              title="Diário"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Legenda de status */}
      <div className="grid grid-cols-2 sm:flex sm:space-x-4 gap-2 sm:gap-0 text-xs sm:text-sm">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-gray-500 rounded flex-shrink-0"></div>
          <span>Agendada</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded flex-shrink-0"></div>
          <span>Realizada</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-500 rounded flex-shrink-0"></div>
          <span>Remarcada</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded flex-shrink-0"></div>
          <span>Faltou</span>
        </div>
      </div>
      
      {/* Conteúdo do calendário */}
      <div className="bg-white rounded-lg border">
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'day' && renderDayView()}
      </div>
    </div>
  );
};

export default CalendarioView;