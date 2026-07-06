// LocalStorage Database Manager for QuitoHampi

const KEYS = {
  USERS: 'quitohampi_users',
  SPECIALTIES: 'quitohampi_specialties',
  SUGGESTED_SPECIALTIES: 'quitohampi_suggested_specialties',
  REVIEWS: 'quitohampi_reviews',
  APPOINTMENTS: 'quitohampi_appointments',
  REST_DAYS: 'quitohampi_rest_days',
  BLOCKED_IPS: 'quitohampi_blocked_ips' // to handle 5min login block
};

const defaultSpecialties = [
  { id: 1, name: 'Medicina general', status: 'Activo', createdAt: '2026-01-10' },
  { id: 2, name: 'Pediatría', status: 'Activo', createdAt: '2026-01-12' },
  { id: 3, name: 'Psicología', status: 'Activo', createdAt: '2026-01-15' },
  { id: 4, name: 'Dermatología', status: 'Activo', createdAt: '2026-01-20' },
  { id: 5, name: 'Cardiología', status: 'Activo', createdAt: '2026-02-01' },
  { id: 6, name: 'Traumatología', status: 'Activo', createdAt: '2026-02-05' }
];

const defaultSuggestedSpecialties = [
  { id: 1, name: 'Neurología', doctorName: 'Dr. Roberto Dávila', date: '2026-06-25' },
  { id: 2, name: 'Ginecología', doctorName: 'Dra. Patricia Ortiz', date: '2026-06-28' }
];

const defaultUsers = [
  // Admin
  {
    email: 'admin@quitohampi.com',
    password: 'admin123',
    role: 'admin',
    nombre: 'Administrador',
    apellido: 'General',
    estado: 'Activo'
  },
  // Doctors
  {
    email: 'doctor@quitohampi.com',
    password: 'doctor123',
    role: 'medico',
    nombre: 'Juan',
    apellido: 'Pérez',
    especialidad: 'Cardiología',
    estado: 'Verificado',
    telefono: '0984969316',
    edad: 45,
    foto: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150',
    titulos: 'Médico Cirujano - Universidad Central',
    certificaciones: 'Especialista en Cardiología - UTE',
    fechaRegistro: '2026-05-10',
    direccion: 'Av. Amazonas y República, Edificio Médico, Of. 304',
    lat: -0.1850,
    lng: -78.4800,
    documentos: [
      { name: 'titulo_medico.pdf', size: '2.4 MB', type: 'application/pdf' },
      { name: 'registro_senescyt.pdf', size: '1.8 MB', type: 'application/pdf' }
    ]
  },
  {
    email: 'pediatra@quitohampi.com',
    password: 'doctor123',
    role: 'medico',
    nombre: 'María',
    apellido: 'Gómez',
    especialidad: 'Pediatría',
    estado: 'Verificado',
    telefono: '0991234567',
    edad: 38,
    foto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
    titulos: 'Doctora en Medicina - USFQ',
    certificaciones: 'Pediatría Clínica - Universidad de Barcelona',
    fechaRegistro: '2026-06-28',
    direccion: 'Av. 6 de Diciembre y Colón, Consultorio 205',
    lat: -0.1750,
    lng: -78.4600,
    documentos: [
      { name: 'titulo_pediatria.pdf', size: '2.9 MB', type: 'application/pdf' },
      { name: 'certificado_practica.png', size: '950 KB', type: 'image/png' }
    ]
  },
  {
    email: 'dermatologo@quitohampi.com',
    password: 'doctor123',
    role: 'medico',
    nombre: 'Roberto',
    apellido: 'Dávila',
    especialidad: 'Dermatología',
    estado: 'Verificado',
    telefono: '0987654321',
    edad: 50,
    foto: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150',
    titulos: 'Médico Cirujano - PUCE',
    certificaciones: 'Dermatología Clínica - Hospital Vozandes',
    fechaRegistro: '2026-04-15',
    direccion: 'Av. González Suárez N27-45, Consultorio 101',
    lat: -0.1900,
    lng: -78.4900,
    documentos: [
      { name: 'titulo_dermatologia.pdf', size: '1.5 MB', type: 'application/pdf' }
    ]
  },
  {
    email: 'psicologo@quitohampi.com',
    password: 'doctor123',
    role: 'medico',
    nombre: 'Ana',
    apellido: 'Vallejo',
    especialidad: 'Psicología',
    estado: 'Verificado',
    telefono: '0976543210',
    edad: 42,
    foto: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150',
    titulos: 'Licenciada en Psicología - UCE',
    certificaciones: 'Psicología Clínica - Máster USFQ',
    fechaRegistro: '2026-03-20',
    direccion: 'Av. Eloy Alfaro y 10 de Agosto, Edif. Galerías, Of. 508',
    lat: -0.1700,
    lng: -78.4700,
    documentos: [
      { name: 'titulo_psicologia.pdf', size: '2.1 MB', type: 'application/pdf' },
      { name: 'certificado_maestria.pdf', size: '1.2 MB', type: 'application/pdf' }
    ]
  },
  {
    email: 'pendiente@quitohampi.com',
    password: 'doctor123',
    role: 'medico',
    nombre: 'Pedro',
    apellido: 'Ramos',
    especialidad: 'Medicina general',
    estado: 'Pendiente',
    telefono: '0991234567',
    edad: 35,
    foto: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
    titulos: 'Médico General - UDLA',
    certificaciones: 'Atención Primaria - MSP',
    fechaRegistro: '2026-06-28',
    direccion: 'Av. América y Mariana de Jesús',
    lat: -0.1950,
    lng: -78.4850,
    documentos: [
      { name: 'titulo_medicina.pdf', size: '2.9 MB', type: 'application/pdf' },
      { name: 'certificado_practica.png', size: '950 KB', type: 'image/png' }
    ]
  },
  // Patients
  {
    email: 'paciente@quitohampi.com',
    password: 'paciente123',
    role: 'paciente',
    nombre: 'Carlos',
    apellido: 'Sánchez',
    telefono: '0987654321',
    fechaRegistro: '2026-06-01',
    estado: 'Activo'
  },
  {
    email: 'ana@correo.com',
    password: 'paciente123',
    role: 'paciente',
    nombre: 'Ana',
    apellido: 'Mendoza',
    telefono: '0999888777',
    fechaRegistro: '2026-06-10',
    estado: 'Bloqueado'
  }
];

