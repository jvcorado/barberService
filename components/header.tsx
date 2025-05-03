import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import { Sheet, SheetTrigger } from "./ui/sheet";
import SidebarSheet from "./sidebar-sheet";
import Link from "next/link";
import Search from "./search";

const Header = () => {
  return (
    <Card className="rounded-none sticky top-0 z-50 border-none">
      <CardContent className="flex flex-col lg:flex-row items-center justify-between p-5  container md:mx-auto">
        <Link href="/" className="hidden lg:block">
          {/*  <Image alt="FSW Barber" src="/logo.png" height={18} width={120} /> */}
          <p className="text-primary text-lg">reserva</p>
          <p className="-mt-2 text-lg">agora.com</p>
        </Link>

        <div className="flex items-center justify-between w-full lg:hidden">
          <Link href="/">
            {/*  <Image alt="FSW Barber" src="/logo.png" height={18} width={120} /> */}
            <p className="text-primary text-lg">reserva</p>
            <p className="-mt-2 text-lg">agora.com</p>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SidebarSheet />
          </Sheet>
        </div>

        {/* BUSCA */}
        <div className="mt-6 w-full max-w-[600px]">
          <Search />
        </div>

        <div className="hidden lg:block">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SidebarSheet />
          </Sheet>
        </div>
      </CardContent>
    </Card>
  );
};

export default Header;
