import Image from "next/image";

export function Logo() {
  return (
    <div className="inline-flex items-center justify-center">
      <Image
        src="/logo-indigo.png"
        alt="indigo"
        width={160}
        height={72}
        className="h-9 w-auto md:h-10"
        priority
      />
    </div>
  );
}
