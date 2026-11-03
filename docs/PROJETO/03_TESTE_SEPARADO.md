# RO3 — Preparação e validação de versão de teste

**Data:** 22/10/2026  
**Estado deste procedimento:** planejamento técnico. **A execução não foi confirmada.**

## Meta

Executar e comparar versões à medida que o autor upstream atualiza o RO3Emu. **Cada versão testada deve ter seu SHA anotado** e um resultado de build e de validação in-game separados.

Executar uma versão recente do servidor RO3Emu construída do código C# `main`, com **dados próprios**, **cliente copiado**, e sem substituir os binários ou o banco da versão que já funciona.

## Pastas previstas

```text
D:\PROJETOS\RO3\
├── ROO_PC\                    # CLIENTE PRINCIPAL — preservar
├── RO3Emu\                    # SERVIDOR PRINCIPAL — preservar
├── ROO_PC-TESTE\              # CÓPIA do cliente (ainda sem confirmação)
├── RO3Emu-TESTE\              # Dados / personagens / logs isolados (ainda sem confirmação)
└── RO3Emu-Fonte-<sha8>\       # Repositório source do commit (ainda sem confirmação)
```

O nome `RO3Emu-Fonte-<sha8>` é um padrão previsto; **não é evidência de que essa pasta já exista**. O jogo principal tem aproximadamente 22,6 GB, então a cópia integral para teste consome espaço adicional.

## Bloqueio encontrado

Primeiro script falhou imediatamente:

```powershell
$home = "$base\RO3Emu-TESTE"  # ERRO: HOME é variável automática protegida
```

Foi enviada uma versão substituindo `$home` por `$pastaTeste`, mas o usuário **não enviou log posterior**; ela pode não ter sido executada.

## Antes de tentar novamente

1. Confirmar se o servidor principal e o jogo estão fechados; não iniciar duas instâncias nas portas `5380`, `20000`, `33100`.
2. Verificar os diretórios já presentes: `ROO_PC-TESTE`, `RO3Emu-TESTE`, `RO3Emu-Fonte-*`.
3. Verificar o .NET 10 SDK com `dotnet --list-sdks`.
4. Confirmar espaço livre na unidade D: antes de copiar o cliente.
5. Conferir se existem dados principais em `D:\PROJETOS\RO3\RO3Emu\data` e manter backup.
6. Fixar e anotar o SHA do commit a testar, evitando que a build mude durante a investigação.

## Abordagem de build respaldada pelo repositório

O repositório possui `start.ps1` / `start.cmd` para desenvolvedores. Segundo o arquivo `start.ps1`, ele compila estes projetos em Release:

```text
src/Ro3Emu.Server
src/Ro3Emu.ClientHooks
src/Ro3Emu.Loc
src/Ro3Emu.Setup
```

Os módulos `ClientHooks` e `Loc` usam o diretório `ro3_Data\Managed` do cliente apontado por `-ClientDir`. O gerenciador compilado pode ser iniciado com `--client` e `--home` apontando para diretórios de teste.

**Atenção técnica importante:** `start.ps1` constrói o código, mas **não deve ser usado com o cliente ou dados principais**. É necessário informar corretamente os caminhos isolados. O arquivo `global.json` consultado exige SDK 10.0.402 com `latestPatch`.

## Comandos apenas de diagnóstico (não modificam o projeto)

```powershell
$base = 'D:\PROJETOS\RO3'
Get-ChildItem $base -Directory | Select-Object Name,FullName
Get-Command dotnet -ErrorAction SilentlyContinue | Select-Object Source
dotnet --list-sdks
Test-Path "$base\ROO_PC-TESTE\ro3.exe"
Test-Path "$base\RO3Emu-TESTE\data"
Get-ChildItem $base -Directory -Filter 'RO3Emu-Fonte-*' | Select-Object FullName
```

Não rodar o teste na mesma pasta ou nos mesmos dados da instalação principal. O novo gerenciador reexporta dados e pode modificar os arquivos do cliente para apontar ao servidor escolhido.

## Critérios de aprovação do teste

| Caso | Comprovação necessária |
|---|---|
| Compilação | Quatro projetos Release compilados sem erro, SHA identificado |
| Isolamento | Banco e arquivos da instalação principal continuam intactos |
| Inicialização | Cliente de teste abre e conecta ao servidor de teste |
| Tecla 1 | Com spam, ritmo de **dano real** respeita as regras de velocidade/cast |
| Tecla 4 | Não reinicia indevidamente animação nem ignora cooldown |
| Automático | Mantém ataques com cadência compatível com a classe |
| Persistência | Reinício mantém dados do personagem de teste |

## Registro de versões (preencher somente com evidências reais)

| Data | Upstream SHA | Fork SHA/branch | Build | Cliente abriu | Tecla 1 | Tecla 4 | Autoataque | Decisão |
|---|---|---|---|---|---|---|---|---|
| 22/10/2026 | A confirmar | Não publicado | Não confirmado | Não confirmado na versão teste | Pendente | Pendente | Pendente | Manter principal |

Quando surgir nova versão, acrescentar linha; nunca sobrescrever registros anteriores.

## Depois do teste

Registrar data, commit SHA, resultado de compilação, erros, logs e comparação com o vídeo original. Se o bug persistir, desenvolver correção no código-fonte **isolado**, acompanhada de teste de regressão. Nunca concluir "estável para servidor público" com base apenas neste teste de combate.