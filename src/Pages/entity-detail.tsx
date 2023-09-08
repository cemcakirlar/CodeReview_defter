import { Link, useParams } from "react-router-dom";
import { DefterDb, Entity } from "../db";
import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

const db = new DefterDb();
export default function EntityDetail() {
  const { entityId } = useParams();

  const transactions = useLiveQuery(() => {
    if (
      entityId &&
      typeof entityId === "string" &&
      !Number.isNaN(parseInt(entityId))
    ) {
      return db.transactions
        .where("customerId")
        .equals(parseInt(entityId) ?? -1)
        .toArray();
    }
    return [];
  }, []);
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

  const totalCredit = transactions
    ?.filter((c) => getType(c.type) == "c")
    .reduce(function (a, b) {
      return a + b.amount;
    }, 0);
  const totalDebit = transactions
    ?.filter((c) => getType(c.type) == "d")
    .reduce(function (a, b) {
      return a + b.amount;
    }, 0);
  const balance = (totalCredit ?? 0) - (totalDebit ?? 0);
  const normalizedPhoneNumber = normalizePhoneNumber(entity?.phoneNumber ?? "");
  const phoneNumberIsInvalid = normalizedPhoneNumber == "invalid";
  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col w-1/2">
          <h2 className="text-xl">{entity?.name}</h2>
          <span>Tel: {entity?.phoneNumber}</span>
          <span>Not: {entity?.note}</span>
        </div>
        <div className="flex flex-col w-1/2 items-end">
          <span
            className="w-1/4 font-bold text-2xl"
            style={{ color: balance < 0 ? "#F31559" : "#A8DF8E" }}
          >
            {balance} tl
          </span>
          {!phoneNumberIsInvalid && (
            <>
              <a
                target="_blank"
                className="w-1/4 font-bold text-l"
                href={`sms:${normalizedPhoneNumber}&body=Borcunuz ${balance} tl`}
              >
                SMS
              </a>
              <a
                target="_blank"
                className="w-1/4 font-bold text-l"
                href={`https://wa.me/${normalizedPhoneNumber}?text=Borcunuz%20${balance}%20tl`}
              >
                Whatsapp
              </a>
            </>
          )}
        </div>
      </div>
      <div className="flex-1 p-2">
        <h2 className="text-center text-xl">Islemler</h2>
        <div className="flex flex-row">
          <Link
            to={`/entities/${entityId}/new`}
            className="text-center w-full block p-2 mt-2 underline underline-offset-4"
          >
            Yeni Ekle
          </Link>
          <Link
            to={`/entities/`}
            className="text-center w-full block p-2 mt-2 underline underline-offset-4"
          >
            Geri
          </Link>
        </div>
      </div>
      <div className="flex-1">
        {transactions?.map((t) => {
          const ttype = getType(t.type);
          const debit = ttype == "d";
          const credit = ttype == "c";
          const error = !debit && !credit;
          if (error) {
            console.log("error on transaction type for :", t.id);
          }
          return (
            <Row
              key={t.id}
              label={t.date}
              desc={t.note}
              debit={debit ? t.amount : undefined}
              credit={credit ? t.amount : undefined}
            />
          );
        })}
      </div>
      <Row
        label="Toplam"
        desc=""
        debit={totalDebit}
        credit={totalCredit}
      />
    </>
  );
}

type RowProps = {
  label: string | Date;
  desc: string | undefined;
  debit: number | undefined;
  credit: number | undefined;
};
function Row({ label, desc, debit, credit }: RowProps) {
  const lblStr = typeof label === "string" ? label : label.toLocaleDateString();
  return (
    <div className="p-2 m-2 flex text-white  border-b-2 rounded-sm justify-between">
      <div className="w-1/2 md:w-1/3">
        <span>{lblStr}</span>
      </div>
      <div className="hidden md:block md:w-1/3">
        <span>{desc}</span>
      </div>
      <div className="w-1/2 md:w-1/3 flex justify-between">
        <div className="w-1/2 font-bold">
          {debit && (
            <span style={{ color: "#F31559", textAlign: "start" }}>
              {debit} tl
            </span>
          )}
        </div>
        <div className="w-1/2 font-bold">
          {credit && (
            <span style={{ color: "#A8DF8E", textAlign: "end" }}>
              {credit} tl
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function normalizePhoneNumber(phoneNumber: string) {
  phoneNumber = phoneNumber.replaceAll(/\s/g, "");
  if (phoneNumber.startsWith("+9")) {
    phoneNumber = phoneNumber.replace(/\+/, "");
  } else if (phoneNumber.startsWith("0090")) {
    phoneNumber = phoneNumber.replace(/0090/, "90");
  } else if (phoneNumber.startsWith("5")) {
    phoneNumber = "90" + phoneNumber;
  } else {
    phoneNumber = "invalid";
  }

  if (phoneNumber.length < 10) {
    phoneNumber = "invalid";
  }

  return phoneNumber;
}
function getType(tType: string) {
  switch (tType.toLowerCase()) {
    case "a":
    case "alacak":
    case "c":
    case "credit":
      return "c";

    case "b":
    case "borc":
    case "d":
    case "debit":
      return "d";
  }
  return "";
}
