package br.com.vic.ShopeeHistorico.controller;

import br.com.vic.ShopeeHistorico.model.Preco;
import br.com.vic.ShopeeHistorico.repository.PrecoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

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
}