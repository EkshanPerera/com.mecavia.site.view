//classescodematerial
class purchaserequisition {
    constructor(id, prcode, pocode, supplierid, status, remark, totalAmount, purchaseRequisitionMaterials, printeddate) {
        this.id = id;
        this.prcode = prcode;
        this.pocode = pocode;
        this.supplierid = supplierid;
        this.remark = remark;
        this.totalAmount = totalAmount;
        this.status = status;
        this.purchaseRequisitionMaterials = purchaseRequisitionMaterials;
        this.printeddate = printeddate;
    }
}
class purchaseRequisitionMaterial {
    constructor(id, code, material, unitrate, quantity) {
        this.id = id;
        this.code = code;
        this.material = material;
        this.unitrate = unitrate;
        this.quantity = quantity;
    }
}

class goodsreceivednote {
    constructor(id, invoicenumber, invocedate, code, mradate, mrano, enterddate, remark, status, purchaseRequisition, goodsReceivedNoteMaterials, printeddate) {
        this.id = id;
        this.invoicenumber = invoicenumber;
        this.invocedate = invocedate;
        this.code = code;
        this.mradate = mradate;
        this.mrano = mrano;
        this.enterddate = enterddate;
        this.remark = remark;
        this.status = status;
        this.purchaseRequisition = purchaseRequisition;
        this.goodsReceivedNoteMaterials = goodsReceivedNoteMaterials;
        this.printeddate = printeddate;
    }
}
class goodsReceivedNoteMaterial {
    constructor(id, code, ordercode, goodsReceivedNote, prmaterial, arrivedCount) {
        this.id = id;
        this.code = code;
        this.ordercode = ordercode;
        this.goodsReceivedNote = goodsReceivedNote;
        this.prmaterial = prmaterial;
        this.arrivedCount = arrivedCount;
    }
}
class goodsReceivedNote_service {
    constructor() {
        this.goodsreceivednotes = [];
        this.goodsReceivedNoteMaterials = [];
        this.goodsreceivednote;
        this.goodsReceivedNoteMaterial;
        this.newGoodsReceivedNotMaterials = []; 

    }
    addGRNtoArray(id, invoicenumber, invocedate, code, mradate, mrano, enterddate, remark, status, purchaseRequisition, goodsReceivedNoteMaterials, printeddate) {
        let goodsreceivednote_arritem = new goodsreceivednote(id, invoicenumber, invocedate, code, mradate, mrano, enterddate, remark, status, purchaseRequisition, goodsReceivedNoteMaterials, printeddate);
        this.goodsreceivednotes.push(goodsreceivednote_arritem);
    }
    addGRNMaterialstoArray(id, code, ordercode, goodsReceivedNote, prmaterial, arrivedCount) {
        let goodsreceivednotematerials_arritem = new goodsReceivedNoteMaterial(id, code, ordercode, goodsReceivedNote, prmaterial, arrivedCount);
        this.goodsReceivedNoteMaterials.push(goodsreceivednotematerials_arritem);
    }
    addNewGRNMaterialstoArray(id, code, ordercode, goodsReceivedNote, prmaterial, arrivedCount,outstandingcount) {
        var arrivedCount = parseInt(arrivedCount)
        let goodsReceivedNoteMaterials = [];
        let goodsreceivednotematerials_arritem = new goodsReceivedNoteMaterial(id, code, ordercode, goodsReceivedNote, prmaterial, arrivedCount);
        goodsReceivedNoteMaterials = this.newGoodsReceivedNotMaterials;
        if (goodsReceivedNoteMaterials.length != 0){
            goodsReceivedNoteMaterials = goodsReceivedNoteMaterials.filter(goodsReceivedNoteMaterial => goodsReceivedNoteMaterial.ordercode == ordercode);
            let totArrivedCount = 0; 
            for (let i = 0; i < goodsReceivedNoteMaterials.length; i++) {
                totArrivedCount += parseInt(goodsReceivedNoteMaterials[i].arrivedCount);
            }
            if (outstandingcount >= (totArrivedCount + arrivedCount)){

                this.newGoodsReceivedNotMaterials.push(goodsreceivednotematerials_arritem);
                
                return true;
            }
            else{
                return false;
            }
        }else{
            if(outstandingcount>=arrivedCount){
                this.newGoodsReceivedNotMaterials.push(goodsreceivednotematerials_arritem);
                return true;
            }else{
                return false;
            }
        }
        
    }
    allGRN() {
        return this.goodsreceivednotes;
    }
    allGRNMaterials() {
        return this.goodsReceivedNoteMaterials;
    }
    allNewGRNNMaterials() {
        return this.newGoodsReceivedNotMaterials;
    }
    getNewGRNNMaterialsByOrderCode(ordercode){
        return this.newGoodsReceivedNotMaterials.filter(goodsReceivedNoteMaterial => goodsReceivedNoteMaterial.ordercode == ordercode)
    }
    allGRNsByOrderCode(ordercode) {
        let goodsReceivedNoteMaterials = this.goodsReceivedNoteMaterials.filter(goodsReceivedNoteMaterial => goodsReceivedNoteMaterial.ordercode == ordercode 
            && goodsReceivedNoteMaterial.id != undefined);
        let totArrivedCount = 0; 
        for (let i = 0; i < goodsReceivedNoteMaterials.length; i++) {
            totArrivedCount += goodsReceivedNoteMaterials[i].arrivedCount;
        }
        let respons = [];
        respons["GRNMs"] = goodsReceivedNoteMaterials;
        respons["totarrived"] = totArrivedCount;
        return respons;
    }
    getlastGRNByPOCode(pocode){
        let grnarray = [];
        grnarray = this.goodsreceivednotes.filter(goodsreceivednote => goodsreceivednote.purchaseRequisition.pocode == pocode);
        grnarray.sort((a,b) => b.id - a.id);
        if (grnarray.length > 0) {
            return grnarray[0].code;
          }
        return null; 
    }
    getGRNsByPOCode(pocode){
        let grnarray = [];
        grnarray = this.goodsreceivednotes.filter(goodsreceivednote => goodsreceivednote.purchaseRequisition.pocode == pocode);
        return grnarray;
    }

