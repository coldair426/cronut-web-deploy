'use client';

import {
    ButtonIcon,
    ButtonsContainer,
    CartItemCard,
    CartItemContent,
    CartWarningText,
    CartWarningWrapper,
    ConfirmHeader,
    ConfirmHeaderTitle,
    ConfirmTemperatureBadge,
    DrinkNameTypography,
    FooterButton,
    ItemDetails,
    ItemImage,
    LinkShareCard,
    LinkShareContent,
    OrderAmountCard,
    OrderFooter,
    OrderLabelTypography,
    OrderPriceTypography,
    ScrollableCartList,
    ShoppingCartIcon,
    UserAvatar
} from '@/styles/cart/cart.styles';
import {
    CircleDollarSign,
    ClipboardList,
    CopyIcon,
    CupSoda,
    LockIcon,
    Share2,
    ShoppingCart,
    Trash2
} from 'lucide-react';
import { Box, CardMedia, Container, IconButton, InputAdornment, TextField, Tooltip, Typography } from '@mui/material';
import { COLORS_DARK } from '@/data';
import React, { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/utils/hook';
import { useRouter, useSearchParams } from 'next/navigation';
import { deleteCartItem, useGetCartById } from '@/apis/cafe/cafe-api';
import { useQuery } from '@tanstack/react-query';
import PaymentModal from '@/app/cafe/cart/[id]/PaymentModal';
import { CafeCartItem, IDeleteCartItem } from '@/types/cart';
import { CartConfirmModal } from '@/components/page/cafe/modal/cart-confirm-modal';
import { CafeSummaryModal } from '@/components/page/cafe/modal/cafe-summary-modal';
interface ConfirmClientPageProps {
    decryptedData?: { accountNumber: string; bankName: string };
    cartId: string;
    status: string;
    isCartInactive?: boolean;
    isCreator: boolean;
    user: {
        uuid?: string;
        userName?: string;
    };
}
interface CartItem {
    id: string;
    cafeCartId: string;
    cafeMenuId: number;
    isPersonalCup: boolean;
    quantity: number;
    imageUrl: string;
    createdAt: string;
    createdById: string;
    createdByName: string;
    drinkName: string;
    drinkPrice: number;
    drinkTotalPrice: number;
    drinkCategory: string;
    drinkTemperature: 'HOT' | 'ICED';
    drinkImageFilename: string;
    drinkImageUrl: string;
}

export const ConfirmClientV3 = ({ decryptedData, cartId, status, isCreator, user }: ConfirmClientPageProps) => {
    const isMobile = useIsMobile();
    const searchParams = useSearchParams();
    const { data: cartBasic } = useGetCartById(cartId);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [unAccessibleCart, setUnAccessibleCart] = useState(false);
    const isCartReallyInactive = unAccessibleCart || cartBasic?.status === 'INACTIVE' || status === 'INACTIVE';

    const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
    const [reloadDialogOpen, setReloadDialogOpen] = useState<boolean>(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [speedDialOpen, setSpeedDialOpen] = useState(false);
    const [summaryModalOpen, setSummaryModalOpen] = useState(false);
    const router = useRouter();

    const bottomRef = useRef<HTMLDivElement>(null);
    const [bottomHeight, setBottomHeight] = useState(160);

    // 사용자 이니셜 가져오기 (이미지가 없을 경우 대체용)
    const getUserInitial = (name: string) => {
        return name.charAt(0);
    };

    // 샘플 공유 링크
    const shareLink = window.location.href;

    // 링크 복사 함수
    const copyLinkToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            setSnackbarOpen(true);
            setSpeedDialOpen(false);
        } catch (err) {
            console.error('Failed to copy link: ', err);
        }
    };

    const handleRefresh = () => {
        if (typeof window !== 'undefined') {
            window.location.reload();
        }
    };

    const removeItem = async (cafeCartId: string) => {
        if (user) {
            const res = await deleteCartItem({ cafeCartId, user } as IDeleteCartItem);
            if (res) setCartItems(cartItems.filter(item => item.id !== cafeCartId));
        }
    };

    const { data: initialCartItems = [], isLoading } = useQuery<CafeCartItem[]>({
        queryKey: ['orderItems', cartId],
        queryFn: async () => {
            const response = await fetch(`https://api.breadkun.com/api/cafe/carts/${cartId}/items?include=DETAILS`);
            if (!response.ok) throw new Error('네트워크 응답 실패');
            const json = await response.json();
            return json.data?.cafeCartItem || [];
        },
        staleTime: 0,
        refetchOnMount: 'always',
        retry: 1
    });

    const totalPrice = cartItems
        .filter(item => item.createdById === user.uuid)
        .reduce((sum, item) => sum + item.drinkTotalPrice, 0);

    useEffect(() => {
        // SSE 연결 설정
        const eventSource = new EventSource(`https://api.breadkun.com/sse/cafe/carts/${cartId}/items/subscribe`);
        const eventName = `cafe-cart-item-${cartId}`;
        const handleEvent = (e: MessageEvent) => {
            const eventData = JSON.parse(e.data);
            setCartItems(prevItems => {
                if (eventData.event === 'CREATED') {
                    return [
                        ...prevItems,
                        ...eventData.data.cafeCartItem.filter(
                            (newItem: CartItem) => !prevItems.some(item => item.id === newItem.id)
                        )
                    ];
                } else if (eventData.event === 'DELETED') {
                    return prevItems.filter(item => !eventData.data.id.includes(item.id));
                } else {
                    return prevItems;
                }
            });
        };
        eventSource.addEventListener(eventName, handleEvent);

        eventSource.onerror = err => {
            if (status === 'INACTIVE') {
                setUnAccessibleCart(true);
            } else {
                setReloadDialogOpen(true);
            }

            console.error('SSE 에러 발생:', err);
            eventSource.close();
        };

        return () => {
            eventSource.removeEventListener(eventName, handleEvent);
            eventSource.close();
        };
    }, [cartId, cartBasic]);

    useEffect(() => {
        if (!isLoading && initialCartItems) {
            setCartItems(initialCartItems);
        }
    }, [initialCartItems, isLoading]);

    useEffect(() => {
        if (!bottomRef.current) return;

        const updateHeight = () => {
            const bottom = bottomRef.current!.getBoundingClientRect().height;

            setBottomHeight(bottom);
        };

        const resizeObserver = new ResizeObserver(updateHeight);

        resizeObserver.observe(bottomRef.current);

        updateHeight();

        return () => resizeObserver.disconnect();
    }, []);

    if (isLoading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Typography>로딩 중...</Typography>
            </Box>
        );
    }

    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: `calc(95dvh - 80px - ${bottomHeight}px )`
            }}
        >
            {isCartReallyInactive && (
                <CartWarningWrapper>
                    <CartWarningText>
                        ⚠️ 장바구니의 주문 가능 시간이 만료되었습니다. 메뉴 담기 및 송금이 불가합니다. ⚠️
                        &nbsp;&nbsp;&nbsp; ⚠️ 장바구니의 주문 가능 시간이 만료되었습니다. 메뉴 담기 및 송금이
                        불가합니다. ⚠️
                    </CartWarningText>
                </CartWarningWrapper>
            )}
            {/*<ConfirmHeader isMobile={isMobile}>*/}
            {/*    <ShoppingCart />*/}
            {/*    <ConfirmHeaderTitle className="header-title">{cartBasic?.title}</ConfirmHeaderTitle>*/}
            {/*    */}
            {/*</ConfirmHeader>*/}

            <ConfirmHeader isMobile={isMobile}>
                <Box sx={{ flex: 1 }} />

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ShoppingCart />
                    <ConfirmHeaderTitle className="header-title">{cartBasic?.title}</ConfirmHeaderTitle>
                </Box>

                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    {!isMobile ? (
                        <Tooltip title="요약 보기" placement="top" arrow>
                            <IconButton onClick={() => setSummaryModalOpen(true)}>
                                <ClipboardList />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <IconButton onClick={() => setSummaryModalOpen(true)}>
                            <ClipboardList />
                        </IconButton>
                    )}
                </Box>
            </ConfirmHeader>

            {!isMobile && (
                <LinkShareCard>
                    <LinkShareContent>
                        <Box display="flex" alignItems="center" mb={1}>
                            <Share2
                                size={24}
                                style={{
                                    marginRight: '8px',
                                    color: COLORS_DARK.accent.main
                                }}
                            />
                            <Typography variant="subtitle2" fontWeight="medium">
                                장바구니 공유하기
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={shareLink}
                                InputProps={{
                                    readOnly: true,
                                    style: { color: COLORS_DARK.text.primary },
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                edge="end"
                                                onClick={copyLinkToClipboard}
                                                sx={{
                                                    color: COLORS_DARK.accent.main,
                                                    '&:hover': {
                                                        backgroundColor: `${COLORS_DARK.accent.main}20`
                                                    }
                                                }}
                                            >
                                                <CopyIcon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 12,
                                        backgroundColor: COLORS_DARK.background.main
                                    }
                                }}
                            />
                        </Box>
                    </LinkShareContent>
                </LinkShareCard>
            )}

            <ScrollableCartList bottomHeight={bottomHeight} isEmpty={cartItems.length === 0}>
                {cartItems.length === 0 ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            py: 8,
                            px: 4,
                            textAlign: 'center',
                            backgroundColor: COLORS_DARK.background.lighter,
                            borderRadius: 3,
                            mb: bottomHeight
                        }}
                    >
                        <ShoppingCartIcon />
                        <Typography
                            sx={{
                                whiteSpace: 'nowrap',
                                fontWeight: 'bold',
                                fontSize: 'clamp(0.75rem, 4vw, 1.125rem)', // 📌 작으면 0.75rem, 크면 1.125rem
                                lineHeight: 1.4
                            }}
                        >
                            장바구니가 비어있습니다
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color: COLORS_DARK.text.secondary,
                                fontSize: 'clamp(0.75rem, 3.5vw, 0.875rem)',
                                maxWidth: '100%',
                                lineHeight: 1.4,
                                whiteSpace: 'normal',
                                wordBreak: 'keep-all'
                            }}
                        >
                            메뉴를 추가하여 함께 주문해보세요
                        </Typography>
                    </Box>
                ) : (
                    cartItems.map(item => (
                        <CartItemCard key={item.id}>
                            <CartItemContent>
                                <Box display={'flex'} alignItems={'stretch'}>
                                    <ItemImage>
                                        <CardMedia
                                            component="img"
                                            image={
                                                'https://img.freepik.com/free-photo/iced-cola-tall-glass_1101-740.jpg'
                                            }
                                            alt={item.drinkName}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </ItemImage>
                                    <ItemDetails>
                                        <Box>
                                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                                <Box display="flex" alignItems="center">
                                                    <DrinkNameTypography>{item.drinkName}</DrinkNameTypography>
                                                    {item.drinkTemperature && (
                                                        <ConfirmTemperatureBadge
                                                            temperature={item.drinkTemperature}
                                                            label={item.drinkTemperature}
                                                            size="small"
                                                        />
                                                    )}
                                                </Box>
                                                {item.createdById === user.uuid && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => removeItem(item.id)}
                                                        sx={{
                                                            color: COLORS_DARK.text.secondary,
                                                            padding: 0
                                                        }}
                                                    >
                                                        <Trash2 fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Box>

                                            <Box display="flex" alignItems="center" mb={1}>
                                                <UserAvatar src={`/user-img/face1.png`} alt={item.createdByName}>
                                                    {getUserInitial(item.createdByName)}
                                                </UserAvatar>
                                                <Typography variant="body2" sx={{ color: COLORS_DARK.text.secondary }}>
                                                    {item.createdByName}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            width="100%"
                                        >
                                            <Typography variant="body2" sx={{ color: COLORS_DARK.text.primary }}>
                                                수량: {item.quantity}잔
                                            </Typography>
                                            <Typography
                                                variant="subtitle2"
                                                fontWeight="bold"
                                                sx={{
                                                    color: COLORS_DARK.accent.main
                                                }}
                                            >
                                                {item.drinkTotalPrice.toLocaleString()}&nbsp;원
                                            </Typography>
                                        </Box>
                                    </ItemDetails>
                                </Box>
                            </CartItemContent>
                        </CartItemCard>
                    ))
                )}
            </ScrollableCartList>
            <OrderFooter ref={bottomRef}>
                <Container disableGutters sx={{ maxWidth: '900px' }}>
                    {!isCartReallyInactive && (
                        <OrderAmountCard>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <OrderLabelTypography variant="subtitle1">내 주문 금액</OrderLabelTypography>
                                <OrderPriceTypography variant="h5">
                                    {totalPrice.toLocaleString()}원
                                </OrderPriceTypography>
                            </Box>
                        </OrderAmountCard>
                    )}

                    <ButtonsContainer disabledAll={isCartReallyInactive}>
                        <FooterButton
                            onClick={() => {
                                if (user.userName) {
                                    router.push(`/cafe/cart/menu/${cartId}?${searchParams}`);
                                } else {
                                    router.push(`/cafe/cart/register/${cartId}?${searchParams}`);
                                }
                            }}
                            disabled={isCartReallyInactive}
                        >
                            <ButtonIcon disabled={isCartReallyInactive}>
                                <CupSoda />
                            </ButtonIcon>
                            메뉴 담기
                        </FooterButton>
                        {isCreator ? (
                            <FooterButton
                                disabled={isCartReallyInactive}
                                variant="contained"
                                onClick={() => setPaymentModalOpen(true)}
                            >
                                <ButtonIcon disabled={isCartReallyInactive}>
                                    <LockIcon />
                                </ButtonIcon>
                                주문 마감하기
                            </FooterButton>
                        ) : (
                            <FooterButton
                                variant="contained"
                                disabled={isCartReallyInactive}
                                onClick={() => setPaymentModalOpen(true)}
                            >
                                <ButtonIcon disabled={isCartReallyInactive}>
                                    <CircleDollarSign />
                                </ButtonIcon>
                                송금하기
                            </FooterButton>
                        )}
                    </ButtonsContainer>
                </Container>
            </OrderFooter>

            {reloadDialogOpen && (
                <CartConfirmModal
                    open={reloadDialogOpen}
                    disableEscapeKeyDown
                    onConfirm={() => handleRefresh()}
                    title={'세션 만료'}
                    content={<>페이지를 새로고침 해주세여.</>}
                />
            )}

            {decryptedData && (
                <PaymentModal
                    open={paymentModalOpen}
                    setOpen={setPaymentModalOpen}
                    cafeAccount={decryptedData}
                    totalPrice={totalPrice}
                    handlePayment={setPaymentModalOpen}
                />
            )}

            {summaryModalOpen && (
                <CafeSummaryModal open={summaryModalOpen} onClose={() => setSummaryModalOpen(false)} />
            )}
        </Container>
    );
};
