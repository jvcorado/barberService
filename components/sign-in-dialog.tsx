import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import Image from "next/image";

const SignInDialog = async () => {
  const handleLoginWithGoogleClick = () =>
    signIn("google", { callbackUrl: "/" });

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-center">
          Faça login na plataforma
        </DialogTitle>
        <DialogDescription className="text-center">
          Conecte-se usando sua conta do Google.
        </DialogDescription>
      </DialogHeader>

      <Button
        variant="outline"
        className="gap-1 font-bold"
        onClick={handleLoginWithGoogleClick}
      >
        <Image
          alt="Fazer login com o Google"
          src="/google.svg"
          width={18}
          height={18}
        />
        Google
      </Button>
    </>
  );
};

export default SignInDialog;
