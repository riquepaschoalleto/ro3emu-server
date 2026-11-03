# RO3 — Ambiente e instalação validada

**Data do registro:** 22/10/2026  
**Sistema:** Windows 11; PowerShell; unidade `D:`.

## Estrutura principal depois da reorganização do usuário

```text
D:\PROJETOS\RO3\
├── ROO_PC\                        # Cliente Ragnarok 3 (confirmado)
│   ├── ro3.exe
│   └── ro3_Data\
└── RO3Emu\                        # Servidor RO3Emu existente
    ├── RO3Emu.exe                 # Gerenciador correto para iniciar normalmente
    ├── server\
    │   └── Ro3Emu.Server.exe      # Executável de servidor; não abrir isoladamente
    ├── data\                     # Dados exportados / banco do RO3Emu
    └── logs\                     # Logs (quando presentes)
```

**Nota:** anteriormente havia uma duplicação `RO3Emu\RO3Emu\`; o usuário informou que reorganizou a pasta. O caminho final do gerenciador ficou `D:\PROJETOS\RO3\RO3Emu\RO3Emu.exe`.

## Evidências da instalação principal

Saída do `RO3Emu.exe install`:

```text
Asking the official servers for the current release
ro3-live-na-na-login-dns-repair-140076-2026.10.21.1 (release 140076)
Comparing 37817 files ... 22.6 GB
37817 files written and checked in 19 min 52 s
```

Ao iniciar:

```text
this game version works with RO3Emu
exported in 53 s: 516 tables, 381 maps, 2222 skills,
172 walk maps, 1090 messages, 28850 English texts
running ...
the game now connects to http://127.0.0.1:5380
```

O jogo abriu e o usuário confirmou poder jogar. Isso **não** comprova que todas as missões, classes e mecânicas estejam corretas.

## Inicialização normal da instalação principal

Abrir por duplo clique o **gerenciador**:

```text
D:\PROJETOS\RO3\RO3Emu\RO3Emu.exe
```

Ou via PowerShell:

```powershell
Set-Location "D:\PROJETOS\RO3\RO3Emu"
.\RO3Emu.exe start
```

Não abrir isoladamente `server\Ro3Emu.Server.exe`; o gerenciador verifica cliente, dados, patch de conexão e inicialização conjunta.

**Para parar:** usar `Q` na janela gerenciada pelo RO3Emu, conforme instrução na própria ferramenta.

## Observações sobre o servidor iniciado isoladamente

O usuário abriu diretamente:

```text
D:\PROJETOS\RO3\RO3Emu\server\Ro3Emu.Server.exe
```

No log desse processo apareceram dezenas de avisos de configuração não encontrada (`SkillConfig.json`, `MapConfig.json`, `JobConfig.json`, `TaskConfig.json`, `MVPConfig.json`, etc.), `Tasks: 0 TaskConfig rows` e `MVP: 0 field MVPs`.

Esse log **é da execução direta do servidor**, não prova que os mesmos dados estejam ausentes quando se inicia pelo gerenciador.

O log também mostra aviso de `Ro3Emu:GmAccounts is empty`: em uma configuração apropriada para servidor público é necessário restringir privilégios de GM. Em modo local houve GM disponível.

## Endereços e portas locais documentados

- HTTP: `127.0.0.1:5380`
- MicroGate: `127.0.0.1:20000`
- GameGate: `127.0.0.1:33100`

Não disponibilizar essas portas à internet nesta fase.

## Dependências para código-fonte (ainda não confirmadas no PC)

- Repositório: <https://github.com/aethai/ro3emu-server>
- Branch em estudo: `main`; fonte C#.
- SDK requerido no repositório consultado: **.NET 10**, com `global.json` contendo `10.0.402` e `rollForward: latestPatch`.
- O gerenciador `RO3Emu.exe` distribuído pronto para Windows não exige que o usuário compile o projeto; a versão fonte exige SDK.

Nenhuma verificação atual do SDK instalado foi enviada pelo usuário após o comando de teste.

## Repositório do projeto e separação de ambientes (decisão 22/10/2026)

- **Upstream oficial do emulador:** <https://github.com/aethai/ro3emu-server>.
- **Fork planejado:** `riquepaschoalleto/ro3emu-server` — **não confirmado como criado**.
- Branch upstream: `main`; alterações próprias e documentação previstas em `dev/ro3-stabilization` após o fork.
- O repositório remoto deve conter **código e documentação**. Não enviar o cliente instalado, arquivos `.bytes`, conteúdo extraído de 22,6 GB, `.json` exportados do cliente, banco de dados, chaves ou patches compilados.
- O local real de quaisquer pastas de teste no Windows ainda precisa ser verificado. Nunca confundir `RO3Emu-TESTE` com o servidor principal.