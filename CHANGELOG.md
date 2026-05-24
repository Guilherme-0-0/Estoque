# CHANGELOG

Todas as mudanças importantes neste repositório são registradas neste arquivo.

## [Unreleased]
- Documentação inicial e tarefas planejadas.

## 2025-11-03 - Alterações aplicadas
- Implementado modo de alto-contraste em `static/style/high_contrast.css` com regras específicas para formulários, botões e componentes.
- Excluída a página `creditos.html` do modo alto-contraste (controle em `static/scripts/high_contrast.js`).
- Ajustado toggle "Modo Rápido" para cores padrão (OFF cinza, ON verde) e sobrescrito em alto-contraste para esquema preto/branco/amarelo.
- Restaurado link de rodapé "Atena Maker" em vários templates (login, home, histórico, adicionar produto, retirada, etc.).
- Corrigido erro Jinja em `templates/historico.html` (condicional moved to class attribute).
- Reestruturada a página de login (`templates/index.html`) para retirar controles de acessibilidade de dentro do formulário e movê-los para `.accessibility-controls`; rodapé de login movido para `.login-footer`.
- Adicionada função utilitária em `app.py` para validar se dependências do `requirements.txt` estão instaladas e opcionalmente instalar via pip (controlado por variável de ambiente `AUTO_INSTALL_DEPS`).
- Criados `requirements.txt` e arquivos de suporte (tooltips, checklist de acessibilidade).


## Notas
- Testes manuais recomendados: verificar toggles, alto-contraste (localStorage), fluxo de login e páginas afetadas.
