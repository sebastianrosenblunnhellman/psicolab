import { auth } from "@/auth";
import HeaderClient from "./HeaderClient";
import { Suspense } from "react";

export default async function Header() {
  const session = await auth();
  
  return (
    <Suspense fallback={<div className="h-16 bg-white"></div>}>
      <HeaderClient user={session?.user} />
    </Suspense>
  );
}
