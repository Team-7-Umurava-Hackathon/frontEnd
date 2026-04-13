export const DUMMY_USER = {
  email: "admin@umurava.com",
  password: "password123",
  name: "Clement Rugwiro",
  role: "Recruiter",
  avatar: "CR",
};

export function login(email: string, password: string): boolean {
  if (email === DUMMY_USER.email && password === DUMMY_USER.password) {
    localStorage.setItem("user", JSON.stringify(DUMMY_USER));
    document.cookie = "user=true; path=/; max-age=86400";
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem("user");
  document.cookie = "user=; path=/; max-age=0";
}

export function getUser() {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("user");
}