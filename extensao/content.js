async function salvarPreco(url, preco) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      {
        type: "SALVAR_PRECO",
        url: "https://shopee-preco-real.onrender.com/precos",
        body: { urlProduto: url, preco: preco },
      },
      (response) => {
        if (response?.success) {
          console.log("💾 Salvo no servidor:", response.data);
        } else {
          console.error("❌ Erro ao salvar:", response?.error);
        }
        resolve();
      }
    );
  });
}

async function exibirPainel(url, precoAtual) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      {
        type: "BUSCAR_HISTORICO",
        url: `https://shopee-preco-real.onrender.com/precos?url=${encodeURIComponent(url)}`,
      },
      (response) => {
        if (!response?.success) {
          console.error("❌ Erro ao buscar histórico:", response?.error);
          resolve();
          return;
        }

        const historico = response.data;
        const precos = historico.map((h) => h.preco);
        const menorPreco = Math.min(...precos);
        const maiorPreco = Math.max(...precos);

        const painelAntigo = document.getElementById("shopee-preco-real");
        if (painelAntigo) painelAntigo.remove();

        const painel = document.createElement("div");
        painel.id = "shopee-preco-real";
        painel.innerHTML = `
          <h3>📊 Histórico de Preço</h3>
          <p>💰 Preço atual: <strong>R$ ${precoAtual.toFixed(2)}</strong></p>
          <p>📉 Menor preço: <strong>R$ ${menorPreco.toFixed(2)}</strong></p>
          <p>📈 Maior preço: <strong>R$ ${maiorPreco.toFixed(2)}</strong></p>
          <p>🔍 Visitas registradas: <strong>${historico.length}</strong></p>
          <hr/>
          ${historico.map((h) => `<small>${h.data} → R$ ${h.preco.toFixed(2)}</small>`).join("<br/>")}
        `;

        document.body.appendChild(painel);
        resolve();
      }
    );
  });
}