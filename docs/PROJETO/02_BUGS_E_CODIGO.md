# RO3 — Bugs observados, investigações e alterações upstream

**Registro:** 22/10/2026.

## Evidência do usuário: vídeo de aproximadamente 2min10s

O usuário gravou e enviou `Gravando 2026-10-22 072942.mp4` com testes em um personagem arqueiro:

1. **Batalha Automática:** testada no começo como referência.
2. **Tecla [1]:** após desativar a batalha automática, pressionou repetidamente. Relata múltiplas animações e **mais danos reais quanto mais rapidamente aperta**.
3. **Tecla [4], Rajada de Flechas:** apertar repetidamente provoca repetição/anomalia de animação; o usuário **não observou os mesmos danos adicionais** da tecla 1.
4. Comparou pressionamentos rápidos e normais.

No vídeo também aparecem números repetidos em branco e amarelo (ex.: `2459`/`2459`, por volta de 00:58). Só observar dois números não comprova dois descontos reais de HP.

**Status correto:** comportamento anormal relatado e parcialmente visível. Sem log de pacotes/HP sincronizado, a quantidade exata de danos aceitos pelo servidor ainda não foi medida. Não declarar causa confirmada.

## GitHub: issue #45 e PRs

- Issue: <https://github.com/aethai/ro3emu-server/issues/45>
- PR #49: <https://github.com/aethai/ro3emu-server/pull/49>
  - Corrige exibição duplicada do mesmo dano: o cliente exibia uma parcela em branco e o total em amarelo; não eram necessariamente dois danos reais.
  - Incorporada à branch `main` em 22/10/2026.
- PR #50: <https://github.com/aethai/ro3emu-server/pull/50>
  - Faz efeitos de talentos selecionados realmente influenciarem atributos, cooldowns e modificadores.
  - Incorporada em 22/10/2026.
- PR #51: <https://github.com/aethai/ro3emu-server/pull/51>
  - Implementa parte dos efeitos especiais acionados por talentos, inicialmente classes da linha Knight / Lord Knight / Crusader / Paladin.
  - Incorporada em 22/10/2026.
- PR #54: <https://github.com/aethai/ro3emu-server/pull/54>
  - Amplia talentos de linhas como Thief e Merchant e inclui correções descobertas jogando com classes reais.
  - Incorporada em 22/10/2026.
  - Correção importante: depois de trocar de classe, o slot 1 podia continuar usando ataque básico de Noviço (`1000001`) em vez do ataque básico de Arqueiro (`1300001`); isso também afetava talentos ligados ao ataque básico.

**Não afirmar:** que essas PRs corrigem integralmente o spam de inputs das teclas 1 e 4. Não há validação local desse efeito após atualizar o servidor.

## Código técnico investigado

Arquivo: <https://github.com/aethai/ro3emu-server/blob/main/src/Ro3Emu.Server/Game/CombatService.Casting.cs>

Na validação dos ataques manuais, há verificação de cooldown por grupo/modo, e do estado `SkillBusy` durante uma animação/cast ativo, **condicionada** ao dado `_bCancelCast`:

```csharp
else if (s.SkillCast is { Cancelled: false } active
    && Now < active.StartMs + active.ChantMs + active.ActionMs
    && GameData.Int(row.Value, "_bCancelCast") == 0)
    error = ErrorCodes.SkillBusy;
```

Uma hipótese para investigar: algumas repetições manuais podem passar pela regra de cancelamento e reiniciar o cast antes da janela esperada. **A hipótese não foi comprovada.**

O servidor também possui ataque automático agendado por `AttackLoop.NextSwingMs` em `CombatService.cs`. Isso estabelece caminhos diferentes para swing automático e solicitações manuais, mas não prova erro em nenhum deles.

A função `SkillMs` calcula duração baseada em `_iActionTime`, `_iActionTimeInfluence` e velocidade/atributo `[115]`. **Não adicionar cooldown arbitrário fixo**, pois isso pode prejudicar ASPD legítimo e combos.

## O que realmente falta testar

- Confirmar IDs e configurações atuais das habilidades nos dados exportados do cliente, inclusive `_bCancelCast`, `_iCD`, `_iActionTime`.
- Comparar taxa de **casts aceitos** e eventos de **HP efetivamente reduzido** com input único, spam manual e batalha automática.
- Validar o comportamento da tecla 1 antes/depois do código recente.
- Validar se a tecla 4 apenas reproduz animação local ou se aceita casts indevidos.
- Testar cada regra no servidor com teste automatizado para prevenir regressão.

## Regra de encerramento

