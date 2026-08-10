import Image from "next/image";

export function Logo() {
  return (
    <div className="inline-flex items-center justify-center">
      <Image
        src="/logo-indigo.png"
        alt="indigo"
        width={208}
        height={94}
        className="h-[2.925rem] w-auto md:h-[3.25rem]"
        priority
      />
    </div>
  );
}
