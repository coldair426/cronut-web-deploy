import styled from '@emotion/styled';
import {
    Avatar,
    Badge,
    Box,
    Button,
    ButtonProps,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Container,
    Tab,
    Tabs,
    Typography
} from '@mui/material';
import { COLORS_DARK } from '@/data';
import { TemperatureBadgeProps } from '@/types/cart';
import { ShoppingCart } from 'lucide-react';
import { keyframes } from '@emotion/react';

interface ConfirmHeaderProps {
    isMobile: boolean;
}
const marquee = keyframes`
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
`;

const slideMarquee = keyframes`
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
`;

export const PageWrapper = styled.div`
    width: 100%;
    max-width: 950px;
    .cart-wrapper {
        display: flex;
        justify-content: center;
    }
`;

export const CartContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    max-width: 680px;
`;

export const CartButton = styled.button`
    width: 100%;
    height: 40px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 5px;
    border: 1px solid ${COLORS_DARK.accent.main};
    box-sizing: border-box;
    background-color: ${COLORS_DARK.accent.main};
    color: #fff;
    padding: 0 10px;
    text-align: center;
    margin: 20px 0;
`;

export const StyledMenuTitle = styled(Typography)({
    fontWeight: 'bold',
    fontSize: '1.5rem',
    color: COLORS_DARK.text.primary,
    textAlign: 'center',
    whiteSpace: 'pre-line'
});

// 온도 뱃지를 위한 Box 컴포넌트
export const StyledMenuTempBox = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 8px;
    justify-content: flex-start;
`;

// TabIcon styled component 추가
export const TabIcon = styled(StyledMenuTempBox)`
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: center;
`;

export const MenuCardMedia = styled(CardMedia, {
    shouldForwardProp: prop => prop !== 'isMenu'
})<{ isMenu: boolean }>(({ isMenu }) => ({
    height: 0,
    paddingTop: '100%',
    backgroundColor: 'white',
    position: 'relative',
    transition: 'transform 0.3s ease',
    ...(!isMenu && {
        '&:hover': {
            transform: 'scale(1.05)'
        }
    })
}));

export const PageContainer = styled(Container)({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: COLORS_DARK.background.main
});

export const Header = styled(Box)({
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backgroundColor: COLORS_DARK.background.main
});

interface ConfirmHeaderProps {
    isMobile: boolean;
}

// styled 컴포넌트 정의
export const ConfirmHeader = styled(Box, {
    shouldForwardProp: prop => prop !== 'isMobile'
})<ConfirmHeaderProps>(({ isMobile, theme }) => ({
    position: 'sticky',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginBottom: isMobile ? 0 : 16,
    borderBottom: `1px solid ${COLORS_DARK.border.default}`,
    backgroundColor: COLORS_DARK.background.main,

    // 아이콘 크기 반응형 조정
    svg: {
        width: '1.25rem',
        height: '1.25rem',
        [theme.breakpoints.up('sm')]: {
            width: '1.5rem',
            height: '1.5rem'
        },
        [theme.breakpoints.up('md')]: {
            width: '1.75rem',
            height: '1.75rem'
        }
    }
}));

export const ConfirmHeaderTitle = styled(Typography)(({ theme }) => ({
    marginLeft: '0.8rem',
    fontWeight: 700,
    color: COLORS_DARK.text.primary,
    fontSize: '1.2rem',

    [theme.breakpoints.up('sm')]: {
        fontSize: '1.3rem'
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '1.35rem'
    }
}));

export const HeaderContent = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: '1rem',
    marginBottom: '1rem'
});

export const CategoryTabs = styled(Tabs)({
    minHeight: 48,
    marginBottom: 8,
    '& .MuiTabs-flexContainer': {
        justifyContent: 'center',
        gap: 16
    },
    padding: '0 0 16px 0',
    borderBottom: `1px solid ${COLORS_DARK.divider}`
});

export const CategoryTab = styled(Tab)`
    padding: 8px 4px;
    minheight: 40;

    &.Mui-selected {
        color: ${COLORS_DARK.accent.main};
        font-weight: bold;
    }

    &:hover {
        color: ${COLORS_DARK.accent.main};
    }
`;

export const ScrollableContent = styled(Box)`
    flex: 1;
    padding: 0 16px 16px 16px;
    overflow-y: auto;

    &.mobile {
        padding: 16px 0 16px 0; // 모바일일 때 패딩 제거
    }
`;

export const MenuGrid = styled(Box)({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', // 기본 3개씩 표시 (웹)
    gap: 16,
    width: '100%',
    '@media (max-width: 600px)': {
        gridTemplateColumns: 'repeat(2, 1fr)' // 모바일에서는 2개씩 표시
    }
});

export const MenuItemCard = styled(Card, {
    shouldForwardProp: prop => prop !== 'isMenu'
})<{ isMenu: boolean }>(({ isMenu }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    // isMenu가 true가 아닐 때만 hover 효과 적용
    ...(!isMenu && {
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
        }
    })
}));

export const MenuItemContent = styled(CardContent)({
    padding: '12px !important',
    display: 'flex',
    flexDirection: 'column',
    flex: 1
});

