import { Card, CardContent } from "./ui/card";

const Footer = () => {
  return (
    <footer>
      <Card className="rounded-none border-none bg-background ">
        <CardContent className="px-5 py-6  container md:mx-auto">
          <p className="text-sm text-gray-300">
            © 2023 Copyright{" "}
            <span className="font-bold">reservaagora.com</span>
          </p>
        </CardContent>
      </Card>
    </footer>
  );
};

export default Footer;