Somente chamar o bug de "corrigido" depois de repetir o teste em cliente e servidor de teste e comparar resultados observados. Nem a existência de um commit nem um build bem-sucedido confirmam a correção em jogo.

## Protocolo para acompanhar novas correções do autor

Para cada atualização upstream relevante:

1. Registrar data, link do PR/commit e **SHA completo**; não inferir que um PR esteja no executável instalado.
2. Classificar impacto: combate/cooldown/animação, dados de classes/talentos, segurança/contas, ou outros.
3. Compilar isoladamente e testar primeiro a versão de teste, mantendo o build anterior reproduzível.
4. Repetir o cenário original da tecla 1, tecla 4 e batalha automática. Registrar dano real (queda de HP), cadência e número de casts aceitos quando possível.
5. Marcar como *corrigido* apenas com evidência de execução do cliente e servidor da versão testada; se regressão, não promover.

**Último estado confirmado nesta documentação:** PRs #49, #50, #51 e #54 foram incorporadas ao upstream em 22/10/2026; **não existe teste local confirmado** da compilação posterior nem prova de correção do spam manual. Atualizações futuras do upstream não são incorporadas automaticamente por este documento.

## Reteste no cliente atualizado — 22/10/2026 (feedback e duas imagens)

**Estado real:** o usuário executou o script de compilação e o jogo de teste abriu. As imagens comprovam a sessão em jogo; o **SHA do binário efetivamente carregado ainda não foi verificado no log da compilação**, por isso não atribuir o resultado a um commit específico sem confirmação.

**Melhorias percebidas pelo usuário:**
- Rajada de Flechas / **Double Strafe Nv.10**, tecla **4**: aparecem dois danos brancos de **1263** e **1262**, e um total amarelo de **2525**, corretamente igual à soma. Preservar o multi-hit e a fórmula de dano.
- Tecla **1**, ataque básico: o dano real **aparenta** respeitar o intervalo entre ataques mesmo pressionando repetidamente.
- Usuário considera que o dano parece corresponder à descrição das habilidades. Ainda não houve medição de HP/eventos do servidor para comprovação quantitativa.

**Defeitos visuais ainda reproduzidos pelo usuário:**
1. **Spam de animações:** teclas **1** e **4** podem ser pressionadas repetidamente, provocando animações excessivas mesmo quando o dano já é limitado. Precisamos diferenciar cast autorizado de antecipação de animação local.
2. **Cooldown no botão:** algumas habilidades entram em recarga, mas o ícone não mostra o indicador ou a contagem; **nenhuma habilidade com CD positivo foi identificada de modo inequívoco nas duas capturas**.

**Detalhe essencial da primeira captura:** o tooltip de **Double Strafe Nv.10** mostra **Conjuração 0.0 s** e **Recarga 0.0 s**. Assim, **a falta de contador para essa habilidade não comprova bug**; intervalo de ação, velocidade de ataque e cooldown são mecanismos diferentes.

### Pontos concretos do código verificados

- `src/Ro3Emu.Server/Game/CombatService.Casting.cs` já valida cooldown em `CastCoreAsync` e envia `SkillCdNotify` por `StartCooldownAsync` somente quando a duração calculada é **positiva**. Os campos usam **grupo da skill**, modo, início e fim; mensagem de rede **31113**.
- `tests/Ro3Emu.Tests/MapTests.cs` possui teste de recepção de `31113` e rejeição `3012` em cooldown; isso não testa a exibição de recarga na interface Unity.
- `src/Ro3Emu.ClientHooks/LuaPatches.cs` já modifica funções Lua no cliente por wrappers de C#, mas **a função exata de entrada de ataque e o consumidor visual do cooldown ainda não foram localizados/validados**.
- Hipótese de trabalho: o cliente pode iniciar a animação antes de receber a resposta do servidor. **Não é causa comprovada.** Não mudar artificialmente cooldown, dano, ASPD, as regras de cancelamento ou duas parcelas da habilidade sem identificar o consumidor correto.

**Próxima intervenção técnica:** rastrear a sequência `31102` (pedido/resposta), `31100` (animação aceita), `31103/31124` (fim/interrupção), `31113` (cooldown) e os respectivos consumidores locais Unity/Lua. Reproduzir spam rápido versus 1 toque versus batalha automática. Identificar uma skill cuja `_iCD` seja maior que zero para testar o indicador do atalho. Corrigir a apresentação no cliente somente depois de verificar o caminho original, e validar in-game.

**Não chamar de corrigido:** animações e cooldown visual continuam com defeitos reportados, apesar da melhora aparente no dano. A instalação principal permanece preservada.
