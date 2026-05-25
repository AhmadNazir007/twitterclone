// utils/logout.ts
export const logoutUser = async () => {
  const token = localStorage.getItem('token');

  const clearSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (!process.env.NEXT_PUBLIC_API_URL || !token) {
    clearSession();
    return true;
  }

  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    // The local session should still be cleared if the API is unreachable.
  } finally {
    clearSession();
  }

  return true;
};
