//package com.sisyphus.backend.image.entity;
//
//import com.sisyphus.backend.require.entity.Require;
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//
//@Entity
//@DiscriminatorValue("REQUIRE")
//@NoArgsConstructor
//@Getter
//public class RequireImage extends Image {
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "require_id")
//    private Require require;
//
//    public RequireImage( String url, String originName, String extension, Long size) {
//        super(url, originName, extension, size);
//    }
//
//    public void setNote(Require require) {
//        this.require = require;
//    }
//}