import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LogOutIcon,
  CalendarIcon,
  HomeIcon,
  ReceiptText,
  TicketSlash,
  CircleChevronRight,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { quickSearchOptions } from "@/src/constants/search";

const ProfileButton = () => {
  const { data } = useSession();

  const handleLogout = () => signOut({ callbackUrl: "/" });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer">
        <Avatar className="h-8 w-8 rounded-full">
          <AvatarImage
            src={data?.user?.image ?? ""}
            alt={data?.user?.name ?? "U"}
          />
          <AvatarFallback>
            {data?.user?.name?.charAt(0).toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Avatar className="h-8 w-8 rounded-full">
            <AvatarImage
              src={data?.user?.image ?? ""}
              alt={data?.user?.name ?? "U"}
            />
            <AvatarFallback>
              {data?.user?.name?.charAt(0).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium truncate">{data?.user?.name}</span>
            <span className="text-xs text-muted-foreground truncate">
              {data?.user?.email}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <div className="flex flex-col gap-2 border-b border-solid py-2">
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/">
              <HomeIcon size={18} />
              Início
            </Link>
          </Button>

          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/bookings">
              <CalendarIcon size={18} />
              Agendamentos
            </Link>
          </Button>

          {data?.user.admin && (
            <>
              <Button className="justify-start gap-2" variant="ghost" asChild>
                <Link href="/dashboard">
                  <ReceiptText size={18} />
                  Dashboard
                </Link>
              </Button>

              <Button className="justify-start gap-2" variant="ghost" asChild>
                <Link href="/dashboard/services">
                  <TicketSlash size={18} />
                  Serviços
                </Link>
              </Button>
            </>
          )}
        </div>

        {!data?.user.admin && (
          <div className="flex flex-col gap-1 border-b border-solid py-2">
            {quickSearchOptions.map((option) => (
              <Button className="justify-start gap-2" variant="ghost" asChild>
                <Link href={`/barbershops?service=${option.title}`}>
                  <Image
                    alt={option.title}
                    src={option.imageUrl}
                    height={18}
                    width={18}
                  />
                  {option.title}
                </Link>
              </Button>
            ))}
          </div>
        )}

        {!data?.user.admin && (
          <div className="flex flex-col gap-2 py-2">
            <Button
              className="justify-start gap-2 ps-2"
              variant="ghost"
              asChild
            >
              <Link href="/register">
                <CircleChevronRight size={18} />
                Se tornar parceiro
              </Link>
            </Button>
          </div>
        )}

        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileButton;
