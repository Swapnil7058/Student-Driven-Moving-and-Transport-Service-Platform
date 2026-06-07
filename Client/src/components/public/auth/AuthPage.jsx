import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const AuthPage = () => {
  const navigate = useNavigate();
  const {
    user,
    isLoading,
    login,
    signup,
    sendPreSignupPhoneOtp,
    verifyPreSignupPhoneOtp,
    sendPreSignupEmailOtp,
    verifyPreSignupEmailOtp,
    forgotPassword,
  } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [email, setEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [password, setPassword] = useState("");
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [verificationStatus, setVerificationStatus] = useState({
    isPhoneVerified: false,
    isEmailVerified: false,
  });

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    }
  }, [isLoading, user, navigate]);

  const clearMessages = () => {
    setError("");
    setInfo("");
  };

  const handlePhoneChange = (value) => {
    setPhone(value);
    setVerificationStatus((prev) => ({ ...prev, isPhoneVerified: false }));
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    setVerificationStatus((prev) => ({ ...prev, isEmailVerified: false }));
  };

  const handleSendPhoneOtp = async () => {
    clearMessages();
    if (!phone.trim()) {
      setError("Enter phone number first.");
      return;
    }

    const result = await sendPreSignupPhoneOtp(phone);
    if (!result.success) {
      setError(result.message || "Failed to send OTP.");
      return;
    }

    const maybeOtp = result.data?.data?.otp;
    const message = result.data?.message || "Phone OTP sent.";
    setInfo(maybeOtp ? `${message} (Dev OTP: ${maybeOtp})` : message);
  };

  const handleVerifyPhoneOtp = async () => {
    clearMessages();
    if (!phone.trim() || !phoneOtp.trim()) {
      setError("Enter phone and OTP.");
      return;
    }

    const result = await verifyPreSignupPhoneOtp(phone, phoneOtp);
    if (!result.success) {
      setError(result.message || "Phone OTP verification failed.");
      return;
    }

    setVerificationStatus((prev) => ({ ...prev, isPhoneVerified: true }));
    setInfo("Phone verified successfully.");
  };

  const handleSendEmailOtp = async () => {
    clearMessages();
    if (!email.trim()) {
      setError("Enter email first.");
      return;
    }

    const result = await sendPreSignupEmailOtp(email);
    if (!result.success) {
      setError(result.message || "Failed to send email OTP.");
      return;
    }

    const maybeOtp = result.data?.data?.otp;
    const message = result.data?.message || "Email OTP sent.";
    setInfo(maybeOtp ? `${message} (Dev OTP: ${maybeOtp})` : message);
  };

  const handleVerifyEmailOtp = async () => {
    clearMessages();
    if (!email.trim() || !emailOtp.trim()) {
      setError("Enter email and OTP.");
      return;
    }

    const result = await verifyPreSignupEmailOtp(email, emailOtp);
    if (!result.success) {
      setError(result.message || "Email OTP verification failed.");
      return;
    }

    setVerificationStatus((prev) => ({ ...prev, isEmailVerified: true }));
    setInfo("Email verified successfully.");
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    clearMessages();

    if (isLogin) {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message || "Authentication failed.");
      }
      return;
    }

    if (!verificationStatus.isPhoneVerified || !verificationStatus.isEmailVerified) {
      setError("Verify phone and email first.");
      return;
    }

    const result = await signup(name, phone, email, password);
    if (!result.success) {
      setError(result.message || "Signup failed.");
      return;
    }

    setInfo("Signup successful. You can login now.");
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    clearMessages();
    const result = await forgotPassword(email);
    if (!result.success) {
      setError(result.message || "Failed to send reset link.");
      return;
    }
    setInfo("If this email exists, a reset link has been sent.");
  };

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setIsForgotMode(false);
    setPhoneOtp("");
    setEmailOtp("");
    setVerificationStatus({
      isPhoneVerified: false,
      isEmailVerified: false,
    });
    clearMessages();
  };

  const isSignupFormComplete =
    Boolean(name.trim()) &&
    Boolean(phone.trim()) &&
    Boolean(email.trim()) &&
    Boolean(password.trim());
  const isSignupEnabled =
    isSignupFormComplete &&
    verificationStatus.isPhoneVerified &&
    verificationStatus.isEmailVerified;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div
        className={`bg-white p-8 rounded-2xl shadow-xl w-full text-center ${
          isLogin || isForgotMode ? "max-w-md" : "max-w-4xl"
        }`}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {isForgotMode
            ? "Forgot Password"
            : isLogin
              ? "Login to VanMan"
              : "Create a VanMan Account"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 font-medium text-sm">
            {error}
          </div>
        )}
        {info && (
          <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4 font-medium text-sm">
            {info}
          </div>
        )}

        {isForgotMode ? (
          <form onSubmit={handleForgotPassword}>
            <div className="relative mt-4">
              <input
                type="email"
                value={email}
                onChange={(event) => handleEmailChange(event.target.value)}
                required
                className="w-full py-2 border-b-2 border-gray-300 focus:border-orange-500 focus:outline-none"
              />
              <label className="absolute left-0 -top-4 text-xs text-orange-500">
                Email Address
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg mt-8 transition"
            >
              Send Reset Link
            </button>
            <button
              type="button"
              onClick={() => {
                setIsForgotMode(false);
                clearMessages();
              }}
              className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg mt-3 transition"
            >
              Back to Login
            </button>
          </form>
        ) : (
          <>
            <form onSubmit={handleAuthSubmit}>
              {!isLogin && (
                <>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    placeholder="Full Name"
                    className="w-full py-2 border-b-2 border-gray-300 focus:border-orange-500 focus:outline-none mt-3"
                  />

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <input
                      type="text"
                      value={phone}
                      onChange={(event) => handlePhoneChange(event.target.value)}
                      required
                      placeholder="Contact Number"
                      className="w-full py-2 border-b-2 border-gray-300 focus:border-orange-500 focus:outline-none mt-2"
                    />
                    <div className="rounded-lg border border-slate-200 p-3 text-left">
                      <p className="text-xs font-semibold text-slate-700">Phone Verification</p>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={handleSendPhoneOtp}
                          className="flex-1 rounded-lg bg-amber-600 px-3 py-2 text-sm text-white"
                        >
                          Send OTP
                        </button>
                      </div>
                      <input
                        type="text"
                        value={phoneOtp}
                        onChange={(event) => setPhoneOtp(event.target.value)}
                        placeholder="Enter phone OTP"
                        className="w-full py-2 border-b-2 border-gray-300 focus:border-orange-500 focus:outline-none mt-2"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyPhoneOtp}
                        className="mt-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white"
                      >
                        Verify Phone OTP
                      </button>
                      <p className="mt-2 text-xs text-slate-600">
                        {verificationStatus.isPhoneVerified
                          ? "Phone verified."
                          : "Phone not verified yet."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => handleEmailChange(event.target.value)}
                      required
                      placeholder="Email Address"
                      className="w-full py-2 border-b-2 border-gray-300 focus:border-orange-500 focus:outline-none mt-2"
                    />
                    <div className="rounded-lg border border-slate-200 p-3 text-left">
                      <p className="text-xs font-semibold text-slate-700">Email Verification</p>
                      <button
                        type="button"
                        onClick={handleSendEmailOtp}
                        className="mt-2 rounded-lg bg-orange-600 px-3 py-2 text-sm text-white"
                      >
                        Send Email OTP
                      </button>
                      <input
                        type="text"
                        value={emailOtp}
                        onChange={(event) => setEmailOtp(event.target.value)}
                        placeholder="Enter email OTP"
                        className="w-full py-2 border-b-2 border-gray-300 focus:border-orange-500 focus:outline-none mt-2"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyEmailOtp}
                        className="mt-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white"
                      >
                        Verify Email OTP
                      </button>
                      <p className="mt-2 text-xs text-slate-600">
                        {verificationStatus.isEmailVerified
                          ? "Email verified."
                          : "Email not verified yet."}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {isLogin && (
                <input
                  type="email"
                  value={email}
                  onChange={(event) => handleEmailChange(event.target.value)}
                  required
                  placeholder="Email Address"
                  className="w-full py-2 border-b-2 border-gray-300 focus:border-orange-500 focus:outline-none mt-3"
                />
              )}

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                placeholder="Password"
                className="w-full py-2 border-b-2 border-gray-300 focus:border-orange-500 focus:outline-none mt-3"
              />

              <button
                type="submit"
                disabled={!isLogin && !isSignupEnabled}
                className={`w-full py-3 text-white font-semibold rounded-lg mt-8 transition ${
                  !isLogin && !isSignupEnabled
                    ? "bg-orange-300 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>

            {isLogin && (
              <button
                type="button"
                onClick={() => {
                  setIsForgotMode(true);
                  clearMessages();
                }}
                className="mt-4 text-sm text-orange-600 hover:underline"
              >
                Forgot password?
              </button>
            )}

            <p className="mt-6 text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <span
                onClick={toggleMode}
                className="text-orange-500 hover:underline cursor-pointer ml-1 font-medium"
              >
                {isLogin ? "Sign Up" : "Login"}
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