    getGRNsByOrderCode(ordercode) {
        return this.goodsReceivedNoteMaterials.filter(goodsReceivedNoteMaterials => goodsReceivedNoteMaterials.ordercode == ordercode)
    }
    getGRN(code) {
        this.goodsreceivednote = this.goodsreceivednotes.find(goodsreceivednote => goodsreceivednote.code == code);
        return this.goodsreceivednote;
    }
  

    clear() {
        this.goodsreceivednotes = [];
        this.goodsreceivednote = undefined;
        this.goodsReceivedNoteMaterials = []
    }
    cleargrnm() {
        this.newGoodsReceivedNotMaterials = [];
    }
}

class purchaserequisition_service {
    constructor() {
        this.purchaserequisitions = [];
        this.purchaseRequisitionMaterials = [];
        this.purchaserequisition;
        this.purchaseRequisitionMaterial;

    }
    addPurchaseRequisitiontoArray(id, prcode, pocode, supplierid, status, remark, totalAmount, purchaseRequisitionMaterials, printeddate) {
        let purchaserequisition_arritem = new purchaserequisition(id, prcode, pocode, supplierid, status, remark, totalAmount, purchaseRequisitionMaterials, printeddate);
        this.purchaserequisitions.push(purchaserequisition_arritem);
    }
    addpurchaseRequisitionMaterialstoArray(id, code, material, unitrate, quantity) {
        let purchaserequisitionmaterials_arritem = new purchaseRequisitionMaterial(id, code, material, unitrate, quantity);
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
    getPRMsByOrderCode(ordercode) {
        return this.purchaseRequisitionMaterials.find(purchaseRequisitionMaterial => purchaseRequisitionMaterial.code == ordercode)
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
class GoodsRecevedNoteSerial {
    constructor() {
        this.parent_code;
        this.code;
        this.index;
        this.length;
        this.GroupCode;
    }
    genarateGRNCode(index, parent_code) {
        this.parent_code = parseInt(parent_code.match(/\d+(?=$)/g));
        this.code = "GRN";
        this.index = parseInt(String(this.parent_code).concat("0", index + 1));
        this.length = 9;
        this.GroupCode = this.code + String(this.index).padStart(this.length - 3, '0');
        return this.GroupCode;
    }
    genarateGRNMCode(index, parent_code) {
        this.parent_code = parseInt(parent_code.match(/\d+(?=$)/g));
        this.code = "GRNM";
        this.index = parseInt(String(this.parent_code).concat("0", index + 1));
        this.length = 11;
        this.GroupCode = this.code + String(this.index).padStart(this.length - 4, '0');
        return this.GroupCode;
    }
}
//end of classes