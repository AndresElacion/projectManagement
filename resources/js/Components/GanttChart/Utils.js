export const parseDate = (dateString) => {
    return new Date(dateString);
};

export const getQuarters = (startDate, endDate) => {
    const quarters = [];
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();

    for (let year = startYear; year <= endYear; year++) {
        for (let quarter = 1; quarter <= 4; quarter++) {
            const quarterStart = new Date(year, (quarter - 1) * 3, 1);
            const quarterEnd = new Date(year, quarter * 3, 0);

            if (quarterEnd >= startDate && quarterStart <= endDate) {
                quarters.push({ 
                    year, 
                    label: `Q${quarter}`, 
                    start: quarterStart, 
                    end: quarterEnd 
                });
            }
        }
    }
    return quarters;
};