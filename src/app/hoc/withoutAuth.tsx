import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const withoutAuth = (WrappedComponent: any) => {
  const Wrapper = (props: any) => {
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
      // Check if the user is logged in
      const auth = localStorage.getItem("auth");
      if (!auth) {
        setAuthenticated(true);
      } else {
        router.replace("/user/dashboard");
      }
    }, [router]);

    // Render the wrapped component if the user is logged in, otherwise return null
    return authenticated ? <WrappedComponent {...props} /> : null;
  };

  return Wrapper;
};
