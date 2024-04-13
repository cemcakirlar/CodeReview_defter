import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { DefterDb } from "../db";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { PersonIcon } from "@radix-ui/react-icons"
import { Label } from "@/components/ui/label";
import { round } from "@/lib/utils";

const db = new DefterDb();

function Entities() {
  const [searchKey, setSarchKey] = useState("");
  const entities = useLiveQuery(
    () =>
      db.entities
        .where("name")
        .startsWith(searchKey)
        .or("phoneNumber")
        .startsWith(searchKey)
        .toArray(),
    [searchKey]
  );

  const [totalBalance, settotalBalance] = useState(0)
  useEffect(() => {
    db.transactions.toArray()
      .then(d => {
        const total = d.reduce(function (a, b) {
          if (b.type == 'c') {
            return round(a - b.amount, 2)
          }
          return round(a + b.amount, 2);
        }, 0);
        console.log(total);
        settotalBalance(total)
      })
  }, [])


  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <Label className="text-xl">Kişiler</Label>
        <Link
          to="/entities/new"
          className={buttonVariants({ variant: 'default', size: 'sm' })}
        >
          Yeni Kişi Ekle
        </Link>
      </div>
      {totalBalance > 0 ?
        <Label className="text-xs">Toplam alacaklar : {totalBalance} tl</Label> :
        <></>}
      <Input
        className="placeholder:text-muted mb-2"
        placeholder="Kişi Ara"
        onChange={(e) => setSarchKey(e.target.value.toString())}
      />

      {entities ? (
        entities.map((c) => (
          <div
            key={c.id}
            className="mb-2 flex items-center space-x-4 rounded-md border p-4"
          >
            <PersonIcon />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                {c.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {c.phoneNumber}
              </p>
            </div>
            <Link
              to={`/entities/${c.id}`}
              className={buttonVariants({ variant: 'default', })}
            >
              Detay
            </Link>
          </div>
        ))
      ) : (
        <>loading</>
      )}
    </div>
  );
}

export default Entities;
