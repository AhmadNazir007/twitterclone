// utils/logout.ts
export const logoutUser = async () => {
    const token = localStorage.getItem('token'); // or from cookie
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        throw new Error('Logout failed');
      }
      const data= res.json();
      console.log("Response", data);
  
      // Remove token after successful logout
      localStorage.removeItem('token');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };
  