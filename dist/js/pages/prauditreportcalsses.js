//classescode
var purchaserequisitionClasses = (function () {
    class purchaserequisition {
        constructor(id, prcode, pocode, supplierid, status, remark, totalAmount, purchaseRequisitionMaterials, prprinteddate, quotationno,enteredUser, printededUser,acceptedUser,poPrintededUser  ) {
            this.id = id;
            this.prcode = prcode;
            this.pocode = pocode;
            this.supplierid = supplierid;
            this.remark = remark;
            this.totalAmount = totalAmount;
            this.status = status;
            this.purchaseRequisitionMaterials = purchaseRequisitionMaterials;
            this.quotationno = quotationno;
            this.prprinteddate = prprinteddate;
            this.enteredUser = enteredUser;
            this.printededUser = printededUser;
            this.acceptedUser = acceptedUser;
            this.poPrintededUser = poPrintededUser;
            
        }
    }
    class purchaserequisition_service {
        constructor() {
            this.purchaserequisitions = [];

        }
        addPurchaseRequisitiontoArray(id, prcode, pocode, supplierid, status, remark, totalAmount, purchaseRequisitionMaterials, prprinteddate, quotationno,enteredUser, printededUser,acceptedUser,poPrintededUser  ) {
            let purchaserequisitions_arritem = new purchaserequisition(id, prcode, pocode, supplierid, status, remark, totalAmount, purchaseRequisitionMaterials, prprinteddate, quotationno,enteredUser, printededUser,acceptedUser,poPrintededUser  );
            this.purchaserequisitions.push(purchaserequisitions_arritem);
        }
        allPurchaseEequisitions() {
            return this.purchaserequisitions;
        }
        
    }

    function purchaserequisitionClassesInstence() {
        return {
            purchaserequisitions: new purchaserequisition(),
            purchaserequisition_service: new purchaserequisition_service(),

        }
    }
    return {
        purchaserequisitionClassesInstence: purchaserequisitionClassesInstence
    }
})();
    //end of classes