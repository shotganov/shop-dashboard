import { Typography } from "@material-tailwind/react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-2">
      <div className="flex w-full justify-center px-2 md:justify-start">
        <Typography variant="small" className="font-normal text-inherit">
          &copy; {year} Shop Dashboard
        </Typography>
      </div>
    </footer>
  );
}

Footer.displayName = "/src/widgets/layout/footer.jsx";

export default Footer;