const defaultReviews = [
  {
    id: 1,
    patientName: 'Carlos Sánchez',
    patientEmail: 'paciente@quitohampi.com',
    doctorName: 'Dr. Juan Pérez',
    doctorEmail: 'doctor@quitohampi.com',
    stars: 5,
    comment: 'Excelente atención, muy profesional y puntual en la videoconsulta.',
    date: '2026-06-15',
    status: 'Visible'
  },
  {
    id: 2,
    patientName: 'Ana Mendoza',
    patientEmail: 'ana@correo.com',
    doctorName: 'Dr. Juan Pérez',
    doctorEmail: 'doctor@quitohampi.com',
    stars: 1,
    comment: 'SPAM: ¡Gana dinero desde casa fácil! Ingresa a www.spam-medicinas.com y compra hoy.',
    date: '2026-06-18',
    status: 'Visible'
  },
  {
    id: 3,
    patientName: 'Carlos Sánchez',
    patientEmail: 'paciente@quitohampi.com',
    doctorName: 'Dr. Juan Pérez',
    doctorEmail: 'doctor@quitohampi.com',
    stars: 2,
    comment: 'La videoconsulta se cortaba constantemente y fue difícil entender las indicaciones.',
    date: '2026-06-20',
    status: 'Visible'
  }
];

const defaultAppointments = [
  { id: 1, doctorEmail: 'doctor@quitohampi.com', patientName: 'Carlos Sánchez', patientEmail: 'paciente@quitohampi.com', date: '2026-07-10', time: '09:00', specialty: 'Cardiología', type: 'presencial', status: 'confirmada' },
  { id: 2, doctorEmail: 'doctor@quitohampi.com', patientName: 'Ana Mendoza', patientEmail: 'ana@correo.com', date: '2026-07-08', time: '11:00', specialty: 'Cardiología', type: 'virtual', status: 'confirmada' },
  { id: 3, doctorEmail: 'doctor@quitohampi.com', patientName: 'Carlos Sánchez', patientEmail: 'paciente@quitohampi.com', date: '2026-06-30', time: '14:00', specialty: 'Cardiología', type: 'presencial', status: 'realizada' },
  { id: 4, doctorEmail: 'doctor@quitohampi.com', patientName: 'Carlos Sánchez', patientEmail: 'paciente@quitohampi.com', date: '2026-06-25', time: '10:00', specialty: 'Cardiología', type: 'virtual', status: 'cancelada' },
  { id: 5, doctorEmail: 'pediatra@quitohampi.com', patientName: 'Carlos Sánchez', patientEmail: 'paciente@quitohampi.com', date: '2026-07-15', time: '09:00', specialty: 'Pediatría', type: 'presencial', status: 'confirmada' },
  { id: 6, doctorEmail: 'dermatologo@quitohampi.com', patientName: 'Carlos Sánchez', patientEmail: 'paciente@quitohampi.com', date: '2026-06-28', time: '11:00', specialty: 'Dermatología', type: 'virtual', status: 'realizada' }
];

