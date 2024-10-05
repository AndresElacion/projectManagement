export const getDateRange = (tasks) => {
  if (!tasks?.length) {
    const today = new Date();
    return {
      min: new Date(today.getFullYear(), today.getMonth(), 1),
      max: new Date(today.getFullYear(), today.getMonth() + 1, 0)
    };
  }
  
  const starts = tasks.map(task => new Date(task.startDate).getTime());
  const ends = tasks.map(task => new Date(task.endDate).getTime());
  
  const minDate = new Date(Math.min(...starts));
  const maxDate = new Date(Math.max(...ends));
  
  // Set to first day of the start month
  minDate.setDate(1);
  // Set to last day of the end month
  maxDate.setMonth(maxDate.getMonth() + 1, 0);
  
  return { min: minDate, max: maxDate };
};

// Format Month and Year Utility
export const formatMonthYear = (date) => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  });
};