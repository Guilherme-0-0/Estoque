document.addEventListener('DOMContentLoaded', () => {
    const historico = JSON.parse(localStorage.getItem('historico')) || [];
    const tbody = document.getElementById('tabelaHistorico');

    historico.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${r.produto}</td>
            <td>${r.quantidade}</td>
            <td>${r.responsavel}</td>
            <td>${r.data_hora}</td>
        `;
        tbody.appendChild(tr);
    });

    // Botão exportar Excel
    document.getElementById('exportarExcel').addEventListener('click', () => {
        if (historico.length === 0) return;
        const ws = XLSX.utils.json_to_sheet(historico);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Saidas");
        XLSX.writeFile(wb, `saida_${new Date().toISOString().slice(0,10)}.xlsx`);
    });
});


let tr = document.createElement('tr');

tr.innerHTML = `
  <td data-label="Produto">${produto}</td>
  <td data-label="Quantidade">${quantidade}</td>
  <td data-label="Responsável">${responsavel}</td>
  <td data-label="Data/Hora">${dataHora}</td>
`;

document.getElementById('tabelaHistorico').appendChild(tr);
