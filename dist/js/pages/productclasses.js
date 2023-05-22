//classescode
var productClasses = (function(){
class product {
    constructor(id,code,description,name,status,pricelist) {
        this.id = id;
        this.code = code;
        this.desc = description;
        this.name = name;
        this.status = status;
        this.pricelist = pricelist;
    }
}
class productprice{
    constructor(id,code,price,effectiveDate,status){
        this.id = id; 
        this.code = code; 
        this.price = price;
        this.effectiveDate = effectiveDate;
        this.status = status;
    }
}
class product_service {
    constructor() {
        this.products = [];
        this.productprices = [];
        this.productprice;
        this.product;
    }
    addProducttoArray(id,code,description,name,status,pricelist) {
        let product_arritem = new product(id,code,description,name,status,pricelist);
        this.products.push(product_arritem);
    }
    addProductPricetoArray(id,code,price,effectiveDate,status){
        let product_price_arritem = new productprice(id,code,price,effectiveDate,status)
        this.productprices.push(product_price_arritem);
    }
    allProduct() {
        return this.products;
    }
    getProduct(code) {
        this.product = this.products.find(product => product.code == code);
        return this.product;
    }
    getProductById(id) {
        this.product = this.products.find(product => product.id == id);
        return this.product;
    }
    getActivePrice(code){
        this.product = this.products.find(product => product.code == code);
        let pricelist = []
        pricelist = this.product.pricelist;
        let price = pricelist.find(price => price.status == "ACTIVE");
        return price;  
    }
    getProductPrice(product, code) {
        this.product = this.products.find(products => products.code == product);
        this.productprices = this.product.pricelist;
        this.productprice = this.productprices.find(productprice => productprice.code == code);
        this.product = this.productprices = undefined;
        return this.productprice;
    }
    clear() {
        this.products = [];
        this.product = undefined;

    }
}
class ProductSerial {
    constructor() {
        this.parent_code;
        this.code;
        this.index;
        this.length;
        this.GroupCode;
    }
    genarateProductCode(index) {
        this.code = "P";
        this.index = index + 1;
        this.length = 7;
        this.GroupCode = this.code + String(this.index).padStart(this.length - 2, '0');
        return this.GroupCode;
    }
    genarateProductPriceCode(index, parent_code) {
        this.parent_code = parseInt(parent_code.match(/\d+/));
        this.code = "PP";
        this.index = parseInt(String(this.parent_code).concat("0", index + 1));
        this.length = 7;
        this.GroupCode = this.code + String(this.index).padStart(this.length - 2, '0');
        return this.GroupCode;
    }
}
function productClassesInstence(){
    return{
        product: new product(),
        productprice: new productprice(),
        product_service: new product_service(),
        ProductSerial: new ProductSerial()
    }
}
return {
    productClassesInstence : productClassesInstence
}
})();
//end of classes