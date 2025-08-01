import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
  output: 'export',
  images: {
    domains: [],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
      generator: {
        filename: 'uploads/[name][ext]',
      },
    });
    return config;
  },
};

export default nextConfig;
