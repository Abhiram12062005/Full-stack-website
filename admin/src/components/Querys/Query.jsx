import React, { useState, useEffect } from 'react';
import './Query.css';

const Query = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(import.meta.env.VITE_SERVER_DOMAIN +'querys', {
            method: 'GET',
        })
            .then((res) => res.json())
            .then((response) => {
                console.log('Fetch Response:', response);
                if (response.data && Array.isArray(response.data)) {
                    setData(response.data);
                } else {
                    console.error('Unexpected data format:', response);
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleReply = (email) => {
        const message = prompt('Enter your reply message:');
        if (message) {
            fetch(import.meta.env.VITE_SERVER_DOMAIN +'send-reply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, message }),
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.error) {
                        alert(`Error: ${result.error}`);
                    } else {
                        alert(result.message);
                    }
                })
                .catch((error) => {
                    console.error('Error sending email:', error);
                });
        }
    };

    return (
        <div className='query'>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>How do They Know us</th>
                        <th>Query</th>
                        <th>Reply</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((e, index) => (
                            <tr key={index}>
                                <td>{e.name}</td>
                                <td>{e.email}</td>
                                <td>{e.mobileNumber}</td>
                                <td>{e.howDoYouKnow}</td>
                                <td>{e.query}</td>
                                <td>
                                    <a
                                        href={`mailto:${e.email}`}
                                        className="reply-button"
                                    >
                                        Reply
                                    </a>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="no-data">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Query;
