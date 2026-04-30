export const formatarData = (data: string) => {
  return new Date(data).toLocaleDateString('pt-BR');
};

export const formatarDataHora = (data: string) => {
  return new Date(data).toLocaleString('pt-BR');
};

export const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

export const getIndicadorTendencia = (diferenca: number, melhoriaPositiva: boolean = true) => {
  if (Math.abs(diferenca) < 0.1) return { icon: '→', color: 'text-gray-500', texto: 'Manteve' };
  const melhorou = melhoriaPositiva ? diferenca > 0 : diferenca < 0;
  return melhorou 
    ? { icon: '↑', color: 'text-green-600', texto: 'Melhorou' }
    : { icon: '↓', color: 'text-red-600', texto: 'Piorou' };
};

export const calcularIdade = (dataNascimento: string) => {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  
  return idade;
};