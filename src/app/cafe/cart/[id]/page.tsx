import crypto from 'crypto';
import ConfirmClientPage from './ConfirmClientPage';
import { Metadata } from 'next';
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const cartData = await fetchCart(params.id);
    const cart = cartData.data.cafeCart;

    return {
        title: cart.title,
        description: cart.description,
        openGraph: {
            title: cart.title,
            description: cart.description,
            images: ''
        }
    };
}
const fetchCart = async (cafeCartId: string): Promise<any> => {
    const secretKey: string = process.env.SECRET_CRYPTO_KEY!;
    const res = await fetch(`https://api.breadkun.com/api/cafe/carts/${cafeCartId}`, {
        headers: {
            Accept: 'application/vnd.breadkun.v1+json',
            Origin: 'https://breadkun-dev.vercel.app',
            'X-SSR-Token': secretKey
        }
    });
    if (!res.ok) throw new Error('API 요청 실패');
    return res.json();
};

const decryptAES256 = (encryptedDataBase64Url: string, keyBuffer: Buffer) => {
    const combined = Buffer.from(encryptedDataBase64Url, 'base64url');
    const iv = combined.subarray(0, 16);
    const encryptedText = combined.subarray(16);

    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, iv);
    let decrypted = decipher.update(encryptedText, undefined, 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
};

export default async function ConfirmPage({
    params,
    searchParams
}: {
    params: { id: string };
    searchParams: { data: string };
}) {
    const encryptedData = searchParams.data;
    if (encryptedData) {
        const cartData = await fetchCart(params.id);
        const key = cartData.data.cafeCart.secureShareKey;
        const keyBuffer = Buffer.from(key, 'base64');

        const decryptedData = decryptAES256(encryptedData, keyBuffer);
        return <ConfirmClientPage decryptedData={decryptedData} cartId={params.id} />;
    } else {
        return <ConfirmClientPage cartId={params.id} />;
    }
}
