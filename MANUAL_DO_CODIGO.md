def login_required(f):
 # Manual do Código — Projeto Estoque (versão longa, direta e sem rodeios)

Ok. Você pediu mais — e com um tom mais ácido/abrasivo. Vou ser direto: este manual não é fofo. Vai apontar os problemas, mostrar o que funciona, o que cheira mal e como consertar. Se alguma coisa estiver errada no código, eu vou dizer. Se você preferir um cafuné, peça depois.

Arquivos analisados: `app.py`, `translate_templates.py`, `translations.py` e `scripts/seed_db.py` (quando presente).

## Sumário (extenso)

- 1) Introdução rápida (pra quem tá com pressa)
- 2) Setup e Quickstart (faça isso primeiro)
- 3) Visão geral do `app.py` — explicação linha a linha das partes importantes
- 4) Banco de dados: esquema, transações e armadilhas
- 5) Fluxos principais: adicionar, retirar e limpar estoque (passo a passo)
- 6) APIs e chamadas AJAX (exemplos práticos com curl)
- 7) Internacionalização (como adicionar/editar traduções)
- 8) Exportar histórico para Excel — detalhando `openpyxl`
- 9) Debug, logs e as coisas que costumam queimar no deploy
- 10) Segurança: o que consertar se você levar esse projeto pra produção
- 11) Testes automatizados (exemplos `pytest`) — faça isso antes que alguém quebre tudo
- 12) Deploy recomendado (Gunicorn, Docker, variáveis de ambiente)
- 13) Checklist final e perguntas frequentes (FAQ)
- Apêndices: snippets rápidos, comandos úteis, glossário
---

## Introdução (curta e direta)

Este manual te guia pelos pedaços do código do projeto Estoque com linguagem simples e exemplos práticos. Se você já sabe o básico de Python, vai entender rapidinho — e se não, calma que eu seguro sua mão nas partes importantes.

Use como referência ou leitura casual quando estiver tomando café. Vamos lá.

---

## O que você precisa ter (pré-requisitos)

- Python 3.10+ (ou parecido)
- pip
- Recomendo um ambiente virtual (para não bagunçar seu Python global):

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Pronto. Agora respira e vamos ao projeto.

---

## Estrutura do projeto — onde estão as coisas (sem drama)

- `app.py` — coração do app. Rotas, banco, lógica.
- `translations.py` — dicionário de traduções (pt / es).
- `translate_templates.py` — ajudante pra trocar texto nos templates (opcional).
- `templates/` — HTML com Jinja2.
- `static/` — CSS, JS, imagens.
- `scripts/seed_db.py` — (se tiver) script pra encher o banco com dados de exemplo.

Se você perder algo, a rota `/debug/list_files` ajuda a listar templates e arquivos estáticos.

---

## Capítulo 1 — O básico: Flask, rotas e sessões (explicação simples)

Pense no Flask como um porteiro: ele recebe pedidos HTTP e chama a função certa.

Exemplo mínimo de rota:

```python
@app.route('/home')
def home():
    return render_template('home.html')
```

- Para pegar dados de formulários: `request.form['campo']`.
- Para pegar parâmetros na URL: `request.args.get('q')`.
- Sessões: `session['user'] = 'Guilherme'` guarda o usuário entre páginas.

Protegendo rotas (tipo: só deixa entrar quem tá logado):

```python
def login_required(f):
    @wraps(f)
    def inner(*a, **k):
        if 'user' not in session:
            return redirect(url_for('login'))
        return f(*a, **k)
    return inner
```

Exercício bobinho: crie uma rota `/segredo` que só mostra uma mensagem se `session['user']` existir — senão manda para `/`.

---

## Capítulo 2 — Templates e arquivos estáticos (mais prático)

Templates usam Jinja2. Você manda variáveis do Python pro HTML com `render_template('x.html', nome='Arroz')`.

O projeto injeta a função `t` pra tradução nos templates: `{{ t('add_product') }}` — muito útil quando alguém pede o site em espanhol.

Arquivos estáticos ficam em `static/`. O app tem rotas customizadas pra servir esses arquivos e logar quando algo não existe (útil pra achar imagens quebradas).

Dica: coloque uma imagem engraçada (ex: `static/img/arroz.png`) e referencie no HTML — se estiver faltando, `/verify_resources` aponta o problema.

---

## Capítulo 3 — Banco de dados (SQLite) explicado como se fosse uma cozinha

---

