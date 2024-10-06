import React, { useMemo } from 'react';
import { getQuarters } from './Utils'; // Ensure you import it from wherever you moved it

const TimelineHeader = ({ dateRange }) => {
    const quarters = useMemo(() => getQuarters(dateRange.min, dateRange.max), [dateRange]);

    return (
        <div className="sticky top-0 bg-[#292f4c] z-20 border-b border-gray-700">
            {/* Years */}
            <div className="flex h-8">
                {quarters.reduce((acc, q) => {
                    const lastYear = acc[acc.length - 1];
                    if (!lastYear || lastYear.year !== q.year) {
                        acc.push({ year: q.year, quarters: [q] });
                    } else {
                        lastYear.quarters.push(q);
                    }
                    return acc;
                }, []).map((yearGroup) => (
                    <div key={yearGroup.year} className="flex-grow text-center text-sm text-gray-300 py-2 border-r border-gray-700" style={{ width: `${(yearGroup.quarters.length / quarters.length) * 100}%` }}>
                        {yearGroup.year}
                    </div>
                ))}
            </div>
            {/* Quarters */}
            <div className="flex h-8">
                {quarters.map((q, i) => (
                    <div key={i} className="flex-grow text-center text-sm text-gray-300 py-2 border-r border-gray-700" style={{ width: `${100 / quarters.length}%` }}>
                        {q.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimelineHeader;
