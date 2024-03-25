<template>
  <div>
    <div v-if="!isMetaMaskInstalled">
      <p style="color: red;">Please install the browser plugin MetaMask Little Fox Wallet first</p>
    </div>
    <div v-else>
      <button @click="connectAndSwitchToMerlin" class="wallet-button">
        <img src="../assets/metamask-icon.png" alt="MetaMask Icon" class="wallet-icon" />
        <div v-if="isConnected" class="wallet-connected">Connected</div>
        <div v-else class="wallet-connect">Initiate connection to MetaMask</div>
      </button>
      <div v-if="isConnected" class="connected-info">
        <p>Contract address: {{ contractAddress }}</p>
        <p>Wallet address: {{ walletAddress }}</p>
        <p>Testnet currency balance: {{ mainCoinBalance }} BTC</p>

        <button @click="checkSenderBalance" class="check-button">Check My WBTC Balance</button>
        <div>
          <input v-model="checkAddress" placeholder="Enter address to check WBTC balance" class="check-input">
          <button @click="checkAddressBalance" class="check-button">Check WBTC Balance</button>
        </div>
      </div>
      </div>
  </div>
</template>
<script>
import contractABI from './contractABI.json'; // 直接引用 ABI 文件
import Web3 from 'web3';


export default {
  data() {
    return {
      isConnected: false,
      walletAddress: null,
      isMetaMaskInstalled: false,
      mainCoinBalance: 0,
      contractAddress:'0x3FdaCd1C4fCbF43568C5f3d9E674aE9C9ba30847',
      checkAddress:'0xC9D994e2E2614bE1218AfB55104723C2c2B8AA13',
      // 合约实例
      contractInstance: null
    };
  },
  mounted() {
    this.checkMetaMaskInstallation();
  },
  methods: {
    async checkMetaMaskInstallation() {
      this.isMetaMaskInstalled = typeof window.ethereum !== 'undefined';
    },
    async connectAndSwitchToMerlin() {
      if (window.ethereum) {
        try {
          // Request user authorization to connect to MetaMask
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          // Access the selected address
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          this.walletAddress = accounts[0];
          this.isConnected = true;

   

          // Query main coin balance
          const balance = await this.getBalance(this.walletAddress);
          const decimalValue = parseInt(balance, 16);

          this.mainCoinBalance = this.convertWeiToEther(decimalValue);



        // 获取合约实例
        // 创建一个Web3实例
         const contractAddress = '0x956c16DF692fbee5cC0A7Be643de8C669f1B7808';
         const web3 = new Web3(Web3.givenProvider || 'https://testnet-rpc.merlinchain.io');

         this.contractInstance = new web3.eth.Contract(contractABI, contractAddress);
         console.log("合约示例初始化成功",this.contractInstance);

        } catch (error) {
          console.error('MetaMask operation error:', error);
        }
      } else {
        console.error('MetaMask not detected');
      }
    },
    convertWeiToEther(wei) {
        return parseFloat(wei) / 1e18; // Convert wei to ether
      },
     // 查询主币余额
     async getBalance(address) {
        try {
          const response = await fetch(`https://testnet-rpc.merlinchain.io`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_getBalance',
              params: [address, 'latest'],
              id: 1,
            }),
          });
  
          const data = await response.json();
          return data.result;
        } catch (error) {
          console.error('Error fetching balance:', error);
          return 0;
        }
      },
      async checkSenderBalance() {
      try {
        const result = await this.contractInstance.methods.checkBalanceOfSender().call({ from: this.walletAddress });
        alert(`Your WBTC balance is ${result ? 'above' : 'not above'} 1 WBTC.`);
      } catch (error) {
        console.error('Error checking sender balance:', error);
        alert('Error checking balance.');
      }
    },
    async checkAddressBalance() {
      if (!this.checkAddress) {
        alert('Please enter an address.');
        return;
      }
      try {
        const result = await this.contractInstance.methods.checkBalance(this.checkAddress).call();
        alert(`The WBTC balance of the address is ${result ? 'above' : 'not above'} 1 WBTC.`);
      } catch (error) {
        console.error('Error checking address balance:', error);
        alert('Error checking balance.');
      }
    },
  }
};
</script>

<style scoped>
.wallet-button {
  background-color: #4caf50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.wallet-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  border:  2px solid white;
  border-radius: 7px;
}

.connected-info {
  margin-top: 20px;
}

a.faucet-link {
color: blue;
/* 添加额外样式以指示链接被点击后的状态 */
}

/* Add more styles as needed */
/* 样式 for check-button */
.check-button {
  background-color: #007bff; /* 蓝色背景 */
  color: white; /* 白色文字 */
  padding: 8px 16px; /* 内边距 */
  border: none; /* 移除边框 */
  border-radius: 4px; /* 圆角 */
  cursor: pointer; /* 鼠标悬停时显示手型图标 */
  font-size: 14px; /* 字体大小 */
  transition: background-color 0.2s ease-in-out; /* 背景色变化过渡效果 */
  margin-top: 10px; /* 上边距 */
}

.check-button:hover {
  background-color: #0056b3; /* 按钮悬停时的背景色变深 */
}

/* 样式 for check-input */
.check-input {
  width: 100%; /* 输入框宽度自适应 */
  padding: 8px; /* 内边距 */
  border: 1px solid #ccc; /* 边框颜色 */
  border-radius: 4px; /* 圆角 */
  margin: 10px 0; /* 上下边距 */
  box-sizing: border-box; /* 边框和内填充计入宽度 */
}

/* 增强响应式设计 */
@media (min-width: 768px) {
  .connected-info > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .check-input {
    max-width: 60%; /* 大屏设备上限制最大宽度 */
    margin-right: 10px; /* 与按钮的间距 */
  }
  
  .check-button {
    width: auto; /* 按钮宽度自适应 */
    margin-top: 0; /* 移除上边距 */
  }
}

</style>
