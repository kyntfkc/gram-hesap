import Image from "next/image";

export function Logo() {
  return (
    <div className="inline-flex items-center justify-center mb-2">
      <div className="relative">
        <Image
          src="/logo2.png"
          alt="indigo TAKI"
          width={150}
          height={60}
          className="h-auto w-auto max-w-[150px]"
          priority
        />
      </div>
    </div>
  );
}

