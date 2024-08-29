import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import MountainIcon from "./MountainIcon";

export function Footer() {
  return (
    <footer className="bg-muted py-6 w-full">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 text-white flex flex-col md:flex-row items-center justify-between">
        <Link href="#" className="flex items-center mb-4 md:mb-0" prefetch={false}>
          <h1 className="text-2xl">Course Scanner</h1>
        </Link>
        <div className="flex flex-col md:flex-row items-center text-sm text-muted-foreground space-y-4 md:space-y-0 md:space-x-4">
          <p>&copy; 2024 XCode Tech LLC. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <Link href="#" className="hover:underline" prefetch={false}>
              Privacy Policy
            </Link>
            <Link href="#" className="hover:underline" prefetch={false}>
              Terms of Service
            </Link>
            <Link href="/contact_us" className="hover:underline" prefetch={false}>
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </footer>

  );
}

export default Footer;
