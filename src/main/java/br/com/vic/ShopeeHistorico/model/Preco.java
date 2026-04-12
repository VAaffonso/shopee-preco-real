package br.com.vic.ShopeeHistorico.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Preco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String urlProduto;
    private Double preco;
    private LocalDate data;

    public Preco() {}

    public Preco(String urlProduto, Double preco, LocalDate data) {
        this.urlProduto = urlProduto;
        this.preco = preco;
        this.data = data;
    }

    public Long getId() { return id; }
    public String getUrlProduto() { return urlProduto; }
    public Double getPreco() { return preco; }
    public LocalDate getData() { return data; }
}