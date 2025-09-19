# 📊 Log Viewer - Sistema de Monitoramento

Sistema moderno para monitoramento e visualização de logs em tempo real.

## 🚀 Como Usar

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar o sistema
npm run dev
```

Acesse: `http://localhost:5173`

## 🔑 Login

**Credenciais:**
- Usuário: `admin`
- Senha: `admin`

## 📱 Funcionalidades

### Tela Principal
- Lista de serviços monitorados
- Status em tempo real
- Botões: Configurações, Atualizar, Sair

### Visualização de Logs
- Filtros por nível (Debug, Info, Warning, Error)
- Busca em tempo real
- Dashboard com métricas
- Relatórios detalhados

### Configurações
- Controle de sincronização
- Intervalo de atualização
- Configuração de API Key

## 🎯 Recursos

- ✅ Interface moderna e responsiva
- ✅ Autenticação segura
- ✅ Tema escuro/claro
- ✅ Dashboard interativo
- ✅ Filtros avançados
- ✅ Métricas em tempo real
- ✅ Configurações personalizadas

## 📦 Scripts

```bash
npm run dev     # Servidor de desenvolvimento
npm run build   # Build para produção
npm run preview # Preview do build
```

## 🔧 Solução de Problemas

### Erro: "@vitejs/plugin-react can't detect preamble"
**Causa:** Falta da importação do React nos componentes.

**Solução:**
```javascript
// Adicione esta linha no início dos arquivos .jsx
import React from 'react';
```

### Erro: "Unexpected token 'd', 'dark' is not valid JSON"
**Causa:** Dados corrompidos no localStorage do navegador.

**Soluções:**

1. **Pelo Console do Navegador:**
   - Abra F12 > Console
   - Digite: `localStorage.clear()`
   - Pressione Enter e recarregue a página

2. **Pelo Código (já implementado):**
   ```javascript
   const [isDark, setIsDark] = useState(() => {
     try {
       const saved = localStorage.getItem('theme');
       return saved ? JSON.parse(saved) : true;
     } catch (error) {
       localStorage.removeItem('theme');
       return true;
     }
   });
   ```

### Tela Branca no Navegador
**Causas possíveis:**
- Erros de JavaScript (verifique F12 > Console)
- Problemas de build
- Cache do navegador

**Soluções:**
```bash
# Limpar cache e reinstalar
npm cache clean --force
Remove-Item -Recurse -Force node_modules  # Windows
# ou
rm -rf node_modules  # Linux/Mac
npm install
npm run dev
```

### Warning: "MODULE_TYPELESS_PACKAGE_JSON"
**Causa:** Configuração de módulo não especificada.

**Solução (opcional):**
Adicione no `package.json`:
```json
{
  "name": "log-viewer",
  "type": "module",
  ...
}
```

### Servidor não inicia
**Verificações:**
1. Node.js instalado (versão 16+)
2. Dependências instaladas: `npm install`
3. Porta 5173 disponível
4. Permissões de firewall

**Comandos úteis:**
```bash
# Verificar versão do Node
node --version

# Reinstalar dependências
npm install

# Iniciar em porta diferente
npm run dev -- --port 3000

# Build para produção
npm run build
npm run preview
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.