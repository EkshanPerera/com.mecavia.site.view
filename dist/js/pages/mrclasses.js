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
class materialrequisition {
    constructor(id, invoicenumber, invocedate, code, mradate, mrano, enterddate, remark, status, billofMaterial, materialRequisitionMaterials, printeddate) {
        this.id = id;
        this.invoicenumber = invoicenumber;
        this.invocedate = invocedate;
        this.code = code;
        this.mradate = mradate;
        this.mrano = mrano;
        this.enterddate = enterddate;
        this.remark = remark;
        this.status = status;
        this.billofMaterial = billofMaterial;
        this.materialRequisitionMaterials = materialRequisitionMaterials;
        this.printeddate = printeddate;
    }
}
class materialRequisitionMaterial {
    constructor(id, code, ordercode, materialRequisition, prmaterial, arrivedCount) {
        this.id = id;
        this.code = code;
        this.ordercode = ordercode;
        this.materialRequisition = materialRequisition;
        this.prmaterial = prmaterial;
        this.arrivedCount = arrivedCount;
    }
}
class materialRequisition_service {
    constructor() {
        this.materialrequisitions = [];
        this.materialRequisitionMaterials = [];
        this.materialrequisition;
        this.materialRequisitionMaterial;
        this.newGoodsReceivedNotMaterials = []; 

    }
    addMRtoArray(id, invoicenumber, invocedate, code, mradate, mrano, enterddate, remark, status, billofMaterial, materialRequisitionMaterials, printeddate) {
        let materialrequisition_arritem = new materialrequisition(id, invoicenumber, invocedate, code, mradate, mrano, enterddate, remark, status, billofMaterial, materialRequisitionMaterials, printeddate);
        this.materialrequisitions.push(materialrequisition_arritem);
    }
    addMRMaterialstoArray(id, code, ordercode, materialRequisition, prmaterial, arrivedCount) {
        let materialrequisitionmaterials_arritem = new materialRequisitionMaterial(id, code, ordercode, materialRequisition, prmaterial, arrivedCount);
        this.materialRequisitionMaterials.push(materialrequisitionmaterials_arritem);
    }
    addNewMRMaterialstoArray(id, code, ordercode, materialRequisition, prmaterial, arrivedCount,outstandingcount) {
        var arrivedCount = parseInt(arrivedCount)
        let materialRequisitionMaterials = [];
        let materialrequisitionmaterials_arritem = new materialRequisitionMaterial(id, code, ordercode, materialRequisition, prmaterial, arrivedCount);
        materialRequisitionMaterials = this.newGoodsReceivedNotMaterials;
        if (materialRequisitionMaterials.length != 0){
            materialRequisitionMaterials = materialRequisitionMaterials.filter(materialRequisitionMaterial => materialRequisitionMaterial.ordercode == ordercode);
            let totArrivedCount = 0; 
            for (let i = 0; i < materialRequisitionMaterials.length; i++) {
                totArrivedCount += parseInt(materialRequisitionMaterials[i].arrivedCount);
            }
            if (outstandingcount >= (totArrivedCount + arrivedCount)){

                this.newGoodsReceivedNotMaterials.push(materialrequisitionmaterials_arritem);
                
                return true;
            }
            else{
                return false;
            }
        }else{
            if(outstandingcount>=arrivedCount){
                this.newGoodsReceivedNotMaterials.push(materialrequisitionmaterials_arritem);
                return true;
            }else{
                return false;
            }
        }
        
    }
    allMR() {
        return this.materialrequisitions;
    }
    allMRMaterials() {
        return this.materialRequisitionMaterials;
    }
    allNewMRNMaterials() {
        return this.newGoodsReceivedNotMaterials;
    }
    getNewMRNMaterialsByOrderCode(ordercode){
        return this.newGoodsReceivedNotMaterials.filter(materialRequisitionMaterial => materialRequisitionMaterial.ordercode == ordercode)
    }
    allMRsByOrderCode(ordercode) {
        let materialRequisitionMaterials = this.materialRequisitionMaterials.filter(materialRequisitionMaterial => materialRequisitionMaterial.ordercode == ordercode 
            && materialRequisitionMaterial.id != undefined);
        let totArrivedCount = 0; 
        for (let i = 0; i < materialRequisitionMaterials.length; i++) {
            totArrivedCount += materialRequisitionMaterials[i].arrivedCount;
        }
        let respons = [];
        respons["MRMs"] = materialRequisitionMaterials;
        respons["totarrived"] = totArrivedCount;
        return respons;
    }
    getlastMRByPOCode(pocode){
        let mrarray = [];
        mrarray = this.materialrequisitions.filter(materialrequisition => materialrequisition.billofMaterial.pocode == pocode);
        mrarray.sort((a,b) => b.id - a.id);
        if (mrarray.length > 0) {
            return mrarray[0].code;
          }
        return null; 
    }
    getMRsByPOCode(pocode){
        let mrarray = [];
        mrarray = this.materialrequisitions.filter(materialrequisition => materialrequisition.billofMaterial.pocode == pocode);
        return mrarray;
    }

