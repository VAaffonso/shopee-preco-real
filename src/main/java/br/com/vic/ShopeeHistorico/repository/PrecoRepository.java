package br.com.vic.ShopeeHistorico.repository;

import br.com.vic.ShopeeHistorico.model.Preco;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface PrecoRepository extends JpaRepository<Preco, Long> {
    List<Preco> findByUrlProduto(String urlProduto);
    boolean existsByUrlProdutoAndData(String urlProduto, LocalDate data);
}