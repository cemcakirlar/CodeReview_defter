import { Link, useNavigate, useParams } from "react-router-dom";
import { DefterDb, Entity } from "../db";
import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { VList } from "virtua";

const db = new DefterDb();
export default function EntityDetail() {
  const { entityId } = useParams();
  const navigate = useNavigate();
  const [removeRequested, setRemoveRequested] = useState(false);
  const [removeStarted, setRemoveStarted] = useState(false);

  const transactions = useLiveQuery(() => {
    if (
      entityId &&
      typeof entityId === "string" &&
      !Number.isNaN(parseInt(entityId))
    ) {
      return db.transactions
        .where("customerId")
        .equals(parseInt(entityId) ?? -1)
        .reverse()
        .sortBy("date");
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
      db.entities.get(parseInt(entityId)).then((rec) => {
        if (rec) {
          setEntity(rec);
        } else {
          navigate(`/entities`);
        }
      });
    } else {
      navigate(`/entities`);
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
  function handleRemove() {
    setRemoveStarted(true);
    proceedRemove().then(() => {
      navigate(`/entities`);
    });
  }
  async function proceedRemove() {
    await db.transactions.bulkDelete(
      transactions?.map((t) => t.id ?? -1) ?? []
    );
    await db.entities.delete(entity?.id ?? -1);
  }
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
            style={{ color: balance < 0 ? "#F31559" : "#A8DF8E" }}
          >
            {balance} tl
          </span>
          {!phoneNumberIsInvalid && (
            <div className="flex flex-row gap-2">
              <a
                target="_blank"
                className=" font-bold text-l"
                href={`sms:${normalizedPhoneNumber}&body=Borcunuz ${balance} tl`}
              >
                <img
                  src="/comment-sms-solid.svg"
                  className="w-6 h-6 p-1 bg-white rounded"
                />
              </a>
              <a
                target="_blank"
                className=" font-bold text-l"
                href={`https://wa.me/${normalizedPhoneNumber}?text=Borcunuz%20${balance}%20tl`}
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
      {removeRequested ? (
        <div>
          <span>
            Bu kisi/kurum ve islem detaylari silinecektir. Emin misiniz?{" "}
          </span>
          <button
            className="text-center text-red-400 font-bold text-2xl w-full block p-2 mt-2 underline underline-offset-4"
            onClick={handleRemove}
            disabled={removeStarted}
          >
            Sil
          </button>
          <button
            className="text-center w-full block p-2 mt-2 underline underline-offset-4"
            onClick={() => setRemoveRequested(false)}
            disabled={removeStarted}
          >
            Geri
          </button>
        </div>
      ) : (
        <>
          <button
            className="text-left text-red-400 font-bold w-full block p-1 underline underline-offset-4"
            onClick={() => setRemoveRequested(true)}
          >
            Kisi Sil
          </button>
          <Row
            label="Toplam"
            desc=""
            debit={totalDebit}
            credit={totalCredit}
          />
          <div className="flex-1 p-1">
            <div className="flex flex-row">
              <Link
                to={`/entities/${entityId}/new`}
                className="text-center w-full block underline underline-offset-4"
              >
                Yeni Ekle
              </Link>
              <Link
                to={`/entities`}
                className="text-center w-full block underline underline-offset-4"
              >
                Geri
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <span className="text-center w-full block p-1 mt-1 border-t-2 border-b-2 border-white">
              Detaylar
            </span>
            <VList style={{ height: "50vh" }}>
              {transactions?.map((t) => {
                const ttype = getType(t.type);
                const debit = ttype == "d";
                const credit = ttype == "c";
                const error = !debit && !credit;
                if (error) {
                  console.log("error on transaction type for :", t.id);
                }
                return (
                  <Link
                    key={t.id}
                    to={`/entities/${entityId}/${t.id}`}
                    className="w-full block "
                  >
                    <Row
                      label={t.date}
                      desc={t.note}
                      debit={debit ? t.amount : undefined}
                      credit={credit ? t.amount : undefined}
                    />
                  </Link>
                );
              })}
            </VList>
          </div>
        </>
      )}
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
  const lblStr = typeof label === "string" ? label : getLocaleDate(label);
  return (
    <div className="p-2 flex text-white  border-b-2 rounded-sm justify-between">
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
function getLocaleDate(ms: Date | undefined) {
  return ms?.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    // dateStyle:'long'
  });
}