export const MenuImage = styled(Box)({
    position: 'relative',
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8
});

export const CartBadge = styled(Badge)({
    '& .MuiBadge-badge': {
        backgroundColor: COLORS_DARK.badge.hot,
        color: '#fff',
        fontWeight: 'bold',
        boxShadow: '0 0 0 2px #212529'
    }
});
export const CartConfirmContainer = styled(Container)({
    display: 'flex',
    flexDirection: 'column'
    // minHeight: '100vh'
});

export const LinkShareCard = styled(Card)({
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: COLORS_DARK.theme.blue,
    border: `1px solid ${COLORS_DARK.background.lighter}`,
    borderRadius: '20px'
});

export const LinkShareContent = styled(CardContent)({
    padding: '12px !important'
});

export const ItemDetails = styled(Box)({
    marginLeft: 16,
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column'
});

export const BottomSummary = styled(Box)({
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: COLORS_DARK.theme.blue,
    borderTop: `1px solid ${COLORS_DARK.background.lighter}`,
    boxShadow: 'none'
});

export const ButtonsContainer = styled(Box, {
    shouldForwardProp: prop => prop !== 'disabledAll'
})<{ disabledAll?: boolean }>(({ disabledAll }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    marginTop: disabledAll ? 0 : 16
}));

export const ActionButton = styled(Button)({
    height: 56,
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    color: COLORS_DARK.text.primary,
    backgroundColor: COLORS_DARK.accent.main
});

export const WhiteButton = styled(Button)({
    height: 56,
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS_DARK.text.primary,
    border: `1px solid ${COLORS_DARK.accent.main}`,
    color: COLORS_DARK.accent.main,
    '&:hover': {
        backgroundColor: '#e9ecef' // 약간 어두운 흰색
    }
});

export const ButtonIcon = styled(Box)<{ disabled?: boolean }>(({ disabled }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    svg: {
        color: disabled ? COLORS_DARK.text.disabled : COLORS_DARK.accent.main
    }
}));

export const ConfirmContainer = styled(Box)`
    flex: 1;
`;

export const OrderFooter = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    background-color: ${COLORS_DARK.theme.blue};
    z-index: 10;
    padding: 16px;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.2);

    @media (max-height: 700px) {
        padding: 12px;
    }
`;

export const OrderAmountCard = styled.div`
    background-color: ${COLORS_DARK.theme.purple};
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
    border: 1px solid rgba(255, 171, 0, 0.2);

    @media (max-height: 700px) {
        padding: 12px;
    }
