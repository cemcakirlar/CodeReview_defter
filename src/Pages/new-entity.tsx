import { useState } from "react";
import { DefterDb, Entity } from "../db";
import { Link } from "react-router-dom";

const db = new DefterDb();

function NewEntity() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [note, setNote] = useState("");

  function resetForm() {
    setName("");
    setPhoneNumber("");
    setNote("");
  }
  return (
    <>
      <form
        className="p-2 m-2 flex rounded-sm flex-col gap-1"
        onSubmit={(e) => {
          e.preventDefault();
          const newCustomer: Entity = {
            name,
            phoneNumber,
            note,
          };
          console.log(newCustomer);
          db.entities.add(newCustomer).then(resetForm);
        }}
      >
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="p-2 bg-inherit border-white border-2 rounded"
          placeholder="isim"
        />
        <input
          onChange={(e) => {
            const val = e.target.value;
            setPhoneNumber(val);
          }}
          value={phoneNumber}
          inputMode="tel"
          className="p-2 bg-inherit border-white border-2 rounded"
          placeholder="telefon"
        />
        <input
          onChange={(e) => setNote(e.target.value)}
          value={note}
          className="p-2 bg-inherit border-white border-2 rounded"
          placeholder="not"
        />
        <div className="flex flex-row">
          <button className="text-center w-full block p-2 mt-2 underline underline-offset-4">
            Kaydet
          </button>
          <Link
            to={`/entities/`}
            className="text-center w-full block p-2 mt-2 underline underline-offset-4"
          >
            Geri
          </Link>
        </div>
      </form>
    </>
  );
}

export default NewEntity;
