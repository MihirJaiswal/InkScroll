/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      config.resolve.alias.canvas = false;
      config.resolve.unsafeCache = true;
      return config;
    },
  };
  
  export default nextConfig;