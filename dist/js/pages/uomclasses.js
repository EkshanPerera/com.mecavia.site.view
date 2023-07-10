//classes
var uomClasses = (function () {
    class uom {
        constructor(id, code, scode, description, status) {
            this.id = id;
            this.code = code;
            this.scode = scode;
            this.description = description;
            this.status = status;
        }
    }
    class uom_service {
        constructor() {
            this.uoms = [];
            this.uom;
        }
        addUOMtoArray(id, code, scode, description, status) {
            let uom_arritem = new uom(id, code, scode, description, status);
            this.uoms.push(uom_arritem);
        }
        allUOM() {
            return this.uoms;
        }
        getUOM(code) {
            this.uom = this.uoms.find(uom => uom.code == code);
            return this.uom;
        }
        getUOMById(id) {
            this.uom = this.uoms.find(uom => uom.id == id);
            return this.uom;
        }
        clear() {
            this.uoms = [];
            this.uom = undefined;
        }
    }
    class UOMSerial {
        constructor() {
            this.parent_code;
            this.code;
            this.index;
            this.length;
            this.GroupCode;
        }
        genarateUOMCode(index) {
            this.code = "UOM";
            this.index = index + 1;
            this.length = 7;
            this.GroupCode = this.code + String(this.index).padStart(this.length - 2, '0');
            return this.GroupCode;
        }
    }
    function uomClassesInstence() {
        return {
            uom: new uom(),
            uom_service: new uom_service(),
            UOMSerial: new UOMSerial()
        }
    }
    return {
        uomClassesInstence: uomClassesInstence
    }
})();
//end of classes