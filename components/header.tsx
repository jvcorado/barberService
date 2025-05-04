"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import Search from "./search";
import AuthMenu from "./auth-menu";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Card
      className={`rounded-none sticky top-0 z-50 border-none transition-colors duration-300 ${
        scrolled
          ? "bg-background/40 backdrop-blur-sm"
          : "bg-background/40 backdrop-blur-sm"
      }`}
    >
      <CardContent className="flex flex-col lg:flex-row items-end justify-between max-lg:pt-4 container md:mx-auto">
        <Link href="/" className="hidden lg:block">
          <p className="text-primary text-lg">reserva</p>
          <p className="-mt-2 text-lg">agora.com</p>
        </Link>

        <div className="flex items-center justify-between w-full lg:hidden">
          <Link href="/">
            <p className="text-primary text-lg">reserva</p>
            <p className="-mt-2 text-lg">agora.com</p>
          </Link>

          <div className="flex items-center gap-4">
            <AuthMenu />
          </div>
        </div>

        <div
          className={`mt-6 block lg:hidden w-full max-w-[600px] overflow-hidden transition-all ease-in-out duration-500 ${
            scrolled ? "opacity-0 !h-0" : "opacity-100 max-h-[200px]"
          }`}
        >
          <Search />
        </div>

        <div className={`mt-6 w-full max-w-[600px] hidden lg:block `}>
          <Search />
        </div>

        <div className="items-center gap-4 hidden lg:flex">
          <AuthMenu />
        </div>
      </CardContent>
    </Card>
  );
};

export default Header;
