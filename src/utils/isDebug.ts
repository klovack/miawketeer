export const isDebug = () => {
  const debugParam = new URLSearchParams(window.location.search).get("debug");

  return !!debugParam || debugParam === "" || debugParam === "true";
};
