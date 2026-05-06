import { useEffect, useMemo, useState } from "react";
import Footer from "../components/Footer/Footer";
import NavBar from "../components/NavBar/NavBar";
import api from "../lib/api";
import { MdOutlineSearch } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import { LuClock3 } from "react-icons/lu";
import { SlLocationPin } from "react-icons/sl";

import BengkelImg from "../../assets/bengkel1.jpeg";

function BengkelList() {
  const [bengkels, setBengkels] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBengkels = async () => {
      try {
        const response = await api.get("/data_bengkel");
        setBengkels(response.data);
      } catch (error) {
        console.error("Gagal mengambil data bengkel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBengkels();
  }, []);

  const filteredBengkels = useMemo(() => {
    const keyword = search.toLowerCase();

    return bengkels.filter((bengkel) =>
      [bengkel.nama_bengkel, bengkel.alamat, bengkel.deskripsi]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword))
    );
  }, [bengkels, search]);

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold text-white-text">Bengkel</h1>

          <form className="w-full sm:w-80" role="search">
            <div className="relative">
              <MdOutlineSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-2xl text-info-color" />
              <input
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-11 pr-4 text-sm"
                type="search"
                placeholder="cari"
                aria-label="cari"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </form>
        </div>

        {loading ? (
          <p className="text-sm text-info-color">Memuat data bengkel...</p>
        ) : (
          <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredBengkels.map((bengkel) => (
              <article
                key={bengkel.id}
                className="flex min-h-[340px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md"
              >
                <img
                  src={BengkelImg}
                  className="h-36 w-full object-cover"
                  alt={bengkel.nama_bengkel}
                />

                <div className="flex flex-1 flex-col p-3">
                  <h2 className="line-clamp-2 min-h-[44px] text-sm font-bold leading-snug text-white-text">
                    {bengkel.nama_bengkel}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-info-color">
                    {bengkel.deskripsi}
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-info-color">
                    <div className="flex gap-2">
                      <SlLocationPin className="mt-0.5 shrink-0" />
                      <p className="line-clamp-2">{bengkel.alamat}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <LuClock3 className="shrink-0" />
                      <p>
                        {bengkel.jam_buka}.00 - {bengkel.jam_tutup}.00 WIB
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <IoCallOutline className="shrink-0" />
                      <p>{bengkel.nohp}</p>
                    </div>
                  </div>

                  <div className="mt-auto flex justify-end pt-5">
                    <button
                      className="rounded-full bg-success-color px-4 py-1.5 text-xs font-semibold text-white"
                      type="button"
                    >
                      Selengkapnya
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default BengkelList;
