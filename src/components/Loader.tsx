import Image from "next/image";
import React from "react";

const Loader = () => {
  return (
    <Image
      className="w-16 h-16 animate-spin"
      width={200}
      height={200}
      src="https://www.svgrepo.com/show/199956/loading-loader.svg"
      alt="Loading icon"
    />
  );
};

export default Loader;
