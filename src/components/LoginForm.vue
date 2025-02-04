<template>
    <form @submit.prevent="submitForm">
      <div v-if="isRegistering">
        <input v-model="email" type="email" placeholder="Correo electrónico" required />
        <input v-model="password" type="password" placeholder="Contraseña" required />
        <input v-model="confirmPassword" type="password" placeholder="Confirmar contraseña" required />
      </div>
      <div v-else>
        <input v-model="userId" type="text" placeholder="ID de usuario" required />
      </div>
      <button type="submit">{{ isRegistering ? 'Registrarse' : 'Iniciar Sesión' }}</button>
    </form>
  </template>
  
  <script>
  import { ref, defineProps, defineEmits } from 'vue';
  
  export default {
    props: {
      isRegistering: Boolean
    },
    setup(props, { emit }) {
      const email = ref('');
      const password = ref('');
      const confirmPassword = ref('');
      const userId = ref('');
      
      const submitForm = () => {
        emit('submitForm', {
          email: email.value,
          password: password.value,
          confirmPassword: confirmPassword.value,
          userId: userId.value
        });
      };
  
      return { email, password, confirmPassword, userId, submitForm };
    }
  };
  </script>
  
  <style scoped>
  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  button {
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  </style>
  