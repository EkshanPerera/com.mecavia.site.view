//classescode
var materialOutNoteClasses = (function () {
    class MaterialOutNoteDto {
        constructor(id, code, enterddate, materialRequisition, materialOutNoteMaterials, printeddate, remark, status, enteredUser) {
            this.id = id;
            this.code = code;
            this.enterddate = enterddate;
            this.materialRequisition = materialRequisition;
            this.materialOutNoteMaterials = materialOutNoteMaterials;
            this.printeddate = printeddate;
            this.remark = remark;
            this.status = status;
            this.enteredUser = enteredUser
        }
    }
    class MaterialOutNoteMaterialDto {
        constructor(id, code, materialOutNote, material, releasedCount) {
            this.id = id;
            this.code = code;
            this.materialOutNote = materialOutNote;
            this.material = material;
            this.releasedCount = releasedCount;
        }
    }


    class materialOutNote_service {
        constructor() {
            this.MaterialOutNoteDtos = [];
            this.MaterialOutNoteDto;
            this.MaterialOutNoteMaterialDtos = [];
        }
        addMONtoArray(id, code, enterddate, materialRequisition, materialOutNoteMaterials, printeddate, remark, status, enteredUser) {
            let MaterialOutNoteDto_arritem = new MaterialOutNoteDto(id, code, enterddate, materialRequisition, materialOutNoteMaterials, printeddate, remark, status, enteredUser);
            this.MaterialOutNoteDtos.push(MaterialOutNoteDto_arritem);
        }
        addMONMtoArray(id, code, materialOutNote, material, releasedCount) {
            let MaterialOutNoteMaterialDtos_arritem = new MaterialOutNoteMaterialDto(id, code, materialOutNote, material, releasedCount);
            this.MaterialOutNoteMaterialDtos.push(MaterialOutNoteMaterialDtos_arritem);
        }
        allMON() {
            return this.MaterialOutNoteDtos;
        }
        allMONM() {
            return this.MaterialOutNoteMaterialDtos;
        }
        getMON(code) {
            this.MaterialOutNoteDto = this.MaterialOutNoteDtos.find(MaterialOutNoteDto => MaterialOutNoteDto.code == code);
            return this.MaterialOutNoteDto;
        }
        getMONById(id) {
            this.MaterialOutNoteDto = this.MaterialOutNoteDtos.find(MaterialOutNoteDto => MaterialOutNoteDto.id == id);
            return this.MaterialOutNoteDto;
        }
        clear() {
            this.MaterialOutNoteDtos = [];
            this.MaterialOutNoteDto = undefined;

        }
    }
    class MONSerial {
        constructor() {
            this.parent_code;
            this.code;
            this.index;
            this.length;
            this.GroupCode;
        }
        genarateMONCode(index) {
            this.code = "MON";
            this.index = index + 1;
            this.length = 7;
            this.GroupCode = this.code + String(this.index).padStart(this.length - 2, '0');
            return this.GroupCode;
        }
    }
    function MaterialOutNoteClassesInstence() {
        return {
            MaterialOutNoteDto: new MaterialOutNoteDto(),
            materialOutNote_service: new materialOutNote_service(),
            MONSerial: new MONSerial()
        }
    }
    return {
        MaterialOutNoteClassesInstence: MaterialOutNoteClassesInstence
    }
})();
//end of classes

