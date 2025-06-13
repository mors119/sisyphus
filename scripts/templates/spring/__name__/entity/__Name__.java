package com.sisyphus.backend.__name__.entity;

import com.sisyphus.backend.__name__.dto.__Name__Request;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "__name__")
@Getter

public class __Name__ {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;
}
