const API = "https://shopee-preco-real.onrender.com/precos/resumo";

function formatarPreco(valor) {
  return "R$ " + valor.toFixed(2).replace(".", ",");
}

function formatarData(dataStr) {
  if (!dataStr) return "";
  const [ano, mes, dia] = dataStr.split("-");
  return `${dia}/${mes}/${ano}`;
}

function toggleHistorico(btn, listaEl) {
  const aberto = listaEl.classList.toggle("aberto");
  btn.textContent = aberto ? "▲ Ocultar histórico" : "▼ Ver histórico completo";
}

async function carregarProdutos() {
  const loading = document.getElementById("loading");
  const vazio = document.getElementById("vazio");
  const lista = document.getElementById("lista");
  const footer = document.getElementById("footer");
  const contador = document.getElementById("contador");

  try {
    const response = await fetch(API);
    if (!response.ok) throw new Error("Erro na API");
    const produtos = await response.json();

    loading.style.display = "none";

    if (!produtos || produtos.length === 0) {
      vazio.style.display = "flex";
      return;
    }

    contador.textContent = `${produtos.length} produto${produtos.length > 1 ? "s" : ""}`;
    lista.style.display = "flex";
    footer.style.display = "block";
    lista.innerHTML = "";

    produtos.forEach((p) => {
      const tendencia = p.ultimoPreco < p.primeiroPreco
        ? { classe: "baixou", texto: "🟢 Baixou" }
        : p.ultimoPreco > p.primeiroPreco
        ? { classe: "subiu", texto: "🔴 Subiu" }
        : { classe: "estavel", texto: "⚪ Estável" };

      const card = document.createElement("div");
      card.className = "produto-card";

      const historicoHtml = (p.historico || [])
        .slice()
        .reverse()
        .map(h => `
          <div class="historico-item">
            <span>${formatarData(h.data)}</span>
            <span>${formatarPreco(h.preco)}</span>
          </div>
        `).join("");

      card.innerHTML = `
        <div class="produto-nome">
          <span>${p.nome}</span>
          <a href="${p.url}" target="_blank">Ver →</a>
        </div>
        <div class="produto-precos">
          <div class="preco-tag">
            <span class="label">Último</span>
            <span class="valor">${formatarPreco(p.ultimoPreco)}</span>
          </div>
          <div class="preco-tag menor">
            <span class="label">📉 Menor</span>
            <span class="valor">${formatarPreco(p.menorPreco)}</span>
          </div>
          <div class="preco-tag maior">
            <span class="label">📈 Maior</span>
            <span class="valor">${formatarPreco(p.maiorPreco)}</span>
          </div>
        </div>
        <div class="produto-meta">
          <span class="badge ${tendencia.classe}">${tendencia.texto}</span>
          <span class="ultima-data">Última visita: ${formatarData(p.ultimaData)}</span>
        </div>
        ${p.historico && p.historico.length > 1 ? `
          <button class="historico-toggle">▼ Ver histórico completo</button>
          <div class="historico-lista">${historicoHtml}</div>
        ` : ""}
      `;

      const btn = card.querySelector(".historico-toggle");
      const listaEl = card.querySelector(".historico-lista");
      if (btn && listaEl) {
        btn.addEventListener("click", () => toggleHistorico(btn, listaEl));
      }

      lista.appendChild(card);
    });

  } catch (err) {
    loading.innerHTML = `
      <span style="font-size:28px">⚠️</span>
      <span style="color:#c0392b">Erro ao conectar ao servidor</span>
      <span style="font-size:11px;color:#bbb">Verifique se o backend está online</span>
    `;
  }
}

carregarProdutos();