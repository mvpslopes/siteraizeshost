# 🔐 Credenciais de Acesso - Raízes Eventos

## 📋 Dados para Acesso ao Sistema

### 👤 Usuário Administrador
- **Email:** admin@raizeseventos.com.br
- **Senha:** admin123
- **Role:** admin
- **Permissões:** Acesso completo ao sistema

### 👤 Usuário Colaborador
- **Email:** colaborador@raizeseventos.com.br
- **Senha:** colaborador123
- **Role:** colaborador
- **Permissões:** Gerenciar eventos, visualizar avaliações

### 👤 Usuário Avaliador
- **Email:** avaliador@raizeseventos.com.br
- **Senha:** avaliador123
- **Role:** avaliador
- **Permissões:** Criar e gerenciar avaliações de viabilidade

## 🚀 Como Acessar

1. **Clique no botão "Acesso ao Sistema"** no header do site
2. **Digite o email e senha** de um dos usuários acima
3. **Clique em "Entrar"**
4. **Você será redirecionado** para o painel administrativo

## 🔧 Configuração do Banco de Dados

Para que o sistema funcione, você precisa:

1. **Configurar o Supabase:**
   - Criar um projeto no Supabase
   - Executar as migrações em `supabase/migrations/`
   - Configurar as variáveis de ambiente

2. **Variáveis de Ambiente (.env):**
   ```
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```

3. **Criar os usuários no Supabase Auth:**
   - Acesse o painel do Supabase
   - Vá em Authentication > Users
   - Crie os usuários com os emails acima
   - Crie os perfis na tabela `user_profiles`

## 📝 Notas Importantes

- ⚠️ **Estas são credenciais de desenvolvimento/teste**
- 🔒 **Altere as senhas em produção**
- 👥 **Crie usuários reais no Supabase Auth**
- 🛡️ **Configure RLS (Row Level Security) adequadamente**

## 🎯 Funcionalidades por Role

### Admin
- ✅ Gerenciar todos os eventos
- ✅ Visualizar todas as avaliações
- ✅ Gerenciar usuários
- ✅ Acessar mensagens de contato
- ✅ Gerenciar galeria

### Colaborador
- ✅ Criar e editar eventos
- ✅ Visualizar avaliações
- ✅ Adicionar mídia à galeria

### Avaliador
- ✅ Criar avaliações de viabilidade
- ✅ Visualizar eventos
- ✅ Editar próprias avaliações
