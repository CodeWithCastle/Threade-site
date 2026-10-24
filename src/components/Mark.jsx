// The Threadé logo and wordmark. The icon is the business app's own (public/logo192.png,
// the same file as app.threade.app's logo192.png and favicon); the text is the business
// app's wordmark: "Threadé", 22px, 700, -0.01em.
export default function Mark() {
  return (
    <span className="mark">
      <img className="mark__icon" src="/logo192.png" alt="" width="28" height="28" aria-hidden="true" />
      <span className="mark__word">Threadé</span>
    </span>
  );
}
