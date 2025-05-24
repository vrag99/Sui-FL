"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

interface navItem {
  name: string;
  link: string;
}

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const navItems: navItem[] = [
    { name: "Publisher", link: "/dashboard/publisher" },
    { name: "Trainer", link: "/dashboard/trainer" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const [wallet, setWallet] = useState("0x123456789");
  const truncatedWallet = wallet?.slice(0, 6) + "..." + wallet?.slice(-6);

  const [balance, setBalance] = useState(0.001);

  return (
    <>
      <div className="mx-auto h-screen pt-4 w-[80vw] 2xl:w-[72vw] max-w-[1400px]">
        <header className="flex items-center justify-between bg-background py-1 shadow-sm">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-display text-lg ">Sui-FL</span>
            </Link>
            <nav className="hidden items-center gap-2 md:flex">
              {navItems.map((item, index) => (
                <Button
                  key={index}
                  variant={activeIndex === index ? "linkActive" : "linkHover2"}
                  onClick={() => {
                    setActiveIndex(index);
                    router.push(item.link);
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </nav>
          </div>

          {wallet ? (
            <div className="flex flex-row gap-1">
              <span className="text-sm ">Balance : {balance} SUI</span>
              <Separator className="w-[2px]" orientation="vertical" />
              <span className="text-sm text-muted-foreground">
                {truncatedWallet}
              </span>
            </div>
          ) : (
            <Button>
              Connect Wallet
            </Button>
          )}
        </header>
        <div className="mt-8 flex w-full flex-col gap-8">{children}</div>
      </div>
    </>
  );
};

export default DashboardLayout;
