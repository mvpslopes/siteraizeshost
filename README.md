# 🌱 Raízes Eventos

Sistema completo de gestão de eventos agropecuários com painel administrativo e calculadora de viabilidade.

## 🚀 Funcionalidades

### 🌐 Site Público
- **Landing Page** com design moderno e responsivo
- **Seção de Eventos** com listagem e filtros
- **Galeria de Fotos** dos eventos realizados
- **Formulário de Contato** integrado
- **Design Responsivo** para todos os dispositivos

### 🔐 Painel Administrativo
- **Dashboard** com estatísticas em tempo real
- **Gestão de Eventos** (CRUD completo)
- **Calculadora de Viabilidade** com análise financeira
- **Sistema de Autenticação** com diferentes níveis de acesso
- **Interface Intuitiva** com navegação lateral

### 📊 Calculadora de Viabilidade
- **Seleção de Eventos** para análise
- **Gestão de Custos** por categoria
- **Gestão de Receitas** por categoria
- **Cálculo Automático** de totais e saldo final
- **Relatórios Financeiros** em tempo real

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework frontend
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **Lucide React** - Ícones
- **React Router** - Navegação
- **Context API** - Gerenciamento de estado

## 🎨 Design System

### Paleta de Cores
- **Primary (Verde Oliva)**: `#556038` - Cor principal da marca
- **Secondary (Laranja Terra)**: `#ee7a0a` - Destaques e ações
- **Accent (Azul Céu)**: `#0ea5e9` - Elementos informativos
- **Earth (Marrom Terra)**: `#44403c` - Textos e elementos neutros
- **Neutral (Cinza)**: `#737373` - Fundos e bordas

### Tipografia
- **Sans**: Inter, system-ui, sans-serif
- **Serif**: Georgia, serif

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/raizes-eventos.git

# Entre no diretório
cd raizes-eventos

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

### Scripts Disponíveis
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Linter
```

## 🔑 Credenciais de Acesso

### Usuários de Demonstração
- **Admin**: `admin@raizeseventos.com.br` / `admin123`
- **Colaborador**: `colaborador@raizeseventos.com.br` / `colaborador123`
- **Avaliador**: `avaliador@raizeseventos.com.br` / `avaliador123`

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── admin/          # Componentes do painel admin
│   ├── Header.tsx      # Cabeçalho do site
│   ├── Footer.tsx      # Rodapé do site
│   ├── Logo.tsx        # Componente do logo
│   └── ...
├── contexts/           # Contextos React
│   └── AuthContext.tsx # Contexto de autenticação
├── lib/                # Utilitários e configurações
│   ├── mockData.ts     # Dados mock para demonstração
│   └── supabase.ts     # Configuração do Supabase
├── assets/             # Recursos estáticos
│   ├── logos/          # Logos e imagens da marca
│   └── images/         # Imagens gerais
└── App.tsx             # Componente principal
```

## 🌐 Deploy

O projeto está configurado para deploy no **Vercel** com:
- Build automático a cada push
- Preview de branches
- Variáveis de ambiente configuradas
- Domínio personalizado (se configurado)

## 📝 Licença

Este projeto é propriedade da **Raízes Eventos** e está protegido por direitos autorais.

## 🤝 Contribuição

Para contribuir com o projeto:
1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Contato

- **Email**: contato@raizeseventos.com.br
- **Website**: [raizeseventos.com.br](https://raizeseventos.com.br)

---

Desenvolvido com ❤️ para o agronegócio brasileiro
