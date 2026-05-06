import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";

import { TfiBookmark } from "react-icons/tfi";
import { CiShare2 } from "react-icons/ci";

import BearingImg from "../../../assets/BEARING 6201 2RS KOYO JAPAN ORIGINAL.jpg";
import FilterImg from "../../../assets/Filter Saringan Udara Vario 150 125 Nemo Honda Vario 150 125.jpg";
import BohlamImg from "../../../assets/BOHLAM DEPAN MOTOR OSRAM HALOGEN BEBEK MATIC 18 25 32 WATT ASLI OSRAM - 18W (1PC).jpg";
import AkiImg from "../../../assets/Aki untuk segala motor matic ISS YTZ6V Yuasa Aki Kering.jpg";
import CvtImg from "../../../assets/PAKET FULL UPGRADE CVT SPIN SKYWAVE SKYDRIVE MJRT RACING - 7gr.jpg";

const productImages = [BearingImg, FilterImg, BohlamImg, AkiImg, CvtImg];

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);

function SukuCadang() {
  const eleRefSukuCadang = useRef(null);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/data_produk");
        setProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();

    const mouseLeaveHandler = () => {
      const ele = eleRefSukuCadang.current;
      if (!ele) return;

      ele.style.cursor = "grab";
      ele.style.removeProperty("user-select");
    };

    window.addEventListener("mouseleave", mouseLeaveHandler);

    return () => {
      window.removeEventListener("mouseleave", mouseLeaveHandler);
    };
  }, []);

  const mouseDownHandler = (eleRef) => (e) => {
    const ele = eleRef.current;
    if (!ele) return;

    ele.style.cursor = "grabbing";
    ele.style.userSelect = "none";

    const pos = {
      left: ele.scrollLeft,
      top: ele.scrollTop,
      x: e.clientX,
      y: e.clientY,
    };

    const mouseMoveHandler = (event) => {
      const dx = event.clientX - pos.x;
      const dy = event.clientY - pos.y;

      ele.scrollTop = pos.top - dy;
      ele.scrollLeft = pos.left - dx;
    };

    const mouseUpHandler = () => {
      ele.style.cursor = "grab";
      ele.style.removeProperty("user-select");

      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    };

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };

  return (
    <section className="mx-auto mt-8 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <h5 className="flex justify-center text-base font-bold">
        Suku Cadang Yang Dibutuhkan
      </h5>

      <p className="py-5 text-base font-bold">Pilihan Favorit</p>

      <div
        className="flex gap-5 overflow-x-auto pb-7 no-scrollbar"
        ref={eleRefSukuCadang}
        style={{ cursor: "grab" }}
        onMouseDown={mouseDownHandler(eleRefSukuCadang)}
      >
        {products.map((product, index) => (
          <article
            key={product.id}
            className="flex w-[270px] shrink-0 flex-col overflow-hidden rounded-lg bg-white shadow-lg sm:w-[290px]"
          >
            <img
              className="h-40 w-full rounded-t-lg object-cover pointer-events-none"
              src={productImages[index % productImages.length]}
              alt={product.nama_produk}
            />

            <div className="flex min-h-[190px] flex-1 flex-col p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <h2 className="line-clamp-2 text-base font-bold leading-snug text-white-text">
                  {product.nama_produk}
                </h2>

                <div className="flex shrink-0 gap-2">
                  <Link
                    to="#"
                    className="rounded-full border border-info-color p-1"
                    aria-label="Simpan produk"
                  >
                    <TfiBookmark className="text-base text-info-color max-sm:text-sm" />
                  </Link>
                  <Link
                    to="#"
                    className="rounded-full border border-info-color p-1"
                    aria-label="Bagikan produk"
                  >
                    <CiShare2 className="text-base text-info-color max-sm:text-sm" />
                  </Link>
                </div>
              </div>

              <p className="line-clamp-2 text-sm leading-relaxed text-info-color">
                {product.deskripsi}
              </p>

              <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                <p className="truncate text-base font-bold text-white-text">
                  {formatRupiah(product.harga)}
                </p>
                <Link
                  to="#"
                  className="shrink-0 rounded-full bg-success-color px-5 py-2 text-xs font-semibold text-white"
                >
                  Beli
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default SukuCadang;
