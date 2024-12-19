// Helper function to format price
export const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
    }).format(price);
};
