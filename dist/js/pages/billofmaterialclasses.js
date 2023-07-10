//classescodematerial
var billofmaterialClasses = (function () {
    class billofmaterial {
        constructor(id, code, customerOrder, bomMaterials, totalcost, status) {
            this.id = id;
            this.code = code;
            this.customerOrder = customerOrder;
            this.bomMaterials = bomMaterials;
            this.totalcost = totalcost;
            this.status = status;
        }
    }
    class bommaterial {
        constructor(id, code, material, materialCost, quantity, hash) {
            this.id = id;
            this.code = code;
            this.material = material;
            this.materialCost = materialCost;
            this.quantity = quantity;
            this.hash = hash;
        }
    }
    class billofmaterial_service {
        constructor() {
            this.billofmaterials = [];
            this.bommaterials = [];
            this.bommaterial;
            this.billofmaterial;
            this.hash = 0;
        }
        addBillOfMaterialtoArray(id, code, customerOrder, bomMaterials, totalcost, status) {
            let billofmaterial_arritem = new billofmaterial(id, code, customerOrder, bomMaterials, totalcost, status);
            this.billofmaterials.push(billofmaterial_arritem);
        }
        addbommaterialtoArray(id, code, material, materialCost, quantity) {
            this.hash += 1;
            let bommaterials_arritem = new bommaterial(id, code, material, materialCost, quantity, this.hash);
            this.bommaterials.push(bommaterials_arritem);
        }
        removebommaterialfromArray(hash) {
            this.bommaterials = this.bommaterials.filter(bommaterial => bommaterial.hash != hash)
        }
        allBillOfMaterial() {
            return this.billofmaterials;
        }
        allBillOfMaterialMaterials() {
            return this.bommaterials;
        }
        allJobs() {
            return this.billofmaterials.filter(billofmaterial => billofmaterial.jobID != undefined)
        }
        getBillOfMaterial(code) {
            this.billofmaterial = this.billofmaterials.find(billofmaterial => billofmaterial.code == code);
            return this.billofmaterial;
        }
        getBOMMaterialbycode(code, bomcode) {
            this.billofmaterial = this.billofmaterials.find(billofmaterial => billofmaterial.code == bomcode);
            this.bommaterial = this.billofmaterial.bomMaterials.find(bommaterial => bommaterial.code == code);
            return this.bommaterial;
        }
        getBillOfMaterialById(id) {
            this.billofmaterial = this.billofmaterials.find(billofmaterial => billofmaterial.id == id);
            return this.billofmaterial;
        }
        getBillOfMaterialByCOcode(coopde) {
            this.billofmaterial = this.billofmaterials.find(billofmaterial => billofmaterial.customerOrder.code == coopde);
            return this.billofmaterial;
        }
        clear() {
            this.billofmaterials = [];
            this.billofmaterial = undefined;
            this.bommaterials = []
        }
        clearprm() {
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
            this.code = "BOM" + lastTwoDigits + "A";
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
    function billofmaterialClassesInstence() {
        return {
            billofmaterial: new billofmaterial(),
            bommaterial: new bommaterial(),
            billofmaterial_service: new billofmaterial_service(),
            BillOfMaterialSerial: new BillOfMaterialSerial()
        }
    }
    return {
        billofmaterialClassesInstence: billofmaterialClassesInstence
    }
})();
//end of classes