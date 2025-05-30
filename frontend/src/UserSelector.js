const users = ['Juan', 'María', 'Pedro', 'Lucía'];

function UserSelector({ onSelectUser }) {
  return (
    <div className="container py-4">
      <div className="card p-3">
        <h4 className="mb-3 text-center">Selecciona tu nombre</h4>
        <select
          className="form-select"
          onChange={(e) => onSelectUser(e.target.value)}
        >
          <option value="">-- Seleccionar --</option>
          {users.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default UserSelector;
