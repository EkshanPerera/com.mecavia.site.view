//classes
var userClasses = (function(){
class user {
    constructor(id, code, firstname, middlename, lastname, email, password, businessRole, status, addresses, contactNumbers, userGroupid, roleid, firstLogin) {
        this.id = id;
        this.code = code;
        this.firstname = firstname;
        this.middlename = middlename;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.businessRole = businessRole;
        this.status = status;
        this.addresses = addresses;
        this.contactNumbers = contactNumbers;
        this.userGroupid = userGroupid;
        this.roleid = roleid;
        this.firstLogin = firstLogin;
    }
}
class user_addresses {
    constructor(id, code, line01, line02, line03, line04, isdef, status) {
        this.id = id;
        this.code = code;
        this.line01 = line01;
        this.line02 = line02;
        this.line03 = line03;
        this.line04 = line04;
        this.isdef = isdef;
        this.status = status;
    }
}
class user_contacts {
    constructor(id, code, description, tpno, isdef, status) {
        this.id = id;
        this.code = code;
        this.description = description;
        this.tpno = tpno;
        this.isdef = isdef;
        this.status = status;
    }
}
class usr_service {
    constructor() {
        this.users = [];
        this.user;
        this.addresses = [];
        this.contactNumbers = [];
        this.address;
        this.contactNumber;
    }
    addUsrtoArray(id, code, firstname, middlename, lastname, email, password, businessRole, status, firstLogin, userGroupid, roleid) {
        let usr_arritem = new user(id, code, firstname, middlename, lastname, email, password, businessRole, status, this.addresses, this.contactNumbers, userGroupid, roleid, firstLogin);
        this.users.push(usr_arritem);
        this.addresses = [];
        this.contactNumbers = [];
    }
    addAddresstoArry(id, code, line01, line02, line03, line04, isdef, status) {
        let address_arritem = new user_addresses(id, code, line01, line02, line03, line04, isdef, status);
        this.addresses.push(address_arritem);
    }
    addContactstoArry(id, code, description, tpno, isdef, status) {
        let contacts_arritem = new user_contacts(id, code, description, tpno, isdef, status);
        this.contactNumbers.push(contacts_arritem);
    }
    allUsers() {
        return this.users;
    }
    getUser(code) {
        this.user = this.users.find(user => user.code == code);
        return this.user;
    }
    getUserAddress(usr, code) {
        this.user = this.users.find(user => user.code == usr);
        this.addresses = this.user.addresses;
        this.address = this.addresses.find(user_addresses => user_addresses.code == code);
        this.user = this.addresses = undefined;
        return this.address;
    }
    getUserContact(usr, code) {
        this.user = this.users.find(user => user.code == usr);
        this.contactNumbers = this.user.contactNumbers;
        this.contactNumber = this.contactNumbers.find(contactNumbers => contactNumbers.code == code);
        this.user = this.contactNumbers = undefined;
        return this.contactNumber;
    }
    clear() {
        this.users = [];
        this.user = this.address = this.contactNumber = undefined;
        this.addresses = [];
        this.contactNumbers = [];

    }
}
class UsrSerial {
    constructor() {
        this.parent_code;
        this.code;
        this.index;
        this.length;
        this.GroupCode;
    }
    genarateUserCode(index) {
        this.code = "U";
        this.index = index + 1;
        this.length = 7;
        this.GroupCode = this.code + String(this.index).padStart(this.length - 1, '0');
        return this.GroupCode;
    }
    genarateUserAddrCode(index, parent_code) {
        this.parent_code = parseInt(parent_code.match(/\d+/));
        this.code = "UA";
        this.index = parseInt(String(this.parent_code).concat("0", index + 1));
        this.length = 7;
        this.GroupCode = this.code + String(this.index).padStart(this.length - 2, '0');
        return this.GroupCode;
    }
    genarateUserContCode(index, parent_code) {
        this.parent_code = parseInt(parent_code.match(/\d+/));
        this.code = "UC";
        this.index = parseInt(String(this.parent_code).concat("0", index + 1));
        this.length = 7;
        this.GroupCode = this.code + String(this.index).padStart(this.length - 2, '0');
        return this.GroupCode;
    }
}
function userClassesInstence(){
    return{
        user: new user(),
        user_addresses: new user_addresses(),
        user_contacts: new user_contacts(),
        usr_service:new usr_service(),
        UsrSerial:new UsrSerial()
    }
}
return {
    userClassesInstence : userClassesInstence
}
})();
//end of classes