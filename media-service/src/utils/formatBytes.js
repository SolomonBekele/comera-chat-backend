export const formatBytes = (bytes, decimals = 2) => {
  if (!bytes || bytes === "0") return "0 Bytes";

  const size = typeof bytes === "string" ? Number(bytes) : bytes;
  if (isNaN(size)) return "Invalid size";

  const k = 1024;
  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(size) / Math.log(k));

  return `${parseFloat((size / Math.pow(k, i)).toFixed(decimals))} ${units[i]}`;
};
