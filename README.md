# MottaFit - Sistema Completo de Gestão de Treinos e Academia

## 🏋️ Sobre o Projeto

Sistema completo para gestão de academia desenvolvido com .NET 8 Lambda API e React TypeScript. Oferece funcionalidades abrangentes para professores gerenciarem alunos, treinos, aulas, pagamentos e avaliações corporais.

## 🚀 Funcionalidades Principais

### 👨🏫 **Professor**
- ✅ **Autenticação**: Login seguro com JWT
- ✅ **Cadastro**: Auto-registro de professores
- ✅ **Gestão de Exercícios**: CRUD completo com 8 categorias
- ✅ **Criação de Treinos**: Treinos personalizados semanais
- ✅ **Gestão de Alunos**: Convites e gerenciamento
- ✅ **Calendário de Aulas**: Agendamento e controle de status
- ✅ **Controle Financeiro**: Pagamentos e relatórios
- ✅ **Bioimpedância**: Avaliações corporais científicas
- ✅ **Histórico de Cargas**: Acompanhamento de progressão

### 👨🎓 **Aluno**
- ✅ **Cadastro via Convite**: Registro através de link do professor
- ✅ **Login Seguro**: Autenticação com JWT
- ✅ **Treinos Personalizados**: Visualização de treinos semanais
- ✅ **Detalhes dos Exercícios**: Informações completas e vídeos
- ✅ **Histórico de Cargas**: Acompanhamento de evolução
- ✅ **Avaliações Corporais**: Visualização de bioimpedância

### 🏃♂️ **Exercícios**
- ✅ **8 Categorias**: Peito, Costas, Ombros, Bíceps, Tríceps, Pernas, Abdômen, Aeróbico
- ✅ **Informações Completas**: Nome, séries, repetições, carga, vídeo
- ✅ **CRUD Completo**: Apenas professores podem gerenciar

### 📋 **Treinos**
- ✅ **Treinos Semanais**: Organização por dias da semana
- ✅ **Exercícios Personalizados**: Parâmetros específicos por aluno
- ✅ **Histórico de Cargas**: Tracking automático de progressão
- ✅ **Observações**: Notas específicas por exercício

### 📅 **Sistema de Aulas**
- ✅ **Calendário Visual**: Interface intuitiva com múltiplas visualizações
- ✅ **Agendamento**: Criação de aulas individuais ou recorrentes
- ✅ **Status de Aulas**: Agendada, Realizada, Faltou, Remarcada
- ✅ **Remarcação**: Sistema de reagendamento com histórico
- ✅ **Mobile Responsivo**: Otimizado para dispositivos móveis

### 💰 **Controle Financeiro**
- ✅ **Valor por Aluno**: Configuração individual de preços
- ✅ **Cobrança Automática**: Baseada em aulas realizadas/faltou
- ✅ **Controle de Pagamentos**: Registro de recebimentos
- ✅ **Relatórios Mensais**: Análise financeira detalhada
- ✅ **Formas de Pagamento**: PIX, Dinheiro, Cartão

### 🔬 **Bioimpedância**
- ✅ **Cálculos Científicos**: Fórmulas Kyle et al. e Harris-Benedict
- ✅ **Composição Corporal**: IMC, % gordura, massa magra, TMB
- ✅ **Comparações**: Análise de evolução entre avaliações
- ✅ **Medidas Antropométricas**: Circunferências e dobras cutâneas
- ✅ **Relatórios Detalhados**: Visualização completa dos resultados

## 🛠️ Tecnologias

### **Backend**
- **.NET 8** - Framework principal
- **AWS Lambda** - Serverless computing
- **AWS DynamoDB** - Banco NoSQL
- **JWT Bearer** - Autenticação
- **BCrypt** - Hash de senhas

### **Frontend**
- **React 18** - Framework UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **Axios** - Cliente HTTP

### **Infraestrutura**
- **AWS API Gateway** - Gerenciamento de APIs
- **GitHub Actions** - CI/CD
- **AWS IAM** - Controle de acesso
- **Região SA-East-1** - São Paulo

## 📊 Estrutura do Banco (DynamoDB)

### Tabelas:
- **Professores** - Dados dos professores
- **Alunos** - Informações dos alunos
- **Convites** - Sistema de convites
- **Exercicios** - Catálogo de exercícios
- **Treinos** - Treinos personalizados
- **Aulas** - Agendamentos e status
- **Pagamentos** - Controle financeiro
- **Bioimpedancia** - Avaliações corporais
- **HistoricoCarga** - Progressão de cargas

## ⚙️ Configuração

### **AWS Credentials**
```json
{
  "AWS": {
    "Region": "sa-east-1",
    "AccessKey": "sua_access_key",
    "SecretKey": "sua_secret_key"
  }
}
```

### **JWT Configuration**
```json
{
  "Jwt": {
    "Key": "sua-chave-secreta-jwt-muito-segura-com-pelo-menos-32-caracteres",
    "Issuer": "MottaFit.Api",
    "Audience": "MottaFit.Client"
  }
}
```