## 1) Introdução rápida (pra quem tá com pressa)

Resumo em 30 segundos: o app é um sistema de estoque simples em Flask + SQLite. Tem rotas pra adicionar e retirar produtos, um histórico de movimentações, APIs para o frontend e exportação pra Excel. Tem tradução pt/es e várias melhorias úteis — algumas feitas direito, outras meio gambiarra.

Se você já instalou as dependências e rodou `flask init-db`, pule pro Capítulo 3. Se não, siga o Quickstart.

---

## 2) Setup e Quickstart (faça isso primeiro)

1. Clone o repositório e entre nele.
2. Crie e ative um virtualenv:

```bash
python -m venv .venv
source .venv/bin/activate
```

3. Instale deps:

```bash
pip install -r requirements.txt
```

4. Inicialize o banco:

```bash
flask init-db
```

5. Rode a aplicação em dev:

```bash
python app.py
```

Se alguma dependência falhar, leia o `requirements.txt` e instale manualmente. Não invente versões aleatórias — use as do arquivo.

---

## 3) Visão geral do `app.py` — o que importa e o que você deve reparar

Vou dissecar as partes relevantes. Não vou colar TODO o arquivo, só o que interessa.

3.1 Config e inicialização

- `app = Flask(__name__)`
- `app.secret_key` está hardcoded — isso é ok pra dev, ridículo pra produção. Use `os.environ['SECRET_KEY']` em vez disso.
- `DATABASE_PATH = os.path.join(app.root_path, 'banco.db')` — bom: caminho absoluto evita problemas quando o CWD muda.

3.2 Contexto de tradução

```python
@app.context_processor
def inject_translation():
        lang = session.get('lang', 'pt')
        return {'t': lambda key: translate(key, lang), 'lang': lang, 'translations': get_all_translations(lang)}
```

Isso injeta `t` nos templates — use `{{ t('chave') }}` sempre que for texto visível.

3.3 Conexão com DB

`get_db()` salva a conexão em `g.db` e define `row_factory = sqlite3.Row` — bom.

`@app.teardown_appcontext` faz commit e close. Se você estiver em uma request que falhou, o commit ainda é chamado aqui; isso pode levar a commits indesejados se o seu código não proteger transações. Melhor prática: commit explicitamente onde mudar dados, e no teardown somente fechar.

3.4 Rotas importantes (resumo rápido)

- `/` — login (admin/admin) — ridículo em produção.
- `/home` — lista produtos, filtros, paginação e ordenação inteligente por validade.
- `/adicionar_produto` — formulário POST que faz insert/update e registra movimentação.
- `/retirada` e `/retirada_estoque/<id>` — fluxo de retirada.
- `/historico` — tela de histórico com filtros por data/ação.
- `/exportar_historico` — gera Excel (openpyxl).
- APIs: `/api/produtos_por_codigo`, `/api/adjust_quantity`, `/api/retirar_com_motivo`, `/api/adicionar_com_motivo`, `/api/responsaveis`.

3.5 Funções utilitárias

- `validar_imagem(filename)` — verifica extensão.
- `limpar_estoque_zerado()` — executa `DELETE FROM estoque WHERE quantidade <= 0`.

Observação direta: revise onde `db.commit()` é chamado — alguns blocos usam `db.commit()` no teardown, outros chamam após operações; isso pode esconder erros. Seja explícito: commit quando terminar a operação.

---

## 4) Banco de dados — esquema, transações e armadilhas (não vacile aqui)

Tabelas (resumo):

- `estoque` (id, codigo_de_barras TEXT, lote, validade_int, validade_text, produto_nome, quantidade, image_path, categoria)
- `movimentacao` (id, product_id, product_barcode, name, action, quantidade, motivo, timestamp)
- `responsaveis` (id, nome, criado_em)

4.1 Tipos e escolhas erradas

- `codigo_de_barras` está como TEXT — bom, evita perder zeros à esquerda.
- `validade_int` é timestamp (int) e `validade_text` é string formatada — redundante, mas prático para ordenação e exibição.

4.2 Queries: parâmetros sempre

NÃO concatene strings em SQL. Sempre use `?` e tupla.

4.3 Transações e concorrência

SQLite é OK para aplicações pequenas. Se você tiver múltiplos processos concorrendo, vai dar conflito. Para produção com vários workers, pense em PostgreSQL.

4.4 Exemplo: criar as tabelas (o que `init_db()` faz)

