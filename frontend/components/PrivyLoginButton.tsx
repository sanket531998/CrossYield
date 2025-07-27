// components/PrivyLoginButton.tsx
"use client";

import { usePrivy, useLogin } from "@privy-io/react-auth";

const PrivyLoginButton = () => {
  const { ready, authenticated, logout } = usePrivy();
  const { login } = useLogin();

  if (!ready)
    return (
      <button className="bg-gray-700 px-4 py-1 rounded" disabled>
        Loading...
      </button>
    );

  return authenticated ? (
    <button
      onClick={logout}
      className="bg-red-600 hover:bg-red-500 text-white px-4 py-1 rounded-lg"
    >
      Logout
    </button>
  ) : (
    <button
      onClick={login}
      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1 rounded-lg text-lg font-semibold "
    >
      Connect & Start Yielding 🚀
    </button>
  );
};

export default PrivyLoginButton;
