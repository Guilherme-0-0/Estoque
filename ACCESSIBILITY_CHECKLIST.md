# Checklist de Acessibilidade (WCAG - Rápido)

Use esta lista para testar manualmente as páginas principais do sistema.

## Prioridade Alta (deveria ser corrigido imediatamente)
- [ ] Todos os campos de formulário têm rótulos visíveis (<label>) conectados ao input via `for`/`id`.
- [ ] Todos os controles interativos são acessíveis por teclado (Tab / Enter / Space).
- [ ] Foco visível (outline ou ring) em todos os elementos focáveis.
- [ ] Contraste de cores mínimo 4.5:1 para texto normal e 3:1 para texto grande. Verificar modo normal e alto-contraste.
- [ ] Botões e alvos de toque com tamanho mínimo 44x44px em telas touch.
- [ ] Mensagens de erro são anunciadas via `aria-live` ou alteram o DOM com papel de alerta.

## Prioridade Média
- [ ] Campos `required` declaram `aria-required="true"` e mensagens de erro contextuais são próximas ao campo.
- [ ] Forms podem ser submetidos por teclado; botões principais possuem `type="submit"`.
- [ ] Links e botões possuem `aria-label` se o texto não for descritivo.

## Prioridade Baixa
- [ ] Modais (ex.: confirmar retirada) movem foco para o modal e retornam o foco ao fechar.
- [ ] Imagens importantes têm `alt` descritivo; imagens puramente decorativas têm `alt=""`.
- [ ] Seletor de idioma é legível e acessível (aria-checked/role apropriado se não for um checkbox nativo).

## Como usar
1. Abra cada página principal (/, /home, /adicionar_produto, /retirada, /historico, /creditos).
2. Use apenas o teclado para navegar e interagir. Corrija onde encontrar bloqueios.
3. Teste modo alto-contraste e compare o contraste e legibilidade.
4. Anote problemas e priorize pela lista acima.

