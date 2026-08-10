import Image from "next/image";

export function Logo() {
  return (
    <div className="inline-flex shrink-0 items-center justify-center">
      <Image
        src="/logo2.png"
        alt="indigo TAKI"
        width={110}
        height={44}
        className="h-8 w-auto md:h-9"
        priority
      />
    </div>
  );
}
