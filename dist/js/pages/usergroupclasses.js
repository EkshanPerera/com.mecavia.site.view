//classes
var usergroupClasses = (function () {
    class usr_grp {
        constructor(id, code, description, status, userslist, roleslist) {
            this.id = id;
            this.code = code;
            this.description = description;
            this.status = status;
            this.userslist = userslist;
            this.roleslist = roleslist;
        }
    }
    class abstract_user {
        constructor(id, code, firstname, lastname, email, role, status) {
            this.id = id
            this.code = code;
            this.firstname = firstname;
            this.lastname = lastname;
            this.email = email;
            this.businessRole = role;
            this.status = status;
        }
    }
    class user_role {
        constructor(id, description, code, status, accIconList) {
            this.id = id;
            this.description = description;
            this.code = code;
            this.status = status;
            this.accIconList = accIconList;
        }
    }
    class usr_grp_service {
        constructor() {
            this.usr_grps = [];
            this.usrs = [];
            this.user_roles = [];
            this.usr_grp;
            this.user_role;
        }
        addUsrGrptoArray(id, code, description, status) {
            let usr_grp_arritem = new usr_grp(id, code, description, status, this.usrs, this.user_roles);
            this.usr_grps.push(usr_grp_arritem);
            this.usrs = [];
            this.user_roles = [];
        }
        addRoletoArry(id, description, code, status, accIconList) {
            let role_arritem = new user_role(id, description, code, status, accIconList);
            this.user_roles.push(role_arritem);
        }
        addUsertoArry(id, code, firstname, lastname, email, role, status) {
            let user_arritem = new abstract_user(id, code, firstname, lastname, email, role, status);
            this.usrs.push(user_arritem);
        }
        allUsrGrp() {

            return this.usr_grps;
        }
        getUsrGrp(code) {
            this.usr_grp = this.usr_grps.find(usr_grp => usr_grp.code == code);
            return this.usr_grp;
        }
        getUsrGrpById(id) {
            this.usr_grp = this.usr_grps.find(usr_grp => usr_grp.id == id);
            return this.usr_grp;
        }
        getUserRole(usrgrp, code) {
            this.usr_grp = this.usr_grps.find(usr_grp => usr_grp.code == usrgrp);
            this.user_roles = this.usr_grp.roleslist;
            this.user_role = this.user_roles.find(user_role => user_role.code == code);
            this.usr_grp = this.user_roles = undefined;
            return this.user_role;
        }
        getUserRoleByid(usrgrpid, id) {
            this.usr_grp = this.usr_grps.find(usr_grp => usr_grp.usrgrpid == usrgrpid);
            this.user_roles = this.usr_grp.roleslist;
            this.user_role = this.user_roles.find(user_role => user_role.id == id);
            this.usr_grp = this.user_roles = undefined;
            return this.user_role;
        }
        clear() {
            this.usr_grps = [];
            this.usrs = [];
            this.user_roles = [];
            this.usr_grp = this.user_role = undefined;

        }
    }
    class UsrGrpSerial {
        constructor() {
            this.parent_code;
            this.code;
            this.index;
            this.length;
            this.GroupCode;
        }
        genarateUserGroupCode(index) {
            this.code = "UG";
            this.index = index + 1;
            this.length = 7;
            this.GroupCode = this.code + String(this.index).padStart(this.length - 2, '0');
            return this.GroupCode;
        }
        genarateUserRoleCode(index, parent_code) {
            this.parent_code = parseInt(parent_code.match(/\d+/));
            this.code = "UR";
            this.index = parseInt(String(this.parent_code).concat("0", index + 1));
            this.length = 7;
            this.GroupCode = this.code + String(this.index).padStart(this.length - 2, '0');
            return this.GroupCode;
        }
    }
    function usergroupClassesInstence() {
        return {
            usr_grp: new usr_grp(),
            abstract_user: new abstract_user(),
            user_role: new user_role(),
            usr_grp_service: new usr_grp_service(),
            UsrGrpSerial: new UsrGrpSerial()
        };
    }
    return {
        usergroupClassesInstence: usergroupClassesInstence
    };
})();

//end of classes