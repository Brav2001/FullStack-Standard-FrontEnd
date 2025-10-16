# 💳 Puntored Frontend

Interfaz moderna y responsiva para la plataforma **Puntored**, desarrollada con **React + Vite + TailwindCSS + Zustand + ShadCN UI + Framer Motion**.  
Permite gestionar pagos, credenciales de proveedores, visualizar estadísticas y manejar notificaciones en tiempo real.

---

## 🚀 Características principales

✅ **Autenticación segura** con login y registro de usuarios  
✅ **Gestión de pagos**: crear, listar, ver detalles y actualizar estados en tiempo real  
✅ **Configuración de credenciales** del proveedor Puntored (usuario/contraseña)  
✅ **Estadísticas de pagos** con gráficas interactivas (Recharts)  
✅ **Notificaciones en tiempo real** mediante **Socket.IO**  
✅ **Interfaz responsiva y animada** (Framer Motion)  
✅ **Diseño elegante** con **ShadCN/UI** y **TailwindCSS**  
✅ **Integración directa con el backend NestJS** (`http://localhost:3000`)

---

## 🧩 Tecnologías principales

| Categoría       | Librería / Framework   |
| --------------- | ---------------------- |
| Frontend        | React 19, Vite         |
| Estilos         | TailwindCSS, ShadCN/UI |
| Estado global   | Zustand                |
| Animaciones     | Framer Motion          |
| Gráficas        | Recharts               |
| Notificaciones  | Sonner                 |
| Ruteo           | React Router DOM       |
| Tiempo real     | Socket.IO Client       |
| Peticiones HTTP | Axios                  |

---

## ⚙️ Configuración del entorno

Crea un archivo **.env** en la raíz del proyecto con:

```bash
VITE_API_URL=http://localhost:3000

VITE_WS_URL=ws://localhost:3000
```

---

## 🧠 Instalación y ejecución

Instala dependencias:

```bash
npm install
```

Inicia el entorno de desarrollo:

```bash
npm run dev
```

Abre en tu navegador:

```
http://localhost:5173
```

---

## 👤 Uso del sistema

### 🔐 1. Registro

Antes de iniciar sesión, debes crear un usuario desde la interfaz

Luego podrás iniciar sesión desde la interfaz con ese usuario.

---

### 💸 2. Gestión de pagos

- Crea pagos desde el botón **“Crear pago”**
- Consulta los pagos existentes
- Visualiza detalles con animaciones deslizantes
- Usa el modo móvil para experimentar el diseño responsivo

---

### ⚙️ 3. Configurar credenciales Puntored

- Abre el modal de **Configuración (⚙️)**
- Introduce tus credenciales de Puntoredaseña
- El sistema validará automáticamente tus credenciales contra el proveedor.

---

### 📊 4. Estadísticas

- Desde el botón **📈 Estadísticas**, observa métricas visuales:
  - Gráficas dinámicas con Recharts

---

### 🧭 5. Navegación

- En dispositivos móviles, el panel de pagos y el detalle se deslizan con animaciones suaves.
- Botones fijos superiores para estadísticas, configuración, creación de pago y cierre de sesión.
- Diseño totalmente **responsive** y **animado** con **Framer Motion**.

---

## 🧰 Scripts disponibles

| Comando         | Descripción                      |
| --------------- | -------------------------------- |
| `npm run dev`   | Inicia el servidor de desarrollo |
| `npm run build` | Genera el build de producción    |

---

## 👨‍💻 Autor

Desarrollado por **Brayan Acosta Vivas**  
Desarrollador Fullstack
