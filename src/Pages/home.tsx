import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex gap-2 pt-2">
      <Link to="/entities"  className="flex flex-col w-24">
        <img
          src="/user-regular.svg"
          className="w-24 h-24 p-1 bg-white rounded"
        />
        <span className="text-center w-full ">Kisi veya Kurumlar</span>
      </Link>
      <Link to="/entities/new"  className="flex flex-col w-24">
        <img
          src="/icons8-plus-50.png"
          className="w-24 h-24 p-1 bg-white rounded"
        />
        <span className="text-center w-full ">Yeni</span>
      </Link>
    </div>
  );
}
