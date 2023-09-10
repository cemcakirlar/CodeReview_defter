import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { DefterDb } from "../db";
import { Link } from "react-router-dom";
import { VList } from "virtua";

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

  return (
    <>
      <input
        className="w-full h-10 mt-4 bg-inherit font-bold p-2 border-white border-2 rounded "
        placeholder="Kisi/Kurum ara"
        onChange={(e) => setSarchKey(e.target.value.toString())}
      />
      <Link
        to="/entities/new"
        className="text-center w-full block p-2 mt-2 underline underline-offset-4"
      >
        Yeni Ekle
      </Link>
      <VList style={{ height: "60vh" }}>
        {entities ? (
          entities.map((c) => (
            <Link
              key={c.id}
              to={`/entities/${c.id}`}
            >
              <div className="p-2 m-2 flex border-b-2 rounded-sm ">
                <h2 className="w-1/2 md:w-1/4">{c.name}</h2>
                <span className="w-1/2 md:w-1/4 text-center">
                  {c.phoneNumber}
                </span>
                <span className="hidden md:inline-block md:w-1/2">
                  {c.note}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <>loading</>
        )}
      </VList>
    </>
  );
}

export default Entities;
