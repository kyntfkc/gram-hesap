import Image from "next/image";

export function Logo() {
  return (
    <div className="inline-flex items-center justify-center">
      <Image
        src="/logo2.png"
        alt="indigo TAKI"
        width={130}
        height={52}
        className="h-auto w-auto max-w-[130px]"
        priority
      />
    </div>
  );
}

