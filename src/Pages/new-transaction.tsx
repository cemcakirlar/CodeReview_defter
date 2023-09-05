import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DefterDb, Entity, Transaction } from "../db";
const db = new DefterDb();

const today = new Date();
export default function NewTransaction() {
  const { entityId } = useParams();

  const [entity, setEntity] = useState(undefined as Entity | undefined);
  useEffect(() => {
    if (
      entityId &&
      typeof entityId === "string" &&
      !Number.isNaN(parseInt(entityId))
    ) {
      db.entities.get(parseInt(entityId)).then((rec) => setEntity(rec));
    }
  }, [entityId]);

  const [date, setDate] = useState(today);
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");
  const [type, setType] = useState("d" as "c" | "d");
  function resetForm() {}
  return (
    <form
      className="p-2 m-2 flex rounded-sm flex-col gap-1"
      onSubmit={(e) => {
        e.preventDefault();
        const rec: Transaction = {
          date,
          amount,
          customerId: entity?.id!,
          type,
          note,
        };
        console.log(rec);
        db.transactions.add(rec).then(resetForm);
      }}
    >
      <input
        onChange={(e) => {
          //`${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
          setDate(new Date(e.target.value));
        }}
        value={date.toDateString()}
        type="date"
        pattern="\d{4}-\d{2}-\d{2}"
        className="p-2 bg-inherit border-white border-2 rounded"
        placeholder="tarih"
      />
      <input
        onChange={(e) => {
          const amount = parseFloat(e.target.value);
          if (Number.isNaN(amount)) {
            setAmount(0);
          }
          setAmount(amount);
        }}
        value={amount}
        type="number"
        className="p-2 bg-inherit border-white border-2 rounded"
        placeholder="tutar"
      />
      <input
        onChange={(e) => setNote(e.target.value)}
        value={note}
        className="p-2 bg-inherit border-white border-2 rounded"
        placeholder="not"
      />
      <div className="flex justify-between">
        <label>
          <input
            type="radio"
            value="d"
            className="m-1"
            checked={type === "d"}
            onChange={(e) => e.target.checked && setType("d")}
          />
          Borclandi
        </label>
        <label>
          <input
            type="radio"
            value="c"
            className="m-1"
            checked={type === "c"}
            onChange={(e) => e.target.checked && setType("c")}
          />
          Odeme yapti
        </label>
      </div>

      <button>kaydet</button>
    </form>
  );
}
