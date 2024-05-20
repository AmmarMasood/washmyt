"use client";

import { withAuth } from "@/app/hoc/withAuth";
import React from "react";
import Layout from "../components/Layout";

function Page() {
  return (
    <main className="min-h-screen  bg-secondary-color p-6 relative">
      <Layout currentOption={-2}>
        <h1 className="text-black">Access Denied</h1>
      </Layout>
    </main>
  );
}

export default withAuth(Page);
