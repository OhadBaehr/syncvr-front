// Helper function to format a date
export function formatDate(date: string | number | Date) {
    try {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            throw new Error('Invalid date');
        }
        return (
            parsedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) + ', ' +
            parsedDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
        );
    } catch (error) {
        return '-';
    }
}
