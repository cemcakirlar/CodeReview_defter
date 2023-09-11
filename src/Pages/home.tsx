import { Link } from "react-router-dom";
import { HiUsers,HiUserPlus } from "../icons";

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
    </div>
  );
}
