import { useState } from "react";
import { DefterDb, Entity } from "../db";
import { Link } from "react-router-dom";
import { BsTelephoneOutbound, CiUser, MdOutlineStickyNote2 } from "../icons";

const db = new DefterDb();

function NewEntity() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [note, setNote] = useState("");
  const [result, setResult] = useState("");

  function resetForm() {
    setName("");
    setPhoneNumber("");
    setNote("");
  }
  return (
    <>
      <form
        className="p-2 m-2 flex rounded-sm flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const newCustomer: Entity = {
            name,
            phoneNumber,
            note,
          };
          db.entities
            .add(newCustomer)
            .then(resetForm)
            .then(() => {
              setResult("Eklendi");
            });
        }}
      >
        <div className="flex">
          <div className="w-1/5 flex justify-center items-center">
          <span className="text-4xl">
              <CiUser />
            </span>
          </div>
          <div className="w-4/5 flex bg-inherit border-white border-2 rounded ">
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="p-2 bg-inherit"
              placeholder="isim"
            />
          </div>
        </div>
        <div className="flex">
          <div className="w-1/5 flex justify-center items-center">
          <span className="text-2xl">
              <BsTelephoneOutbound />
            </span>
          </div>
          <div className="w-4/5 flex bg-inherit border-white border-2 rounded ">
            <input
              onChange={(e) => {
                const val = e.target.value;
                setPhoneNumber(val);
              }}
              value={phoneNumber}
              inputMode="tel"
              className="p-2 bg-inherit "
              placeholder="telefon"
            />
          </div>
        </div>
        <div className="flex">
          <div className="w-1/5 flex justify-center items-center">
          <span className="text-3xl">
              <MdOutlineStickyNote2/>
            </span>
          </div>
          <div className="w-4/5 flex bg-inherit border-white border-2 rounded ">
            <input
              onChange={(e) => setNote(e.target.value)}
              value={note}
              className="p-2 bg-inherit "
              placeholder="not"
            />
          </div>
        </div>

        <span className="text-center w-full block p-2 mt-2">{result}</span>
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
