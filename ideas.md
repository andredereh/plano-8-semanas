# Ideas — Plano 8 Semanas Dashboard

## Abordagens Consideradas

**Abordagem A — Athletic Dark Pro** (prob: 0.07)
Dashboard dark mode inspirado em apps de elite como Whoop e Garmin Connect. Fundo quase preto, acentos em azul elétrico e verde neon. Sensação de performance e monitoramento profissional.

**Abordagem B — Clean Health Minimal** (prob: 0.02)
Interface branca e clean, tipografia grande, muita respiração. Inspirado no Apple Health. Elegante mas pode parecer frio demais para uso diário motivacional.

**Abordagem C — Warm Coach** (prob: 0.01)
Paleta quente (terracota, areia, verde musgo), sensação de diário pessoal e acompanhamento humano. Menos "tech", mais "jornada".

---

## Abordagem Escolhida: Athletic Dark Pro

### Design Movement
Sports Performance Dashboard — referência: Whoop App + Garmin Connect + Nike Training Club

### Core Principles
1. Dados em primeiro lugar — cada pixel serve a uma informação
2. Hierarquia clara — o treino do dia domina a tela, o resto é contexto
3. Feedback imediato — cada ação (marcar checklist, registrar peso) tem resposta visual
4. Mobile-first — 80% do uso será pelo celular às 5h30 da manhã

### Color Philosophy
Fundo escuro profundo (slate-900) para reduzir fadiga visual matinal. Azul elétrico (blue-500) como cor primária de ação. Verde esmeralda para conquistas e metas atingidas. Âmbar para alertas e atenção. A escuridão não é estética — é funcional para uso em baixa luminosidade.

### Signature Brand Color
Azul elétrico: oklch(0.623 0.214 259.815) — #3b82f6

### Layout Paradigm
Mobile-first card stack. Header fixo com contexto do dia. Cards empilhados com hierarquia visual clara. Sem sidebar — navegação por tabs na base (mobile) ou topo (desktop).

### Signature Elements
1. Barra de RPE colorida (verde→vermelho) como indicador visual de intensidade
2. Calendário semanal compacto com status por cor
3. Métricas COROS em grid 3×2 com badges de status

### Typography System
- Display: Inter 800 para números grandes (peso, tempo)
- Labels: Inter 500 uppercase tracking-wide para títulos de seção
- Body: Inter 400 para descrições e listas de exercícios

### Brand Essence
Seu coach digital pessoal — para o atleta que voltou e não quer errar o caminho de novo.
Personalidade: Direto, motivador, preciso.

### Brand Voice
Headlines: "Hoje é dia de Força A. Você consegue." / "Semana 3 de 8. Você está no caminho."
Microcopy: Sem "Welcome back" genérico. Sempre contextual ao dia e ao progresso.

## Style Decisions
- Usar dark theme como padrão absoluto (não switchable)
- Números grandes em destaque com fonte bold para leitura rápida
- Cards com border sutil (1px oklch(1 0 0 / 10%)) e fundo ligeiramente mais claro que o bg
- Animações de checklist com micro-bounce ao marcar item
