<template>
  <v-app theme="dark">
    <!-- 1. VISTA DE AUTENTICACIÓN (LOGIN / REGISTRO) -->
    <v-main v-if="!currentUser">
      <v-container class="fill-height d-flex align-center justify-center">
        <v-card width="420" elevation="6" class="pa-4">
          <v-card-title class="text-h5 text-center font-weight-bold mb-2">
            {{ isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión' }}
          </v-card-title>
          <v-card-subtitle class="text-center mb-4">
            Sistema de Gestión de Tickets - TI
          </v-card-subtitle>

          <v-card-text>
            <v-form @submit.prevent="handleAuth">
              <v-text-field
                v-if="isRegistering"
                v-model="authForm.name"
                label="Nombre completo"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                density="compact"
                class="mb-2"
                required
              ></v-text-field>

              <v-text-field
                v-model="authForm.email"
                label="Correo electrónico"
                type="email"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                density="compact"
                class="mb-2"
                required
              ></v-text-field>

              <v-text-field
                v-model="authForm.password"
                label="Contraseña"
                type="password"
                prepend-inner-icon="mdi-lock"
                variant="outlined"
                density="compact"
                class="mb-4"
                required
              ></v-text-field>

              <v-alert v-if="authError" type="error" variant="tonal" density="compact" class="mb-4">
                {{ authError }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="authLoading"
              >
                {{ isRegistering ? 'Registrarse' : 'Entrar' }}
              </v-btn>
            </v-form>
          </v-card-text>

          <v-divider class="my-2"></v-divider>

          <v-card-actions class="justify-center">
            <v-btn variant="text" size="small" @click="toggleAuthMode">
              {{ isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-main>

    <!-- 2. VISTA PRINCIPAL (PANEL DE TICKETS CUANDO YA INICIÓ SESIÓN) -->
    <template v-else>
      <v-app-bar color="primary" elevation="2">
        <v-app-bar-title>Sistema de Gestión de Tickets</v-app-bar-title>
        <v-spacer></v-spacer>
        
        <!-- Indicador de usuario logueado -->
        <div class="mr-4 text-caption text-grey-lighten-2 d-none d-sm-flex align-center">
          <v-icon start icon="mdi-account-circle" class="mr-1"></v-icon>
          {{ currentUser.name }} ({{ currentUser.role }})
        </div>

        <v-btn color="white" variant="elevated" prepend-icon="mdi-plus" class="mr-2" @click="dialog = true">
          Nuevo Ticket
        </v-btn>

        <v-btn icon="mdi-logout" variant="text" title="Cerrar sesión" @click="logout"></v-btn>
      </v-app-bar>

      <v-main>
        <v-container class="py-6">
          <!-- Filtros y Búsqueda -->
          <v-card elevation="2" class="mb-4 pa-4">
            <v-row dense align="center">
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="searchQuery"
                  label="Buscar por título o solicitante..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <v-select
                  v-model="filterCategory"
                  :items="['Todas', ...categories.map(c => c.name)]"
                  label="Categoría"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <v-select
                  v-model="filterStatus"
                  :items="['Todos', 'Abierto', 'En Proceso', 'Resuelto']"
                  label="Estado"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-select>
              </v-col>

              <v-col cols="12" md="2" class="text-right">
                <v-btn 
                  variant="tonal" 
                  color="secondary" 
                  prepend-icon="mdi-filter-remove"
                  block
                  @click="clearFilters"
                >
                  Limpiar
                </v-btn>
              </v-col>
            </v-row>
          </v-card>

          <!-- Tabla de Incidencias -->
          <v-card elevation="3">
            <v-card-title class="d-flex align-center justify-space-between">
              <span>Listado de Incidencias ({{ filteredTickets.length }})</span>
              <v-btn icon="mdi-refresh" variant="text" @click="fetchTickets" :loading="loading"></v-btn>
            </v-card-title>

            <v-table>
              <thead>
                <tr>
                  <th class="text-left">ID</th>
                  <th class="text-left">Título</th>
                  <th class="text-left">Categoría</th>
                  <th class="text-left">Reportado por</th>
                  <th class="text-left">Prioridad</th>
                  <th class="text-left">Estado</th>
                  <th class="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredTickets.length === 0">
                  <td colspan="7" class="text-center py-6 text-grey">
                    No se encontraron tickets con los filtros aplicados.
                  </td>
                </tr>
                <tr v-for="ticket in filteredTickets" :key="ticket.id">
                  <td>#{{ ticket.id }}</td>
                  <td>
                    <div class="font-weight-bold">{{ ticket.title }}</div>
                    <div class="text-caption text-grey">{{ ticket.description }}</div>
                  </td>
                  <td>
                    <v-chip size="small" variant="outlined">
                      {{ ticket.category ? ticket.category.name : 'Sin categoría' }}
                    </v-chip>
                  </td>
                  <td>{{ ticket.reportedBy }}</td>
                  <td>
                    <v-chip size="small" :color="priorityColor(ticket.priority)">
                      {{ ticket.priority }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip size="small" :color="statusColor(ticket.status)">
                      {{ ticket.status }}
                    </v-chip>
                  </td>
                  <td class="text-center">
                    <v-btn 
                      v-if="ticket.status !== 'Resuelto'"
                      icon="mdi-check" 
                      size="small" 
                      color="success" 
                      variant="text" 
                      title="Marcar como resuelto"
                      @click="resolveTicket(ticket.id)"
                    ></v-btn>
                    <v-btn 
                      icon="mdi-delete" 
                      size="small" 
                      color="error" 
                      variant="text" 
                      title="Eliminar ticket"
                      @click="deleteTicket(ticket.id)"
                    ></v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-container>
      </v-main>

      <!-- Modal para Crear Ticket -->
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>Crear Nuevo Ticket</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="saveTicket">
              <v-text-field v-model="form.title" label="Título del problema" required></v-text-field>
              <v-textarea v-model="form.description" label="Descripción detallada" rows="3" required></v-textarea>
              <v-text-field v-model="form.reportedBy" label="Nombre del solicitante" required></v-text-field>
              
              <v-select
                v-model="form.categoryId"
                :items="categories"
                item-title="name"
                item-value="id"
                label="Categoría"
                required
              ></v-select>

              <v-select
                v-model="form.priority"
                :items="['Baja', 'Media', 'Alta']"
                label="Prioridad"
                required
              ></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
            <v-btn color="primary" variant="elevated" :loading="saving" @click="saveTicket">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from './services/api';

// Estado de Autenticación
const currentUser = ref(null);
const isRegistering = ref(false);
const authLoading = ref(false);
const authError = ref('');
const authForm = ref({
  name: '',
  email: '',
  password: ''
});

// Estado de Tickets y Categorías
const tickets = ref([]);
const categories = ref([]);
const loading = ref(false);
const saving = ref(false);
const dialog = ref(false);

const searchQuery = ref('');
const filterCategory = ref('Todas');
const filterStatus = ref('Todos');

const form = ref({
  title: '',
  description: '',
  reportedBy: '',
  categoryId: null,
  priority: 'Media'
});

// Cambiar entre modo Login y modo Registro
const toggleAuthMode = () => {
  isRegistering.value = !isRegistering.value;
  authError.value = '';
};

// Manejar Login y Registro
const handleAuth = async () => {
  authError.value = '';
  authLoading.value = true;
  try {
    if (isRegistering.value) {
      await api.post('/auth/register', authForm.value);
      alert('Cuenta creada exitosamente. Ahora puedes iniciar sesión.');
      isRegistering.value = false;
      authForm.value.password = '';
    } else {
      const res = await api.post('/auth/login', {
        email: authForm.value.email,
        password: authForm.value.password
      });
      currentUser.value = res.data.user;
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);

      // Cargar datos del panel
      await fetchCategories();
      await fetchTickets();
    }
  } catch (error) {
    authError.value = error.response?.data?.error || 'Error al autenticar';
  } finally {
    authLoading.value = false;
  }
};

const logout = () => {
  currentUser.value = null;
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  tickets.value = [];
};

// Filtros reactivos
const filteredTickets = computed(() => {
  return tickets.value.filter(ticket => {
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      ticket.reportedBy.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesCategory = 
      filterCategory.value === 'Todas' || 
      (ticket.category && ticket.category.name === filterCategory.value);

    const matchesStatus = 
      filterStatus.value === 'Todos' || 
      ticket.status === filterStatus.value;

    return matchesSearch && matchesCategory && matchesStatus;
  });
});

const clearFilters = () => {
  searchQuery.value = '';
  filterCategory.value = 'Todas';
  filterStatus.value = 'Todos';
};

const fetchCategories = async () => {
  try {
    const res = await api.get('/categories');
    categories.value = res.data;
  } catch (error) {
    console.error('Error cargando categorías:', error);
  }
};

const fetchTickets = async () => {
  loading.value = true;
  try {
    const res = await api.get('/tickets');
    tickets.value = res.data;
  } catch (error) {
    console.error('Error cargando tickets:', error);
  } finally {
    loading.value = false;
  }
};

const saveTicket = async () => {
  if (!form.value.title || !form.value.description || !form.value.categoryId || !form.value.reportedBy) {
    alert('Completa todos los campos obligatorios');
    return;
  }

  saving.value = true;
  try {
    await api.post('/tickets', form.value);
    dialog.value = false;
    form.value = { title: '', description: '', reportedBy: '', categoryId: null, priority: 'Media' };
    await fetchTickets();
  } catch (error) {
    console.error('Error guardando ticket:', error);
  } finally {
    saving.value = false;
  }
};

const resolveTicket = async (id) => {
  try {
    await api.put(`/tickets/${id}`, { status: 'Resuelto' });
    await fetchTickets();
  } catch (error) {
    console.error('Error resolviendo ticket:', error);
  }
};

const deleteTicket = async (id) => {
  if (!confirm('¿Seguro que deseas eliminar este ticket?')) return;
  try {
    await api.delete(`/tickets/${id}`);
    await fetchTickets();
  } catch (error) {
    console.error('Error eliminando ticket:', error);
  }
};

const priorityColor = (priority) => {
  if (priority === 'Alta') return 'error';
  if (priority === 'Media') return 'warning';
  return 'info';
};

const statusColor = (status) => {
  if (status === 'Resuelto') return 'success';
  if (status === 'En Proceso') return 'info';
  return 'secondary';
};

onMounted(() => {
  // Mantener sesión si el usuario ya se había logueado
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    currentUser.value = JSON.parse(savedUser);
    fetchCategories();
    fetchTickets();
  }
});
</script>