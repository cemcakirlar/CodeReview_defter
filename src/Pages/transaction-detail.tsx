import { Link, useParams } from "react-router-dom";
import { DefterDb, Entity, Transaction } from "../db";
import { useEffect, useState } from "react";

const db = new DefterDb();
export default function TransactionDetail() {
  const { entityId, transactionId } = useParams();
  const [transaction, setTransaction] = useState(
    undefined as Transaction | undefined
  );

  useEffect(() => {
    if (
      transactionId &&
      typeof transactionId === "string" &&
      !Number.isNaN(parseInt(transactionId))
    ) {
      db.transactions
        .where("id")
        .equals(parseInt(transactionId) ?? -1)
        .toArray()
        .then((ts) => {
          if (ts.length > 0) {
            setTransaction(ts[0]);
          }
        });
    }
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

  const normalizedPhoneNumber = normalizePhoneNumber(entity?.phoneNumber ?? "");
  const phoneNumberIsInvalid = normalizedPhoneNumber == "invalid";

  const msg = phoneNumberIsInvalid
    ? ""
    : transaction?.type === "d"
    ? `${getLocaleDate(transaction.date)} tarihinde ${
        transaction.amount
      } tl borclandiniz`
    : transaction?.type === "c"
    ? `${getLocaleDate(transaction.date)} tarihinde ${
        transaction.amount
      } tl odeme yaptiniz`
    : "";

  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col w-1/2 ">
          <div className="flex flex-row gap-2">
            <img
              src="/user-regular.svg"
              className="w-6 h-6 p-1 bg-white rounded"
            />
            <span className="text-xl">{entity?.name}</span>
          </div>
          <div className="flex flex-row gap-2">
            <img
              src="/square-phone-solid.svg"
              className="w-6 h-6 p-1 bg-white rounded"
            />
            <span className="text-xl">{entity?.phoneNumber}</span>
          </div>
          <div className="flex flex-row gap-2">
            <img
              src="/note-sticky-regular.svg"
              className="w-6 h-6 p-1 bg-white rounded"
            />
            <span className="text-xl">{entity?.note}</span>
          </div>
        </div>
        <div className="flex flex-col w-1/2 items-end">
          <span
            className="font-bold text-2xl"
            style={{ color: transaction?.type === "d" ? "#F31559" : "#A8DF8E" }}
          >
            {transaction?.amount} tl
          </span>
          {!phoneNumberIsInvalid && (
            <div className="flex flex-row gap-2">
              <a
                target="_blank"
                className=" font-bold text-l"
                href={`sms:${normalizedPhoneNumber}&body=${msg}`}
              >
                <img
                  src="/comment-sms-solid.svg"
                  className="w-6 h-6 p-1 bg-white rounded"
                />
              </a>
              <a
                target="_blank"
                className=" font-bold text-l"
                href={`https://wa.me/${normalizedPhoneNumber}?text=${msg}`}
              >
                <img
                  src="/square-whatsapp.svg"
                  className="w-6 h-6 p-1 bg-white rounded"
                />
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 p-2">
        <div className="flex flex-row">
          <Link
            to={`/entities/${entityId}/new`}
            className="text-center w-full block p-2 mt-2 underline underline-offset-4"
          >
            Yeni Ekle
          </Link>
          <Link
            to={`/entities/${entityId}`}
            className="text-center w-full block p-2 mt-2 underline underline-offset-4"
          >
            Geri
          </Link>
        </div>
      </div>
      <div>Tarih: {getLocaleDate(transaction?.date)} </div>
      <div>Tutar: {transaction?.amount} tl</div>
      <div>Borc/Odeme: {transaction?.type == "c" ? "Odeme" : "Borc"}</div>
      <div>Not: {transaction?.note}</div>
    </>
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

function getLocaleDate(ms: Date | undefined) {
  return ms?.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    // dateStyle:'long'
  });
}
