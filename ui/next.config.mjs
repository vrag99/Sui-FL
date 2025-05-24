/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/publisher",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
