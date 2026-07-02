import { Routes, Route } from "react-router"
import Landing from "./pages/Landing"
import Services from "./pages/Services"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Recuperar from "./pages/Recuperar"
import DoctorProfile from "./pages/DoctorProfile"
import BookAppointment from "./pages/BookAppointment"
import PatientHistory from "./pages/PatientHistory"
import PatientPanel from "./pages/PatientPanel"
import PatientSearch from "./pages/PatientSearch"
import PatientCitas from "./pages/PatientCitas"
import PatientProfile from "./pages/PatientProfile"
import PatientAppointment from "./pages/PatientAppointment"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing/>}/>
      <Route path="/servicios" element={<Services/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/registro" element={<Register/>}/>
      <Route path="/recuperar" element={<Recuperar/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/doctor/:id" element={<DoctorProfile/>}/>
      <Route path="/agendar/:doctorId" element={<BookAppointment/>}/>
      <Route path="/mis-citas" element={<PatientHistory/>}/>
      <Route path="/panel-paciente" element={<PatientPanel/>}>
        <Route path="buscar" element={<PatientSearch/>}/>
        <Route path="citas" element={<PatientCitas/>}/>
        <Route path="perfil" element={<PatientProfile/>}/>
        <Route path="agendar/:doctorId" element={<PatientAppointment/>}/>
      </Route>
    </Routes>
  )
}

export default App
