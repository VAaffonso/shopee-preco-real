# 🛍️ Shopee Preço Real

Extensão para o Google Chrome que monitora automaticamente o histórico de preços de produtos da Shopee. Toda vez que você visita um produto, o preço é registrado. Com o tempo, você consegue ver se o preço subiu, baixou ou está estável.

---

## ✨ Funcionalidades

- 📊 Registra automaticamente o preço ao visitar páginas de produto na Shopee
- 📉 Exibe painel com menor preço, maior preço e histórico completo diretamente na página
- 🔔 Suporte a notificações do sistema operacional
- 🗂️ Popup com resumo de todos os produtos monitorados
- 🟢🔴 Badge de tendência: Baixou / Subiu / Estável
- 🗑️ Remoção individual de produtos do histórico
- ☁️ Dados armazenados em nuvem (backend no Render + PostgreSQL)

---

## 🏗️ Arquitetura

```
[Chrome + Extensão]  ←→  [Backend Java/Spring Boot no Render]  ←→  [PostgreSQL]
```

O projeto é dividido em duas partes:

- **`extensao/`** — extensão do Chrome (HTML, CSS, JavaScript)
- **`src/`** — backend REST em Java com Spring Boot

---

## 🚀 Backend

### Tecnologias

- Java 17
- Spring Boot 3.5
- Spring Data JPA
- PostgreSQL (produção) / H2 (desenvolvimento)
- Docker

### Endpoints da API

| Método   | Rota              | Descrição                                      |
|----------|-------------------|------------------------------------------------|
| `POST`   | `/precos`         | Salva o preço de um produto (sem duplicatas por dia) |
| `GET`    | `/precos?url=...` | Retorna o histórico de um produto              |
| `GET`    | `/precos/todos`   | Retorna todos os registros                     |
| `GET`    | `/precos/resumo`  | Resumo com menor, maior preço e tendência      |
| `DELETE` | `/precos?url=...` | Remove todos os registros de um produto        |

### Rodando localmente

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/ShopeeHistorico.git
cd ShopeeHistorico

# Execute com Maven (usa banco H2 em memória por padrão)
./mvnw spring-boot:run
```

O servidor sobe em `http://localhost:8080`.

O console do banco H2 fica disponível em `http://localhost:8080/h2-console`.

### Rodando com Docker

```bash
docker build -t shopee-historico .
docker run -p 8080:8080 shopee-historico
```

### Deploy no Render

O projeto está configurado para deploy automático no [Render](https://render.com) via `Dockerfile`.

Variáveis de ambiente necessárias no Render:

| Variável       | Descrição                              |
|----------------|----------------------------------------|
| `DATABASE_URL` | URL de conexão do PostgreSQL           |
| `DB_USER`      | Usuário do banco de dados              |
| `DB_PASSWORD`  | Senha do banco de dados                |

Para ativar o perfil de produção, defina também:

```
SPRING_PROFILES_ACTIVE=prod
```

---

## 🔌 Extensão do Chrome

### Instalando (modo desenvolvedor)

1. Abra o Chrome e acesse `chrome://extensions`
2. Ative o **Modo do desenvolvedor** (canto superior direito)
3. Clique em **"Carregar sem compactação"**
4. Selecione a pasta `extensao/` do projeto

### Como usar

1. Acesse qualquer página de produto na Shopee (`shopee.com.br`)
2. A extensão detecta o preço automaticamente e salva no servidor
3. Um painel flutuante aparece na página com o histórico de preços
4. Clique no ícone da extensão na barra do Chrome para ver todos os produtos monitorados

### Arquivos da extensão

| Arquivo          | Função                                                                 |
|------------------|------------------------------------------------------------------------|
| `manifest.json`  | Configuração da extensão (permissões, scripts, URLs autorizadas)       |
| `content.js`     | Detecta o preço na página e exibe o painel flutuante                  |
| `popup.html/js`  | Interface do popup com resumo de todos os produtos                     |
| `background.js`  | Serviço em segundo plano para envio de notificações                    |
| `style.css`      | Estilos do painel flutuante exibido nas páginas da Shopee              |

---

## 📁 Estrutura do Projeto

```
ShopeeHistorico/
├── extensao/
│   ├── manifest.json
│   ├── content.js
│   ├── popup.html
│   ├── popup.js
│   ├── background.js
│   └── style.css
├── src/
│   └── main/java/br/com/vic/ShopeeHistorico/
│       ├── ShopeeHistoricoApplication.java
│       ├── config/CorsConfig.java
│       ├── controller/PrecoController.java
│       ├── model/Preco.java
│       └── repository/PrecoRepository.java
├── src/main/resources/
│   ├── application.properties
│   └── application-prod.properties
├── Dockerfile
└── pom.xml
```

---

![Demo](demo.gif)

## 🌐 Backend em produção

O backend está hospedado em:

```
https://shopee-preco-real.onrender.com
```

> ⚠️ O Render pode hibernar serviços gratuitos após inatividade. A primeira requisição pode demorar alguns segundos para acordar o servidor.

---

## 📄 Licença

Este projeto foi desenvolvido para uso pessoal. Sinta-se livre para usar e modificar.
