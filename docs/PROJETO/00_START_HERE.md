# RAGNAROK 3 / RO3Emu — START HERE

**Última atualização do registro:** 22/10/2026  
**Situação:** cliente e servidor local comprovadamente funcionando. Após executar o script de compilação, o usuário exibiu **capturas do jogo de teste aberto**, com melhora aparente do dano na tecla 1 e na Rajada de Flechas; **o SHA do binário carregado ainda não foi confirmado por log**. Persistem spam de animações nas teclas 1/4 e relatos de cooldown visual ausente em outras skills. Veja `02_BUGS_E_CODIGO.md`. Fork público e branch `dev/ro3-stabilization` ativos.

## Objetivos e ordem de execução

**PRIORIDADE 1 — AGORA: estabilização.** Preservar o cliente original e o servidor RO3Emu que já funcionam. Em uma instalação **separada**, reproduzir, medir e corrigir bugs — começando por spam da tecla 1, animações da tecla 4 (Rajada de Flechas) e batalha automática. Um build bem-sucedido não comprova correção in-game.

**PRIORIDADE 2 — CONTÍNUA: acompanhar o autor upstream.** Consultar atualizações de [`aethai/ro3emu-server`](https://github.com/aethai/ro3emu-server); registrar commit SHA, diferenças, compilação e testes de regressão. Atualizar a versão de teste primeiro; **nunca substituir automaticamente a versão principal**. Compilar versões conforme o upstream avança, com validação antes de adotar.

**PRIORIDADE 3 — FUTURO, NÃO EXECUTAR AGORA: conteúdo próprio.** Somente quando o RO3Emu estiver suficientemente estável, estudar conteúdo personalizado: chefe com modelo existente; depois variações de texturas; eventualmente modelos/rigs/mapas próprios. **Nenhuma integração de conteúdo novo foi validada neste projeto.** Ragnarok Classic em Rust fica apenas como referência de sistemas; não é o servidor escolhido.

Antes de considerar abertura online, validar combate, contas/GM, persistência e multiplayer.

## Regras do projeto

1. **Não inventar funcionalidades, correções nem testes.** Distinguir relato, observação, hipótese e confirmação por logs/código.
2. **Não sobrescrever a instalação principal** `D:\PROJETOS\RO3\RO3Emu` nem o cliente principal `D:\PROJETOS\RO3\ROO_PC`.
3. **Não baixar novamente 22,6 GB** sem necessidade: o cliente já foi baixado e validado.
4. Trabalhar preferencialmente com PowerShell pronto para copiar e colar, sem exigir experiência de programação.
5. Priorizar o código-fonte C# do RO3Emu. Reservar o REA para questões que realmente exijam examinar binários do cliente Unity.
6. Confirmar o estado real antes de afirmar que uma correção funcionou.
7. Não expor o servidor à internet antes de restringir permissões administrativas e verificar segurança.
8. **Ordem obrigatória de prioridade:** correção de bugs → compilação e regressão das atualizações upstream → conteúdo próprio no futuro. Não antecipar escopo.
9. Registrar `upstream SHA`, `fork SHA`, versão compilada e evidência de teste; distinguir **download**, **build**, **execução** e **validação in-game**.
10. No GitHub, não publicar cliente de 22,6 GB, assets binários, dumps, dados extraídos, banco SQLite de jogadores, executáveis compilados, logs privados ou credenciais.

## Situação comprovada

- Download do cliente original: **37.817 arquivos, 22,6 GB**, versão anunciada como release **140076**, recebida dos servidores de atualização do Genesis.
- `RO3Emu.exe` verificou compatibilidade, exportou **516 tabelas, 381 mapas, 2.222 habilidades, 172 walk maps, 1.090 mensagens e 28.850 textos em inglês**, iniciou o servidor e abriu o jogo.
- Foi possível entrar em um mapa, visualizar NPCs/monstros e jogar. Imagem do jogo mostrava personagem `ADM`, Base 5 / Job 15, e indicador GM.
- O usuário confirmou que **o jogo funciona localmente** e gravou um vídeo demonstrando suspeitas de falhas nos ataques.

## Estado onde paramos (não pular)

O usuário decidiu criar uma **versão de teste** com o código recente do repositório [`aethai/ro3emu-server`](https://github.com/aethai/ro3emu-server), **separada da versão principal**.

O primeiro script PowerShell falhou imediatamente com:

```text
Não é possível substituir a variável HOME porque ela é somente leitura ou constante.
$home = "$base\RO3Emu-TESTE"
```

Motivo: `$HOME` é uma variável automática protegida no PowerShell (sem diferenciação entre maiúsculas e minúsculas).

Posteriormente, foram criadas cópias locais de teste e uma compilação anterior em `RO3Emu-Fonte-4c113c90`. Também existe `RO3Emu-Codigo` associado ao GitHub. Em 22/10, o usuário relatou ter executado o script de compilação mais recente e enviou **duas capturas do jogo rodando**; isso confirma a sessão de teste, mas **não verifica o SHA exato compilado**. Não repetir download do cliente nem criar mais pastas.

**Próxima ação técnica:** confirmar o SHA efetivamente usado pelo iniciador de teste e isolar problemas **visuais** remanescentes: animações provocadas por spam das teclas 1/4 e ausência de overlay para uma habilidade com cooldown positivo. Tooltip de Double Strafe Nv.10 indica recarga 0.0 s; não inventar CD para ela. Ver detalhes no `02_BUGS_E_CODIGO.md`. Preservar a melhoria do dano e não recompilar ou duplicar pastas sem necessidade.

## Arquivos deste conjunto

- `00_START_HERE.md` — visão geral, regras e estado onde paramos.
- `01_AMBIENTE_E_INSTALACAO.md` — diretórios, executáveis, evidências e comandos comprovados.
- `02_BUGS_E_CODIGO.md` — bugs observados, hipóteses técnicas e correções do GitHub.
- `03_TESTE_SEPARADO.md` — organização da versão de teste, precauções e critérios de validação.
- `04_GITHUB_ROADMAP.md` — governança do fork, acompanhamento do upstream e evolução futura.

## GitHub — estado de publicação

- Conta conectada verificada: `riquepaschoalleto`.
- Repositório de origem: `aethai/ro3emu-server`, branch `main`.
- Fork ativo: `riquepaschoalleto/ro3emu-server` (fork).
- **Estado:** fork confirmado; documentação publicada na branch `dev/ro3-stabilization`.
- Estratégia: manter `main` sincronizável com o autor; documentar e desenvolver mudanças próprias numa branch `dev/ro3-stabilization`, preservando a distinção entre upstream e código customizado.

## Para retomar em outro chat

> Estamos trabalhando no Ragnarok 3 / RO3Emu em Windows 11. Leia os cinco arquivos `.md` deste projeto como fonte do estado atual. Cliente oficial (22,6 GB) e servidor local funcionaram em `D:\PROJETOS\RO3`. Objetivo imediato: bugs e versões de teste acompanhando o upstream; conteúdo próprio apenas depois de estabilizar. Já existem cópias de teste e o usuário mostrou duas capturas do jogo rodando após executar o script de compilação; confirmar SHA exato da build antes de atribuir alterações ao commit. Dano da Rajada de Flechas mostrou 1263 + 1262 = 2525; spam visual das teclas 1 e 4 permanece. Tooltip de Double Strafe mostra recarga 0.0 s; cooldown visual ausente é relatado em outras skills, ainda não identificadas por ID. Não invente conclusão de testes, não baixe novamente o cliente e não exponha o servidor online agora.

## Sincronização upstream concluída no GitHub — 23/10/2026

- **Upstream `aethai/ro3emu-server` main:** `191510412757bd6126235113af134a8f5c138d15` (release v1.0.15); avanço de **43 commits** desde `047f05cf` e 70 arquivos alterados.
- **Nosso fork `main`:** atualizado por fast-forward, sem forçar histórico, para o mesmo commit `19151041`.
- **Nossa branch `dev/ro3-stabilization`:** atualizada pela [PR #1](https://github.com/riquepaschoalleto/ro3emu-server/pull/1), merge commit `8ee9c71bbfba28235ced75b9dc564db36358da93`, preservando os documentos em `docs/PROJETO/`.
- **Estado do PC:** a atualização do GitHub **não executa pull, compilação ou testes no Windows**. O usuário deve atualizar `D:\PROJETOS\RO3\RO3Emu-Codigo` e compilar no ambiente de teste existente, sem baixar/duplicar o cliente de 22,6 GB.
- **Regressões prioritárias:** verificar cooldown da PR upstream #63, spam visual [1]/[4], dano de Double Strafe (dois hits, total amarelo) e árvore de habilidades. Nem a atualização do fork nem a existência da release comprovam correção in-game.

## Sincronização completa com upstream, web e cliente — 30/10/2026

- Original aethai/ro3emu-server, main: `7cf31d446d957c9355dc5e9a85910c3faf3624f7` (v1.0.23 e commits posteriores).
- Fork riquepaschoalleto/ro3emu-server, main: fast-forward para o mesmo SHA; 365 commits incorporados desde 19151041.
- Branch dev/ro3-stabilization: [PR #2](https://github.com/riquepaschoalleto/ro3emu-server/pull/2) integrada sem conflitos, merge `b3303c6f703b357665b8db3d5ae0a9ca18c34baf`; os cinco documentos do projeto foram preservados.
- Incluídos: correções de combate e HunterAttack/ASPD, projéteis, painel GM e presets, launcher, `Ro3Emu.Panel` (portal/admin web), exportador de imagens `Ro3Emu.DataExport/IconExport`, dungeons, guildas e War of Emperium.
- Preparado iniciador PowerShell isolado: `scripts/INICIAR_RO3_TESTE_WEB.ps1`. Ele usa o cliente e os dados de TESTE existentes, valida o ambiente, faz backup do banco de teste, compila a versão atual e abre o servidor com painel web local na porta 5391. Ele pede a conta de login GM para o administrador do painel.
- Manual atualizado: [05_WEB_PANEL_E_TESTES.md](05_WEB_PANEL_E_TESTES.md). Manual upstream do painel: [docs/guide/panel.md](../guide/panel.md).
- **Confirmado remotamente:** sincronização GitHub e criação desses arquivos. **Não confirmado no PC:** pull, build, inicialização, exportação dos ~2.500 PNG, acesso HTTP, migrações e testes in-game. Não afirmar que as animações [1]/[4] foram corrigidas antes de testar.
- Instalação principal `RO3Emu` e cliente principal `ROO_PC` permanecem fora do escopo. Sem sobrescrever seus dados ou baixar outra cópia do cliente.
