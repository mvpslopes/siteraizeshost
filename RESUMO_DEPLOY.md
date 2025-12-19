# 📋 Resumo Rápido - Deploy Hostinger

## ⚡ Passos Rápidos

### 1. Preparar Build
```bash
npm install
npm run build
```

### 2. Configurar Credenciais

**Opção A - Arquivo config.js (Recomendado para Hostinger):**
1. Copie `public/config.js.example` para `public/config.js`
2. Preencha com suas credenciais do Supabase
3. O arquivo será incluído automaticamente no build

**Opção B - Variáveis de ambiente:**
1. Crie arquivo `.env` na raiz
2. Adicione:
   ```
   VITE_SUPABASE_URL=sua_url
   VITE_SUPABASE_ANON_KEY=sua_chave
   ```

### 3. Fazer Upload

1. Acesse o **hPanel** da Hostinger
2. Vá em **File Manager** → `public_html`
3. Faça upload de **TODOS** os arquivos da pasta `dist`
4. Certifique-se de que `.htaccess` está incluído

### 4. Verificar

- Acesse seu domínio
- Teste a navegação
- Verifique o console do navegador (F12) para erros

## 📁 Arquivos Importantes

- ✅ `.htaccess` - Configuração do servidor (já incluído)
- ✅ `dist/` - Arquivos de produção (gerados pelo build)
- ✅ `public/config.js` - Credenciais (criar manualmente)

## ⚠️ Importante

- **NUNCA** commite `config.js` ou `.env` com credenciais reais
- Sempre teste localmente antes de fazer upload
- Mantenha backup dos arquivos antes de atualizar

## 📖 Documentação Completa

Veja `DEPLOY_HOSTINGER.md` para instruções detalhadas.