```sql
CREATE TABLE IF NOT EXISTS estoque(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo_de_barras TEXT NOT NULL,
    lote TEXT NOT NULL,
    validade_int INTEGER NOT NULL,
    validade_text TEXT NOT NULL,
    produto_nome TEXT NOT NULL,
    quantidade INTEGER,
    image_path TEXT,
    categoria INTEGER NOT NULL
);
```

4.5 Backups e manutenção

Faça backups regulares do `banco.db`. SQLite é um arquivo único — copie com o app parado ou use `sqlite3` `.backup()`.

---

## 5) Fluxos principais — passo a passo (adicionar / retirar / limpar)

Aqui eu mostro exemplos reais e possíveis falhas.

5.1 Adicionar produto (`/adicionar_produto`)

Fluxo simplificado:

1. Recebe `codigo_de_barras`, `validade`, `quantidade` e, dependendo do modo, outros campos.
2. Converte validade para timestamp (aceita `DD/MM/YYYY` e `YYYY-MM-DD`).
3. Procura por produto com mesmo `codigo_de_barras` e `validade_text`.
4. Se existe → soma quantidade e `UPDATE`. Se não → `INSERT`.
5. Registra na tabela `movimentacao` com `action='entrada'`.

Dica: sempre valida `quantidade` como inteiro >= 1. O código já tenta, mas trate `ValueError` corretamente.

Exemplo de requisição (form):

```http
POST /adicionar_produto
Form data:
    codigo_de_barras=12345
    validade=25/12/2025
    quantidade=10
    produto_nome=Arroz Falante
```

Problemas comuns:

- Formato de data inválido → ValueError
- Modo rápido encontra produto com mesmo código mas não com mesma validade; o app tenta pegar referência — teste esse caminho.

5.2 Retirar produto (`/retirada` → `/retirada_estoque/<id>`)

Passos:

1. `/retirada` recebe `codigo_de_barras` + `validade` e localiza o item com `quantidade > 0`.
2. Redireciona para `retirada_com_id` com o `produto_id`.
3. No POST final, valida se `quantidade_retirada` é <= quantidade disponível.
4. Faz `UPDATE estoque SET quantidade = ?` e insere `movimentacao` com action `retirada` e motivo/responsável.
5. Chama `limpar_estoque_zerado()` para apagar itens zerados.

Caso teste maluco: retirar 999999 → o app vai validar e devolver erro de estoque insuficiente.

5.3 Limpar estoque

`limpar_estoque_zerado()` faz `DELETE FROM estoque WHERE quantidade <= 0`. É simples e funciona, mas tenha atenção: se você quiser manter registros históricos sobre lotes zerados (para auditoria), não apague — marque como inativo.

---

## 6) APIs e exemplos práticos (curl, JSON)

6.1 `/api/produtos_por_codigo?codigo=...`

Exemplo de uso:

```bash
curl 'http://127.0.0.1:5000/api/produtos_por_codigo?codigo=12345'
```

Resposta (exemplo):

```json
[ ... ]
```

6.2 `/api/adjust_quantity` (POST JSON)

```bash
curl -X POST -H 'Content-Type: application/json' -d '{"product_id":1, "action":"add"}' http://127.0.0.1:5000/api/adjust_quantity
```

Resposta esperada:

```json
{"ok": true, "new_quantity": 11}
```

6.3 `/api/retirar_com_motivo` (exige `motivo`)

```bash
curl -X POST -H 'Content-Type: application/json' -d '{"product_id":1, "quantidade":2, "motivo":"Doacao"}' http://127.0.0.1:5000/api/retirar_com_motivo
```

Resposta: `{ "ok": true, "new_quantity": 9 }` ou erro com status code apropriado.

---

## 7) Internacionalização (i18n) — adicionar/editar traduções sem drama

`translations.py` tem `TRANSLATIONS` com chaves e dois idiomas (`pt`, `es`).

7.1 Como adicionar uma chave nova

1. Abra `translations.py` e adicione:

```python
"nova_chave": {"pt": "Texto em PT", "es": "Texto en ES"}
```

2. No template: `{{ t('nova_chave') }}` — pronto.

3. No backend: `translate('nova_chave', session.get('lang', 'pt'))`.

Se esquecer de colocar `es`, a função `translate` devolve a versão `pt` por padrão — ok, mas não ideal.

---

## 8) Exportar histórico para Excel — olha o que o código faz por baixo

Rota: `/exportar_historico`.

