<template>
    <div class="buy-crypto">
      <h2>Comprar {{ selectedCrypto }}</h2>
      <p>Precio actual: ${{ cryptoPrice }}</p>
      <input v-model.number="amount" type="number" placeholder="Cantidad a comprar" min="0.01" step="0.01" />
      <button @click="buy">Comprar</button>
      <p v-if="message" class="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useWalletStore } from '../store/useWalletStore';
  
  export default {
    props: {
      selectedCrypto: String,
      cryptoPrice: Number
    },
    setup(props) {
      const store = useWalletStore();
      const amount = ref(0);
      const message = ref('');
  
      const buy = () => {
        if (amount.value > 0 && store.balance >= amount.value * props.cryptoPrice) {
          store.buyCrypto(props.selectedCrypto, amount.value, props.cryptoPrice);
          message.value = `Compra realizada: ${amount.value} ${props.selectedCrypto}`;
        } else {
          message.value = "Fondos insuficientes o cantidad inválida";
        }
      };
  
      return { amount, buy, message };
    }
  };
  </script>
  
  <style scoped>
  .buy-crypto {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .message {
    color: green;
  }
  </style>
  