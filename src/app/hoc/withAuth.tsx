import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const withAuth = (WrappedComponent: any) => {
  const Wrapper = (props: any) => {
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
      // Check if the user is logged in
      const auth = localStorage.getItem("auth");
      if (!auth) {
        router.replace("/login");
      } else {
        setAuthenticated(true);
      }
    }, [router]);

    // Render the wrapped component if the user is logged in, otherwise return null
    return authenticated ? <WrappedComponent {...props} /> : null;
  };

  return Wrapper;
};
