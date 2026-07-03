"use strict";

let products = getProducts();

function save() {
    saveProducts(products);
}

function addProduct(product){

    product.id = createId();
    product.sold = 0;

    products.push(product);

    save();

}

function updateProductStock(id, stock){

    const p = products.find(p => p.id === id);

    if(p){

        p.stock = stock;

        save();

    }

}
