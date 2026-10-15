export default function Mark({ small = false }) {
  return (
    <span className={`mark ${small ? 'mark--small' : ''}`}>
      <span className="mark__glyph" aria-hidden="true">
        T
      </span>
      <span className="mark__word">Threadé</span>
    </span>
  );
}
