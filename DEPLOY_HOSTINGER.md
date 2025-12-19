# 🚀 Guia de Deploy - Hostinger

Este guia irá te ajudar a fazer o deploy do site Raízes Eventos na Hostinger.

## 📋 Pré-requisitos

1. Conta na Hostinger com acesso ao painel hPanel
2. Node.js instalado localmente (versão 18 ou superior)
3. Acesso FTP ou File Manager no painel da Hostinger
4. Credenciais do Supabase (URL e Chave Anônima)

## 🔧 Passo 1: Preparar o Build Local

### 1.1 Instalar Dependências
```bash
npm install
```

### 1.2 Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

**⚠️ IMPORTANTE:** Não commite o arquivo `.env` no Git! Ele contém informações sensíveis.

### 1.3 Gerar o Build de Produção

Execute o comando para gerar os arquivos otimizados:

```bash
npm run build
```

Este comando irá criar uma pasta `dist` com todos os arquivos prontos para produção.

## 📤 Passo 2: Fazer Upload para Hostinger

### Opção A: Via File Manager (Recomendado)

1. Acesse o **hPanel** da Hostinger
2. Vá em **File Manager**
3. Navegue até a pasta `public_html` (ou a pasta do seu domínio)
4. **IMPORTANTE:** Se já houver arquivos, faça backup antes de continuar
5. Faça upload de **todos os arquivos** da pasta `dist`:
   - Selecione todos os arquivos da pasta `dist`
   - Faça upload para `public_html`
   - Certifique-se de que o arquivo `index.html` está na raiz de `public_html`

### Opção B: Via FTP

1. Use um cliente FTP (FileZilla, WinSCP, etc.)
2. Conecte-se ao servidor usando as credenciais FTP fornecidas pela Hostinger
3. Navegue até `public_html`
4. Faça upload de todos os arquivos da pasta `dist`

### Opção C: Via Git (Se configurado)

Se você configurou Git na Hostinger:

1. Faça commit e push das alterações
2. No servidor, execute:
   ```bash
   git pull
   npm install
   npm run build
   ```
3. Copie os arquivos de `dist` para `public_html`

## ⚙️ Passo 3: Configurar o Servidor

### 3.1 Verificar o arquivo .htaccess

O arquivo `.htaccess` já está incluído no projeto e será copiado junto com os outros arquivos. Ele é essencial para:

- Roteamento correto do React Router
- Compressão GZIP
- Cache de arquivos estáticos
- Segurança básica

**Certifique-se de que o arquivo `.htaccess` está na raiz de `public_html`**

### 3.2 Configurar Variáveis de Ambiente no Servidor

Como a Hostinger não suporta variáveis de ambiente diretamente para aplicações estáticas, você tem duas opções:

#### Opção 1: Inserir diretamente no código (NÃO RECOMENDADO para produção)

Edite o arquivo `dist/index.html` ou os arquivos JavaScript gerados e substitua as variáveis.

#### Opção 2: Usar arquivo de configuração (RECOMENDADO)

1. Crie um arquivo `config.js` na pasta `public` do projeto:

```javascript
// public/config.js
window.APP_CONFIG = {
  VITE_SUPABASE_URL: 'sua_url_do_supabase',
  VITE_SUPABASE_ANON_KEY: 'sua_chave_anonima_do_supabase'
};
```

2. Adicione no `index.html` antes do fechamento do `</head>`:

```html
<script src="/config.js"></script>
```

3. Modifique `src/lib/supabase.ts` para usar a configuração:

```typescript
const supabaseUrl = window.APP_CONFIG?.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = window.APP_CONFIG?.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
```

4. Refaça o build e faça upload novamente.

## ✅ Passo 4: Verificar o Deploy

1. Acesse seu domínio no navegador
2. Verifique se o site carrega corretamente
3. Teste a navegação entre páginas
4. Verifique se o painel administrativo funciona
5. Teste a conexão com o Supabase

## 🔍 Troubleshooting

### Problema: Página em branco
- **Solução:** Verifique se o arquivo `index.html` está na raiz de `public_html`
- Verifique o console do navegador para erros JavaScript

### Problema: Erro 404 ao navegar entre páginas
- **Solução:** Certifique-se de que o arquivo `.htaccess` está presente e configurado corretamente
- Verifique se o módulo `mod_rewrite` está habilitado no servidor (contate o suporte da Hostinger se necessário)

### Problema: Erro de conexão com Supabase
- **Solução:** Verifique se as variáveis de ambiente estão configuradas corretamente
- Verifique se a URL do Supabase está correta e acessível
- Verifique as configurações de CORS no Supabase

### Problema: Arquivos CSS/JS não carregam
- **Solução:** Verifique os caminhos dos arquivos no `index.html`
- Certifique-se de que todos os arquivos da pasta `dist` foram enviados
- Limpe o cache do navegador (Ctrl+F5)

### Problema: Site muito lento
- **Solução:** Verifique se a compressão GZIP está funcionando
- Verifique se o cache está configurado corretamente no `.htaccess`
- Considere usar um CDN para arquivos estáticos

## 🔄 Atualizações Futuras

Para atualizar o site:

1. Faça as alterações no código local
2. Execute `npm run build` novamente
3. Faça upload dos novos arquivos da pasta `dist`, substituindo os antigos
4. Limpe o cache do navegador para ver as mudanças

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs de erro no console do navegador (F12)
2. Verifique os logs do servidor no hPanel
3. Entre em contato com o suporte da Hostinger se o problema for relacionado ao servidor
4. Verifique a documentação do Supabase se o problema for relacionado ao backend

## 🔐 Segurança

- **NUNCA** commite arquivos `.env` no Git
- Use variáveis de ambiente ou arquivos de configuração seguros
- Mantenha as dependências atualizadas
- Configure HTTPS no domínio (geralmente já vem configurado na Hostinger)

---

**Boa sorte com o deploy! 🚀**


