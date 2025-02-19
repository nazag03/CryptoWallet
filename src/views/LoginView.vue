<template>
  <div class="login-container">
    <h2>{{ isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión' }}</h2>
    <LoginForm :isRegistering="isRegistering" @submitForm="handleSubmit" />
    <p @click="toggleMode" class="toggle">
      {{ isRegistering ? '¿Ya tienes una cuenta? Iniciar sesión' : '¿No tienes cuenta? Regístrate' }}
    </p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import LoginForm from '@/components/LoginForm.vue';
// Importa tu store de Pinia
import { useWalletStore } from '@/store/useWalletStore';

export default {
  components: { LoginForm },
  setup() {
    const router = useRouter();
    const isRegistering = ref(false);
    const walletStore = useWalletStore(); // Aquí tienes acceso a los métodos y estado de tu store

    const handleSubmit = (data) => {
      if (isRegistering.value) {
        // REGISTRO DE USUARIO
        if (data.password !== data.confirmPassword) {
          alert('Las contraseñas no coinciden');
          return;
        }
        const newUserId = crypto.randomUUID();
        const user = { email: data.email, password: data.password, userId: newUserId };
        localStorage.setItem(newUserId, JSON.stringify(user));
        alert(`Registro exitoso. Tu ID es: ${newUserId}`);
        isRegistering.value = false;
      } else {
        // INICIO DE SESIÓN
        const storedUser = localStorage.getItem(data.userId);
        if (storedUser) {
          // 1) Decirle al store cuál es el usuario actual
          walletStore.setUser(data.userId); 
          // 2) Redirigir a la vista principal (TradeView, por ejemplo)
          router.push('/TradeView');
        } else {
          alert('ID inválido');
        }
      }
    };

    const toggleMode = () => {
      isRegistering.value = !isRegistering.value;
    };
    
    return { isRegistering, handleSubmit, toggleMode };
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
}
.toggle {
  color: #007bff;
  cursor: pointer;
}
</style>
