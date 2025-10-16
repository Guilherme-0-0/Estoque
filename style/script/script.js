function mostrarAviso() {
  const aviso = document.getElementById('aviso');
  const caixa = aviso.querySelector('.caixa');

  // garante que o aviso está visível
  aviso.style.display = 'flex';

  // reinicia animação
  caixa.classList.remove('mostrar');
  void caixa.offsetWidth; // força reflow
  caixa.classList.add('mostrar');

  // esconde aviso após animação
  setTimeout(() => {
    aviso.style.display = 'none';
    caixa.classList.remove('mostrar');
  }, 2500); // mesmo tempo da animação
}

function mostrarErro() {
  const aviso = document.getElementById('aviso-erro');
  const caixa = aviso.querySelector('.caixa');

  aviso.style.display = 'flex';

  // reinicia animação
  caixa.classList.remove('mostrar');
  void caixa.offsetWidth; // força reflow
  caixa.classList.add('mostrar');

  // esconde aviso após a animação
  setTimeout(() => {
    aviso.style.display = 'none';
    caixa.classList.remove('mostrar');
  }, 2500);
}
let produtos = []; // array global

// Quando a página carregar
window.addEventListener('DOMContentLoaded', () => {
    fetch('../../registros/produtos.csv')
        .then(response => response.text())
        .then(text => {
            produtos = csvParaArray(text);
            console.log("Produtos carregados automaticamente:", produtos);
        })
        .catch(err => console.error("Erro ao carregar CSV:", err));
});




// Converte CSV em array de objetos
function csvParaArray(text) {
    const linhas = text.trim().split("\n");
    const cabecalho = linhas.shift().split(",").map(h => h.trim()); // remove espaços e \r

    return linhas.map(linha => {
        const valores = linha.split(",").map(v => v.trim());
        let obj = {};
        cabecalho.forEach((h, i) => obj[h] = valores[i]);
        return obj;
    });
}



function retirar() {
    const codigoBarra = document.getElementById('codigo_barra').value.trim();
    const quantidade = document.getElementById('quantidade').value.trim();
    const responsavel = document.getElementById('nome_retirada').value.trim();

    if (!codigoBarra || !quantidade || !responsavel) {
        mostrarErro();
        return;
    }

    // Procura produto pelo código
    const produtoObj = produtos.find(p => p.codigo === codigoBarra);
    if (!produtoObj) {
        mostrarErro(); // código não encontrado
        return;
    }

    const retirada = {
        produto: produtoObj.produto, 
        quantidade,
        responsavel,
        data_hora: new Date().toLocaleString()
    };

    let historico = JSON.parse(localStorage.getItem('historico')) || [];
    historico.push(retirada);
    localStorage.setItem('historico', JSON.stringify(historico));

    mostrarAviso();
   limparFormulario();
}

function limparFormulario() {
    document.getElementById('codigo_barra').value = '';
    document.getElementById('quantidade').value = '';
    document.getElementById('nome_retirada').value = '';
    document.getElementById('codigo_barra').focus(); // foca no input do código novamente
}


