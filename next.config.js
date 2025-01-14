/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        styledComponents: true // SSR 지원 활성화
    },
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'babkaotalk.herokuapp.com'
            }
        ]
    }
};

module.exports = nextConfig;
