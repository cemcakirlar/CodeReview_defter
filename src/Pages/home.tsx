import { Link } from "react-router-dom";
import { HiUsers,HiUserPlus, MdRestore, LuDatabaseBackup } from "../icons";

export default function Home() {
  return (
    <div className="flex gap-2 pt-2">
      <Link
        to="/entities"
        className="flex flex-col w-16"
      >
        <span className="text-center text-6xl">
          <HiUsers />
        </span>
        <span className="text-center w-full ">Kisi veya Kurumlar</span>
      </Link>
      <Link
        to="/entities/new"
        className="flex flex-col w-16"
      >
        <span className="text-center text-6xl">
          <HiUserPlus />
        </span>
        <span className="text-center w-full ">Yeni</span>
      </Link>
      <Link
        to="/restore"
        className="flex flex-col w-16"
      >
        <span className="text-center text-6xl">
          <MdRestore />
        </span>
        <span className="text-center w-full">Yedekten Yükle</span>
      </Link>
      <Link
        to="/backup"
        className="flex flex-col w-16"
      >
        <span className="text-center text-6xl">
          <LuDatabaseBackup />
        </span>
        <span className="text-center w-full">Yedekle</span>
      </Link>

    </div>
  );
}
