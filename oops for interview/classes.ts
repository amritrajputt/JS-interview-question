// Build a BankAccount class where the constructor validates that initial balance isn't negative 
// (throw an error otherwise), and add a transfer(otherAccount, amount) method that moves money 
// between two instances, checking sufficient balance.

class BankAccount {
    initialBalance:number;
    name:string;
    constructor(initialBalance:number,name:string) {
        if (initialBalance < 0) {
            throw new Error('Initial balance must be non-negative');
            return;
        }
        this.initialBalance = initialBalance;
        this.name = name;
    }

    transfer(otherAccount:BankAccount,amount:number) {
        if (this.initialBalance < amount) {
            throw new Error('Insufficient balance');
            return;
        }
        otherAccount.initialBalance += amount;
        this.initialBalance -= amount;
        return;
    }

}