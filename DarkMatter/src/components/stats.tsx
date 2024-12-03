import React, { useState, useEffect } from 'react';

function Stats() {
    interface DataToStore {
        type: string;
        url: string;
        date: string;
    }

    const [darkPatterns, setDarkPatterns] = useState<DataToStore[]>([]);
    const [totalFakeReviews, setTotalFakeReviews] = useState(0);
    const [totalDarkPatterns, setTotalDarkPatterns] = useState(0);
    const [totalDarkPatternsToday, setTotalDarkPatternsToday] = useState(0);

    useEffect(() => {
        const fetchData = () => {
            console.log('Fetching data from chrome.storage.local...');
            chrome.storage.local.get(['darkPatterns'], (result) => {
                const retrievedPatterns = result.darkPatterns || [];
                console.log('Data retrieved:', retrievedPatterns);

                setDarkPatterns(retrievedPatterns);

                let fakeReviewsCount = 0;
                let darkPatternsCount = 0;
                let darkPatternsTodayCount = 0;

                const todayDate = new Date().toISOString().split('T')[0];
                console.log('Today\'s date:', todayDate);

                for (let i = 0; i < retrievedPatterns.length; i++) {
                    const pattern = retrievedPatterns[i];
                    console.log(`Processing pattern ${i + 1}:`, pattern);

                    if (pattern.type === 'fake_review') {
                        fakeReviewsCount++;
                    } else {
                        darkPatternsCount++;
                        if (pattern.date === todayDate) {
                            darkPatternsTodayCount++;
                        }
                    }
                }

                console.log('Total fake reviews:', fakeReviewsCount);
                console.log('Total dark patterns:', darkPatternsCount);
                console.log('Total dark patterns today:', darkPatternsTodayCount);

                setTotalFakeReviews(fakeReviewsCount);
                setTotalDarkPatterns(darkPatternsCount);
                setTotalDarkPatternsToday(darkPatternsTodayCount);
            });
        };

        // Fetch data once when the component is mounted
        console.log('Initializing stats component...');
        fetchData();
    }, []); // Empty dependency array to run the effect only once

    return (

        <div className="stats-grid">
        {[
          { value: totalDarkPatternsToday, label: "Patterns Today" },
          { value: totalDarkPatterns, label: "Patterns Total" },
          { value: totalFakeReviews, label: "Fake Reviews" }
        ].map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    );
}

export default Stats;
