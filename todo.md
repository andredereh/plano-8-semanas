# Project TODO

## Funcionalidades implementadas
- [x] Dashboard estático com plano de 8 semanas programado
- [x] Checklist diário interativo
- [x] Rastreador de peso com gráfico
- [x] Navegação por abas (Hoje, Plano, Peso, Nutrição, Relatório)
- [x] Design dark mode mobile-first
- [x] Banner de boas-vindas com treino do dia
- [x] Modal de configuração de data de início
- [x] Aba de Nutrição com cadastro de alimentos e registro por refeição
- [x] Upgrade fullstack (web-db-user): banco MySQL, autenticação, servidor Express/tRPC
- [x] Card de resumo de nutrição no dashboard principal
- [x] Integração COROS via manus-mcp-cli (funciona apenas no sandbox Manus)
- [x] Semana 0 de pré-validação (29/07–02/08)
- [x] Card Último Treino com dados reais da COROS
- [x] Banco de alimentos com 27 itens importados
- [x] Relatório semanal com médias de sono, HRV, peso e aderência

## Migração para infraestrutura pessoal
- [x] Substituir autenticação OAuth Manus por login com senha simples
- [x] Criar endpoint POST /api/auth/login com verificação de ADMIN_PASSWORD
- [x] Criar tela de login (LoginPage.tsx) com design dark mode consistente
- [x] Atualizar useAuth para remover dependências do startLogin/OAuth
- [x] Atualizar main.tsx para remover redirecionamento automático para OAuth
- [x] Criar AuthGate no App.tsx para proteger todas as rotas
- [x] Configurar variável ADMIN_PASSWORD no ambiente de produção (Railway/Vercel) — feito via webdev_request_secrets
- [x] Migrar dados do banco para novo MySQL (Railway) — script SQL gerado e documentado no guia
- [x] Remover ou substituir bloco COROS — mantido como funcionalidade Manus-only, documentado no guia
