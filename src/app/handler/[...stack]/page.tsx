"use client";

import { StackHandler, StackProvider } from "@stackframe/stack";
import { useEffect, useState } from "react";

export default function Handler(props: any) {
  const [stackApp, setStackApp] = useState<any>(null);

  useEffect(() => {
    // Import the stack client app dynamically to avoid SSR issues
    import("../../../stack-client").then(({ stackClientApp }) => {
      setStackApp(stackClientApp);
    });
  }, []);

  if (!stackApp) {
    return <div>Loading...</div>;
  }

  return (
    <StackProvider app={stackApp}>
      <StackHandler fullPage app={stackApp} routeProps={props} />
    </StackProvider>
  );
}