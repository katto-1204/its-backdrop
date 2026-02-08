import Image from "next/image";
import Scene from "./components/Scene";

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Top Center Logo - Behind the 3D model */}
      <div className="absolute top-[2vh] left-1/2 -translate-x-1/2 z-[5] opacity-100 pointer-events-none">
        <Image
          src="/world of it white.png"
          alt="World of IT Logo"
          width={2000}
          height={1000}
          className="w-[85vw] md:w-[70vw] h-auto max-h-[40vh] object-contain"
          priority
        />
      </div>

      {/* 3D Scene - Higher z-index but transparent background */}
      <div className="relative z-10 w-full h-full">
        <Scene />
      </div>
    </main>
  );
}
