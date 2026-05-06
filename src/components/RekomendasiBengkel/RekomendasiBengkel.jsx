import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";

import { FaStar } from "react-icons/fa";
import { TfiBookmark } from "react-icons/tfi";
import { CiShare2 } from "react-icons/ci";
import { SlLocationPin } from "react-icons/sl";
import { LuClock3 } from "react-icons/lu";
import { IoCallOutline } from "react-icons/io5";

import Bengkel1 from "../../../assets/bengkel1.jpeg";
import productData from "../../../data/product.json";
import rekomendasiData from "../../../data/rekomendasi.json";

const rekomendasiFallback = rekomendasiData.data_rekomendasi_bengkel || [];
const favoritFallback = productData.data_bengkel || [];

const getArrayData = (response, fallback) => {
  if (response.status !== "fulfilled") return fallback;

  return Array.isArray(response.value.data) ? response.value.data : fallback;
};

function RekomendasiBengkel() {
  const eleRefRekomendasi = useRef(null);
  const eleRefFavorit = useRef(null);

  const [rekomendasiBengkels, setRekomendasiBengkels] =
    useState(rekomendasiFallback);
  const [favoritBengkels, setFavoritBengkels] = useState(favoritFallback);

  useEffect(() => {
    const fetchData = async () => {
      const [rekomendasiResponse, favoritResponse] = await Promise.allSettled([
        api.get("/data_rekomendasi_bengkel"),
        api.get("/data_bengkel"),
      ]);

      setRekomendasiBengkels(
        getArrayData(rekomendasiResponse, rekomendasiFallback)
      );
      setFavoritBengkels(getArrayData(favoritResponse, favoritFallback));
    };

    fetchData();

    const mouseLeaveHandler = () => {
      [eleRefRekomendasi.current, eleRefFavorit.current].forEach((ele) => {
        if (!ele) return;
        ele.style.cursor = "grab";
        ele.style.removeProperty("user-select");
      });
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

  const renderStars = () => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, index) => (
        <FaStar
          key={index}
          className="text-sm fill-secondary-color max-sm:text-xs"
        />
      ))}
    </div>
  );

  const renderBengkelCard = (bengkel, key) => (
    <article
      key={key}
      className="flex w-[270px] shrink-0 flex-col overflow-hidden rounded-lg bg-white shadow-lg sm:w-[290px]"
    >
      <img
        className="h-40 w-full rounded-t-lg object-cover pointer-events-none"
        src={Bengkel1}
        alt={bengkel.nama_bengkel}
      />

      <div className="flex min-h-[210px] flex-1 flex-col p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          {renderStars()}

          <div className="flex gap-2">
            <Link
              to="#"
              className="rounded-full border border-info-color p-1"
              aria-label="Simpan bengkel"
            >
              <TfiBookmark className="text-base text-info-color max-sm:text-sm" />
            </Link>
            <button
              className="rounded-full border border-info-color p-1"
              type="button"
              aria-label="Bagikan bengkel"
            >
              <CiShare2 className="text-base text-info-color max-sm:text-sm" />
            </button>
          </div>
        </div>

        <h2 className="line-clamp-1 text-base font-bold text-white-text">
          {bengkel.nama_bengkel}
        </h2>

        <div className="mt-3 space-y-1.5 text-sm text-white-text">
          <div className="flex gap-2">
            <SlLocationPin className="mt-0.5 shrink-0 text-base" />
            <p className="line-clamp-1">{bengkel.alamat}</p>
          </div>
          <div className="flex items-center gap-2">
            <LuClock3 className="shrink-0 text-base" />
            <p>
              {String(bengkel.jam_buka).padStart(2, "0")}.00-
              {String(bengkel.jam_tutup).padStart(2, "0")}.00 WIB
            </p>
          </div>
          <div className="flex items-center gap-2">
            <IoCallOutline className="shrink-0 text-base" />
            <p className="truncate">{bengkel.nohp}</p>
          </div>
        </div>

        <div className="mt-auto flex justify-end pt-4">
          <Link
            to="#"
            className="rounded-full bg-success-color px-5 py-2 text-xs font-semibold text-white"
          >
            Selengkapnya
          </Link>
        </div>
      </div>
    </article>
  );

  return (
    <section className="mx-auto mt-6 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <h5 className="flex justify-center text-base font-bold">
        Rekomendasi bengkel
      </h5>

      <p className="py-5 text-base font-bold">Rekomendasi Mitra</p>

      <div
        className="flex gap-5 overflow-x-auto pb-7 no-scrollbar"
        ref={eleRefRekomendasi}
        style={{ cursor: "grab" }}
        onMouseDown={mouseDownHandler(eleRefRekomendasi)}
      >
        {rekomendasiBengkels.map((bengkel) =>
          renderBengkelCard(bengkel, bengkel.id)
        )}
      </div>

      <p className="py-5 text-base font-bold">Bengkel Favorit</p>

      <div
        className="flex gap-5 overflow-x-auto pb-7 no-scrollbar"
        ref={eleRefFavorit}
        style={{ cursor: "grab" }}
        onMouseDown={mouseDownHandler(eleRefFavorit)}
      >
        {favoritBengkels.map((bengkel) =>
          renderBengkelCard(bengkel, `favorit-${bengkel.id}`)
        )}
      </div>
    </section>
  );
}

export default RekomendasiBengkel;
