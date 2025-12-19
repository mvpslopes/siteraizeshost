# 🚀 Instruções para Configurar o Sistema Administrativo

## ⚠️ Problema Identificado
O sistema administrativo existe, mas precisa de usuários criados no Supabase para funcionar.

## 🔧 Solução: Criar Usuários no Supabase

### 1. Acesse o Painel do Supabase
- Vá para: https://supabase.com/dashboard
- Faça login na sua conta
- Acesse o projeto: `qoyiaikehrumqfnhmzmd`

### 2. Criar Usuários de Autenticação
Vá em **Authentication > Users** e clique em **"Add user"**:

#### 👤 Usuário Administrador
- **Email:** admin@raizeseventos.com.br
- **Password:** admin123
- **Auto Confirm User:** ✅ (marcado)

#### 👤 Usuário Colaborador  
- **Email:** colaborador@raizeseventos.com.br
- **Password:** colaborador123
- **Auto Confirm User:** ✅ (marcado)

#### 👤 Usuário Avaliador
- **Email:** avaliador@raizeseventos.com.br
- **Password:** avaliador123
- **Auto Confirm User:** ✅ (marcado)

### 3. Criar Perfis de Usuário
Após criar os usuários, vá em **Table Editor > user_profiles** e adicione os perfis:

#### Perfil do Administrador
```sql
INSERT INTO user_profiles (id, email, full_name, role) VALUES 
('ID_DO_USUARIO_ADMIN', 'admin@raizeseventos.com.br', 'Administrador', 'admin');
```

#### Perfil do Colaborador
```sql
INSERT INTO user_profiles (id, email, full_name, role) VALUES 
('ID_DO_USUARIO_COLABORADOR', 'colaborador@raizeseventos.com.br', 'Colaborador', 'colaborador');
```

#### Perfil do Avaliador
```sql
INSERT INTO user_profiles (id, email, full_name, role) VALUES 
('ID_DO_USUARIO_AVALIADOR', 'avaliador@raizeseventos.com.br', 'Avaliador', 'avaliador');
```

**⚠️ IMPORTANTE:** Substitua `ID_DO_USUARIO_*` pelos IDs reais dos usuários criados no passo 2.

### 4. Verificar se as Migrações Foram Executadas
Vá em **SQL Editor** e execute a migração:
```sql
-- Copie e cole todo o conteúdo do arquivo:
-- supabase/migrations/20251013004330_create_raizes_eventos_schema.sql
```

## 🎯 Como Testar

1. **Acesse:** http://localhost:5173
2. **Clique em:** "Acesso ao Sistema"
3. **Use qualquer credencial:**
   - admin@raizeseventos.com.br / admin123
   - colaborador@raizeseventos.com.br / colaborador123
   - avaliador@raizeseventos.com.br / avaliador123
4. **Você será redirecionado** para o painel administrativo

## 🛠️ Funcionalidades do Sistema

### Dashboard
- ✅ Visão geral dos eventos
- ✅ Estatísticas do sistema
- ✅ Gráficos de performance

### Gerenciar Eventos
- ✅ Criar novos eventos
- ✅ Editar eventos existentes
- ✅ Publicar/cancelar eventos
- ✅ Upload de imagens

### Avaliação de Viabilidade
- ✅ Criar avaliações de eventos
- ✅ Sistema de pontuação automática
- ✅ Relatórios de viabilidade

### Galeria
- ✅ Upload de fotos e vídeos
- ✅ Organização por eventos
- ✅ Gerenciamento de mídia

## 🔒 Segurança
- ✅ Row Level Security (RLS) ativado
- ✅ Controle de permissões por role
- ✅ Autenticação via Supabase Auth

## 📞 Suporte
Se encontrar problemas:
1. Verifique se os usuários foram criados corretamente
2. Confirme se os perfis foram inseridos na tabela `user_profiles`
3. Verifique se as migrações foram executadas
4. Teste o login com as credenciais fornecidas
