//classescodeproduct
var fginClasses = (function(){
    class customerorder {
        constructor(id, code, JobID, JobNumber, customerid, totalAmount, grossAmount, remark, customerOrderProducts, printeddate, status,enteredUser,enteredDate,acceptedUser,acceptedDate,invoices,inventoryItems) {
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
            this.enteredUser = enteredUser;
            this.enteredDate = enteredDate;
            this.acceptedUser = acceptedUser;
            this.acceptedDate = acceptedDate;
            this.invoices = invoices;
            this.inventoryItems = inventoryItems;
            
        }
    }
class customerOrderProduct {
    constructor(id, code, product, unitrate, quantity,totFinishedCount) {
        this.id = id;
        this.code = code;
        this.product = product;
        this.quantity = quantity;
        this.unitrate = unitrate;
        this.totFinishedCount = totFinishedCount; 
    }
}
class finishedgoodsinnote {
    constructor(id, code,panumber,padate, enterddate, remark, status, customerOrder, finishedGoodsInNoteProducts, printeddate,enteredUser) {
        this.id = id;
        this.code = code;
        this.panumber = panumber;
        this.padate = padate;
        this.enterddate = enterddate;
        this.remark = remark;
        this.status = status;
        this.customerOrder = customerOrder;
        this.finishedGoodsInNoteProducts = finishedGoodsInNoteProducts;
        this.printeddate = printeddate;
        this.enteredUser = enteredUser;
    }
}
class finishedGoodsInNoteProduct {
    constructor(id, code, cordercode, finishedGoodsInNote, coproduct, finishedCount,hash) {
        this.id = id;
        this.code = code;
        this.cordercode = cordercode;
        this.finishedGoodsInNote = finishedGoodsInNote;
        this.coproduct = coproduct;
        this.finishedCount = finishedCount;
        this.hash = hash
    }
}
class finishedGoodsInNote_service {
    constructor() {
        this.finishedgoodsinnotes = [];
        this.finishedGoodsInNoteProducts = [];
        this.finishedgoodsinnote;
        this.finishedGoodsInNoteProduct;
        this.newFinishedGoodsInNotProducts = [];
        this.hash  = 0;

    }
    addFGINtoArray(id, code,panumber,padate, enterddate, remark, status, customerOrder, finishedGoodsInNoteProducts, printeddate,enteredUser) {
        let finishedgoodsinnote_arritem = new finishedgoodsinnote(id, code,panumber,padate, enterddate, remark, status, customerOrder, finishedGoodsInNoteProducts, printeddate,enteredUser);
        this.finishedgoodsinnotes.push(finishedgoodsinnote_arritem);
    }
    addFGINProductstoArray(id, code, cordercode, finishedGoodsInNote, coproduct, finishedCount) {
        let finishedgoodsinnoteproducts_arritem = new finishedGoodsInNoteProduct(id, code, cordercode, finishedGoodsInNote, coproduct, finishedCount);
        this.finishedGoodsInNoteProducts.push(finishedgoodsinnoteproducts_arritem);
    }
    addNewFGINProductstoArray(id, code, cordercode, finishedGoodsInNote, coproduct, finishedCount, outstandingcount) {
        this.hash += 1;
        var finishedCount = parseFloat(finishedCount)
        let finishedGoodsInNoteProducts = [];
        let finishedgoodsinnoteproducts_arritem = new finishedGoodsInNoteProduct(id, code, cordercode, finishedGoodsInNote, coproduct, finishedCount,this.hash);
        finishedGoodsInNoteProducts = this.newFinishedGoodsInNotProducts;
        if (finishedGoodsInNoteProducts.length != 0) {
            finishedGoodsInNoteProducts = finishedGoodsInNoteProducts.filter(finishedGoodsInNoteProduct => finishedGoodsInNoteProduct.cordercode == cordercode);
            let totFinishedCount = 0;
            for (let i = 0; i < finishedGoodsInNoteProducts.length; i++) {
                totFinishedCount += parseFloat(finishedGoodsInNoteProducts[i].finishedCount);
            }
            if (outstandingcount >= (totFinishedCount + finishedCount)) {

                this.newFinishedGoodsInNotProducts.push(finishedgoodsinnoteproducts_arritem);

                return true;
            }
            else {
                return false;
            }
        } else {
            if (outstandingcount >= finishedCount) {
                this.newFinishedGoodsInNotProducts.push(finishedgoodsinnoteproducts_arritem);
                return true;
            } else {
                return false;
            }
        }

    }
    removeFGINProductstoArray(hash) {
        this.newFinishedGoodsInNotProducts = this.newFinishedGoodsInNotProducts.filter(newFinishedGoodsInNotProduct => newFinishedGoodsInNotProduct.hash != hash);
    }
    allFGIN() {
        return this.finishedgoodsinnotes;
    }
    allFGINProducts() {
        return this.finishedGoodsInNoteProducts;
    }
    allNewFGINNProducts() {
        return this.newFinishedGoodsInNotProducts;
    }
    getNewFGINNProductsByOrderCode(cordercode) {
        return this.newFinishedGoodsInNotProducts.filter(finishedGoodsInNoteProduct => finishedGoodsInNoteProduct.cordercode == cordercode)
    }
    getFGINNProductsByOrderCode(cordercode) {
        return this.finishedGoodsInNoteProducts.filter(finishedGoodsInNoteProduct => finishedGoodsInNoteProduct.cordercode == cordercode)
    }
    allFGINsByOrderCode(cordercode) {
        let finishedGoodsInNoteProducts = this.finishedGoodsInNoteProducts.filter(finishedGoodsInNoteProduct => finishedGoodsInNoteProduct.cordercode == cordercode
            && finishedGoodsInNoteProduct.id != undefined);
        let totFinishedCount = 0;
        for (let i = 0; i < finishedGoodsInNoteProducts.length; i++) {
            totFinishedCount += finishedGoodsInNoteProducts[i].finishedCount;
        }
        let respons = [];
        respons["FGINMs"] = finishedGoodsInNoteProducts;
        respons["totfinished"] = totFinishedCount;
        return respons;
    }
    getlastFGINByJobId(jobID) {
        let fginarray = [];
        fginarray = this.finishedgoodsinnotes.filter(finishedgoodsinnote => finishedgoodsinnote.customerOrder.jobID == jobID);
        fginarray.sort((a, b) => b.id - a.id);
        if (fginarray.length > 0) {
            return fginarray[0].code;
        }
        return null;
    }
    getFGINsByJobId(jobID) {
        let fginarray = [];
        fginarray = this.finishedgoodsinnotes.filter(finishedgoodsinnote => finishedgoodsinnote.customerOrder.jobID == jobID);
        return fginarray;
    }

    getFGINsByOrderCode(cordercode) {
        return this.finishedGoodsInNoteProducts.filter(finishedGoodsInNoteProducts => finishedGoodsInNoteProducts.cordercode == cordercode)
    }
    getFGIN(code) {
        this.finishedgoodsinnote = this.finishedgoodsinnotes.find(finishedgoodsinnote => finishedgoodsinnote.code == code);
        return this.finishedgoodsinnote;
    }


    clear() {
        this.finishedgoodsinnotes = [];
        this.finishedgoodsinnote = undefined;
        this.finishedGoodsInNoteProducts = []
    }
    clearfginm() {
        this.newFinishedGoodsInNotProducts = [];
    }
}
class customerorder_service {
    constructor() {
        this.customerorders = [];
        this.customerOrderProducts = [];
        this.customerorder;
        this.customerOrderProduct;

    }
    addCustomerOrdertoArray(id, code, JobID, JobNumber, customerid, totalAmount, grossAmount, remark, customerOrderProducts, printeddate, status,enteredUser,enteredDate,acceptedUser,acceptedDate,invoices,inventoryItems) {
        let customerorder_arritem = new customerorder(id, code, JobID, JobNumber, customerid, totalAmount, grossAmount, remark, customerOrderProducts, printeddate, status,enteredUser,enteredDate,acceptedUser,acceptedDate,invoices,inventoryItems);
        this.customerorders.push(customerorder_arritem);
    }
    addcustomerOrderProductstoArray(id, code, product, unitrate, quantity,totFinishedCount) {
        let customerorderproducts_arritem = new customerOrderProduct(id, code, product, unitrate, quantity,totFinishedCount);
        this.customerOrderProducts.push(customerorderproducts_arritem);
    }
    allCustomerOrder() {
        return this.customerorders;
    }
    allCustomerOrderProducts() {
        return this.customerOrderProducts;
    }
    getCustomerOrder(prcode) {
        this.customerorder = this.customerorders.find(customerorder => customerorder.prcode == prcode);
        return this.customerorder;
    }
    getFGINPsByOrderCode(ordercode) {
        return this.customerOrderProducts.find(customerOrderProduct => customerOrderProduct.code == ordercode)
    }
    getPurchaseOrder(jobID) {
        this.customerorder = this.customerorders.find(customerorder => customerorder.jobID == jobID);
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
    clearcop() {
        this.customerOrderProducts = [];
    }
}
class FinishedGoodsInSerial {
    constructor() {
        this.parent_code;
        this.code;
        this.index;
        this.length;
        this.GroupCode;
    }
    genarateFGINCode(index, parent_code) {
        this.parent_code = parseInt(parent_code.match(/\d+(?=$)/g));
        this.code = "FGIN";
        this.index = parseInt(String(this.parent_code).concat("0", index + 1));
        this.length = 9;
        this.GroupCode = this.code + String(this.index).padStart(this.length - 3, '0');
        return this.GroupCode;
    }
    genarateFGINMCode(index, parent_code) {
        this.parent_code = parseInt(parent_code.match(/\d+(?=$)/g));
        this.code = "FGINM";
        this.index = parseInt(String(this.parent_code).concat("0", index + 1));
        this.length = 11;
        this.GroupCode = this.code + String(this.index).padStart(this.length - 4, '0');
        return this.GroupCode;
    }
}
function fginClassesInstence(){
    return{
        customerorder: new customerorder(),
        customerOrderProduct: new customerOrderProduct(),
        finishedgoodsinnote: new finishedgoodsinnote(),
        finishedGoodsInNoteProduct: new finishedGoodsInNoteProduct(),
        finishedGoodsInNote_service: new finishedGoodsInNote_service(),
        finishedGoodsInNote_service: new finishedGoodsInNote_service(),
        customerorder_service: new customerorder_service(),
        FinishedGoodsInSerial:new FinishedGoodsInSerial()
    }
}
return {
    fginClassesInstence : fginClassesInstence
}
})();
//end of classes