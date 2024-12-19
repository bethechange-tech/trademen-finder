export const logout = async () => {
  await fetch("/api/logout", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
