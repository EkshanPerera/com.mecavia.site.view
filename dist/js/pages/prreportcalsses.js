//classescode
var purchaserequisitionClasses = (function(){
    class purchaserequisition {
        constructor(id,prcode,pocode,supplierid,status,remark,totalAmount,purchaseRequisitionMaterials,quotationno,printeddate) {
        this.id = id;
        this.prcode = prcode;
        this.pocode = pocode;
        this.supplierid = supplierid; 
        this.remark = remark;
        this.totalAmount = totalAmount;
        this.status = status;
        this.purchaseRequisitionMaterials = purchaseRequisitionMaterials;
        this.quotationno = quotationno;
        this.printeddate = printeddate;
        }
    }
    class purchaserequisition_service {
        constructor() {
            this.purchaserequisitions = [];
           
        }
        addPurchaseEequisitiontoArray(id,prcode,pocode,supplierid,status,remark,totalAmount,purchaseRequisitionMaterials,quotationno,printeddate) {
            let purchaserequisitions_arritem = new purchaserequisition(id,prcode,pocode,supplierid,status,remark,totalAmount,purchaseRequisitionMaterials,quotationno,printeddate);
            this.purchaserequisitions.push(purchaserequisitions_arritem);
        }
        allPurchaseEequisitions() {
            return this.purchaserequisitions;
        }
    }
   
    function purchaserequisitionClassesInstence(){
        return{
            purchaserequisitions: new purchaserequisition(),
            purchaserequisition_service: new purchaserequisition_service(),

        }
    }
    return {
        purchaserequisitionClassesInstence : purchaserequisitionClassesInstence
    }
    })();
    //end of classes