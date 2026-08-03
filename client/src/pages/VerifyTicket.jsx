import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { Loader2 } from "lucide-react";

const VerifyTicket = () => {
    const { bookingId } = useParams();
    const { axios } = useAppContext();

    // status: "loading" | "success" | "error"
    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        let cancelled = false;

        const verify = async () => {
            try {
                const { data } = await axios.get(`/api/booking/verify/${bookingId}`);

                if (cancelled) return;

                if (data.success) {
                    setStatus("success");
                    setMessage(data.message || "Ticket verified successfully");
                } else {
                    setStatus("error");
                    setMessage(data.message || "This ticket could not be verified");
                }
            } catch (err) {
                if (cancelled) return;
                console.log(err);
                setStatus("error");
                setMessage("Something went wrong while verifying this ticket");
            }
        };

        verify();

        return () => {
            cancelled = true;
        };
    }, [bookingId]);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[#05020A]">
            <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl flex flex-col items-center text-center">

                {status === "loading" && (
                    <>
                        <Loader2 className="w-14 h-14 text-primary animate-spin mb-5" />
                        <h1 className="text-xl font-semibold text-white">Verifying ticket...</h1>
                        <p className="text-sm text-gray-400 mt-1">Please wait a moment</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <svg
                            className="w-20 h-20 mb-5"
                            viewBox="0 0 52 52"
                        >
                            <circle
                                className="checkmark-circle"
                                cx="26" cy="26" r="24"
                                fill="none"
                                stroke="#22c55e"
                                strokeWidth="3"
                            />
                            <path
                                className="checkmark-check"
                                fill="none"
                                stroke="#22c55e"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14 27l7 7 17-17"
                            />
                        </svg>
                        <h1 className="text-xl font-semibold text-white">Ticket Verified</h1>
                        <p className="text-sm text-gray-400 mt-1">{message}</p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <svg
                            className="w-20 h-20 mb-5"
                            viewBox="0 0 52 52"
                        >
                            <circle
                                className="checkmark-circle error"
                                cx="26" cy="26" r="24"
                                fill="none"
                                stroke="#ef4444"
                                strokeWidth="3"
                            />
                            <path
                                className="checkmark-check error"
                                fill="none"
                                stroke="#ef4444"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M18 18l16 16M34 18L18 34"
                            />
                        </svg>
                        <h1 className="text-xl font-semibold text-white">Verification Failed</h1>
                        <p className="text-sm text-gray-400 mt-1">{message}</p>
                    </>
                )}

            </div>

            <style>{`
                .checkmark-circle {
                    stroke-dasharray: 151;
                    stroke-dashoffset: 151;
                    animation: circleDraw 0.5s ease-out forwards;
                }
                .checkmark-check {
                    stroke-dasharray: 48;
                    stroke-dashoffset: 48;
                    animation: checkDraw 0.35s 0.4s ease-out forwards;
                }
                .checkmark-check.error {
                    stroke-dasharray: 34;
                    stroke-dashoffset: 34;
                }
                @keyframes circleDraw {
                    to { stroke-dashoffset: 0; }
                }
                @keyframes checkDraw {
                    to { stroke-dashoffset: 0; }
                }
            `}</style>
        </div>
    );
};

export default VerifyTicket;