O que acontece:

- Busca movimentações por período (hoje, semana, mês, custom, all).
- Cria um `Workbook()` com `openpyxl`.
- Escreve cabeçalho com `PatternFill` e `Font` e formata células de `action` com cor verde/vermelha.
- Ajusta larguras e envia via `BytesIO` com `send_file`.

Dica: se o Excel abrir com problema de encoding, verifique os dados em `movimentacoes` (caracteres especiais) — o `openpyxl` lida bem, mas strings malformadas quebram tudo.

---

## 9) Debug e logs (o que olhar quando a coisa explode)

9.1 Logs úteis

- `app.logger.error(...)` — procure por mensagens ao reproduzir erro.
- A rota `/debug/list_files` ajuda a verificar se templates e assets existem.

9.2 Erros comuns e como encontrar

- 500 no Excel: rode o endpoint manualmente e olhe o stacktrace (dev mode). Problemas comuns: dados inesperados em `movimentacoes`.
- Problemas de imagem: `validar_imagem` só checa extensão; se você salvar o caminho errado, a rota `/static/img/...` retorna 404 e o template quebra.
- Conexão SQLite travada: tente `lsof banco.db` e veja processos usando o DB. Em dev com vários workers, SQLite pode travar.

---

## 10) Segurança — o que consertar antes de expor ao mundo

Não seja preguiçoso.

- Troque `app.secret_key` por uma variável de ambiente.
- Implemente autenticação real (Flask-Login) e armazene senhas com `bcrypt`/`passlib`.
- Valide uploads: `secure_filename`, limite de tamanho e verificação MIME/assinatura magic bytes.
- Remova o `debug=True` no `app.run()` em produção.
- Para múltiplos workers, use PostgreSQL em vez de SQLite.

Checklist mínimo de produção:

1. SECRET_KEY no env
2. DEBUG=False
3. Banco em servidor (Postgres)
4. Autenticação e permissões
5. TLS (HTTPS) na frente do app

---

## 11) Testes automatizados — comece pequeno, cresça rápido

11.1 Teste unitário simples para `validar_imagem` e `translate`

Crie `tests/test_utils.py` com:

```python
import pytest
from translations import translate
from app import validar_imagem

def test_translate():
        assert translate('login_button', 'pt') == 'Entrar'

def test_validar_imagem():
        assert validar_imagem('foto.png') is True
        assert validar_imagem('script.js') is False
```

11.2 Teste de integração (exemplo com client Flask)

```python
from app import app

def test_home_page():
        client = app.test_client()
        rv = client.get('/home')
        assert rv.status_code == 200
```

Rode com:

```bash
pytest -q
```

11.3 Sugestão: usar fixture para criar DB temporário (`:memory:`) ou copiar um `banco.db` de teste.

---

## 12) Deploy (como eu faria sem drama)

12.1 Gunicorn (simples)

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

12.2 Docker (Dockerfile mínimo)

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY . /app
RUN pip install -r requirements.txt
ENV FLASK_ENV=production
ENV SECRET_KEY=change_me
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "app:app"]
```

12.3 Variáveis de ambiente recomendadas

- SECRET_KEY
- DATABASE_PATH (se quiser armazenar fora do container)
- AUTO_INSTALL_DEPS (opcional)

---

## 13) Checklist final e FAQ (respostas curtas e afiadas)

Antes de subir pra produção:

- [ ] SECRET_KEY em env
- [ ] DEBUG=False
- [ ] Banco robusto (Postgres) se houver concorrência
- [ ] Autenticação com senhas seguras
- [ ] Testes básicos passando
- [ ] Backup do DB

FAQ rápido:

- Q: "Posso usar SQLite em produção?"
- A: Só se for um deploy pequeno com 1 processo. Se tiver 2+ workers fique longe.

- Q: "Por que as imagens quebram às vezes?"
- A: Porque os templates referenciam caminhos estáticos que não existem. Rode `/verify_resources`.

- Q: "Como adiciono tradução nova?"
- A: `translations.py` → add chave → use `t('chave')`.

---

## Apêndices

Apêndice A — Snippets úteis

- `flask init-db` — inicializa DB
- `python app.py` — roda em dev
- cURL examples: já descritos no Capítulo 6

Apêndice B — Glossário curto

- CRUD — Create/Read/Update/Delete
- i18n — internacionalização
- WSGI — servidor de aplicações Python (Gunicorn é um exemplo)

---
