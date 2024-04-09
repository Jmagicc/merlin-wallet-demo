import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

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

// rootHash::  0xdadb45256da3288823d196fe53858cad865a1ca07bed14fd5a82f65279b56f59
// proof::     ["0x04a10bfd00977f54cc3450c9b25c9b3a502a089eba0097ba35fc33c4ea5fcb54","0x9d997719c0a5b5f6db9b8ac69a988be57cf324cb9fffd51dc2c37544bb520d65","0xe384bf06d1044be171a45df0f68ea9fafb753b427fc0734987a70678c90e2184"]
// verify::    true