`;

export const FooterButton = styled(Button)<ButtonProps>(({ theme, variant, disabled }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,

    fontSize: '1.2rem',
    padding: '12px 0',
    width: '100%',
    borderRadius: 12,

    border: `2px solid ${COLORS_DARK.accent.main}`,
    backgroundColor: variant === 'contained' ? COLORS_DARK.accent.main : 'white',
    color: variant === 'contained' ? 'white' : COLORS_DARK.accent.main,

    '&:hover': {
        backgroundColor: variant === 'contained' ? '#e08a1e' : '#f5f5f5'
    },

    ...(disabled && {
        backgroundColor: theme.palette.action.disabledBackground,
        color: theme.palette.action.disabled,
        border: `2px solid ${theme.palette.action.disabled}`,
        cursor: 'not-allowed'
    }),

    [theme.breakpoints.down('sm')]: {
        fontSize: '1rem',
        padding: '8px 0'
    }
}));

export const TemperatureBadge = styled(Chip)<TemperatureBadgeProps>(({ temperature }) => ({
    height: 22,
    borderRadius: 4,
    fontWeight: 600,
    fontSize: '0.75rem',
    padding: '0 6px',
    backgroundColor: temperature === 'ICED' ? COLORS_DARK.badge.ice : COLORS_DARK.badge.hot,
    color: '#fff',
    position: 'relative',
    boxShadow: temperature === 'ICED' ? '0 1px 4px rgba(77, 171, 247, 0.4)' : '0 1px 4px rgba(255, 107, 107, 0.4)',
    display: 'flex',
    alignItems: 'center',

    /** 🔥 반응형 추가 **/
    '@media (max-width: 400px)': {
        fontSize: '0.6875rem',
        height: 20,
        padding: '0 5px'
    }
}));

export const CartItemCard = styled(Card)({
    marginBottom: 16,
    overflow: 'hidden',
    transition: 'all 0.2s ease-in-out',
    borderRadius: '20px',
    '&:hover': {
        transform: 'translateY(-2px)'
    }
});

export const CartItemContent = styled(CardContent)(({ theme }) => ({
    padding: '16px !important',
    [theme.breakpoints.down('sm')]: {
        padding: '12px !important'
    }
}));

export const ItemImage = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
        width: 80,
        height: 80,
        borderRadius: 12
    },
    [theme.breakpoints.up('md')]: {
        width: 100,
        height: 100
    }
}));

export const UserAvatar = styled(Avatar)(({ theme }) => ({
    fontWeight: 600,
    backgroundColor: COLORS_DARK.accent.main,
    color: COLORS_DARK.text.primary,

    // xs (모바일)
    width: 20,
    height: 20,
    fontSize: '0.6875rem',
    marginRight: 6,

    [theme.breakpoints.up('sm')]: {
        width: 30,
        height: 30,
        fontSize: '0.8125rem',
        marginRight: 8
    },
    [theme.breakpoints.up('md')]: {
        width: 34,
        height: 34,
        fontSize: '0.875rem'
    }
}));

export const ConfirmTemperatureBadge = styled(Chip)<TemperatureBadgeProps>(({ theme, temperature }) => ({
    height: 20,
    borderRadius: 4,
    fontWeight: 600,
    fontSize: '0.65rem',
    backgroundColor: temperature === 'ICED' ? COLORS_DARK.badge.ice : COLORS_DARK.badge.hot,
    color: '#fff',
    marginLeft: 8,
    boxShadow: 'none',
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.6rem',
        height: '0.875rem'
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '0.75rem',
        height: 22
    }
}));

export const ScrollableCartList = styled(Box, {
    shouldForwardProp: prop => prop !== 'bottomHeight' && prop !== 'isEmpty'
})<{ bottomHeight: number; isEmpty?: boolean }>(({ theme, bottomHeight, isEmpty }) => ({
    flex: 1,
    paddingTop: 16,
    paddingBottom: isEmpty ? 0 : bottomHeight,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',

    '&::-webkit-scrollbar': {
        width: 0,
        height: 0
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'transparent'
    },

    [theme.breakpoints.up('sm')]: {
        '&::-webkit-scrollbar': {
            width: '6px'
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: COLORS_DARK.background.main
        },
        scrollbarWidth: 'thin',
        scrollbarColor: 'auto #212529'
    }
}));

export const ShoppingCartIcon = styled(ShoppingCart)(({ theme }) => ({
    width: 60,
    height: 60,
    color: COLORS_DARK.text.tertiary,
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
        width: 48,
        height: 48
    },
    [theme.breakpoints.down('xs')]: {
        width: 40,
        height: 40
    }
}));

export const DrinkNameTypography = styled(Typography)(({ theme }) => ({
    fontWeight: 500,
    color: theme.palette.text.primary,
    fontSize: '1rem',

    [theme.breakpoints.down('md')]: {
        fontSize: '0.9375rem'
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.875rem'
    },
    [theme.breakpoints.down('xs')]: {
        fontSize: '0.8125rem'
    }
}));

export const ExpiredBanner = styled('div')(({ theme }) => ({
    width: '100%',
    overflow: 'hidden',
    backgroundColor: COLORS_DARK.badge.hot,
    color: 'white',
    fontWeight: 700,
    whiteSpace: 'nowrap',
    position: 'relative',
    fontSize: '1rem',
    padding: '8px 0',

    [theme.breakpoints.down('sm')]: {
        fontSize: '0.875rem'
    },
    [theme.breakpoints.down('xs')]: {
        fontSize: '0.75rem'
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '1.125rem'
    }
}));

export const MarqueeContent = styled.div`
    display: inline-block;
    white-space: nowrap;
    animation: ${marquee} 15s linear infinite;
`;

export const CartWarningWrapper = styled('div')(({ theme }) => ({
    width: '100%',
    overflow: 'hidden',
    padding: '10px',
    borderRadius: '12px',
    border: '1px solid #ff6b6b',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    textAlign: 'center',
    position: 'relative',
    fontSize: '1.07rem',
    marginTop: '12px',

    [theme.breakpoints.down('sm')]: {
        fontSize: '0.875rem'
    },
    [theme.breakpoints.down('xs')]: {
        fontSize: '0.75rem'
    },
    [theme.breakpoints.down('md')]: {
        fontSize: '0.9rem'
    }
}));

export const CartWarningText = styled('div')(({ theme }) => ({
    display: 'inline-block',
    fontWeight: 700,
    color: '#ff6b6b',
    whiteSpace: 'nowrap',

    [theme.breakpoints.down('lg')]: {
        animation: `${slideMarquee} 14s linear infinite`
    }
}));

export const OrderLabelTypography = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    color: COLORS_DARK.text.primary,
    fontSize: '0.875rem', // 기본값: xs

    [theme.breakpoints.up('sm')]: {
        fontSize: '1.25rem'
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '1.3rem'
    },
    [theme.breakpoints.up('xl')]: {
        fontSize: '1.35rem'
    },
    [theme.breakpoints.up('xxl')]: {
        fontSize: '1.4rem'
    },
    '@media (max-height: 700px)': {
        fontSize: '0.875rem'
    }
}));

export const OrderPriceTypography = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    color: COLORS_DARK.text.primary,
    fontSize: '0.875rem', // 기본값: xs

    [theme.breakpoints.up('sm')]: {
        fontSize: '1.35rem'
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '1.4rem'
    },
    [theme.breakpoints.up('xl')]: {
        fontSize: '1.45rem'
    },
    [theme.breakpoints.up('xxl')]: {
        fontSize: '1.5rem'
    },
    '@media (max-height: 700px)': {
        fontSize: '0.875rem'
    }
}));
