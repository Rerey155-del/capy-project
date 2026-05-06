import { useEffect, useMemo, useState } from "react";
import Footer from "../components/Footer/Footer";
import NavBar from "../components/NavBar/NavBar";
import api from "../lib/api";
import { MdOutlineSearch } from "react-icons/md";

import BearingImg from "../../assets/BEARING 6201 2RS KOYO JAPAN ORIGINAL.jpg";
import FilterImg from "../../assets/Filter Saringan Udara Vario 150 125 Nemo Honda Vario 150 125.jpg";
import BohlamImg from "../../assets/BOHLAM DEPAN MOTOR OSRAM HALOGEN BEBEK MATIC 18 25 32 WATT ASLI OSRAM - 18W (1PC).jpg";
import AkiImg from "../../assets/Aki untuk segala motor matic ISS YTZ6V Yuasa Aki Kering.jpg";
import CvtImg from "../../assets/PAKET FULL UPGRADE CVT SPIN SKYWAVE SKYDRIVE MJRT RACING - 7gr.jpg";

const productImages = [BearingImg, FilterImg, BohlamImg, AkiImg, CvtImg];

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);

function SukuCadangList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/data_produk");
        setProducts(response.data);
      } catch (error) {
        console.error("Gagal mengambil data suku cadang:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const keyword = search.toLowerCase();

    return products.filter((product) =>
      [product.nama_produk, product.deskripsi, product.tautan]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword))
    );
  }, [products, search]);

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold text-white-text">Suku Cadang</h1>

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
          <p className="text-sm text-info-color">Memuat data suku cadang...</p>
        ) : (
          <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product, index) => (
              <article
                key={product.id}
                className="flex min-h-[320px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md"
              >
                <img
                  src={productImages[index % productImages.length]}
                  className="h-36 w-full object-cover"
                  alt={product.nama_produk}
                />

                <div className="flex flex-1 flex-col p-3">
                  <h2 className="line-clamp-2 min-h-[44px] text-sm font-bold leading-snug text-white-text">
                    {product.nama_produk}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-info-color">
                    {product.deskripsi}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                    <p className="truncate text-sm font-bold text-white-text">
                      {formatRupiah(product.harga)}
                    </p>
                    <button
                      className="shrink-0 rounded-full bg-success-color px-5 py-1.5 text-xs font-semibold text-white"
                      type="button"
                    >
                      Buy
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

export default SukuCadangList;
