const getterName = 'debt';
const type = 'type';
class MyAcount {
  get balance() { return this.amount; }
  set balance(amount) { this.amount = amount; }
  get [getterName]() { return this.debtAmount || 'no debt';}
  set [getterName](amount) { this.debtAmount = amount;}

  static doSomething() { return 'static method';}
  static get maxValue() { return 1000; }
  static get [type]() { return 'PERSONAL'; }
}



var acount = new MyAcount();
acount.balance = 40;
console.log(acount.balance)
console.log(acount.debt)
acount.debt = 100;
console.log(acount.debt)
console.log(MyAcount.doSomething())
console.log(MyAcount.maxValue)
console.log(MyAcount.type)

//B extends A , B is also an instance of Object
class A {}
class B extends A {}
//new B() instanceof A = true
//new B() instanceof Object = true;


//inline assign class
let A;
class B extends (A = class {}) {}


//super in method
class User {
    constructor (name) {
        this.name = name;
    }
    login () { return 'user '  + this.name + ' login in';}
}

class Admin extends User {
    login () {
        return 'admin ' + super.login();
    }
}
let user = new User('iris');
console.log(user.login());
let admin = new Admin('andrew');
console.log(admin.login());