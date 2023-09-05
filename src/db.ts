import { Dexie } from "dexie";

export class DefterDb extends Dexie {
    entities!: Dexie.Table<Entity, number>;
    transactions!: Dexie.Table<Transaction, number>;

    constructor() {
        super("defter");

        // Define tables and indexes
        this.version(1).stores({
            entities: "++id,name,phoneNumber,note",
            transactions: "++id,customerId,amount,type,date,note",
        });
    }
}

export interface Entity {
    id?: number;
    name: string;
    phoneNumber: string;
    note: string;
}
export interface Transaction {
    id?: number;
    customerId: number;
    amount: number;
    type: "c" | "d";
    date: Date;
    note: string;
}