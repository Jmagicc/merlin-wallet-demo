# DAPoint Token System

The DAPoint Token System is a blockchain-based points system that leverages smart contracts for point distribution and management. This system uses an ERC20 token, named DAPoint (DAP), built on the Ethereum blockchain. It incorporates a Merkle Tree-based whitelist mechanism for secure and efficient verification of eligible addresses for point distribution.

## Features

- **ERC20 Compatibility:** Fully compliant with the ERC20 standard, allowing for seamless integration with existing wallets and exchanges.
- **Whitelist Verification:** Utilizes a Merkle Tree for efficient and secure verification of addresses against a whitelist.
- **Owner Privileges:** Only the contract owner can update the distribution root and distribute points to whitelisted addresses.

## Why Use a Merkle Tree for the Whitelist?

Merkle Trees offer an efficient and secure way to verify the presence of an element in a dataset without revealing the entire dataset. This is particularly useful for whitelists in token distribution scenarios, where:

1. **Efficiency:** Verifying an address against the whitelist requires only a small subset of the tree (the Merkle proof) rather than the entire list of addresses.
2. **Security:** The integrity of the whitelist can be assured with a single hash (the Merkle root), making it infeasible to tamper with the list without detection.
3. **Privacy:** The contents of the whitelist are not exposed during verification, protecting the privacy of the listed addresses.

## Updating the Merkle Tree Root

The Merkle Tree root represents the current state of the whitelist and is stored on the blockchain within the Points System contract. To update the whitelist:

1. Generate a new Merkle Tree from the updated list of whitelisted addresses.
2. Calculate the new Merkle root hash.
3. Use the `setDistributionRoot` function in the contract, callable only by the owner, to update the distribution root on the blockchain.
```
    function setDistributionRoot(bytes32 root) public onlyOwner {
        distributionRoot = root;
    }
```

## Verifying an Address

To verify if an address is in the whitelist:

1. Generate a Merkle proof for the address using the list of whitelisted addresses. This step is performed off-chain, using the provided JavaScript code snippet.
2. Call the `verifyAddressInWhitelist` function in the smart contract, passing the address and the generated Merkle proof as arguments.
3. The function returns a boolean value indicating whether the address is whitelisted.
```
    function verifyAddressInWhitelist(address account, bytes32[] memory proof) public view returns (bool) {
        bytes32 encodedAccount = keccak256(abi.encodePacked(account));
        return MerkleProof.verify(proof, distributionRoot, encodedAccount);
    }
```

## Getting the Merkle Proof (JavaScript)

The JavaScript code snippet provided alongside the smart contract is used to generate the Merkle proof for a given address. This is necessary for verifying an address against the whitelist.

To generate a Merkle proof:
1. Ensure you have the list of current whitelisted addresses.
2. Use the `MerkleTree` library to construct the Merkle Tree from the whitelisted addresses.
3. Use the `getHexProof` method of the `MerkleTree` object, passing the hash of the address you want to verify.
4. The output is the Merkle proof, which can be used with the `verifyAddressInWhitelist` function in the smart contract.
```
    // Define whitelist addresses
    const WhiteList = [
        '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
        '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
        '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db',
        '0x83589169893520c8ac5be8eb032559373c6b0657',
        '0xc9d994e2e2614be1218afb55104723c2c2b8aa13',
    ];
    
    const leaves = WhiteList.map((x) => keccak256(x));
    const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const rootHash = '0x' + merkleTree.getRoot().toString('hex');
    const testAddress = '0x83589169893520c8ac5be8eb032559373c6b0657';
    const leaf = keccak256(testAddress);
    const proof = merkleTree.getHexProof(leaf);
    const isWhiteList = merkleTree.verify(proof, leaf, rootHash);
    
    console.log('rootHash:: ', rootHash);
    console.log('proof:: ', proof);
    console.log('verify:: ', isWhiteList);
```

## Conclusion

The DAPoint Token System provides a secure and efficient method for managing point distribution to a set of whitelisted addresses using Merkle Trees. This approach ensures integrity, efficiency, and privacy in verifying eligible addresses for token distribution.