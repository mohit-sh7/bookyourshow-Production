import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const VerifyTicket = () => {
    const { bookingId } = useParams();
    const { axios } = useAppContext();

    const [message, setMessage] = useState("");

    useEffect(() => {
        const verify = async () => {
            const { data } = await axios.get(
                `/api/booking/verify/${bookingId}`
            );

            setMessage(data.message);
        };

        verify();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-3xl">{message}</h1>
        </div>
    );
};

export default VerifyTicket;