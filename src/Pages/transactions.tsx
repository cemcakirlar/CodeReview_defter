import { Link } from "react-router-dom";
import { DefterDb, Entity, Transaction } from "../db";
import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Button, buttonVariants } from "@/components/ui/button"
import { Label } from "@/components/ui/label";

const db = new DefterDb();

export default function Transactions() {

  const [page, setPage] = useState(0);
  const transactions = useLiveQuery(
    () =>
      db.transactions
        .orderBy("date")
        .reverse()
        .offset(5 * page)
        .limit(5)
        .toArray(),
    [page]
  );

  return (
    <div className="w-full">
      <div className="flex flex-col space-y-2">
        <Label className="text-xl">
          Son Hareketler : Sayfa {page + 1}
        </Label>
        {(transactions && transactions.length > 0) ?
          transactions.map((t) => <Row key={t.id} transaction={t} />)
          : <>Hiç işlem yok</>}
      </div>
      <div className="w-full gap-2 flex justify-end mt-2">
        {page > 0 ? <Button onClick={() => setPage(v => v - 1)}>Önceki</Button> : <></>}
        {(transactions?.length ?? 0) == 5 ? <Button onClick={() => setPage(v => v + 1)}>Sonraki</Button> : <></>}
      </div>
    </div>
  );
}



interface RowProps {
  transaction: Transaction
}

function Row({ transaction: t }: RowProps) {
  const [entity, setEntity] = useState(undefined as Entity | undefined);

  useEffect(() => {
    db.entities.get(t.customerId).then((rec) => setEntity(rec));
  }, []);



  const lblStr = typeof t.date === "string" ? t.date : getLocaleDate(t.date);

  const debit = t.type == "d";
  const credit = t.type == "c";
  const error = !debit && !credit;

  if (error) {
    console.log("error on transaction type for :", t.id);
  }

  const amountInfo = (<span style={{ color: debit ? "#F31559" : credit ? "#A8DF8E" : "hsl(var(--primary))" }}>
    {t.amount} tl
  </span>)

  return (
    <div className="mb-2 flex items-center justify-between rounded-md border p-4"    >
      <p className="text-sm font-medium">
        {lblStr} tarihinde {entity?.name} {amountInfo} {debit ? "borçlandı" : "ödeme yaptı"}
      </p>

      <div>
        <Link
          to={`/entities/${t.customerId}/${t.id}`}
          className={buttonVariants({ variant: 'default', size: 'sm' })}
        >
          İşlem Detayı
        </Link>
      </div>
    </div>
  );
}

function getLocaleDate(ms: Date | undefined) {
  return ms?.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    // dateStyle:'long'
  });
}