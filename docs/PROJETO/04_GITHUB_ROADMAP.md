# RO3 — GitHub, upstream e roadmap

**Decisão registrada:** 22/10/2026. Este documento descreve a intenção do projeto e não comprova execução.

## Finalidade do GitHub

Manter código e documentação auditáveis e acessíveis neste chat, com histórico de cada alteração. O código de origem é [`aethai/ro3emu-server`](https://github.com/aethai/ro3emu-server), projeto C# / .NET 10. **Não misturar** o código do emulador com os 22,6 GB do cliente Ragnarok 3.

## Estrutura remota planejada

- **Conta:** `riquepaschoalleto` (integração GitHub consultada).
- **Fork confirmado:** [`riquepaschoalleto/ro3emu-server`](https://github.com/riquepaschoalleto/ro3emu-server), originado de `aethai/ro3emu-server`.
- **`main`:** acompanhar o código original, evitando mudanças próprias nessa branch.
- **`dev/ro3-stabilization`:** documentação de projeto e eventuais correções testadas.
- **`docs/PROJETO/`:** os cinco arquivos `00_START_HERE.md` a `04_GITHUB_ROADMAP.md`.
- **Estado do repositório:** fork confirmado, com documentação publicada na branch `dev/ro3-stabilization`.

## Fluxo de atualização do desenvolvedor original

1. Verificar commits, PRs e releases novos do upstream. Escolher um SHA explícito como base; anotar o motivo da atualização.
2. Preservar a versão funcional do usuário. Atualizar **apenas** o código e o ambiente de teste, sem copiar sobre `D:\PROJETOS\RO3\RO3Emu` ou `D:\PROJETOS\RO3\ROO_PC`.
3. Compilar com a toolchain indicada pelo upstream (no registro atual: .NET 10 SDK; `global.json` versão 10.0.402, `latestPatch`). Registrar resultado exato de build.
4. Testar no cliente real com banco e dados de teste: botão 1, Rajada de Flechas, batalha automática, login, persistência e outros cenários afetados pelos commits.
5. Documentar bugs persistentes/regressões antes de mesclar mudanças locais; só adotar a nova versão principal mediante decisão consciente e backup.

**Importante:** acompanhar upstream **não** significa fazer atualização automática sem teste, nem comprova que os commits recentes corrigiram os bugs relatados.

## Roadmap, em ordem de prioridade

### 1. ESTABILIZAÇÃO — ATIVO

- Diagnóstico do spam da tecla `1` (animações e possível aumento indevido de dano real).
- Diagnóstico da tecla `4` (Rajada de Flechas: animação repetida, sem dano adicional relatado).
- Validar cadência e dano efetivo na batalha automática.
- Testes automatizados de cooldown / bloqueio de casts, seguidos de verificação in-game.
- Investigar regressões reveladas por versões novas do autor; não introduzir mudanças arbitrárias na velocidade do jogo.

### 2. SINCRONIZAÇÃO E QUALIDADE — ATIVO CONTÍNUO

- Acompanhar correções do autor `aethai`; compilar e comparar builds isolados.
- Registrar upstream SHA, fork SHA, resultados de testes e decisão de adoção.
- Antes de servidor público, revisar privilégios GM, banco, persistência, multiplayer e segurança.

### 3. CONTEÚDO PRÓPRIO — FUTURO, NÃO INICIAR AGORA

- Primeiro experimento **proposto**, não comprovado: chefe exclusivo usando visual existente, com atributos, comportamento e recompensas configurados por nós.
- Depois, estudar variantes de textura/material e reaproveitamento de rig/animações.
- Somente quando tecnicamente viável, estudar importação de modelos ou mapas 3D totalmente novos no cliente.
- **Não** iniciar sistemas novos, boss próprio, substituição de assets ou mapas agora.
- Ragnarok Classic em Rust é referência de sistemas mais completos, **não** alternativa escolhida para substituir o servidor RO3Emu.

## Restrições de publicação

Não enviar: `ROO_PC/`, executáveis e DLLs compilados, `.bytes`, dados extraídos do cliente, saves/bancos SQLite, arquivos de configuração com credenciais, chaves, dumps, logs de sessão e ZIPs de grandes assets. Só commits de código-fonte e documentação revisados.

## Critério para passar de estabilização para conteúdo próprio

Decisão do usuário **após** testes suficientes de combate e funcionalidade do servidor; não baseada apenas na passagem do tempo, no número de commits ou na existência de uma release.