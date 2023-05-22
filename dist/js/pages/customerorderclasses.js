var customerorderClasses = (function(){
//classescodematerial
class customerorder {
    constructor(id,code,JobID,JobNumber,customerid,totalAmount,grossAmount,remark,customerOrderProducts,printeddate,status) {
        this.id = id;
        this.code = code;
        this.jobID = JobID;
        this.jobNumber = JobNumber;
        this.customerid = customerid; 
        this.totalAmount = totalAmount;
        this.grossAmount = grossAmount;
        this.remark = remark;
        this.customerOrderProducts = customerOrderProducts;
        this.printeddate = printeddate;
        this.status = status;
    }
}
class customerOrderProducts{
    constructor(id,code,product,unitrate,quantity){
        this.id = id; 
        this.code = code;
        this.product = product;
        this.quantity = quantity; 
	    this.unitrate = unitrate;
    }
}
class customerorder_service {
    constructor() {
        this.customerorders = [];
        this.customerOrderProducts = [];
        this.customerorder;

    }
    addCustomerOrdertoArray(id,code,JobID,JobNumber,customerid,totalAmount,grossAmount,remark,customerOrderProducts,printeddate,status) {
        let customerorder_arritem = new customerorder(id,code,JobID,JobNumber,customerid,totalAmount,grossAmount,remark,customerOrderProducts,printeddate,status);
        this.customerorders.push(customerorder_arritem);
    }
    addcustomerOrderProductstoArray(id,code,product,unitrate,quantity) {
        let customerordermaterials_arritem = new customerOrderProducts(id,code,product,unitrate,quantity);
        this.customerOrderProducts.push(customerordermaterials_arritem);
    }
    allCustomerOrder() {
        return this.customerorders;
    }
    allCustomerOrderProducts() {
        return this.customerOrderProducts;
    }
    allJobs(){
        return this.customerorders.filter(customerorder => customerorder.jobID != undefined)
    }
    getCustomerOrder(code) {
        this.customerorder = this.customerorders.find(customerorder => customerorder.code == code);
        return this.customerorder;
    }
    getCustomerOrderById(id) {
        this.customerorder = this.customerorders.find(customerorder => customerorder.id == id);
        return this.customerorder;
    }
    clear() {
        this.customerorders = [];
        this.customerorder = undefined;
        this.customerOrderProducts = []
    }
    clearprm(){
        this.customerOrderProducts = [];
    }
}
class CustomerOrderSerial {
    constructor() {
        this.parent_code;
        this.code;
        this.index;
        this.length;
        this.GroupCode;
    }
    genarateCustomerOrderCode(index) {
        var year = new Date().getFullYear().toString();
        var lastTwoDigits = year.slice(-2);
        this.code = "CO" + lastTwoDigits + "I";
        this.index = index + 1;
        this.length = 12;
        this.GroupCode = this.code + String(this.index).padStart(this.length - 5, '0');
        return this.GroupCode;
    }
    genarateJobCode(index, parent_code) {
        this.parent_code = parseInt(parent_code.match(/\d+(?=$)/g));
        var year = new Date().getFullYear().toString();
        var lastTwoDigits = year.slice(-2);
        this.code = "JN"+lastTwoDigits+"A";
        this.index = parseInt(String(this.parent_code).concat("0", index + 1));
        this.length = 12;
        this.GroupCode = this.code + String(this.index).padStart(this.length - 5, '0');
        return this.GroupCode;
    }
    genaratePRMCode(index, parent_code) {
        this.parent_code = parseInt(parent_code.match(/\d+(?=$)/g));
        this.code = "JNP";
        this.index = parseInt(String(this.parent_code).concat("0", index + 1));
        this.length = 7;
        this.GroupCode = this.code + String(this.index).padStart(this.length - 4, '0');
        return this.GroupCode;
    }
}
function customerorderClassesInstence(){
    return{
        customerorder: new customerorder(),
        customerOrderProducts: new customerOrderProducts(),
        customerorder_service: new customerorder_service(),
        CustomerOrderSerial: new CustomerOrderSerial(),
    }
}
return {
    customerorderClassesInstence : customerorderClassesInstence
}
})();
//end of classes