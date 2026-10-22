# RAGNAROK 3 / RO3Emu — START HERE

**Última atualização do registro:** 22/10/2026  
**Situação:** cliente e servidor local comprovadamente funcionando; versão de teste com código-fonte atualizado **ainda não confirmada como compilada ou executada**. Fork público confirmado em `riquepaschoalleto/ro3emu-server`, com branch `dev/ro3-stabilization` criada para documentação e correções.

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

Foi entregue um **script corrigido**, utilizando `$pastaTeste` e `$clienteTeste`, mas **não existe confirmação de que o usuário o executou ou de que a compilação terminou**. Não declarar a versão teste pronta. O screenshot do GitHub não comprova clone local do repositório.

**Próxima ação técnica:** o fork foi criado e os `.md` estão na branch `dev/ro3-stabilization`; verificar as pastas de teste e o SDK .NET 10 existentes antes de rodar novos comandos. Se a preparação ainda não tiver acontecido, seguir `03_TESTE_SEPARADO.md`. Não presumir que a compilação funcionou.

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

> Estamos trabalhando no Ragnarok 3 / RO3Emu em Windows 11. Leia os cinco arquivos `.md` deste projeto como fonte do estado atual. Cliente oficial (22,6 GB) e servidor local funcionaram em `D:\PROJETOS\RO3`. Objetivo imediato: bugs e versões de teste acompanhando o upstream; conteúdo próprio apenas depois de estabilizar. Criar e validar uma cópia de teste usando código recente do `aethai/ro3emu-server`, sem alterar a instalação principal, para investigar spam da tecla 1 e animação da tecla 4. Primeiro script falhou por usar `$home` no PowerShell; script corrigido foi fornecido, mas sua execução **não foi confirmada**. Não invente conclusão de testes, não baixe novamente o cliente e não exponha o servidor online agora.