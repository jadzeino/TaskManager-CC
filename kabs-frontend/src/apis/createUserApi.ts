const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
export async function createUserApi(
  name: string,
  email: string,
  password: string
) {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      throw new Error("User creation failed. Please try again.");
    }

    const userFromServer = await response.json();
    return {
      id: userFromServer.userId,
      username: userFromServer.name,
    };
  } catch (error) {
    console.error("Error during user creation:", error);
    throw error;
  }
}
