export const login = async (email, password) => {
    try {
      const response = await fetch("https://localhost:443/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        throw new Error("Login failed");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };
  
  export const signUp = async (nickname, email, password) => {
    try {
      const response = await fetch("https://localhost:443/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, email, password }),
      });
  
      if (!response.ok) {
        throw new Error("Sign up failed");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error during sign-up:", error);
      throw error;
    }
  };

  export const logout = async (token) => {
    try {
      const response = await fetch("https://localhost:443/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Переконайтеся, що токен передається тут
        },
      });
  
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      return response.json();
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };
  