# RO3Emu — sincronizacao upstream e teste do painel web (30/10/2026)

## Estado confirmado no GitHub

- Upstream: aethai/ro3emu-server, main = 7cf31d446d957c9355dc5e9a85910c3faf3624f7.
- Fork: riquepaschoalleto/ro3emu-server, main atualizado por fast-forward ao mesmo SHA (365 commits integrados).
- Testes: dev/ro3-stabilization recebeu o upstream pela PR #2, merge b3303c6f703b357665b8db3d5ae0a9ca18c34baf.
- Os cinco documentos de docs/PROJETO foram preservados sem conflitos.
- O GitHub foi atualizado. **Nenhuma compilacao, exportacao de imagens, migracao do banco nem sessao in-game foi feita no PC do usuario por esta operacao remota.**

## O que ja vem no codigo sincronizado

1. RO3Emu v1.0.23 e commits posteriores, com correcoes de ataque normal/Archer ASPD, projeteis, auto-batalha, PvP, GM, dungeons, War of Emperium, equipamentos e outros sistemas.
2. Projeto src/Ro3Emu.Panel, compilado automaticamente como referencia de src/Ro3Emu.Server. Portal publico, rankings, noticias, itens, monstros, mapas; conta do jogador e ficha do personagem; dashboard, contas, bans, correio, codigos, console GM, noticias, avisos e log da economia para administradores.
3. Projeto src/Ro3Emu.DataExport: icones de itens e cartas, monstros, classes, skills e imagens dos mapas. A exportacao gera icons/ na pasta data/ escolhida, normalmente ~2.500 PNGs. O servidor nao precisa de arquivos de imagens no GitHub.
4. Novo src/Ro3Emu.Launcher (nao obrigatorio para o teste via RO3Emu.exe). O gerenciador de linha de comando e o painel web funcionam independentemente do launcher grafico.

Consulte docs/guide/panel.md para a documentacao original do painel e docs/guide/gm-panel.md para as operacoes do GM.

## Separacao no Windows

Pastas documentadas (o script **verifica a existencia**, nao as cria nem copia jogos):

- Codigo existente: D:\PROJETOS\RO3\RO3Emu-Codigo
- Cliente de teste: D:\PROJETOS\RO3\ROO_PC-TESTE
- Dados e personagens de teste: D:\PROJETOS\RO3\RO3Emu-TESTE
- Preservar: D:\PROJETOS\RO3\ROO_PC e D:\PROJETOS\RO3\RO3Emu

**Nao iniciar sem confirmar que o cliente de teste e o home de teste existem.** O gerenciador modifica DLLs do cliente escolhido para conectar ao RO3Emu, e o servidor pode migrar o banco escolhido. Por isso o iniciador nao aceita os caminhos principais e cria um backup do banco de teste antes de iniciar.

Portas **exclusivas da sessao de teste**: jogo HTTP 5390, micro 20001, game 33102 e painel 5391. Para uso local o endereco e http://127.0.0.1:5391. Na instalacao principal o painel pode usar a porta padrao 5381, se for ativado com codigo atualizado.

## Iniciador preparado

O arquivo scripts/INICIAR_RO3_TESTE_WEB.ps1:

1. Verifica cliente de TESTE, banco/pasta de TESTE, processos que precisam estar encerrados, SDK .NET 10 e arvore Git sem alteracoes locais.
2. Faz git fetch e merge --ff-only da branch dev/ro3-stabilization, sem usar force/reset.
3. Confirma a presenca do commit upstream 7cf31d44 no historico.
4. Faz copia do arquivo data/ro3emu.db do TESTE (se existir) para backups-before-upstream/.
5. Compila os quatro projetos do gerenciador via dotnet build Release, com ClientManaged do cliente de TESTE. A referencia a Ro3Emu.Panel compila o painel web; Ro3Emu.Setup referencia Ro3Emu.DataExport.
6. Pede a **conta de login**, nao o nome do personagem, para fornecer Ro3Emu__GmAccounts__0 ao processo. Sem esta lista explicita, GM aberto no jogo local nao garante acesso ao painel de administracao.
7. Executa RO3Emu.exe start --client <CLIENTE_TESTE> --home <DADOS_TESTE> com portas separadas. Como --no-icons nao foi passado, o gerenciador exporta as imagens do proprio cliente se estiverem faltando.

### Primeiro uso: trazer o iniciador para o Windows

No PowerShell, se o codigo ja estiver clonado no caminho documentado:

    $repo = 'D:\PROJETOS\RO3\RO3Emu-Codigo'
    git -C $repo fetch origin
    if ($LASTEXITCODE -ne 0) { throw 'git fetch falhou' }
    git -C $repo switch dev/ro3-stabilization
    if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel selecionar dev/ro3-stabilization' }
    git -C $repo pull --ff-only origin dev/ro3-stabilization
    if ($LASTEXITCODE -ne 0) { throw 'git pull falhou' }
    powershell -ExecutionPolicy Bypass -File "$repo\scripts\INICIAR_RO3_TESTE_WEB.ps1"

**Se a branch so existir no remoto** e o git switch falhar, use git switch --track origin/dev/ro3-stabilization, depois repita o pull (sem force/reset).

Nas proximas execucoes, basta iniciar o script PowerShell. O script nao baixa novamente os ~22,6 GB do jogo. Nao abre portas publicas e nao modifica a instalacao principal.

## O que validar no computador (ainda pendente)

- O comando de build conclui com sucesso (.NET 10 SDK presente).
- RO3Emu inicia com os diretórios de teste, abre o cliente e conecta.
- Painel abre em http://127.0.0.1:5391, mostra pagina publica e permite login com a conta de jogo.
- Login GM aparece com paginas administrativas; conta precisa ser **conta**, nao apelido do char.
- Exportacao de icones: D:\PROJETOS\RO3\RO3Emu-TESTE\data\icons\ com items/, monsters/, classes/, maps/, skills/; imagens aparecem nos bancos e nas fichas.
- Personagem e banco permanecem na pasta de teste. Nao ha migracao ou exclusao de dados principais.
- Regressoes: ataque [1] e spam de animacao; Rajada [4], projeteis e dano por hit; cooldowns; funcionalidades e pontos da arvore de skills; auto-batalha; scripts do painel GM.
- Conferir log de inicio e SHA do codigo compilado antes de declarar correcao.

Nao considerar nenhum item acima validado apenas pela sincronizacao no GitHub.
