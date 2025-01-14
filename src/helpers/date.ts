export const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown Date";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
};