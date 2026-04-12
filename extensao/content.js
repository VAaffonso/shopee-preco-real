const API_URL = "http://localhost:8080/precos";

function encontrarPreco() {
  const seletores = [
    ".Rt4WYl", ".pmmxKx", ".IZPeQz", "._3n5NQx",
    "[class*='price'] span", "[class*='Price'] span",
  ];
  for (const seletor of seletores) {
    const el = document.querySelector(seletor);
    if (el && el.innerText.includes("R$")) return el;
  }
  return null;
}

async function iniciar() {
  const urlProduto = window.location.href;
  const elementoPreco = encontrarPreco();

  if (!elementoPreco) {
    console.log("Preço não encontrado nessa página.");
    return;
  }

  const textoPreco = elementoPreco.innerText;
  const precoAtual = parseFloat(
    textoPreco.replace("R$", "").replace(/\./g, "").replace(",", ".").trim()
  );

  console.log("✅ Preço encontrado:", precoAtual);

  await salvarPreco(urlProduto, precoAtual);
  await exibirPainel(urlProduto, precoAtual);
}

async function salvarPreco(url, preco) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urlProduto: url, preco: preco }),
    });
    const data = await response.json();
    console.log("💾 Salvo no servidor:", data);
  } catch (err) {
    console.error("❌ Erro ao salvar:", err);
  }
}

async function exibirPainel(url, precoAtual) {
  try {
    const response = await fetch(`${API_URL}?url=${encodeURIComponent(url)}`);
    const historico = await response.json();

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
  } catch (err) {
    console.error("❌ Erro ao buscar histórico:", err);
  }
}

let ultimaUrl = window.location.href;
let iniciado = false;

function limparPainel() {
  const painelAntigo = document.getElementById("shopee-preco-real");
  if (painelAntigo) painelAntigo.remove();
}

function isPaginaDeProduto(url) {
  return url.includes("shopee.com.br/") && url.match(/\-i\.\d+\.\d+/);
}

const observer = new MutationObserver(() => {
  const urlAtual = window.location.href;

  // URL mudou
  if (urlAtual !== ultimaUrl) {
    ultimaUrl = urlAtual;
    iniciado = false;
    limparPainel();

    // Se não é página de produto, para por aqui
    if (!isPaginaDeProduto(urlAtual)) return;
  }

  // Já iniciou nessa página, não faz nada
  if (iniciado) return;

  const el = encontrarPreco();
  if (el) {
    iniciado = true;
    iniciar();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});