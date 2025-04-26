import React from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";

export default function Header() {
  return (
    <Card className="!rounded-none !border-b !border-x-0 !border-t-0 !shadow-none sticky top-0 z-50">
      <CardContent className="flex items-center justify-between p-4 ">
        <div>Logo</div>
        <Button size={"icon"} variant={"outline"}>
          <MenuIcon />
        </Button>
      </CardContent>
    </Card>
  );
}
