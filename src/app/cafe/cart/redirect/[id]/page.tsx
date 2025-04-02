// app/cafe/cart/[id]/redirect/page.tsx
import { redirect } from 'next/navigation';
import crypto from 'crypto';

interface IAccount {
    acctNo: string;
    acctNm: string;
}

const fetchCart = async (cafeCartId: string): Promise<any> => {
    const res = await fetch(`https://api.breadkun.com/api/cafe/carts/${cafeCartId}`, {
        headers: {
            Accept: 'application/vnd.breadkun.v1+json',
            Origin: 'https://breadkun-dev.vercel.app'
        }
    });
    if (!res.ok) throw new Error('API 요청 실패');
    return res.json();
};

const encryptAES256 = (plaintextObject: IAccount, keyBuffer: Buffer) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
    let encrypted = cipher.update(JSON.stringify(plaintextObject), 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return Buffer.concat([iv, Buffer.from(encrypted, 'base64')]).toString('base64url');
};

export default async function RedirectPage({
    params,
    searchParams
}: {
    params: { id: string };
    searchParams: IAccount;
}) {
    const res = await fetchCart(params.id);
    const key = res.data.cafeCart.secureShareKey;
    const keyBuffer = Buffer.from(key, 'base64');

    const { acctNo, acctNm } = searchParams;
    if (acctNo && acctNm) {
        const data = { acctNo, acctNm };

        const encryptedData = encryptAES256(data, keyBuffer);

        redirect(`/cafe/cart/confirm/${params.id}?data=${encryptedData}`);
    } else {
        redirect(`/cafe/cart/confirm/${params.id}`);
    }
}
