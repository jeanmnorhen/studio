import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // typescript: {
  //   ignoreBuildErrors: true, // Temporarily removido para depuração do build
  // },
  // eslint: { // Removido para garantir que erros de ESLint apareçam no build
  //   ignoreDuringBuilds: true,
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
