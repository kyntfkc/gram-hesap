"use client";

import Image from "next/image";

export function Logo() {
  return (
    <button
      type="button"
      onClick={() => window.location.reload()}
      className="inline-flex items-center justify-center cursor-pointer"
      aria-label="Sayfayı yenile"
    >
      <Image
        src="/logo-indigo.png"
        alt="indigo Gram Hesap"
        width={953}
        height={180}
        className="h-[2.4rem] w-auto md:h-[2.75rem]"
        priority
      />
    </button>
  );
}
