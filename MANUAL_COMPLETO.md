# MANUAL COMPLETO - Sistema de Estoque

## Sumário
- Visão Geral ........................................ 16
- Instalação & Execução .............................. 20
- Funcionalidades Principais ........................ 34
- Banco de Dados (Schema) ............................ 43
- Rotas / API (endpoints) ............................ 56
- Frontend (templates e assets) ...................... 76
- CSS: variáveis e estilos principais ................ 95
- Acessibilidade ..................................... 106
- Novas Funcionalidades ............................. 112
- Boas práticas e sugestões .......................... 127
- Arquivos importantes ............................... 135
- Sugestões rápidas aplicáveis agora .................. 142

## Visão Geral
Este projeto é um sistema simples de controle de estoque escrito em Flask (Python) com SQLite como banco de dados.
Objetivo: gerenciar entradas/saídas, histórico diário, exportação para Excel e interface acessível.

## Instalação & Execução
Requisitos:
- Python 3.10+
- pip
- Dependências: Flask, openpyxl

Passos:
1. clone o repositório
2. python -m venv .venv
3. source .venv/bin/activate
4. pip install -r requirements.txt  # se existir
5. flask init-db
6. flask run

## Funcionalidades Principais
- Login demo (admin/admin)
- Adição de produtos (modo rápido e completo)
- Retirada com confirmação e motivo
- Ajuste rápido de quantidade via botões (+/-)
- Histórico diário com filtro por período e exportação para Excel
- Exportação formatada (.xlsx) com cores por tipo de ação
- API para responsáveis (CRUD básico)

## Banco de Dados (Schema)
Tabelas principais:
- estoque:
  - id, codigo_de_barras, lote, validade_int, validade_text, produto_nome, quantidade, image_path, categoria
- movimentacao:
  - id, product_id, product_barcode, name, action, quantidade, motivo, timestamp
- responsaveis:
  - id, nome, criado_em

Observações:
- campo motivo foi adicionado em movimentacao (agrega informação do porquê)
- validade_int guarda timestamp (segundos desde epoch)

## Rotas / API (endpoints)
Principais rotas:
- GET/POST / (login)
- GET /usuario
- GET /home
- GET/POST /adicionar_produto
- GET/POST /retirada
- GET/POST /retirada_estoque/<produto_id>
- POST /api/adjust_quantity  (json)
- POST /api/retirar_com_motivo (json)
- POST /api/adicionar_com_motivo (json)
- GET /historico
- GET /exportar_historico
- GET/POST /api/responsaveis

Formato importante:
- /api/adjust_quantity espera JSON { product_id, action:'add' }
- /api/retirar_com_motivo aceita { product_id, quantidade, motivo } (motivo opcional)
- /api/adicionar_com_motivo aceita { product_id, quantidade, motivo } (motivo opcional)

## Frontend (templates e assets)
Templates principais:
- index.html (login)
- usuario.html (seletor de perfil)
- home.html (lista de produtos)
- adicionar_estoque.html (formulário de adição)
- retirar.html (scanner)
- retirar_estoque.html (detalhes e confirmação)
- historico.html (visão e filtros)

Assets:
- static/style/telainicial.css (estilos principais)
- static/img/ (imagens de produto)
- static/scripts/home.js (comportamento na home) [verificar existência]

Regras importantes:
- imagens servidas via /static/img/<filename> com validação de extensão
- templates usam a função t('chave') para tradução (inject_translation)

## CSS: variáveis e estilos principais
Variáveis CSS definidas (exemplos):
- --bg-1, --surface, --text-primary, --accent, --accent-hover, --border-default

Botões:
- action-btn[data-action="add"] -> gradiente verde
- action-btn[data-action="remove"] -> gradiente vermelho
- action-btn (info) -> gradiente azul

Responsividade:
- Mobile-first com @media para max-width:768px e 769-1100px

## Acessibilidade
- WCAG 2.1 AAA como objetivo
- Foco visível via outline de 3px e box-shadow
- Navegação por teclado, tooltips acessíveis (desabilitados em mobile)
- Tamanho mínimo de toque: 44-48px

## Novas Funcionalidades
1) Modal de confirmação na retirada
- Ajuste de quantidade no modal (+ / -)
- Campo motivo (aparece no histórico; agora opcional)
- Cancelar com ESC ou botão

2) Exportação para Excel (.xlsx)
- Arquivo por período com nome como historico_DDD-MM-YYYY.xlsx
- Cabeçalho verde com fonte branca; entradas em verde; saídas em vermelho
- Colunas: Data/Hora, Código de Barras, Produto, Ação, Quantidade, Motivo

