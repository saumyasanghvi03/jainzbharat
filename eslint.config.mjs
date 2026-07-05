import nextConfig from 'eslint-config-next';

const config = [
  { ignores: ['.agents/**'] },
  ...nextConfig,
];

export default config;
