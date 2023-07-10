//classes
var clientClasses = (function () {
    class client {
        constructor(id, code, firstname, middlename, lastname, email, businessRole, status, addresses, contactNumbers) {
            this.id = id;
            this.code = code;
            this.firstname = firstname;
            this.middlename = middlename;
            this.lastname = lastname;
            this.email = email;
            this.businessRole = businessRole;
            this.status = status;
            this.addresses = addresses;
            this.contactNumbers = contactNumbers;
        }
    }
    class client_addresses {
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
    class client_contacts {
        constructor(id, code, description, tpno, isdef, status) {
            this.id = id;
            this.code = code;
            this.description = description;
            this.tpno = tpno;
            this.isdef = isdef;
            this.status = status;
        }
    }
    class cli_service {
        constructor() {
            this.clients = [];
            this.client;
            this.addresses = [];
            this.contactNumbers = [];
            this.address;
            this.contactNumber;
        }
        addClitoArray(id, code, firstname, middlename, lastname, email, businessRole, status) {
            let cli_arritem = new client(id, code, firstname, middlename, lastname, email, businessRole, status, this.addresses, this.contactNumbers);
            this.clients.push(cli_arritem);
            this.addresses = [];
            this.contactNumbers = [];
        }
        addAddresstoArry(id, code, line01, line02, line03, line04, isdef, status) {
            let address_arritem = new client_addresses(id, code, line01, line02, line03, line04, isdef, status);
            this.addresses.push(address_arritem);
        }
        addContactstoArry(id, code, description, tpno, isdef, status) {
            let contacts_arritem = new client_contacts(id, code, description, tpno, isdef, status);
            this.contactNumbers.push(contacts_arritem);
        }
        allClients() {
            return this.clients;
        }
        getClient(code) {
            this.client = this.clients.find(client => client.code == code);
            return this.client;
        }
        getClientAddress(cli, code) {
            this.client = this.clients.find(client => client.code == cli);
            this.addresses = this.client.addresses;
            this.address = this.addresses.find(client_addresses => client_addresses.code == code);
            this.client = this.addresses = undefined;
            return this.address;
        }
        getClientContact(cli, code) {
            this.client = this.clients.find(client => client.code == cli);
            this.contactNumbers = this.client.contactNumbers;
            this.contactNumber = this.contactNumbers.find(contactNumbers => contactNumbers.code == code);
            this.client = this.contactNumbers = undefined;
            return this.contactNumber;
        }
        clear() {
            this.clients = [];
            this.client = this.address = this.contactNumber = undefined;
            this.addresses = [];
            this.contactNumbers = [];

        }
    }
    class CliSerial {
        constructor() {
            this.parent_code;
            this.code;
            this.index;
            this.length;
            this.GroupCode;
        }
        genarateClientCode(index) {
            this.code = "C";
            this.index = index + 1;
            this.length = 7;
            this.GroupCode = this.code + String(this.index).padStart(this.length - 1, '0');
            return this.GroupCode;
        }
        genarateClientAddrCode(index, parent_code) {
            this.parent_code = parseInt(parent_code.match(/\d+/));
            this.code = "CA";
            this.index = parseInt(String(this.parent_code).concat("0", index + 1));
            this.length = 7;
            this.GroupCode = this.code + String(this.index).padStart(this.length - 2, '0');
            return this.GroupCode;
        }
        genarateClientContCode(index, parent_code) {
            this.parent_code = parseInt(parent_code.match(/\d+/));
            this.code = "CC";
            this.index = parseInt(String(this.parent_code).concat("0", index + 1));
            this.length = 7;
            this.GroupCode = this.code + String(this.index).padStart(this.length - 2, '0');
            return this.GroupCode;
        }
    }
    function clientClassesInstence() {
        return {
            client: new client(),
            client_addresses: new client_addresses(),
            client_contacts: new client_contacts(),
            cli_service: new cli_service(),
            CliSerial: new CliSerial()
        }
    }
    return {
        clientClassesInstence: clientClassesInstence
    }
})();
//end of classes