## 🔗 Principais Endpoints

### **Autenticação**
- `POST /api/auth/login/professor` - Login professor
- `POST /api/auth/login/aluno` - Login aluno
- `POST /api/professor/cadastrar` - Cadastro professor

### **Exercícios**
- `GET /api/exercicio/listar` - Listar exercícios
- `POST /api/exercicio/criar` - Criar exercício
- `PUT /api/exercicio/atualizar/{id}` - Atualizar exercício

### **Treinos**
- `GET /api/treino` - Listar treinos
- `POST /api/treino` - Criar treino
- `PUT /api/treino/{id}/carga` - Atualizar cargas

### **Aulas**
- `GET /api/aula/listar` - Listar aulas
- `POST /api/aula/criar` - Criar aula
- `PUT /api/aula/status/{id}` - Atualizar status

### **Financeiro**
- `GET /api/aluno/relatorio-financeiro` - Relatório financeiro
- `POST /api/aluno/marcar-pagamento` - Marcar pagamento

### **Bioimpedância**
- `POST /api/bioimpedancia/criar` - Criar avaliação
- `GET /api/bioimpedancia/comparar/{alunoId}` - Comparar avaliações

## 📁 Arquitetura do Projeto

```
MottaFit/
├── MottaFit.Api/                    # Backend .NET 8 Lambda
│   ├── Controllers/                 # Controllers da API
│   ├── Services/                    # Camada de negócio
│   ├── Models/                      # Modelos de dados
│   ├── DTOs/                        # Data Transfer Objects
│   └── Helpers/                     # Utilitários
├── web/                             # Frontend React
│   ├── src/
│   │   ├── components/              # Componentes React
│   │   ├── pages/                   # Páginas da aplicação
│   │   ├── services/                # Serviços de API
│   │   ├── contexts/                # Contextos React
│   │   └── types/                   # Tipos TypeScript
│   └── public/                      # Arquivos estáticos
└── .github/workflows/               # CI/CD GitHub Actions
```

## 🎯 Fluxo de Uso Completo

### **Professor:**
1. **Cadastro/Login** → Acesso ao sistema
2. **Criação de Exercícios** → Monta catálogo personalizado
3. **Convite de Alunos** → Envia links de cadastro
4. **Criação de Treinos** → Treinos semanais personalizados
5. **Agendamento de Aulas** → Calendário de atendimentos
6. **Controle Financeiro** → Gestão de pagamentos
7. **Avaliações Corporais** → Bioimpedância científica

### **Aluno:**
1. **Cadastro via Convite** → Registro através do professor
2. **Login** → Acesso personalizado
3. **Visualização de Treinos** → Treinos semanais
4. **Acompanhamento** → Histórico de cargas e evolução
5. **Avaliações** → Visualização de bioimpedância

## 🔒 Segurança

- ✅ **Senhas Criptografadas**: BCrypt hash
- ✅ **JWT Tokens**: Expiração 24h
- ✅ **Autorização Role-Based**: Professor/Aluno
- ✅ **Validação de Propriedade**: Recursos por usuário
- ✅ **CORS Configurado**: Segurança de origem
- ✅ **HTTPS**: Comunicação segura

## 📱 Responsividade

- ✅ **Mobile First**: Design otimizado para celular
- ✅ **Touch Friendly**: Botões com tamanho adequado (44px+)
- ✅ **Calendário Mobile**: Visualização automática por dia
- ✅ **Formulários Adaptativos**: Inputs otimizados
- ✅ **Navegação Intuitiva**: UX simplificada

## 🚀 Deploy e CI/CD

- ✅ **GitHub Actions**: Deploy automático
- ✅ **AWS Lambda**: Serverless deployment
- ✅ **Ambiente de Produção**: sa-east-1 (São Paulo)
- ✅ **Rollback Automático**: Em caso de falhas

## 📈 Métricas e Análises

### **Cálculos Científicos:**
- **Bioimpedância**: Fórmulas Kyle et al.
- **TMB**: Harris-Benedict equation
- **Composição Corporal**: Análise completa
- **Progressão**: Tracking automático de cargas

### **Relatórios Financeiros:**
- **Receita Mensal**: Valores recebidos vs pendentes
- **Análise por Aluno**: Performance individual
- **Formas de Pagamento**: Distribuição de recebimentos

## 🔄 Próximas Funcionalidades

- 📊 **Dashboard Analytics**: Métricas avançadas
- 📱 **App Mobile Nativo**: iOS/Android
- 🔔 **Notificações Push**: Lembretes de aulas
- 📈 **Relatórios Avançados**: Análises preditivas
- 🎯 **Metas e Objetivos**: Sistema de gamificação

---

**MottaFit** - Sistema completo para gestão profissional de academias e personal trainers 💪🏋️‍♂️

**Versão**: 1.0.0 - Fase 1 Completa
**Região**: AWS SA-East-1 (São Paulo)
**Status**: Produção ✅