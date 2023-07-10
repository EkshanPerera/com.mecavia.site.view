//classescode
var materialClasses = (function () {
    class material {
        constructor(id, code, description, materialType, materialid, status, price) {
            this.id = id;
            this.code = code;
            this.description = description;
            this.materialType = materialType;
            this.uomid = materialid;
            this.status = status;
            this.price = price;
        }
    }
    class material_service {
        constructor() {
            this.materials = [];
            this.material;
        }
        addMaterialtoArray(id, code, description, materialType, uomid, status, price) {
            let material_arritem = new material(id, code, description, materialType, uomid, status, price);
            this.materials.push(material_arritem);
        }
        allMaterial() {
            return this.materials;
        }
        getMaterial(code) {
            this.material = this.materials.find(material => material.code == code);
            return this.material;
        }
        getMaterialById(id) {
            this.material = this.materials.find(material => material.id == id);
            return this.material;
        }
        clear() {
            this.materials = [];
            this.material = undefined;

        }
    }
    class MaterialSerial {
        constructor() {
            this.parent_code;
            this.code;
            this.index;
            this.length;
            this.GroupCode;
        }
        genarateMaterialCode(index) {
            this.code = "M";
            this.index = index + 1;
            this.length = 7;
            this.GroupCode = this.code + String(this.index).padStart(this.length - 2, '0');
            return this.GroupCode;
        }
    }
    function materialClassesInstence() {
        return {
            material: new material(),
            material_service: new material_service(),
            MaterialSerial: new MaterialSerial()
        }
    }
    return {
        materialClassesInstence: materialClassesInstence
    }
})();
//end of classes