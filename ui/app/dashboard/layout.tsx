"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useAccounts,
  useCurrentAccount,
  useDisconnectWallet,
  useResolveSuiNSName,
  useSuiClient,
} from "@mysten/dapp-kit";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon, ChevronDownIcon, CopyIcon } from "lucide-react";
import { shortenAddress } from "@polymedia/suitcase-core";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

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
  const accounts = useAccounts();

  useEffect(() => {
    if (accounts.length === 0) {
      router.push("/");
    }
  }, [accounts]);

  return (
    <>
      <div className="mx-auto h-screen pt-4 w-[80vw] 2xl:w-[72vw] max-w-[1400px]">
        <header className="flex items-center justify-between bg-background py-1 shadow-sm">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.svg" alt="Sui-FL" width={32} height={32} />
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
          <AccountInfo />
        </header>
        <div className="mt-8 flex w-full flex-col gap-8">{children}</div>
      </div>
    </>
  );
};

function AccountInfo() {
  const currentAccount = useCurrentAccount();
  const { mutate: disconnectWallet } = useDisconnectWallet();
  const { data: domain } = useResolveSuiNSName(
    currentAccount?.label ? null : currentAccount?.address
  );
  const accounts = useAccounts();

  const [open, setOpen] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const suiClient = useSuiClient();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function getBalance() {
      if (currentAccount) {
        const balance = await suiClient.getBalance({
          owner: currentAccount.address,
        });
        setBalance((parseInt(balance.totalBalance) / 10 ** 9).toFixed(2));
      }
    }
    getBalance();
  }, [currentAccount, open, suiClient]);

  if (!currentAccount) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full px-4 flex items-center gap-2"
        >
          <span className="font-mono font-bold">
            {currentAccount.label ??
              domain ??
              shortenAddress(currentAccount.address)}
          </span>
          <ChevronDownIcon className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-4">
          {accounts.map((account) => (
            <>
              <div className="flex gap-2" key={account.address}>
                <Input readOnly value={account.label ?? account.address} />
                <Button
                  variant="outline"
                  size="icon"
                  className="aspect-square"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      account.label ?? account.address
                    );
                    setCopied(true);
                    setTimeout(() => {
                      setCopied(false);
                    }, 1000);
                  }}
                >
                  {copied ? (
                    <CheckIcon className="w-4 h-4" />
                  ) : (
                    <CopyIcon className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {balance && (
                <div className="flex flex-row justify-between">
                  <div className="text text-foreground rounded-lg">
                    Balance:{" "}
                    <span className="text-sm text-primary font-bold">
                      {balance} SUI
                    </span>
                  </div>
                  <Badge variant="outline">Testnet</Badge>
                </div>
              )}
            </>
          ))}
          <Button
            size={"sm"}
            variant="destructive"
            onClick={() => disconnectWallet()}
          >
            Disconnect
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default DashboardLayout;
