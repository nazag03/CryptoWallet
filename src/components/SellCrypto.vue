<template>
    <div class="sell-crypto">
      <h2>Vender {{ selectedCrypto }}</h2>
      <p>Precio actual: ${{ cryptoPrice }}</p>
      <p>Saldo disponible: {{ userCryptoBalance }} {{ selectedCrypto }}</p>
      <input v-model.number="amount" type="number" placeholder="Cantidad a vender" min="0.01" step="0.01" />
      <button @click="sell">Vender</button>
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
  
      const userCryptoBalance = computed(() => store.cryptoHoldings[props.selectedCrypto] || 0);
  
      const sell = () => {
        if (amount.value > 0 && userCryptoBalance.value >= amount.value) {
          store.sellCrypto(props.selectedCrypto, amount.value, props.cryptoPrice);
          message.value = `Venta realizada: ${amount.value} ${props.selectedCrypto}`;
        } else {
          message.value = "Cantidad insuficiente o inválida";
        }
      };
  
      return { amount, sell, message, userCryptoBalance };
    }
  };
  </script>
  
  <style scoped>
  .sell-crypto {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .message {
    color: red;
  }
  </style>
  