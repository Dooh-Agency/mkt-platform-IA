/** @type {import('next').NextConfig} */
const nextConfig = {
  // Los paquetes del workspace se consumen como fuente TS, no compilada.
  transpilePackages: ["@dooh/core", "@dooh/db", "@dooh/providers"],
  webpack: (config) => {
    // Los paquetes del workspace importan con extensión ".js" (convención
    // NodeNext) apuntando a archivos ".ts" fuente; webpack necesita el alias
    // explícito para resolverlos sin un paso de build previo.
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js"],
    };
    return config;
  },
};

export default nextConfig;
