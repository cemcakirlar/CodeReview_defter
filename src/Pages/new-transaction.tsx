import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DefterDb, Entity, Transaction } from "../db";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  BsTelephoneOutbound,
  CiUser,
  MdOutlineStickyNote2,
  AiTwotoneCalendar,
  FaScaleUnbalancedFlip,
} from "../icons";

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
  const [amountWhole, setAmountWhole] = useState(0);
  const [amountFractional, setAmountFractional] = useState(0);
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");
  const [type, setType] = useState("d" as "c" | "d");
  function resetForm() {
    setDate(today);
    setNote("");
    setAmount(0);
  }
  function calculateAmount(wholePart: number, fractionPart: number) {
    const fraction = fractionPart > 10 ? fractionPart / 100 : fractionPart / 10;

    setAmount(wholePart + fraction);
  }
  return (
    <form
      className="flex rounded-sm flex-col gap-1 w-full"
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
      <div className="flex flex-col w-full ">
        <div className="flex flex-row gap-2">
          <span className="text-2xl">
            <CiUser />
          </span>
          <span className="text-xl">{entity?.name}</span>
        </div>
        <div className="flex flex-row gap-2">
          <span className="text-xl">
            <BsTelephoneOutbound />
          </span>
          <span className="text-xl">{entity?.phoneNumber}</span>
        </div>
        <div className="flex flex-row gap-2">
          <span className="text-xl">
            <MdOutlineStickyNote2 />
          </span>
          <span className="text-xl">{entity?.note}</span>
        </div>
      </div>
      <div className="flex mt-6">
        <div className="w-1/6 flex justify-center items-center">
          <span className="text-2xl">
            <AiTwotoneCalendar />
          </span>
        </div>
        <div className="w-5/6 flex bg-inherit border-white border-2 rounded ">
          <DatePicker
            className="p-2 bg-inherit w-full"
            selected={date}
            onChange={(d) => setDate(d)}
          />
        </div>
      </div>
      <div className="flex">
        <div className="w-1/6 flex justify-center items-center">
          <span className="text-2xl"> ₺ </span>
        </div>
        <div className="w-5/6 flex bg-inherit border-white border-2 rounded ">
          <input
            onChange={(e) => {
              let val = e.target.value;
              if (e.target.value.endsWith(".")) {
                val = val + "0";
              }
              let amount = parseFloat(val);
              if (Number.isNaN(amount)) {
                amount = 0;
              }

              setAmountWhole(amount);

              calculateAmount(amount, amountFractional);
            }}
            value={amountWhole}
            type="tel"
            className="p-2 w-2/3 bg-inherit"
            placeholder="tutar"
          />
          <span className="text-3xl"> . </span>
          <input
            onChange={(e) => {
              let val = e.target.value;
              if (e.target.value.endsWith(".")) {
                val = val + "0";
              }
              let amount = parseFloat(val);
              if (Number.isNaN(amount)) {
                amount = 0;
              }

              setAmountFractional(amount);

              calculateAmount(amountWhole, amount);
            }}
            value={amountFractional}
            maxLength={2}
            type="tel"
            className="p-2 w-1/3 bg-inherit"
            placeholder="tutar"
          />
        </div>
      </div>
      <div className="flex">
        <div className="w-1/6 flex justify-center items-center">
          <span className="text-2xl">
            <MdOutlineStickyNote2 />
          </span>
        </div>
        <div className="w-5/6 flex bg-inherit border-white border-2 rounded ">
          <input
            onChange={(e) => setNote(e.target.value)}
            value={note}
            className="p-2 bg-inherit w-full"
            placeholder="not"
          />
        </div>
      </div>
      <div className="flex">
        <div className="w-1/6 flex justify-center items-center">
          <span className="text-2xl">
            <FaScaleUnbalancedFlip />
          </span>
        </div>
        <div className="w-5/6 flex bg-inherit border-white border-2 rounded justify-between p-2 ">
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
