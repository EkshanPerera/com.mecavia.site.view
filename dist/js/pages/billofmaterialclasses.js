//classescodematerial
class billofmaterial {
    constructor(id,code,customerOrder,bomMaterials,totalcost,status) {
        this.id = id; 
        this.code = code;
        this.customerOrder = customerOrder;
        this.bomMaterials = bomMaterials;
        this.totalcost = totalcost;
        this.status = status;
    }
}
class bommaterial{
    constructor(id,code,material,materialCost,quantity){
        this.id = id;
        this.code = code;
        this.material = material;
        this.materialCost = materialCost;
        this.quantity = quantity;
    }
}
class billofmaterial_service {
    constructor() {
        this.billofmaterials = [];
        this.bommaterials = [];
        this.billofmaterial;
    }
    addBillOfMaterialtoArray(id,code,customerOrder,bomMaterials,totalcost,status) {
        let billofmaterial_arritem = new billofmaterial(id,code,customerOrder,bomMaterials,totalcost,status);
        this.billofmaterials.push(billofmaterial_arritem);
    }
    addbommaterialtoArray(id,code,material,materialCost,quantity) {
        let bommaterials_arritem = new bommaterial(id,code,material,materialCost,quantity);
        this.bommaterials.push(bommaterials_arritem);
    }
    allBillOfMaterial() {
        return this.billofmaterials;
    }
    allBillOfMaterialMaterials() {
        return this.bommaterials;
    }
    allJobs(){
        return this.billofmaterials.filter(billofmaterial => billofmaterial.jobID != undefined)
    }
    getBillOfMaterial(code) {
        this.billofmaterial = this.billofmaterials.find(billofmaterial => billofmaterial.code == code);
        return this.billofmaterial;
    }
    getBillOfMaterialById(id) {
        this.billofmaterial = this.billofmaterials.find(billofmaterial => billofmaterial.id == id);
        return this.billofmaterial;
    }
    clear() {
        this.billofmaterials = [];
        this.billofmaterial = undefined;
        this.bommaterials = []
    }
    clearprm(){
        this.bommaterials = [];
    }
}
class BillOfMaterialSerial {
    constructor() {
        this.parent_code;
        this.code;
        this.index;
        this.length;
        this.GroupCode;
    }
    genarateBillOfMaterialCode(index, parent_code) {
        this.parent_code = parseInt(parent_code.match(/\d+(?=$)/g));
        var year = new Date().getFullYear().toString();
        var lastTwoDigits = year.slice(-2);
        this.code = "BOM"+lastTwoDigits+"A";
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
//end of classes