import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DefterDb, Entity, Transaction } from "../db";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const db = new DefterDb();

const today = new Date();
export default function NewTransaction() {
  const { entityId } = useParams();
  const [result, setResult] = useState("");
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

  const [date, setDate] = useState(today as Date | null);
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");
  const [type, setType] = useState("d" as "c" | "d");
  function resetForm() {
    setDate(today);
    setNote("");
    setAmount(0);
  }
  return (
    <form
      className="p-2 m-2 flex rounded-sm flex-col gap-1"
      onSubmit={(e) => {
        e.preventDefault();
        const rec: Transaction = {
          date: date ?? today,
          amount,
          customerId: entity?.id!,
          type,
          note,
        };
        console.log(rec);
        db.transactions
          .add(rec)
          .then(resetForm)
          .then(() => {
            setResult("Eklendi");
          });
      }}
    >
      <span className="text-center w-full block">{entity?.name}</span>
      <span className="text-center w-full block">{entity?.phoneNumber}</span>

      <DatePicker
        className="p-2 bg-inherit border-white border-2 rounded w-full"
        selected={date}
        onChange={(d) => setDate(d)}
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
      <span className="text-center w-full block p-2 mt-2">{result}</span>
      <div className="flex flex-row">
        <button className="text-center w-full block p-2 mt-2 underline underline-offset-4">
          Kaydet
        </button>
        <Link
          to={`/entities/${entityId}`}
          className="text-center w-full block p-2 mt-2 underline underline-offset-4"
        >
          Geri
        </Link>
      </div>
    </form>
  );
}
