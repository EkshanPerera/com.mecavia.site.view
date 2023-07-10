//classes
var appicongroupClasses = (function () {
    class appicongroup {
        constructor(id, code, description, status, appiconslist) {
            this.id = id;
            this.code = code;
            this.description = description;
            this.status = status;
            this.appiconslist = appiconslist;
        }
    }

    class appicon {
        constructor(id, description, code, status, appIconGroup) {
            this.id = id;
            this.description = description;
            this.code = code;
            this.status = status;
            this.appIconGroup = appIconGroup;
        }
    }
    class appicongroup_service {
        constructor() {
            this.appicongroups = [];
            this.appicons = [];
            this.orgappicons = [];
            this.appicongroup;
            this.appicon;
        }
        addAppIconGrouptoArray(id, code, description, status) {
            let appicongroup_arritem = new appicongroup(id, code, description, status, this.appicons);
            this.appicongroups.push(appicongroup_arritem);
            this.appicons = [];
        }
        addAppIcontoArry(id, description, code, status, appIconGroup) {
            let appicon_arritem = new appicon(id, description, code, status, appIconGroup);
            this.appicons.push(appicon_arritem);
            this.orgappicons.push(appicon_arritem);
        }

        allAppIconGroup() {
            return this.appicongroups;
        }
        getAppIconGroup(code) {
            this.appicongroup = this.appicongroups.find(appicongroup => appicongroup.code == code);
            return this.appicongroup;
        }
        getAppIconByCode(code) {
            var orgappicon = this.orgappicons.find(orgappicon => orgappicon.code == code);
            return orgappicon;
        }
        getAppIconGroupById(id) {
            this.appicongroup = this.appicongroups.find(appicongroup => appicongroup.id == id);
            return this.appicongroup;
        }
        getAppIcon(appicongrp, code) {
            this.appicongroup = this.appicongroups.find(appicongroup => appicongroup.code == appicongrp);
            this.appicons = this.appicongroup.appiconslist;
            this.appicon = this.appicons.find(appicon => appicon.code == code);
            this.appicon.appIconGroup = this.appicongroup;
            this.appicongroup = this.appicons = undefined;
            return this.appicon;
        }

        getAppIconByid(appicongroupid, id) {
            this.appicongroup = this.appicongroups.find(appicongroup => appicongroup.appicongroupid == appicongroupid);
            this.appicons = this.appicongroup.appiconslist;
            this.appicon = this.appicons.find(appicon => appicon.id == id);
            this.appicongroup = this.appicons = undefined;
            return this.appicon;
        }
        clear() {
            this.appicongroups = [];
            this.usrs = [];
            this.appicons = [];
            this.orgappicons = [];
            this.appicongroup = this.appicon = undefined;

        }
    }
    class AppIconGroupSerial {
        constructor() {
            this.parent_code;
            this.code;
            this.index;
            this.length;
            this.GroupCode;
        }
        genarateAppIconGroupCode(index) {
            this.code = "AG";
            this.index = index + 1;
            this.length = 7;
            this.GroupCode = this.code + String(this.index).padStart(this.length - 2, '0');
            return this.GroupCode;
        }
        genarateAppIconCode(index, parent_code) {
            this.parent_code = parseInt(parent_code.match(/\d+/));
            this.code = "AI";
            this.index = parseInt(String(this.parent_code).concat("0", index + 1));
            this.length = 7;
            this.GroupCode = this.code + String(this.index).padStart(this.length - 2, '0');
            return this.GroupCode;
        }
    }
    function appicongroupClassesInstence() {
        return {
            appicongroup: new appicongroup(),
            appicon: new appicon(),
            appicongroup_service: new appicongroup_service(),
            AppIconGroupSerial: new AppIconGroupSerial()
        };
    }
    return {
        appicongroupClassesInstence: appicongroupClassesInstence
    };
})();

//end of classes