3) Histórico diário
- Seletor de períodos (hoje, semana, mês, custom, all)
- Cada dia tratado como conjunto independente para exportação

## Boas práticas e sugestões
- Mover banco para app.instance_path para consistência (sqlite path)
- Usar SQLAlchemy para abstração e testes mais fáceis
- Criar um arquivo requirements.txt com dependências exatas
- Separar scripts JS por feature (home.js, historico.js)
- Validar/normalizar entradas no frontend antes de enviar
- Adicionar testes unitários para endpoints críticos

## Arquivos importantes
- app.py .............. lógica e rotas
- translations.py ...... dicionário de tradução
- static/style/telainicial.css
- templates/*.html ..... templates (views)
- NOVAS_FUNCIONALIDADES.md (descrição das features adicionadas)

## Sugestões rápidas aplicáveis agora (pequenas mudanças)
- Aceitar motivo vazio nas APIs de retirada/adição por modal
- Remover código morto na rota /retirada (após parse)
- Sanear nome de arquivo na exportação para evitar caracteres inválidos

## Alterações recentes (03-11-2025)

Resumo das mudanças realizadas em 03-11-2025 (implementadas no repositório):

- Implementado modo de alto contraste centralizado em `static/style/high_contrast.css`. Foram adicionadas regras específicas para componentes Bootstrap e classes do projeto para manter contraste alto e legibilidade.
- Corrigidas exceções de página: `creditos.html` foi explicitamente deixada fora do modo alto-contraste (controle no `static/scripts/high_contrast.js`).
- Ajustado o estilo do toggle "modo rápido" em `static/style/adicionar_estoque.css` (OFF cinza; ON verde) e forçado esquema preto/branco/amarelo quando o modo alto-contraste estiver ativo para legibilidade.
- Restaurado o rodapé com o link "Atena Maker" em vários templates (`index.html`, `home.html`, `historico.html`, `adicionar_estoque.html`, `retirar.html`, `retirar_estoque.html`, `acessibilidade.html`, `usuario.html`).
- Corrigido erro de sintaxe/Jinja em `templates/historico.html` (substituído uso de expressão inline em atributo `style` por uma classe condicional para evitar warnings e problemas de parsing).
- Reestruturada a página de login (`templates/index.html`) para retirar controles de acessibilidade/alto-contraste de dentro do formulário de login; estes controles agora vivem em `.accessibility-controls` fora do `<form>` e o rodapé de login foi movido para `.login-footer`. O arquivo `static/style/login.css` foi atualizado para suportar essa estrutura.

Como validar essas alterações localmente:

1. Criar e ativar o ambiente virtual (se ainda não existir):

  ```bash
  python -m venv .venv
  source .venv/bin/activate
  pip install -r requirements.txt  # se existir
  ```

2. Rodar a aplicação Flask localmente:

  ```bash
  flask run
  ```

3. Testes rápidos (navegar e verificar visual):
  - Abrir `/` (login): verifique que o formulário contém apenas campos de login; os controles de acessibilidade (alto-contraste, idioma) e o rodapé aparecem fora do formulário.
  - Abrir `/home` e `/adicionar_produto` (ou `/adicionar_estoque`): verificar o toggle "modo rápido" em modo normal e em alto-contraste.
  - Abrir `/historico`: verificar que o filtro/datepicker funciona e que não há warnings/template errors.
  - Abrir `/creditos`: verificar que o modo alto-contraste não altera the page (exclusão aplicada).

Próximos passos recomendados (priorizados):

1. Auditar e simplificar fluxos de UI (login, adicionar produto, retirada, histórico) — remover campos redundantes, melhorar labels e placeholders.
2. Melhorias de acessibilidade: foco visível consistente, navegação por teclado e tamanho mínimo de toque para botões críticos.
3. Criar `CHANGELOG.md` e `requirements.txt` (entrada inicial com as dependências detectadas).
4. Implementar pequenas dicas de onboarding (tooltips) para modos e recursos pouco óbvios (ex.: modo rápido, exportar histórico).
5. Adicionar testes básicos e uma rotina de verificação (lint/syntax) para evitar regressões.

Se quiser, posso começar a implementar os itens 3 (adicionar `requirements.txt` e `CHANGELOG.md`) e 4 (tooltip de onboarding) imediatamente — diga qual começa ou se prefere que eu execute o passo 2 (auditoria UI) antes.

Fim do manual.
