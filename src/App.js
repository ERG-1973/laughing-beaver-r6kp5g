// App.jsx
import React, { useState, useEffect } from "react";
import { FaDesktop, FaLaptop, FaChild } from "react-icons/fa";

export default function App() {
  // Usuarios almacenados en localStorage o por defecto
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("users");
    return saved
      ? JSON.parse(saved)
      : [
          { username: "docente1", password: "1234" },
          { username: "docente2", password: "abcd" },
        ];
  });

  // Espacios con iconos
  const [espacios, setEspacios] = useState(() => {
    const saved = localStorage.getItem("espacios");
    return saved
      ? JSON.parse(saved)
      : [
          { id: "sala1", nombre: "Sala de ordenadores 1", icon: "FaDesktop" },
          { id: "sala2", nombre: "Sala de ordenadores 2", icon: "FaLaptop" },
          { id: "psicomotricidad", nombre: "Psicomotricidad", icon: "FaChild" },
        ];
  });

  const iconos = { FaDesktop, FaLaptop, FaChild };

  const [reservas, setReservas] = useState(() => {
    const saved = localStorage.getItem("reservas");
    return saved ? JSON.parse(saved) : [];
  });

  // Guardar en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem("espacios", JSON.stringify(espacios));
  }, [espacios]);
  useEffect(() => {
    localStorage.setItem("reservas", JSON.stringify(reservas));
  }, [reservas]);

  // Estados para login y sesión
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Estados para nuevas reservas y gestión
  const [espacioSeleccionado, setEspacioSeleccionado] = useState("sala1");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("09:00");

  // Estados para añadir usuarios y espacios
  const [newUser, setNewUser] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEspacio, setNewEspacio] = useState("");

  // Horas disponibles de 9 a 14
  const horasDisponibles = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
  ];

  // Login básico
  const handleLogin = () => {
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );
    if (foundUser) {
      setUser(foundUser);
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  // Reservar espacio
  const reservarEspacio = () => {
    if (!fecha || !hora) return alert("Completa fecha y hora");
    const existeReserva = reservas.find(
      (r) =>
        r.espacio === espacioSeleccionado &&
        r.fecha === fecha &&
        r.hora === hora
    );
    if (existeReserva)
      return alert("Ese espacio ya está reservado en ese horario");

    const nuevaReserva = {
      espacio: espacioSeleccionado,
      fecha,
      hora,
      usuario: user.username,
    };
    setReservas([...reservas, nuevaReserva]);
    alert("Espacio reservado con éxito");
  };

  // Cancelar reserva
  const cancelarReserva = (index) => {
    const nuevaLista = reservas.filter((_, i) => i !== index);
    setReservas(nuevaLista);
  };

  // Mostrar disponibilidad de espacios para una fecha
  const disponibilidad = (fechaSeleccionada) => {
    return espacios.map(({ id, nombre }) => {
      const horasOcupadas = reservas
        .filter((r) => r.fecha === fechaSeleccionada && r.espacio === id)
        .map((r) => r.hora);
      return { id, nombre, horasOcupadas };
    });
  };

  // Añadir usuario nuevo
  const agregarUsuario = () => {
    if (!newUser || !newPassword) return alert("Completa todos los campos");
    if (users.find((u) => u.username === newUser))
      return alert("Usuario ya existe");
    setUsers([...users, { username: newUser, password: newPassword }]);
    setNewUser("");
    setNewPassword("");
    alert("Usuario añadido con éxito");
  };

  // Añadir espacio nuevo (sin icono, icono por defecto)
  const agregarEspacio = () => {
    if (!newEspacio) return alert("Introduce un nombre para el nuevo espacio");
    if (espacios.find((e) => e.nombre === newEspacio))
      return alert("Ese espacio ya existe");
    setEspacios([
      ...espacios,
      {
        id: newEspacio.toLowerCase().replace(/\s+/g, ""),
        nombre: newEspacio,
        icon: "FaDesktop",
      },
    ]);
    setNewEspacio("");
    alert("Espacio añadido con éxito");
  };

  if (!user) {
    // Pantalla login
    return (
      <div style={{ padding: 20, maxWidth: 400, margin: "auto" }}>
        <h2>Iniciar Sesión</h2>
        <input
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <input
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <button onClick={handleLogin} style={{ padding: 10, width: "100%" }}>
          Entrar
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h1>Reserva de Espacios</h1>

      <h2>Selecciona un espacio</h2>
      <div style={{ display: "flex", gap: 15, marginBottom: 20 }}>
        {espacios.map(({ id, nombre, icon }) => {
          const IconComp = iconos[icon];
          return (
            <div
              key={id}
              onClick={() => setEspacioSeleccionado(id)}
              style={{
                cursor: "pointer",
                border:
                  espacioSeleccionado === id
                    ? "3px solid #007bff"
                    : "1px solid #ccc",
                borderRadius: 8,
                padding: 10,
                textAlign: "center",
                width: 120,
              }}
            >
              {IconComp && <IconComp size={40} style={{ marginBottom: 8 }} />}
              <div>{nombre}</div>
            </div>
          );
        })}
      </div>

      <h2>Reserva</h2>
      <div style={{ marginBottom: 20 }}>
        <label>
          Fecha:{" "}
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            style={{ padding: 5, marginRight: 10 }}
          />
        </label>
        <label>
          Hora:{" "}
          <select
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            style={{ padding: 5 }}
          >
            {horasDisponibles.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={reservarEspacio}
          style={{ marginLeft: 10, padding: "5px 15px" }}
        >
          Reservar
        </button>
      </div>

      <h2>Mis Reservas</h2>
      <ul>
        {reservas
          .filter((r) => r.usuario === user.username)
          .map((r, i) => (
            <li key={i} style={{ marginBottom: 8 }}>
              {espacios.find((e) => e.id === r.espacio)?.nombre || r.espacio} -{" "}
              {r.fecha} - {r.hora}{" "}
              <button onClick={() => cancelarReserva(i)}>Cancelar</button>
            </li>
          ))}
      </ul>

      <h2>Disponibilidad para {fecha || "(selecciona fecha)"}</h2>
      {fecha ? (
        <ul>
          {disponibilidad(fecha).map(({ id, nombre, horasOcupadas }) => (
            <li key={id} style={{ marginBottom: 6 }}>
              <strong>{nombre}:</strong>{" "}
              {horasOcupadas.length > 0
                ? horasOcupadas.join(", ")
                : "Todo el día disponible"}
            </li>
          ))}
        </ul>
      ) : (
        <p>Selecciona una fecha para ver disponibilidad.</p>
      )}

      <h2>Añadir Usuario</h2>
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Nuevo usuario"
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
          style={{ padding: 5, marginRight: 5 }}
        />
        <input
          placeholder="Contraseña"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ padding: 5, marginRight: 5 }}
        />
        <button onClick={agregarUsuario}>Agregar Usuario</button>
      </div>

      <h2>Añadir Espacio</h2>
      <div>
        <input
          placeholder="Nombre del nuevo espacio"
          value={newEspacio}
          onChange={(e) => setNewEspacio(e.target.value)}
          style={{ padding: 5, marginRight: 5 }}
        />
        <button onClick={agregarEspacio}>Agregar Espacio</button>
      </div>
    </div>
  );
}
