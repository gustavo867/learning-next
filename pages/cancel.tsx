import React from "react";
import Link from "next/link";

const CancelPage: React.FC = () => {
  return (
    <>
      <h1>Cancelled</h1>
      <Link href="/">Go back</Link>
    </>
  );
};

export default CancelPage;
