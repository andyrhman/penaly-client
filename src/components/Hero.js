import React from "react";
import Image from "next/image";
function Hero() {
    return (
        <div className="yellowbackground top-20">
            <br></br>

            <div className="flex font-poppins justify-between wrapper items-center bg-yellow-400  py-10 lg:py-0">
                <div className="px-10 space-y-5">
                    <h1 className="text-6xl capitalize max-w-xl font-serif">
                        <span className="underline decoration-black decoration-4">
                            penaly
                        </span>{" "}
                        tempat menulis, membaca, dan terhubung
                    </h1>
                    <h2 className="text-lg max-w-lg">
                        mudah dan gratis untuk memposting pemikiran Anda tentang topik apa pun dan terhubung dengan jutaan pembaca.
                    </h2>
                </div>
                <Image
                    width={300}
                    height={300}
                    className="hidden md:inline-flex h-64 lg:h-full"
                    src="/images/fountain-pen.png"
                    alt=""
                />
            </div>
        </div>
    );
}

export default Hero;