const defaultRestDays = [
  { doctorEmail: 'doctor@quitohampi.com', day: 'Miércoles' }
];

export const db = {
  init() {
    if (!localStorage.getItem(KEYS.USERS)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(defaultUsers));
    }
    if (!localStorage.getItem(KEYS.SPECIALTIES)) {
      localStorage.setItem(KEYS.SPECIALTIES, JSON.stringify(defaultSpecialties));
    }
    if (!localStorage.getItem(KEYS.SUGGESTED_SPECIALTIES)) {
      localStorage.setItem(KEYS.SUGGESTED_SPECIALTIES, JSON.stringify(defaultSuggestedSpecialties));
    }
    if (!localStorage.getItem(KEYS.REVIEWS)) {
      localStorage.setItem(KEYS.REVIEWS, JSON.stringify(defaultReviews));
    }
    if (!localStorage.getItem(KEYS.APPOINTMENTS)) {
      localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(defaultAppointments));
    }
    if (!localStorage.getItem(KEYS.REST_DAYS)) {
      localStorage.setItem(KEYS.REST_DAYS, JSON.stringify(defaultRestDays));
    }
  },

  // --- USERS ---
  getUsers() {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.USERS)) || [];
  },

  saveUsers(users) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  getUserByEmail(email) {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  addUser(user) {
    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
      return { success: false, message: 'El correo ya está registrado' };
    }
    users.push(user);
    this.saveUsers(users);
    return { success: true };
  },

  updateUser(email, updatedData) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedData };
      this.saveUsers(users);
      return { success: true };
    }
    return { success: false, message: 'Usuario no encontrado' };
  },

  deleteUser(email) {
    let users = this.getUsers();
    users = users.filter(u => u.email.toLowerCase() !== email.toLowerCase());
    this.saveUsers(users);
    return { success: true };
  },

  // --- SPECIALTIES ---
  getSpecialties() {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.SPECIALTIES)) || [];
  },

  saveSpecialties(specialties) {
    localStorage.setItem(KEYS.SPECIALTIES, JSON.stringify(specialties));
  },

  addSpecialty(name) {
    const specialties = this.getSpecialties();
    if (specialties.some(s => s.name.toLowerCase() === name.toLowerCase())) {
      return { success: false, message: 'La especialidad ya existe' };
    }
    const newSpecialty = {
      id: Date.now(),
      name,
      status: 'Activo',
      createdAt: new Date().toISOString().split('T')[0]
    };
    specialties.push(newSpecialty);
    this.saveSpecialties(specialties);
    return { success: true, specialty: newSpecialty };
  },

  updateSpecialty(id, name) {
    const specialties = this.getSpecialties();
    const index = specialties.findIndex(s => s.id === id);
    if (index !== -1) {
      specialties[index].name = name;
      this.saveSpecialties(specialties);
      return { success: true };
    }
    return { success: false, message: 'Especialidad no encontrada' };
  },

  toggleSpecialty(id) {
    const specialties = this.getSpecialties();
    const index = specialties.findIndex(s => s.id === id);
    if (index !== -1) {
      specialties[index].status = specialties[index].status === 'Activo' ? 'Inactivo' : 'Activo';
      this.saveSpecialties(specialties);
      return { success: true, status: specialties[index].status };
    }
    return { success: false, message: 'Especialidad no encontrada' };
  },

  // --- SUGGESTED SPECIALTIES ("Otros") ---
  getSuggestedSpecialties() {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.SUGGESTED_SPECIALTIES)) || [];
  },

  saveSuggestedSpecialties(suggested) {
    localStorage.setItem(KEYS.SUGGESTED_SPECIALTIES, JSON.stringify(suggested));
  },

  addSuggestedSpecialty(name, doctorName) {
    const suggested = this.getSuggestedSpecialties();
    const newSugg = {
      id: Date.now(),
      name,
      doctorName,
      date: new Date().toISOString().split('T')[0]
    };
    suggested.push(newSugg);
    this.saveSuggestedSpecialties(suggested);
  },

  integrateSuggestedSpecialty(id) {
    const suggested = this.getSuggestedSpecialties();
    const item = suggested.find(s => s.id === id);
    if (item) {
      const res = this.addSpecialty(item.name);
      if (res.success) {
        this.saveSuggestedSpecialties(suggested.filter(s => s.id !== id));
        return { success: true };
      }
      return res;
    }
    return { success: false, message: 'Sugerencia no encontrada' };
  },

  // --- REVIEWS ---
  getReviews() {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.REVIEWS)) || [];
  },

  saveReviews(reviews) {
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));
  },

  updateReviewStatus(id, status) {
    const reviews = this.getReviews();
    const index = reviews.findIndex(r => r.id === id);
    if (index !== -1) {
      reviews[index].status = status;
      this.saveReviews(reviews);
      return { success: true };
    }
    return { success: false };
  },

  deleteReview(id) {
    let reviews = this.getReviews();
    reviews = reviews.filter(r => r.id !== id);
    this.saveReviews(reviews);
    return { success: true };
  },

  // --- APPOINTMENTS & CALENDAR ---
  getAppointments() {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.APPOINTMENTS)) || [];
  },

  saveAppointments(appointments) {
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(appointments));
  },

  getRestDays() {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.REST_DAYS)) || [];
  },

  saveRestDays(restDays) {
    localStorage.setItem(KEYS.REST_DAYS, JSON.stringify(restDays));
  },

  getDoctorRestDays(doctorEmail) {
    return this.getRestDays()
      .filter(d => d.doctorEmail.toLowerCase() === doctorEmail.toLowerCase())
      .map(d => d.day);
  },

  setRestDay(doctorEmail, day) {
    const restDays = this.getRestDays();
    if (!restDays.some(r => r.doctorEmail.toLowerCase() === doctorEmail.toLowerCase() && r.day === day)) {
      restDays.push({ doctorEmail, day });
      this.saveRestDays(restDays);
    }
    // Cancel all appointments for this doctor on this day
    let appointments = this.getAppointments();
    appointments = appointments.filter(a => !(a.doctorEmail.toLowerCase() === doctorEmail.toLowerCase() && a.day === day));
    this.saveAppointments(appointments);
    return { success: true };
  },

  removeRestDay(doctorEmail, day) {
    let restDays = this.getRestDays();
    restDays = restDays.filter(r => !(r.doctorEmail.toLowerCase() === doctorEmail.toLowerCase() && r.day === day));
    this.saveRestDays(restDays);
    return { success: true };
  },

  cancelAppointment(id) {
    let appointments = this.getAppointments();
    appointments = appointments.filter(a => a.id !== id);
    this.saveAppointments(appointments);
    return { success: true };
  },

  bookAppointment(appointment) {
    const appointments = this.getAppointments();
    const id = Date.now();
    appointments.push({ id, ...appointment });
    this.saveAppointments(appointments);
    return { success: true, id };
  },

  // --- DOCTORS ---
  getDoctors() {
    return this.getUsers().filter(u => u.role === 'medico');
  },

  getVerifiedDoctors() {
    return this.getDoctors().filter(u => u.estado === 'Verificado');
  },

  getDoctorByEmail(email) {
    return this.getDoctors().find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  // --- APPOINTMENTS FOR PATIENT VIEW ---
  getPatientAppointments(patientEmail) {
    return this.getAppointments().filter(a => a.patientEmail.toLowerCase() === patientEmail.toLowerCase());
  },

  // --- REVIEWS FOR A SPECIFIC DOCTOR ---
  getDoctorReviews(doctorEmail) {
    return this.getReviews().filter(r => r.doctorEmail.toLowerCase() === doctorEmail.toLowerCase() && r.status === 'Visible');
  },

  getDoctorAverageStars(doctorEmail) {
    const reviews = this.getDoctorReviews(doctorEmail);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.stars, 0);
    return (sum / reviews.length).toFixed(1);
  },

  addReview(review) {
    const reviews = this.getReviews();
    const newReview = { id: Date.now(), ...review, date: new Date().toISOString().split('T')[0], status: 'Visible' };
    reviews.push(newReview);
    this.saveReviews(reviews);
    return { success: true };
  },

  // --- LOGIN LOCK-OUT MANAGER ---
  getLoginAttempts(ipOrEmail) {
    const attempts = JSON.parse(localStorage.getItem(`attempts_${ipOrEmail}`)) || { count: 0, blockUntil: null };
    if (attempts.blockUntil && new Date().getTime() > attempts.blockUntil) {
      attempts.count = 0;
      attempts.blockUntil = null;
      localStorage.setItem(`attempts_${ipOrEmail}`, JSON.stringify(attempts));
    }
    return attempts;
  },

  recordFailedAttempt(ipOrEmail) {
    const attempts = this.getLoginAttempts(ipOrEmail);
    attempts.count += 1;
    if (attempts.count >= 3) {
      attempts.blockUntil = new Date().getTime() + 5 * 60 * 1000; // 5 minutes block
    }
    localStorage.setItem(`attempts_${ipOrEmail}`, JSON.stringify(attempts));
    return attempts;
  },

  resetFailedAttempts(ipOrEmail) {
    localStorage.removeItem(`attempts_${ipOrEmail}`);
  }
};
