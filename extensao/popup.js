const API = "https://shopee-preco-real.onrender.com/precos/todos";

async function carregarProdutos() {
  const lista = document.getElementById("lista");

  try {
    const response = await fetch(API);
    const todos = await response.json();

    if (todos.length === 0) {
      lista.innerHTML = '<p class="vazio">Nenhum produto monitorado ainda.<br/>Visite um produto na Shopee!</p>';
      return;
    }

    // Agrupa por URL
    const produtos = {};
    todos.forEach((item) => {
      if (!produtos[item.urlProduto]) {
        produtos[item.urlProduto] = [];
      }
      produtos[item.urlProduto].push(item);
    });

    lista.innerHTML = "";

    Object.entries(produtos).forEach(([url, historico]) => {
      const precos = historico.map((h) => h.preco);
      const menorPreco = Math.min(...precos);
      const ultimoPreco = historico[historico.length - 1].preco;
      const primeiroPreco = historico[0].preco;

      // Extrai nome do produto da URL
      const nomeBruto = url.split("/").pop().split("?")[0];
      const nome = decodeURIComponent(nomeBruto).replace(/-/g, " ").slice(0, 60);

      // Badge de tendência
      let badge = "";
      if (ultimoPreco < primeiroPreco) {
        badge = `<span class="badge-queda">🟢 Baixou</span>`;
      } else if (ultimoPreco > primeiroPreco) {
        badge = `<span class="badge-alta">🔴 Subiu</span>`;
      }

      lista.innerHTML += `
        <div class="produto">
          <div class="produto-nome">
            ${nome}
            <a class="ver" href="${url}" target="_blank">Ver →</a>
          </div>
          <div class="produto-preco">
            R$ ${ultimoPreco.toFixed(2)} ${badge}
          </div>
          <div class="produto-menor">
            📉 Menor registrado: R$ ${menorPreco.toFixed(2)}
          </div>
        </div>
      `;
    });

  } catch (err) {
    lista.innerHTML = '<p class="vazio">Erro ao carregar produtos.</p>';
  }
}

carregarProdutos();