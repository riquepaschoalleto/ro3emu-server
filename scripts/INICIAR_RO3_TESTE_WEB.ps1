# RO3Emu - testa o upstream e o painel web sem tocar na instalacao principal.
# Uso: powershell -ExecutionPolicy Bypass -File "D:\PROJETOS\RO3\RO3Emu-Codigo\scripts\INICIAR_RO3_TESTE_WEB.ps1"
# Opcional: -ContaGM NOME_DA_CONTA (login da conta, nao nome do personagem).
param(
    [string]$BaseDir = 'D:\PROJETOS\RO3',
    [string]$ContaGM
)
$ErrorActionPreference = 'Stop'

$repo = Join-Path $BaseDir 'RO3Emu-Codigo'
$cliente = Join-Path $BaseDir 'ROO_PC-TESTE'
$dados = Join-Path $BaseDir 'RO3Emu-TESTE'
$managed = Join-Path $cliente 'ro3_Data\Managed'
$executable = Join-Path $repo 'src\Ro3Emu.Setup\bin\Release\net10.0\RO3Emu.exe'

function VerifyExit([string]$step) {
    if ($LASTEXITCODE -ne 0) { throw "$step falhou (exit code $LASTEXITCODE)." }
}

if (!(Test-Path -LiteralPath (Join-Path $repo '.git'))) {
    throw "Repositorio local nao encontrado: $repo. Nao criei outra pasta."
}
if (!(Test-Path -LiteralPath (Join-Path $cliente 'ro3.exe')) -or
    !(Test-Path -LiteralPath (Join-Path $managed 'Assembly-CSharp.dll'))) {
    throw "Cliente de TESTE ausente: $cliente. O cliente principal sera preservado."
}
if (!(Test-Path -LiteralPath $dados -PathType Container)) {
    throw "Dados de TESTE ausentes: $dados. Nao usarei os dados principais."
}
if ([IO.Path]::GetFullPath($cliente).TrimEnd('\') -ieq
    [IO.Path]::GetFullPath((Join-Path $BaseDir 'ROO_PC')).TrimEnd('\')) {
    throw "O cliente informado coincide com o cliente principal."
}
if ([IO.Path]::GetFullPath($dados).TrimEnd('\') -ieq
    [IO.Path]::GetFullPath((Join-Path $BaseDir 'RO3Emu')).TrimEnd('\')) {
    throw "Os dados informados coincidem com o servidor principal."
}
if (Get-Process -Name 'ro3','RO3Emu','Ro3Emu.Server' -ErrorAction SilentlyContinue) {
    throw "Feche o jogo e os servidores antes de atualizar o codigo e iniciar o teste."
}

$sdks = @(& dotnet --list-sdks)
VerifyExit 'Consulta ao SDK'
if (!($sdks | Where-Object { $_ -match '^10\.' })) {
    throw "O .NET 10 SDK nao foi encontrado."
}
$dirty = @(& git -C $repo status --porcelain)
VerifyExit 'Verificacao Git'
if ($dirty.Count -gt 0) {
    throw "Ha modificacoes locais no repositorio. Nenhuma foi sobrescrita."
}

Write-Host 'Atualizando a branch de testes (sem force/reset)...' -ForegroundColor Cyan
& git -C $repo fetch origin
VerifyExit 'git fetch'
& git -C $repo show-ref --verify --quiet 'refs/heads/dev/ro3-stabilization'
if ($LASTEXITCODE -eq 0) {
    & git -C $repo switch 'dev/ro3-stabilization'
} else {
    & git -C $repo switch --track 'origin/dev/ro3-stabilization'
}
VerifyExit 'git switch'
& git -C $repo merge --ff-only 'origin/dev/ro3-stabilization'
VerifyExit 'git merge --ff-only'
& git -C $repo merge-base --is-ancestor '7cf31d446d957c9355dc5e9a85910c3faf3624f7' HEAD
VerifyExit 'Confirmacao do upstream sincronizado'

$db = Join-Path $dados 'data\ro3emu.db'
if (Test-Path -LiteralPath $db -PathType Leaf) {
    $backupDir = Join-Path $dados 'backups-before-upstream'
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    $backup = Join-Path $backupDir ("ro3emu-{0}.db" -f (Get-Date -Format 'yyyyMMdd-HHmmss'))
    Copy-Item -LiteralPath $db -Destination $backup -ErrorAction Stop
    Write-Host "Backup do banco de TESTE: $backup" -ForegroundColor Green
}

$env:RO3_CLIENT_DIR = $cliente
Write-Host 'Compilando servidor + painel web + cliente + exportador...' -ForegroundColor Cyan
foreach ($project in @('Ro3Emu.Server','Ro3Emu.ClientHooks','Ro3Emu.Loc','Ro3Emu.Setup')) {
    $args = @('build', (Join-Path $repo "src\$project"), '-c','Release','-v','q','--nologo')
    if ($project -in @('Ro3Emu.ClientHooks','Ro3Emu.Loc')) {
        $args += "-p:ClientManaged=$managed"
    }
    & dotnet @args
    VerifyExit "Build $project"
}
if (!(Test-Path -LiteralPath $executable -PathType Leaf)) {
    throw "Executavel do gerenciador compilado nao encontrado: $executable"
}

if ([string]::IsNullOrWhiteSpace($ContaGM)) {
    $ContaGM = Read-Host 'Conta de LOGIN que tera acesso administrativo ao painel web'
}
if ([string]::IsNullOrWhiteSpace($ContaGM)) {
    throw 'Informe a conta de login GM para acessar a administracao web.'
}
$env:Ro3Emu__GmAccounts__0 = $ContaGM.Trim()

Write-Host ('Commit de teste: ' + (& git -C $repo rev-parse --short HEAD)) -ForegroundColor Green
Write-Host 'Painel web, quando o servidor iniciar: http://127.0.0.1:5391' -ForegroundColor Cyan
Write-Host 'O gerenciador exporta os icones do cliente de TESTE quando necessario.' -ForegroundColor Cyan
& $executable start --client $cliente --home $dados --http-port 5390 --micro-port 20001 --game-port 33102 --panel-port 5391
VerifyExit 'Inicio do RO3Emu TESTE'