    getMRsByOrderCode(ordercode) {
        return this.materialRequisitionMaterials.filter(materialRequisitionMaterials => materialRequisitionMaterials.ordercode == ordercode)
    }
    getMR(code) {
        this.materialrequisition = this.materialrequisitions.find(materialrequisition => materialrequisition.code == code);
        return this.materialrequisition;
    }
  

    clear() {
        this.materialrequisitions = [];
        this.materialrequisition = undefined;
        this.materialRequisitionMaterials = []
    }
    clearmrm() {
        this.newGoodsReceivedNotMaterials = [];
    }
}

class billofmaterial_service {
    constructor() {
        this.billofmaterials = [];
        this.billofMaterialMaterials = [];
        this.billofmaterial;
        this.billofMaterialMaterial;

    }
    addPurchaseRequisitiontoArray(id, prcode, pocode, supplierid, status, remark, totalAmount, billofMaterialMaterials, printeddate) {
        let billofmaterial_arritem = new billofmaterial(id, prcode, pocode, supplierid, status, remark, totalAmount, billofMaterialMaterials, printeddate);
        this.billofmaterials.push(billofmaterial_arritem);
    }
    addbillofMaterialMaterialstoArray(id, code, material, unitrate, quantity) {
        let billofmaterialmaterials_arritem = new billofMaterialMaterial(id, code, material, unitrate, quantity);
        this.billofMaterialMaterials.push(billofmaterialmaterials_arritem);
    }
    allPurchaseRequisition() {
        return this.billofmaterials;
    }
    allPurchaseRequisitionMaterials() {
        return this.billofMaterialMaterials;
    }
    getPurchaseRequisition(prcode) {
        this.billofmaterial = this.billofmaterials.find(billofmaterial => billofmaterial.prcode == prcode);
        return this.billofmaterial;
    }
    getPRMsByOrderCode(ordercode) {
        return this.billofMaterialMaterials.find(billofMaterialMaterial => billofMaterialMaterial.code == ordercode)
    }
    getPurchaseOrder(pocode) {
        this.billofmaterial = this.billofmaterials.find(billofmaterial => billofmaterial.pocode == pocode);
        return this.billofmaterial;
    }
    getPurchaseRequisitionById(id) {
        this.billofmaterial = this.billofmaterials.find(billofmaterial => billofmaterial.id == id);
        return this.billofmaterial;
    }
    clear() {
        this.billofmaterials = [];
        this.billofmaterial = undefined;
        this.billofMaterialMaterials = []
    }
    clearprm() {
        this.billofMaterialMaterials = [];
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
    genarateMRCode(index, parent_code) {
        this.parent_code = parseInt(parent_code.match(/\d+(?=$)/g));
        this.code = "MR";
        this.index = parseInt(String(this.parent_code).concat("0", index + 1));
        this.length = 9;
        this.GroupCode = this.code + String(this.index).padStart(this.length - 3, '0');
        return this.GroupCode;
    }
    genarateMRMCode(index, parent_code) {
        this.parent_code = parseInt(parent_code.match(/\d+(?=$)/g));
        this.code = "MRM";
        this.index = parseInt(String(this.parent_code).concat("0", index + 1));
        this.length = 11;
        this.GroupCode = this.code + String(this.index).padStart(this.length - 4, '0');
        return this.GroupCode;
    }
}
//end of classes