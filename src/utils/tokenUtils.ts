export const getTokens = () => {
  try {
    const stored = localStorage.getItem("auth-storage");
    if (!stored) return { accessToken: null, refreshToken: null };

    const parsed = JSON.parse(stored);
    const state = parsed?.state ?? {};

    return {
      accessToken: state.accessToken ?? null,
      refreshToken: state.refreshToken ?? null,
    };
  } catch (err) {
    console.error("Error parsing auth-storage:", err);
    return { accessToken: null, refreshToken: null };
  }
};

export const getUserName = () => {
  try {
    const stored = localStorage.getItem("auth-storage");
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    const state = parsed?.state ?? {};

    const name = state.user?.name ?? "";
    const formatted = name
      .split(" ")
      .map((word: string) =>
        word.length > 0
          ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          : ""
      )
      .join(" ");

    return formatted || null;
  } catch (err) {
    console.error("Error parsing auth-storage:", err);
    return null;
  }
};

export const saveTokens = (access: string, refresh: string) => {
  try {
    const stored = localStorage.getItem("auth-storage");
    const parsed = stored ? JSON.parse(stored) : { state: {} };

    parsed.state.accessToken = access;
    parsed.state.refreshToken = refresh;

    localStorage.setItem("auth-storage", JSON.stringify(parsed));
  } catch (err) {
    console.error("Error saving tokens:", err);
  }
};

export const clearTokens = () => {
  try {
    const stored = localStorage.getItem("auth-storage");
    if (!stored) return;

    const parsed = JSON.parse(stored);
    delete parsed.state.accessToken;
    delete parsed.state.refreshToken;

    localStorage.setItem("auth-storage", JSON.stringify(parsed));
  } catch (err) {
    console.error("Error clearing tokens:", err);
  }
};
