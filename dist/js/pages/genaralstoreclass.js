//classescode
var genaralStoreClasses = (function(){
    class GeneralStoreDto {
        constructor(id,materialid,itemcount,status) {
            this.id = id;
            this.materialid = materialid;
            this.itemcount = itemcount;
            this.status = status;
        }
    }
    class GeneralStoreDto_service {
        constructor() {
            this.GeneralStoreDtos = [];
           
        }
        addGeneralStoreDtostoArray(id,materialid,itemcount,status) {
            let GeneralStoreDto_arritem = new GeneralStoreDto(id,materialid,itemcount,status);
            this.GeneralStoreDtos.push(GeneralStoreDto_arritem);
        }
        allGeneralStoreDtos() {
            return this.GeneralStoreDtos;
        }
    }
   
    function genaralStoreClassesInstence(){
        return{
            GeneralStoreDto: new GeneralStoreDto(),
            GeneralStoreDto_service: new GeneralStoreDto_service(),

        }
    }
    return {
        genaralStoreClassesInstence : genaralStoreClassesInstence
    }
    })();
    //end of classes