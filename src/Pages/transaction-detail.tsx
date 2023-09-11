import { Link, useParams, useNavigate } from "react-router-dom";
import { DefterDb, Entity, Transaction } from "../db";
import { useEffect, useState } from "react";
import {
  CiUser,
  BsTelephoneOutbound,
  MdOutlineStickyNote2,
  BsWhatsapp,
  MdOutlineTextsms,
  AiTwotoneCalendar,
  FaScaleUnbalancedFlip,
} from "../icons";

const db = new DefterDb();
export default function TransactionDetail() {
  const navigate = useNavigate();
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
          } else {
            navigate(`/entities/${entityId}`);
          }
        });
    } else {
      navigate(`/entities/${entityId}`);
    }
  }, []);
  const [entity, setEntity] = useState(undefined as Entity | undefined);
  useEffect(() => {
    if (
      entityId &&
      typeof entityId === "string" &&
      !Number.isNaN(parseInt(entityId))
    ) {
      db.entities.get(parseInt(entityId)).then((rec) => {
        if (rec) {
          setEntity(rec);
        } else {
          navigate(`/entities/`);
        }
      });
    } else {
      navigate(`/entities/`);
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

  function handleRemove() {
    if (
      transactionId &&
      typeof transactionId === "string" &&
      !Number.isNaN(parseInt(transactionId))
    ) {
      db.transactions
        .delete(parseInt(transactionId))
        .then(() => navigate(`/entities/${entityId}`));
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col w-1/2 ">
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
        <div className="flex flex-col w-1/2 items-end">
          <span
            className="font-bold text-2xl"
            style={{ color: transaction?.type === "d" ? "#F31559" : "#A8DF8E" }}
          >
            {transaction?.amount} tl
          </span>
          {!phoneNumberIsInvalid && (
            <div className="flex flex-row gap-4">
              <a
                target="_blank"
                className=" font-bold text-2xl"
                href={`sms:${normalizedPhoneNumber}&body=${msg}`}
              >
                <MdOutlineTextsms />
              </a>
              <a
                target="_blank"
                className=" font-bold text-xl"
                href={`https://wa.me/${normalizedPhoneNumber}?text=${msg}`}
              >
                <BsWhatsapp />
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
      <div className="flex  gap-2">
        <span className="text-2xl">
          <AiTwotoneCalendar />
        </span>
        <span>{getLocaleDate(transaction?.date)}</span>
      </div>
      <div className="flex  gap-2">
        <span className="text-xl">&nbsp;₺&nbsp;</span>
        <span>{transaction?.amount} tl</span>
      </div>
      <div className="flex  gap-2">
        <span className="text-2xl">
          <FaScaleUnbalancedFlip />
        </span>
        <span>{transaction?.type == "c" ? "Odeme" : "Borc"}</span>
      </div>
      <div className="flex  gap-2">
        <span className="text-2xl">
          <MdOutlineStickyNote2 />
        </span>
        <span>{transaction?.note}</span>
      </div>
      <button
        className="text-center w-full block p-2 mt-2 underline underline-offset-4"
        onClick={handleRemove}
      >
        Sil
      </button>
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

function getLocaleDate(ms: Date | undefined) {
  return ms?.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    // dateStyle:'long'
  });
}
