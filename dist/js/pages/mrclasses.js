var mrClasses = (function () {
    class materialrequisition {
        constructor(id, code, enterddate, billOfMaterial, materialRequisitionMaterials, printeddate, status, enteredUser) {
            this.id = id;
            this.code = code;
            this.enterddate = enterddate;
            this.billOfMaterial = billOfMaterial;
            this.materialRequisitionMaterials = materialRequisitionMaterials;
            this.printeddate = printeddate;
            this.status = status;
            this.enteredUser = enteredUser;
        }
    }
    class materialRequisitionMaterial {
        constructor(id, code, ordercode, materialRequisition, bommaterial, requestedCount) {
            this.id = id;
            this.code = code;
            this.ordercode = ordercode;
            this.materialRequisition = materialRequisition;
            this.bommaterial = bommaterial;
            this.requestedCount = requestedCount;
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
        addMRtoArray(id, code, enterddate, billOfMaterial, materialRequisitionMaterials, printeddate, status, enteredUser) {
            let materialrequisition_arritem = new materialrequisition(id, code, enterddate, billOfMaterial, materialRequisitionMaterials, printeddate, status, enteredUser);
            this.materialrequisitions.push(materialrequisition_arritem);
        }
        addMRMaterialstoArray(id, code, ordercode, materialRequisition, bommaterial, requestedCount) {
            let materialrequisitionmaterials_arritem = new materialRequisitionMaterial(id, code, ordercode, materialRequisition, bommaterial, requestedCount);
            this.materialRequisitionMaterials.push(materialrequisitionmaterials_arritem);
        }
        addNewMRMaterialstoArray(id, code, ordercode, materialRequisition, bommaterial, requestedCount, outstandingcount) {
            var requestedCount = parseInt(requestedCount)
            let materialRequisitionMaterials = [];
            let materialrequisitionmaterials_arritem = new materialRequisitionMaterial(id, code, ordercode, materialRequisition, bommaterial, requestedCount);
            materialRequisitionMaterials = this.newGoodsReceivedNotMaterials;
            if (materialRequisitionMaterials.length != 0) {
                materialRequisitionMaterials = materialRequisitionMaterials.filter(materialRequisitionMaterial => materialRequisitionMaterial.ordercode == ordercode);
                let totRequestedCount = 0;
                for (let i = 0; i < materialRequisitionMaterials.length; i++) {
                    totRequestedCount += parseInt(materialRequisitionMaterials[i].requestedCount);
                }
                if (outstandingcount >= (totRequestedCount + requestedCount)) {

                    this.newGoodsReceivedNotMaterials.push(materialrequisitionmaterials_arritem);

                    return true;
                }
                else {
                    return false;
                }
            } else {
                if (outstandingcount >= requestedCount) {
                    this.newGoodsReceivedNotMaterials.push(materialrequisitionmaterials_arritem);
                    return true;
                } else {
                    return false;
                }
            }

        }
        allMR() {
            return this.materialrequisitions;
        }
        allMRPending() {
            let pendingMRs = [];
            pendingMRs = this.materialrequisitions.filter(materialrequisition => materialrequisition.status == "PENDING")
            return pendingMRs;
        }
        allMRMaterials() {
            return this.materialRequisitionMaterials;
        }
        allNewMRNMaterials() {
            return this.newGoodsReceivedNotMaterials;
        }
        getNewMRNMaterialsByOrderCode(ordercode) {
            return this.newGoodsReceivedNotMaterials.filter(materialRequisitionMaterial => materialRequisitionMaterial.ordercode == ordercode)
        }
        allMRsByOrderCode(ordercode) {
            let materialRequisitionMaterials = this.materialRequisitionMaterials.filter(materialRequisitionMaterial => materialRequisitionMaterial.ordercode == ordercode
                && materialRequisitionMaterial.id != undefined);
            let totRequestedCount = 0;
            for (let i = 0; i < materialRequisitionMaterials.length; i++) {
                totRequestedCount += materialRequisitionMaterials[i].requestedCount;
            }
            let respons = [];
            respons["MRMs"] = materialRequisitionMaterials;
            respons["totrequested"] = totRequestedCount;
            return respons;
        }
        getlastMRByCOCode(code) {
            let mrarray = [];
            mrarray = this.materialrequisitions.filter(materialrequisition => materialrequisition.billOfMaterial.customerOrder.code == code);
            mrarray.sort((a, b) => b.id - a.id);
            if (mrarray.length > 0) {
                return mrarray[0].code;
            }
            return null;
        }
        getMRsByBOMCode(code) {
            let mrarray = [];
            mrarray = this.materialrequisitions.filter(materialrequisition => materialrequisition.billOfMaterial.code == code);
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
    class MaterialRequisitionSerial {
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
    function mrClassesInstence() {
        return {
            materialrequisition: new materialrequisition(),
            materialRequisitionMaterial: new materialRequisitionMaterial(),
            materialRequisition_service: new materialRequisition_service(),
            MaterialRequisitionSerial: new MaterialRequisitionSerial()
        }
    }
    return {
        mrClassesInstence: mrClassesInstence
    }
})();
//end of classes