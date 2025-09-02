# 📊 Log Viewer - Sistema de Envio e Monitoramento de Logs

Um sistema moderno e elegante para envio automático de logs e monitoramento em tempo real, desenvolvido com React e integração com backend Python.

## 🚀 Como Iniciar

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### 1. Instalação do Frontend

```bash
# Clone o repositório
git clone <seu-repositorio>
cd log-viewer

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

### 2. Executar com Electron (Opcional)

```bash
# Para rodar como aplicação desktop
npm run electron-dev
```

## 🔧 Instalação do Backend

### Estrutura Necessária

Crie um servidor backend que forneça os seguintes endpoints:

#### Endpoints Obrigatórios:

**1. Listar Serviços**
```
GET /api/services
```
Resposta esperada:
```json
[
  {
    "id": 1,
    "name": "API Gateway",
    "host": "localhost",
    "port": 3001,
    "status": "online"
  }
]
```

**2. Stream de Logs**
```
GET /api/logs/{serviceId}/stream
```
Resposta esperada (Server-Sent Events):
```json
{
  "level": "INFO",
  "timestamp": "2024-01-15 10:30:15",
  "message": "Aplicação iniciada com sucesso"
}
```

### Backend Completo (Python + FastAPI + SQLAlchemy)

```python
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import json
import asyncio
from datetime import datetime
from typing import List
from models import Service, Log, SessionLocal, engine

app = FastAPI(title="Log Viewer API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/services")
async def get_services(db: Session = Depends(get_db)):
    services = db.query(Service).all()
    return [{
        "id": s.id,
        "name": s.name,
        "host": s.host,
        "port": s.port,
        "status": s.status
    } for s in services]

@app.get("/api/logs/{service_id}/stream")
async def stream_logs(service_id: int, db: Session = Depends(get_db)):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    async def generate_logs():
        while True:
            # Buscar logs reais do banco
            logs = db.query(Log).filter(
                Log.service_id == service_id
            ).order_by(Log.timestamp.desc()).limit(10).all()
            
            for log in reversed(logs):
                log_entry = {
                    "level": log.level,
                    "timestamp": log.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                    "message": log.message
                }
                yield f"data: {json.dumps(log_entry)}\n\n"
            
            await asyncio.sleep(2)
    
    return StreamingResponse(
        generate_logs(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )

@app.post("/api/logs")
async def create_log(service_id: int, level: str, message: str, db: Session = Depends(get_db)):
    log = Log(service_id=service_id, level=level, message=message)
    db.add(log)
    db.commit()
    return {"message": "Log created successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001, reload=True)
```

### Instalação do Backend Python

```bash
# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Instalar dependências
pip install fastapi uvicorn sqlalchemy

# Para PostgreSQL (opcional)
pip install psycopg2-binary

# Executar o servidor
python main.py

# Ou usando uvicorn diretamente
uvicorn main:app --host 0.0.0.0 --port 3001 --reload
```

### Estrutura de Arquivos Python

```
backend/
├── main.py          # API principal
├── models.py        # Modelos SQLAlchemy
├── requirements.txt # Dependências
└── logs.db         # Banco SQLite (criado automaticamente)
```

### requirements.txt

```
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
```
```

## 📱 Como o Sistema Funciona

### Arquitetura de Envio de Logs

O sistema funciona enviando logs automaticamente para o backend:

1. **Aplicação Web** - Interface para monitoramento
2. **Autenticação** - Login obrigatório (admin/admin)
3. **Envio Automático** - Logs de ações, erros e eventos
4. **Backend Python** - Recebe e processa os logs

### Fluxo de Uso

#### 1. Tela Principal
- Lista todos os serviços monitorados
- Mostra status (online/offline) em tempo real
- Contador de serviços ativos
- Botão para atualizar lista

#### 2. Visualização de Logs
- **Filtros por nível**: Debug, Info, Warning, Error
- **Busca em tempo real** nos logs
- **Auto-scroll** configurável
- **Dashboard com métricas** em tempo real
- **Relatórios** com estatísticas

#### 3. Funcionalidades

**🎨 Temas**
- Modo claro/escuro
- Persistência da preferência
- Botão de alternância (☀️/🌙)

**📊 Dashboard**
- Contadores por nível de log
- Gráficos de barras
- Percentuais em tempo real
- Taxa de sucesso/erro

**🔍 Filtros e Busca**
- Filtro por nível (tabs interativas)
- Busca textual nos logs
- Highlight dos termos encontrados

## 🗄️ Banco de Dados

### Estrutura com SQLAlchemy (Python)

```python
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Service(Base):
    __tablename__ = "services"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    host = Column(String(255), nullable=False)
    port = Column(Integer, nullable=False)
    status = Column(String(50), default="offline")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    logs = relationship("Log", back_populates="service")

class Log(Base):
    __tablename__ = "logs"
    
    id = Column(Integer, primary_key=True, index=True)
    service_id = Column(Integer, ForeignKey("services.id"), index=True)
    level = Column(String(10), nullable=False, index=True)
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    
    service = relationship("Service", back_populates="logs")
```

### Configuração do Banco

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# SQLite para desenvolvimento
DATABASE_URL = "sqlite:///./logs.db"

# PostgreSQL para produção
# DATABASE_URL = "postgresql://user:password@localhost/logviewer"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Criar tabelas
Base.metadata.create_all(bind=engine)
```

## 🔧 Configuração

### Alterar Endpoint da API

Edite o arquivo `src/services/api.js`:

```javascript
// Altere esta URL para seu backend
const API_BASE = 'http://localhost:3001/api'
```

### Personalizar Logo

1. Coloque sua logo na pasta `public/`
2. Renomeie para `logo-integra.png`
3. Ou edite o caminho em `ServiceListPage.jsx`

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor Vite
npm run electron-dev # Inicia com Electron

# Produção
npm run build        # Build para produção
npm run preview      # Preview do build
```

## 🎯 Recursos

- ✅ **Autenticação obrigatória** - Login seguro
- ✅ **Envio automático de logs** - Ações, erros, eventos
- ✅ **Interface moderna** - Design responsivo e elegante
- ✅ **Tema escuro padrão** - Alternância claro/escuro
- ✅ **Configurações avançadas** - Sincronização e API Key
- ✅ **Dashboard interativo** - Métricas em tempo real
- ✅ **Filtros inteligentes** - Por nível e busca textual
- ✅ **Interceptação global** - Captura automática de erros
- ✅ **Logs estruturados** - Com metadados e contexto
- ✅ **Preparado para produção** - Backend Python FastAPI

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