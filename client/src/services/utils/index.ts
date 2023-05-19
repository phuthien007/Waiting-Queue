export const serveImage = (fileName: string) => {
  return process.env.NODE_ENV === "development"
    ? `http://localhost:5000/${fileName}`
    : `/images/${fileName}`;
};
