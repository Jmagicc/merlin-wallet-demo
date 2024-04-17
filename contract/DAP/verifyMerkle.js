import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

// Define whitelist addresses
const WhiteList = [
    '0x5C0EA17bD78C6D1a777aB644458371B247c3BD27',
    '0xf4B2211aAb03971064c0e1403e08dC3695F5DEF1',
    '0xE7C2BacFBA5C4Db0b785aa5766BbCF43b847E671',
    '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
];

const leaves = WhiteList.map((x) => keccak256(x));
const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
const rootHash = '0x' + merkleTree.getRoot().toString('hex');
const testAddress = '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4';
const leaf = keccak256(testAddress);
const proof = merkleTree.getHexProof(leaf);
const isWhiteList = merkleTree.verify(proof, leaf, rootHash);

console.log('rootHash:: ', rootHash);
console.log('proof:: ', proof);
console.log('verify:: ', isWhiteList);

// rootHash::  0xca598ab602c79fd735a8b42958bd7857841cf01f0edd6306eb0ce1ca45c21c9f
// proof::  [
//     '0x5794286b84c1983b3ab008c5a32cb7251cf8cbbe6e8dad3b1472126286c9bcb2',
//     '0x48e64618c076f03330f86d5d3e99f9d0b6a5300f702ab4d66221a08ac7b66a00'
// ]
// verify::  true


 // ["0x5794286b84c1983b3ab008c5a32cb7251cf8cbbe6e8dad3b1472126286c9bcb2","0x48e64618c076f03330f86d5d3e99f9d0b6a5300f702ab4d66221a08ac7b66a00"]

