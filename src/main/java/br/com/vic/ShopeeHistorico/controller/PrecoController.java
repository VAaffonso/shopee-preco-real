package br.com.vic.ShopeeHistorico.controller;

import br.com.vic.ShopeeHistorico.model.Preco;
import br.com.vic.ShopeeHistorico.repository.PrecoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/precos")
public class PrecoController {

    @Autowired
    private PrecoRepository repository;

    @PostMapping
    public Preco salvar(@RequestBody Preco preco) {
        boolean jaExiste = repository.existsByUrlProdutoAndData(
                preco.getUrlProduto(), LocalDate.now()
        );
        if (jaExiste) return null;

        preco = new Preco(preco.getUrlProduto(), preco.getPreco(), LocalDate.now());
        return repository.save(preco);
    }

    @GetMapping
    public List<Preco> buscar(@RequestParam String url) {
        return repository.findByUrlProduto(url);
    }

    @GetMapping("/todos")
    public List<Preco> buscarTodos() {
        return repository.findAll();
    }

    @GetMapping("/resumo")
    public List<Map<String, Object>> resumo() {
        List<Preco> todos = repository.findAll();

        Map<String, List<Preco>> agrupados = todos.stream()
                .collect(Collectors.groupingBy(Preco::getUrlProduto));

        List<Map<String, Object>> resultado = new ArrayList<>();

        for (Map.Entry<String, List<Preco>> entry : agrupados.entrySet()) {
            String url = entry.getKey();
            List<Preco> historico = entry.getValue();

            historico.sort(Comparator.comparing(Preco::getData));

            double menorPreco = historico.stream().mapToDouble(Preco::getPreco).min().orElse(0);
            double maiorPreco = historico.stream().mapToDouble(Preco::getPreco).max().orElse(0);
            double ultimoPreco = historico.get(historico.size() - 1).getPreco();
            double primeiroPreco = historico.get(0).getPreco();
            LocalDate ultimaData = historico.get(historico.size() - 1).getData();

            String nomeBruto = url.contains("/") ? url.substring(url.lastIndexOf("/") + 1) : url;
            if (nomeBruto.contains("?")) nomeBruto = nomeBruto.substring(0, nomeBruto.indexOf("?"));
            String nome = nomeBruto.replace("-", " ");
            if (nome.length() > 60) nome = nome.substring(0, 60) + "…";

            Map<String, Object> item = new LinkedHashMap<>();
            item.put("url", url);
            item.put("nome", nome);
            item.put("ultimoPreco", ultimoPreco);
            item.put("menorPreco", menorPreco);
            item.put("maiorPreco", maiorPreco);
            item.put("primeiroPreco", primeiroPreco);
            item.put("ultimaData", ultimaData.toString());
            item.put("totalRegistros", historico.size());
            item.put("historico", historico);

            resultado.add(item);
        }

        resultado.sort((a, b) -> ((String) b.get("ultimaData")).compareTo((String) a.get("ultimaData")));

        return resultado;
    }
    @DeleteMapping
    public void deletar(@RequestParam String url) {
        List<Preco> registros = repository.findByUrlProduto(url);
        repository.deleteAll(registros);
    }
}