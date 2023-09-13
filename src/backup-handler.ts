import { DefterDb, Entity, Transaction } from "./db";

const db = new DefterDb();

export async function saveToDb(fileContent: string) {
    const lines = fileContent.split(/[\r\n]+/)
    try {
        const wholeData = lines.map((v) => parseLine(v))
        // console.log(wholeData);

        let latestEntityId = 0
        let latestEntityPhone = ''

        for (let i = 0; i < wholeData.length; i++) {
            const { ent, trns } = wholeData[i];
            if (latestEntityPhone !== ent.phoneNumber) {
                latestEntityId = await db.entities.add(ent)
            }
            trns.customerId = latestEntityId
            latestEntityPhone = ent.phoneNumber
            await db.transactions.add(trns)
        }

        return ''
    } catch (error) {
        console.log(error);
        return JSON.stringify(error)
    }
}

export async function prepareContentFromDb() {

    const lines = [] as string[]
    const entities = await db.entities.toArray()

    for (let i = 0; i < entities.length; i++) {
        const ent = entities[i];
        const transactions = await db.transactions
            .where("customerId")
            .equals(ent.id ?? -1)
            .reverse()
            .sortBy("date");

        transactions.forEach(trn => {

            lines.push(createLine(ent, trn))
        });
    }

    return lines.join('\n')
}

const separator = "*&*"

function parseLine(line: string) {
    const fields = line.split(separator)
    return {
        ent: {
            name: fields[0],
            phoneNumber: fields[1],
            note: fields[2]
        } as Entity,
        trns: {
            amount: parseFloat(fields[3]),
            type: fields[4],
            date: new Date(parseInt(fields[5])),
            note: fields[6]
        } as Transaction
    }
}
function createLine(ent: Entity, trns: Transaction) {
    const line = ent.name + separator +
        ent.phoneNumber + separator +
        ent.note + separator +
        trns.amount + separator +
        trns.type + separator +
        trns.date.getTime() + separator +
        trns.note
    return line
}