<template>
  <div id="app">
    <div class="header">
      <h1>Welcome to Merlin Channel</h1>
      <MetaMaskConnect />
    </div>
  </div>
</template>

<script>
import MetaMaskConnect from './MetaMaskConnect.vue';

export default {
  name: 'App',
  components: {
    MetaMaskConnect
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap');

#app {
  color: white;
  background: linear-gradient(135deg, #0A0F0D 0%, #00416A 100%);
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.header {
  background-color: rgba(10, 15, 13, 0.8);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
}

.content {
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
}

h1 {
  font-size: 2em;
  color: #00FFFC;
  text-shadow: 0 0 10px #00FFFC;
}

.wallet-button {
  background-color: #007BFF;
  transition: background-color 0.3s ease;
}

.wallet-button:hover {
  background-color: #0056b3;
}

.wallet-icon {
  filter: drop-shadow(0 0 6px #00FFFC);
}

.connected-info p, .wallet-connect, .wallet-connected {
  color: #00FFFC;
  text-shadow: 0 0 5px #00FFFC;
}

a.faucet-link {
  color: #00FFFC;
  text-decoration: underline;
}

a.faucet-link:hover {
  color: #007BFF;
}
</style>