// Local-only display preferences. Upstream UI copy remains the English source of truth.
'use strict';
(() => {
  const translations = new Map(window.RO3_PT_BR || []);
  const stored = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch { /* storage disabled */ } };
  let language = stored('ro3p-language') === 'en' ? 'en' : 'pt-BR';
  let theme = stored('ro3p-theme') === 'dark' ? 'dark' : 'light';
  const sources = new WeakMap();
  const attrs = new WeakMap();

  const patterns = [
    [/^(\d+) (row|rows)$/, m => m[1] + (m[2] === 'row' ? ' linha' : ' linhas')],
    [/^(\d+) (characters are|character is) in the world\. Refreshed every 5 seconds at most\.$/, m => m[1] + ' personagens no mundo. Atualização a cada 5 segundos, no máximo.'],
    [/^(\d+) more in the world$/, m => 'Mais ' + m[1] + ' no mundo'],
    [/^(\d+) (min|h|d) ago$/, m => 'há ' + m[1] + ' ' + m[2]],
    [/^(\d+) (variants|variant)$/, m => m[1] + (m[2] === 'variant' ? ' variante' : ' variantes')],
    [/^page (\d+) of (\d+)$/, m => 'página ' + m[1] + ' de ' + m[2]],
    [/^Only on (.+)$/, m => 'Somente em ' + m[1]],
    [/^Only from (.+)$/, m => 'Somente de ' + m[1]],
    [/^Mailbox of (.+)$/, m => 'Caixa de correio de ' + m[1]],
    [/^The server answered (\d+)\.$/, m => 'O servidor respondeu com o código ' + m[1] + '.'],
    [/^(\d+) (code|codes) created\.$/, m => m[1] + (m[2] === 'code' ? ' código criado.' : ' códigos criados.')],
    [/^Created (\d+)$/, m => 'Criados: ' + m[1]],
    [/^This mail goes to (\d+) characters\. Send it\?$/, m => 'Esta carta será enviada a ' + m[1] + ' personagens. Enviar?'],
    [/^Send to (\d+)$/, m => 'Enviar para ' + m[1]],
    [/^Mail delivered to ([\d.,]+)(, ([\d.,]+) failed \(see the server log\))?\.$/, m =>
      'Carta entregue a ' + m[1] + (m[3] ? ', falha em ' + m[3] + ' (consulte o log do servidor)' : '') + '.'],
    [/^Shown to ([\d.,]+) (player|players)\.$/, m => 'Exibido para ' + m[1] + (m[2] === 'player' ? ' jogador.' : ' jogadores.')],
    [/^Delete "(.+)"\? Players no longer see it\.$/, m => 'Excluir "' + m[1] + '"? Os jogadores não poderão mais ver a notícia.'],
    [/^Show "(.+)" to every player in the game (.+)\?$/, m => 'Mostrar "' + m[1] + '" a todos os jogadores ' + m[2] + '?'],
    [/^My character \((.+)\)$/, m => 'Meu personagem (' + m[1] + ')'],
    [/^Count of (.+)$/, m => 'Quantidade de ' + m[1]],
    [/^MVP: (.+)$/, m => 'MVP: ' + (translations.get(m[1]) || m[1])],
    [/^(\d+) (stack|stacks)$/, m => m[1] + (m[2] === 'stack' ? ' pilha' : ' pilhas')],
    [/^(\d+) other currencies$/, m => m[1] + ' outras moedas'],
    [/^([\d.,]+) EXP into the level$/, m => m[1] + ' EXP no nível'],
    [/^([\d.,]+) job EXP into the level$/, m => m[1] + ' EXP de profissão no nível'],
    [/^Lv ([\d-]+)$/, m => 'Nv. ' + m[1]],
    [/^(\d+) (monster|monsters)$/, m => m[1] + (m[2] === 'monster' ? ' monstro' : ' monstros')],
    [/^(\d+) (player|players)$/, m => m[1] + (m[2] === 'player' ? ' jogador' : ' jogadores')],
    [/^(\d+) online$/, m => m[1] + ' online'],
    [/^(\d+) (min|h|d)$/, m => m[1] + ' ' + m[2]],
    [/^of (\d+) matching items$/, m => 'de ' + m[1] + ' itens encontrados'],
    [/^(\d+) (rows|row) · page (\d+) of (\d+)$/, m => m[1] + ' linhas · página ' + m[3] + ' de ' + m[4]],
    [/^(\d+) (more time|more times), every (\d+) min$/, m => m[1] + ' repetições, a cada ' + m[3] + ' min'],
    [/^now and (.+)$/, m => 'agora e ' + m[1]],
    [/^(.+) · (Who's online|Rankings|News|Admin)$/, m => m[1] + ' · ' + translations.get(m[2])],
  ];
  function translate(value) {
    if (language === 'en' || !value) return value;
    const word = value.trim();
    let result = translations.get(word);
    if (result === undefined) {
      for (const [expression, replacement] of patterns) {
        const match = expression.exec(word);
        if (match) { result = replacement(match); break; }
      }
    }
    if (result === undefined) return value;
    const lead = value.match(/^\s*/)[0];
    const tail = value.match(/\s*$/)[0];
    return lead + result + tail;
  }

  function text(node) {
    if (!node.parentElement || node.parentElement.closest('script,style,pre,code,[data-no-i18n]')) return;
    let entry = sources.get(node);
    if (!entry) { entry = { original: node.nodeValue, shown: node.nodeValue }; sources.set(node, entry); }
    else if (node.nodeValue !== entry.shown) entry.original = node.nodeValue;
    const result = translate(entry.original);
    entry.shown = result;
    if (result !== node.nodeValue) node.nodeValue = result;
  }

  function attributes(el) {
    if (el.closest('[data-no-i18n]')) return;
    let entries = attrs.get(el);
    if (!entries) { entries = new Map(); attrs.set(el, entries); }
    for (const key of ['placeholder','aria-label','title','alt']) {
      if (!el.hasAttribute(key)) continue;
      const value = el.getAttribute(key);
      let entry = entries.get(key);
      if (!entry) { entry = { original: value, shown: value }; entries.set(key, entry); }
      else if (value !== entry.shown) entry.original = value;
      const result = translate(entry.original);
      entry.shown = result;
      if (result !== value) el.setAttribute(key, result);
    }
  }

  function walk(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) { text(root); return; }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
    if (root.nodeType === Node.ELEMENT_NODE) attributes(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    for (let node = walker.nextNode(); node; node = walker.nextNode())
      if (node.nodeType === Node.TEXT_NODE) text(node); else attributes(node);
  }

  let batching = false;
  const observer = new MutationObserver(changes => {
    if (batching) return;
    batching = true;
    try {
      for (const change of changes) {
        if (change.type === 'characterData') walk(change.target);
        else if (change.type === 'attributes') attributes(change.target);
        else for (const node of change.addedNodes) walk(node);
      }
    } finally { batching = false; }
  });

  function controls() {
    const lang = document.getElementById('panel-language');
    const themeButton = document.getElementById('panel-theme');
    if (lang) {
      lang.value = language;
      lang.setAttribute('aria-label', language === 'en' ? 'Panel language' : 'Idioma do painel');
    }
    if (themeButton) {
      const nextDark = theme !== 'dark';
      const label = nextDark
        ? (language === 'en' ? 'Dark' : 'Escuro')
        : (language === 'en' ? 'Light' : 'Claro');
      themeButton.textContent = (nextDark ? '☾ ' : '☀ ') + label;
      themeButton.setAttribute('aria-label', (language === 'en' ? 'Switch to ' : 'Mudar para tema ') +
        (language === 'en' ? label.toLowerCase() + ' theme' : label.toLowerCase()));
      themeButton.setAttribute('title', themeButton.getAttribute('aria-label'));
      themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
    }
  }

  function setLanguage(value) {
    language = value === 'en' ? 'en' : 'pt-BR';
    document.documentElement.lang = language;
    save('ro3p-language', language);
    batching = true;
    try { walk(document.documentElement); } finally { batching = false; }
    controls();
  }
  function setTheme(value) {
    theme = value === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#12172b' : '#dfe4fc');
    save('ro3p-theme', theme);
    controls();
  }

  // Prevent a flash of the opposite theme before the full application renders.
  document.documentElement.dataset.theme = theme;
  document.documentElement.lang = language;
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('panel-language')?.addEventListener('change', e => setLanguage(e.target.value));
    document.getElementById('panel-theme')?.addEventListener('click', () => setTheme(theme === 'dark' ? 'light' : 'dark'));
    setTheme(theme);
    setLanguage(language);
    observer.observe(document.documentElement, {
      subtree: true, childList: true, characterData: true, attributes: true,
      attributeFilter: ['placeholder', 'aria-label', 'title', 'alt']
    });
  });
  window.RO3PanelPreferences = Object.freeze({
    get language() { return language; },
    get theme() { return theme; },
    setLanguage, setTheme
  });
})();
