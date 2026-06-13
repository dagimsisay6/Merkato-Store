"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Check } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Handle sign in logic here
    console.log({ email, password, keepSignedIn });
    setLoading(false);
  };

  return (
    <div className="fflex-1 max-w-6xl w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-center py-12 lg:py-20">
  
    {/* Members Get More Box */}
        <div className="md:col-span-5 bg-linear-to-br from-[#005A36] via-[#01683E] to-[#7CB75D] rounded-[2rem] p-10 text-white flex flex-col justify-between shadow-xs min-h-115 relative overflow-hidden group">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-size-[24px_24px]" />

        <div className="relative z-10">
          <span className="inline-block bg-white/15 backdrop-blur-md text-4 font-bold tracking-wider px-3 py-1.5 rounded-full mb-6 uppercase text-white/90">
              MEMBERS GET MORE
            </span>
          <h2 className="text-3xl lg:text-[2rem] font-extrabold leading-[1.2] tracking-tight mb-8">
              Sign in to unlock app-only deals & faster checkout.
            </h2>
        </div>

          <ul className="space-y-4 text-xs font-semibold opacity-95 relative z-10 list-none p-0 m-0">
            <li className="flex items-center gap-2.5">
              <span className="text-sm font-bold">✓</span>
              <span>Saved addresses & payment methods</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="text-sm font-bold">✓</span>
              <span>Order tracking with live updates</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="text-sm font-bold">✓</span>
              <span>Loyalty points on every purchase</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="text-sm font-bold">✓</span>
              <span>Personalised recommendations</span>
            </li>
          </ul>
        </div>
          <div className="md:col-span-7 max-w-md w-full mx-auto md:ml-auto md:mr-0">

        <div className="mb-6">
          <h1 className="text-[2rem] lg:text-[2.25rem] font-black text-[#0A1828] tracking-tight mb-1.5">Welcome back</h1>
          <p className="text-gray-500 text-sm font-medium">Sign in to your Merkato account.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 tracking-wider mb-2 uppercase">
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder=""
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder=""
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Keep me signed in */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="keepSignedIn"
              checked={keepSignedIn}
              onChange={(e) => setKeepSignedIn(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="keepSignedIn" className="ml-2 text-sm text-gray-700">
              Keep me signed in
            </label>
          </div>

          {/* Sign In Button */}
          <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#005A36] text-white py-3.5 rounded-full font-semibold text-sm hover:bg-[#004428] transition-colors shadow-sm disabled:opacity-50 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
        </form>

       {/* OR Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs font-bold tracking-widest text-gray-400">
              <span className="px-3 bg-[#FCFAF6]">OR</span>
            </div>
          </div>

        {/* Social OAuth Providers */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-full hover:bg-gray-50/50 transition font-medium text-sm text-gray-800"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-full hover:bg-gray-50/50 transition font-medium text-sm text-gray-800"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z"/>
              </svg>
              <span>Apple</span>
            </button>
          </div>
          {/* Create an Account Context Link */}
          <p className="text-center text-xs text-gray-500 mt-8">
            New to Merkato?{' '}
            <a href="#" className="font-bold text-[#005A36] hover:underline">
              Create an account
            </a>
          </p>
        </div>
       </div>
  );
}