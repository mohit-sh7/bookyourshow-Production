import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import {
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";

import { auth } from "../../config/firebase";
import { dummyShowsData } from "../../assets/assets";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Scrolling row of posters. direction: "left" | "right"
const PosterRow = ({ posters, direction = "left", duration = 40 }) => {
  const repeated = [];
  while (repeated.length < 10) repeated.push(...posters);
  const loopPosters = [...repeated, ...repeated];

  return (
    <div
      className="flex w-max gap-4 animate-marquee flex-1"
      style={{
        animationDirection: direction === "right" ? "reverse" : "normal",
        animationDuration: `${duration}s`,
      }}
    >
      {loopPosters.map((src, i) => (
        <div key={i} className="h-full w-44 shrink-0 rounded-xl overflow-hidden shadow-lg">
          <img src={src} alt="" className="h-full w-full object-cover" draggable={false} />
        </div>
      ))}
    </div>
  );
};

const PosterBackground = () => {
  const slides = dummyShowsData;
  const posters = slides.map((s) => s.backdrop_path).filter(Boolean);

  if (!posters.length) return null;

  const rowCount = 4;
  const perRow = Math.ceil(posters.length / rowCount) || 1;
  const rows = Array.from({ length: rowCount }, (_, i) =>
    posters.slice(i * perRow, i * perRow + perRow)
  ).filter((row) => row.length);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none select-none">
      <div className="absolute inset-0 flex flex-col gap-4 opacity-30 -rotate-3 scale-125">
        {rows.map((row, i) => (
          <PosterRow
            key={i}
            posters={row}
            direction={i % 2 === 0 ? "left" : "right"}
            duration={35 + i * 8}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#05020A]/80 via-[#0D031A]/85 to-[#05020A]/95" />
    </div>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const { loadUser } = useAppContext();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const token = await result.user.getIdToken();

        await axios.post(
            `${BASE_URL}/api/auth/google`,
            { token },
            { withCredentials: true }
        );

        await loadUser();
navigate("/");
    } catch (error) {
    console.log(error);

    if (error?.code !== "auth/popup-closed-by-user") {
        toast.error("Google sign-up failed. Please try again.");
    }
} finally {
    setGoogleLoading(false);
}
}; // ← add this line

const onSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const { data } = await axios.post(
      `${BASE_URL}/api/auth/register`,
      form,
      { withCredentials: true }
    );

    if (!data.success) {
      toast.error(data.message || "Registration failed");
    } else {
      toast.success("OTP sent successfully.");
      setShowOTP(true);
    }
  } catch (err) {
    toast.error("Unable to register.");
  }

  setLoading(false);
};

const verifyOtp = async () => {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/api/auth/verify-otp`,
      {
        email: form.email,
        otp,
      },
      {
        withCredentials: true,
      }
    );

    if (data.success) {
      toast.success("Email verified successfully.");
      navigate("/login");
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error("Verification failed.");
  }
};

  const isBusy = loading || googleLoading;

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-[#05020A]">
      <PosterBackground />

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl animate-[fadeIn_0.3s_ease-out]">
        <h2 className="text-2xl font-semibold text-center mb-1 text-white">Create account</h2>
        <p className="text-sm text-center text-gray-400 mb-6">Sign up to start booking</p>

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={isBusy}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition p-3 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <FcGoogle className="h-5 w-5" />
          {googleLoading ? "Connecting..." : "Continue with Google"}
        </button>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-white/15" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="h-px flex-1 bg-white/15" />
        </div>

        {!showOTP ? (
  <form onSubmit={onSubmit} className="space-y-4">
    {/* Name */}
    <div>
      <label htmlFor="name" className="text-sm text-white/80">
        Full Name
      </label>

      <div className="relative mt-1">
        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />

        <input
          id="name"
          type="text"
          required
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="w-full pl-10 pr-3 p-3 rounded-lg bg-white/5 border border-white/20 text-white"
        />
      </div>
    </div>

    {/* Email */}
    <div>
      <label htmlFor="email" className="text-sm text-white/80">
        Email
      </label>

      <div className="relative mt-1">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />

        <input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          className="w-full pl-10 pr-3 p-3 rounded-lg bg-white/5 border border-white/20 text-white"
        />
      </div>
    </div>

    {/* Password */}
    <div>
      <label htmlFor="password" className="text-sm text-white/80">
        Password
      </label>

      <div className="relative mt-1">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />

        <input
          id="password"
          type={showPassword ? "text" : "password"}
          required
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          className="w-full pl-10 pr-10 p-3 rounded-lg bg-white/5 border border-white/20 text-white"
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>

    <button
      type="submit"
      className="w-full bg-primary py-3 rounded-lg text-white"
    >
      Register
    </button>
  </form>
) : (
  <div className="space-y-4">
    <label className="text-sm text-white">
      Enter the OTP sent to your email
    </label>

    <input
      type="text"
      maxLength={6}
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white"
      placeholder="123456"
    />

    <button
      onClick={verifyOtp}
      className="w-full bg-primary py-3 rounded-lg text-white"
    >
      Verify OTP
    </button>
  </div>
)}
<p className="text-center mt-6 text-gray-300 text-sm">
  Already have an account?{" "}
  <span
    className="text-primary cursor-pointer hover:underline"
    onClick={() => navigate("/login")}
  >
    Login
  </span>
</p>
      </div>
    </div>
  );
};

export default Register;