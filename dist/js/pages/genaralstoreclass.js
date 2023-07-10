//classescode
var genaralStoreClasses = (function () {
    class GeneralStoreDto {
        constructor(id, materialid, itemcount, requestedItemcount, releasedItemcount, status) {
            this.id = id;
            this.materialid = materialid;
            this.itemcount = itemcount;
            this.requestedItemcount = requestedItemcount;
            this.releasedItemcount = releasedItemcount;
            this.status = status;
        }
    }
    class GeneralStoreDto_service {
        constructor() {
            this.GeneralStoreDtos = [];
            this.GeneralStoreDto;
        }
        addGeneralStoreDtostoArray(id, materialid, itemcount, requestedItemcount, releasedItemcount, status) {
            let GeneralStoreDto_arritem = new GeneralStoreDto(id, materialid, itemcount, requestedItemcount, releasedItemcount, status);
            this.GeneralStoreDtos.push(GeneralStoreDto_arritem);
        }
        allGeneralStoreDtos() {
            return this.GeneralStoreDtos;
        }
        getGeneralStoreDtoByMaterialCode(materialcode) {
            this.GeneralStoreDto = this.GeneralStoreDtos.find(GeneralStoreDto => GeneralStoreDto.materialid.code == materialcode);
            return this.GeneralStoreDto;
        }
    }

    function genaralStoreClassesInstence() {
        return {
            GeneralStoreDto: new GeneralStoreDto(),
            GeneralStoreDto_service: new GeneralStoreDto_service(),

        }
    }
    return {
        genaralStoreClassesInstence: genaralStoreClassesInstence
    }
})();
    //end of classes