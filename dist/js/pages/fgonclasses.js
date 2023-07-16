//classescode
var finishedGoodsOutNoteClasses = (function () {
    class FinishedGoodsOutNoteDto {
        constructor(id, code, enterddate, customerOrder, finishedGoodsOutNoteProducts, printeddate, remark, status, enteredUser) {
            this.id = id;
            this.code = code;
            this.enterddate = enterddate;
            this.customerOrder = customerOrder;
            this.finishedGoodsOutNoteProducts = finishedGoodsOutNoteProducts;
            this.printeddate = printeddate;
            this.remark = remark;
            this.status = status;
            this.enteredUser = enteredUser
        }
    }
    class FinishedGoodsOutNoteProductDto {
        constructor(id, code, finishedGoodsOutNote, product, releasedCount) {
            this.id = id;
            this.code = code;
            this.finishedGoodsOutNote = finishedGoodsOutNote;
            this.product = product;
            this.releasedCount = releasedCount;
        }
    }


    class finishedGoodsOutNote_service {
        constructor() {
            this.FinishedGoodsOutNoteDtos = [];
            this.FinishedGoodsOutNoteDto;
            this.FinishedGoodsOutNoteProductDtos = [];
        }
        addFGONtoArray(id, code, enterddate, customerOrder, finishedGoodsOutNoteProducts, printeddate, remark, status, enteredUser) {
            let FinishedGoodsOutNoteDto_arritem = new FinishedGoodsOutNoteDto(id, code, enterddate, customerOrder, finishedGoodsOutNoteProducts, printeddate, remark, status, enteredUser);
            this.FinishedGoodsOutNoteDtos.push(FinishedGoodsOutNoteDto_arritem);
        }
        addFGONPtoArray(id, code, finishedGoodsOutNote, product, releasedCount) {
            let FinishedGoodsOutNoteProductDtos_arritem = new FinishedGoodsOutNoteProductDto(id, code, finishedGoodsOutNote, product, releasedCount);
            this.FinishedGoodsOutNoteProductDtos.push(FinishedGoodsOutNoteProductDtos_arritem);
        }
        allFGON() {
            return this.FinishedGoodsOutNoteDtos;
        }
        allFGONP() {
            return this.FinishedGoodsOutNoteProductDtos;
        }
        getFGON(code) {
            this.FinishedGoodsOutNoteDto = this.FinishedGoodsOutNoteDtos.find(FinishedGoodsOutNoteDto => FinishedGoodsOutNoteDto.code == code);
            return this.FinishedGoodsOutNoteDto;
        }
        getFGONById(id) {
            this.FinishedGoodsOutNoteDto = this.FinishedGoodsOutNoteDtos.find(FinishedGoodsOutNoteDto => FinishedGoodsOutNoteDto.id == id);
            return this.FinishedGoodsOutNoteDto;
        }
        clear() {
            this.FinishedGoodsOutNoteDtos = [];
            this.FinishedGoodsOutNoteDto = undefined;

        }
    }
    class FGONSerial {
        constructor() {
            this.parent_code;
            this.code;
            this.index;
            this.length;
            this.GroupCode;
        }
        genarateFGONCode(index) {
            this.code = "FGON";
            this.index = index + 1;
            this.length = 7;
            this.GroupCode = this.code + String(this.index).padStart(this.length - 2, '0');
            return this.GroupCode;
        }
    }
    function FinishedGoodsOutNoteClassesInstence() {
        return {
            FinishedGoodsOutNoteDto: new FinishedGoodsOutNoteDto(),
            finishedGoodsOutNote_service: new finishedGoodsOutNote_service(),
            FGONSerial: new FGONSerial()
        }
    }
    return {
        FinishedGoodsOutNoteClassesInstence: FinishedGoodsOutNoteClassesInstence
    }
})();
//end of classes

