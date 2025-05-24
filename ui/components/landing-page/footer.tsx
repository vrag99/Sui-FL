import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-transparent border-t border-t-muted-foreground/10 py-4 px-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Image src="/logo.svg" alt="Sui FL" width={28} height={28} />
            <h1 className="text-2xl font-bold">SuiFL</h1>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          &copy; 2024 Sui FL. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
