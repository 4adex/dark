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

        // Fetch data initially and set up a listener to update live
        console.log('Initializing stats component and starting interval...');
        fetchData();

        const intervalId = setInterval(fetchData, 1000); // Update every second
        return () => {
            console.log('Cleaning up interval...');
            clearInterval(intervalId);
        }; // Clean up on unmount
    }, []);

    return (
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", textAlign: "center", padding: "20px", color: "#666" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "0 20px" }}>
                <div style={{ fontSize: "36px", color: "#AAA", marginBottom: "5px", fontWeight: "600", fontFamily: "'Inter', sans-serif" }}>{totalDarkPatternsToday}</div>
                <div style={{ fontSize: "14px", fontFamily: "Inter", fontWeight: "600", color: "#940CFF" }}>dark patterns detected today</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "0 20px" }}>
                <div style={{ fontSize: "36px", color: "#AAA", marginBottom: "5px", fontWeight: "600", fontFamily: "'Inter', sans-serif" }}>{totalDarkPatterns}</div>
                <div style={{ fontSize: "14px", fontFamily: "Inter", fontWeight: "600", color: "#940CFF" }}>dark patterns since install</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "0 20px" }}>
                <div style={{ fontSize: "36px", color: "#AAA", marginBottom: "5px", fontWeight: "600", fontFamily: "'Inter', sans-serif" }}>{totalFakeReviews}</div>
                <div style={{ fontSize: "14px", fontFamily: "Inter", fontWeight: "600", color: "#940CFF" }}>fake reviews detected</div>
            </div>
        </div>
    );
}

export default Stats;