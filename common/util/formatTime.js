export const formatLastSeen=(dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const now = new Date();

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  function formatTime(d) {
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return h + ":" + m + " " + ampm;
  }

  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const sameYear = date.getFullYear() === now.getFullYear();

  // ✅ Today → 5:50 PM
  if (sameDay) {
    return formatTime(date);
  }

  // ✅ Same year (ANY date) → Dec 10 at 5:50 PM
  if (sameYear) {
    return (
      months[date.getMonth()] +
      " " +
      date.getDate() +
      " at " +
      formatTime(date)
    );
  }

  // ✅ Different year → 05.08.24 at 10:21 PM
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  return day + "." + month + "." + year + " at " + formatTime(date);
}

export const formatTimeAgo = (date) =>{
      const ms = Date.now() - new Date(date).getTime();

      const minutes = Math.floor(ms / (1000 * 60));
      const hours = Math.floor(ms / (1000 * 60 * 60));
      const days = Math.floor(ms / (1000 * 60 * 60 * 24));
      const weeks = Math.floor(days / 7);
      const months = Math.floor(days / 30);
      const years = Math.floor(days / 365);

      if (minutes < 1) return `just now`;
      if (minutes < 60) return `${minutes} min`;
      if (hours < 24) return `${hours} hr`;
      if (days < 7) return `${days} day`;
      if (weeks < 4) return `${weeks} week`;
      if (months < 12) return `${months} month`;
      return `${years} year`;
    }