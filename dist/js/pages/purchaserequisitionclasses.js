var purchaserequisitionClasses = (function () {
    //classescodematerial
    class purchaserequisition {
        constructor(id, prcode, pocode, supplierid, status, remark, totalAmount, purchaseRequisitionMaterials, quotationno) {
            this.id = id;
            this.prcode = prcode;
            this.pocode = pocode;
            this.supplierid = supplierid;
            this.remark = remark;
            this.totalAmount = totalAmount;
            this.status = status;
            this.purchaseRequisitionMaterials = purchaseRequisitionMaterials;
            this.quotationno = quotationno;

        }
    }
    class purchaseRequisitionMaterials {
        constructor(id, code, material, unitrate, quantity, hash) {
            this.id = id;
            this.code = code;
            this.material = material;
            this.unitrate = unitrate;
            this.quantity = quantity;
            this.hash = hash;
        }
    }

    class purchaserequisition_service {
        constructor() {
            this.purchaserequisitions = [];
            this.purchaseRequisitionMaterials = [];
            this.purchaserequisition;
            this.hash = 0;

        }
        addPurchaseRequisitiontoArray(id, prcode, pocode, supplierid, status, remark, totalAmount, purchaseRequisitionMaterials, quotationno) {
            let purchaserequisition_arritem = new purchaserequisition(id, prcode, pocode, supplierid, status, remark, totalAmount, purchaseRequisitionMaterials, quotationno);
            this.purchaserequisitions.push(purchaserequisition_arritem);
        }
        addpurchaseRequisitionMaterialstoArray(id, code, material, unitrate, quntity) {
            this.hash += 1;
            let purchaserequisitionmaterials_arritem = new purchaseRequisitionMaterials(id, code, material, unitrate, quntity, this.hash);
            this.purchaseRequisitionMaterials.push(purchaserequisitionmaterials_arritem);
        }
        removepurchaseRequisitionMaterialsfromArray(hash) {
            this.purchaseRequisitionMaterials = this.purchaseRequisitionMaterials.filter(purchaseRequisitionMaterial => purchaseRequisitionMaterial.hash != hash)
        }
        allPurchaseRequisition() {
            return this.purchaserequisitions;
        }
        allPurchaseRequisitionMaterials() {
            return this.purchaseRequisitionMaterials;
        }
        allPurchaseOrders() {
            return this.purchaserequisitions.filter(purchaserequisition => purchaserequisition.pocode != undefined)
        }
        getPurchaseRequisition(prcode) {
            this.purchaserequisition = this.purchaserequisitions.find(purchaserequisition => purchaserequisition.prcode == prcode);
            return this.purchaserequisition;
        }
        getPurchaseRequisitionById(id) {
            this.purchaserequisition = this.purchaserequisitions.find(purchaserequisition => purchaserequisition.id == id);
            return this.purchaserequisition;
        }
        clear() {
            this.purchaserequisitions = [];
            this.purchaserequisition = undefined;
            this.purchaseRequisitionMaterials = []
        }
        clearprm() {
            this.purchaseRequisitionMaterials = [];
        }
    }
    class PurchaseRequisitionSerial {
        constructor() {
            this.parent_code;
            this.code;
            this.index;
            this.length;
            this.GroupCode;
        }
        genaratePurchaseRequisitionCode(index) {
            var year = new Date().getFullYear().toString();
            var lastTwoDigits = year.slice(-2);
            this.code = "PR" + lastTwoDigits + "I";
            this.index = index + 1;
            this.length = 12;
            this.GroupCode = this.code + String(this.index).padStart(this.length - 5, '0');
            return this.GroupCode;
        }
        genaratePurchaseOrderCode(index, parent_code) {
            this.parent_code = parseInt(parent_code.match(/\d+(?=$)/g));
            var year = new Date().getFullYear().toString();
            var lastTwoDigits = year.slice(-2);
            this.code = "PO" + lastTwoDigits + "A";
            this.index = parseInt(String(this.parent_code).concat("0", index + 1));
            this.length = 12;
            this.GroupCode = this.code + String(this.index).padStart(this.length - 5, '0');
            return this.GroupCode;
        }
        genaratePRMCode(index, parent_code) {
            this.parent_code = parseInt(parent_code.match(/\d+(?=$)/g));
            this.code = "PRM";
            this.index = parseInt(String(this.parent_code).concat("0", index + 1));
            this.length = 7;
            this.GroupCode = this.code + String(this.index).padStart(this.length - 4, '0');
            return this.GroupCode;
        }
    }
    function purchaserequisitionClassesInstence() {
        return {
            purchaserequisition: new purchaserequisition(),
            purchaseRequisitionMaterials: new purchaseRequisitionMaterials(),
            purchaserequisition_service: new purchaserequisition_service(),
            PurchaseRequisitionSerial: new PurchaseRequisitionSerial()
        }
    }
    return {
        purchaserequisitionClassesInstence: purchaserequisitionClassesInstence
    }
})();
//end of classes