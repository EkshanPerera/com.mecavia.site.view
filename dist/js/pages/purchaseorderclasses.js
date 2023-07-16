var purchaseorderClasses = (function () {
    //classescodematerial
    class purchaserequisition {
        constructor(id, prcode, pocode, supplierid, status, remark, totalAmount, purchaseRequisitionMaterials, printeddate, quotationno,enteredUser, printededUser,acceptedUser,poPrintededUser  ) {
            this.id = id;
            this.prcode = prcode;
            this.pocode = pocode;
            this.supplierid = supplierid;
            this.remark = remark;
            this.totalAmount = totalAmount;
            this.status = status;
            this.purchaseRequisitionMaterials = purchaseRequisitionMaterials;
            this.printeddate = printeddate;
            this.quotationno = quotationno;
            this.enteredUser = enteredUser;
            this.printededUser = printededUser;
            this.acceptedUser = acceptedUser;
            this.poPrintededUser = poPrintededUser;
        }
    }
    class purchaseRequisitionMaterials {
        constructor(id, hash, material, unitrate, quantity) {
            this.id = id;
            this.code = hash;
            this.material = material;
            this.unitrate = unitrate;
            this.quantity = quantity;
        }
    }
    class purchaserequisition_service {
        constructor() {
            this.purchaserequisitions = [];
            this.purchaseRequisitionMaterials = [];
            this.purchaserequisition;

        }
        addPurchaseRequisitiontoArray(id, prcode, pocode, supplierid, status, remark, totalAmount, purchaseRequisitionMaterials, printeddate, quotationno,enteredUser, printededUser,acceptedUser,poPrintededUser  ) {
            let purchaserequisition_arritem = new purchaserequisition(id, prcode, pocode, supplierid, status, remark, totalAmount, purchaseRequisitionMaterials, printeddate, quotationno,enteredUser, printededUser,acceptedUser,poPrintededUser  );
            this.purchaserequisitions.push(purchaserequisition_arritem);
        }
        addpurchaseRequisitionMaterialstoArray(id, hash, material, unitrate, quntity) {
            let purchaserequisitionmaterials_arritem = new purchaseRequisitionMaterials(id, hash, material, unitrate, quntity);
            this.purchaseRequisitionMaterials.push(purchaserequisitionmaterials_arritem);
        }
        allPurchaseRequisition() {
            return this.purchaserequisitions;
        }
        allPurchaseRequisitionMaterials() {
            return this.purchaseRequisitionMaterials;
        }
        getPurchaseRequisition(prcode) {
            this.purchaserequisition = this.purchaserequisitions.find(purchaserequisition => purchaserequisition.prcode == prcode);
            return this.purchaserequisition;
        }
        getPurchaseOrder(pocode) {
            this.purchaserequisition = this.purchaserequisitions.find(purchaserequisition => purchaserequisition.pocode == pocode);
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
    }
    function purchaseorderClassesInstence() {
        return {
            purchaserequisition: new purchaserequisition(),
            purchaseRequisitionMaterials: new purchaseRequisitionMaterials(),
            purchaserequisition_service: new purchaserequisition_service(),
            PurchaseRequisitionSerial: new PurchaseRequisitionSerial()
        }
    }
    return {
        purchaseorderClassesInstence: purchaseorderClassesInstence
    }
})();
//end of classes