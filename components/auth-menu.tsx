"use client";

import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import SignInDialog from "./sign-in-dialog";
import ProfileButton from "./ui/profile";

const AuthMenu = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return null; // ou skeleton

  return session?.user ? (
    <ProfileButton />
  ) : (
    <Dialog>
      <DialogTrigger asChild className="">
        <Button variant="outline" className="h-10">
          Fazer Login
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[400px] ">
        <SignInDialog />
      </DialogContent>
    </Dialog>
  );
};

export default AuthMenu;
