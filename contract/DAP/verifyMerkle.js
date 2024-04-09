import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

// Define whitelist addresses
const WhiteList = [
    '0x5C0EA17bD78C6D1a777aB644458371B247c3BD27',
    '0xf4B2211aAb03971064c0e1403e08dC3695F5DEF1',
    '0xE7C2BacFBA5C4Db0b785aa5766BbCF43b847E671'
];

const leaves = WhiteList.map((x) => keccak256(x));
const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
const rootHash = '0x' + merkleTree.getRoot().toString('hex');
const testAddress = '0x5C0EA17bD78C6D1a777aB644458371B247c3BD27';
const leaf = keccak256(testAddress);
const proof = merkleTree.getHexProof(leaf);
const isWhiteList = merkleTree.verify(proof, leaf, rootHash);

console.log('rootHash:: ', rootHash);
console.log('proof:: ', proof);
console.log('verify:: ', isWhiteList);

// rootHash::  0x181dae41a7c2a5ec156b289bf930ab607510db931b2d4851203eb6ca09ea3f63
// proof::  [
//     '0xc737fe4d0f034eaf86814057af411e426853a82631319f0c26a97a6f5bb501ac',
//     '0x5794286b84c1983b3ab008c5a32cb7251cf8cbbe6e8dad3b1472126286c9bcb2'
// ]
// verify::  true

// ["0xc737fe4d0f034eaf86814057af411e426853a82631319f0c26a97a6f5bb501ac","0x5794286b84c1983b3ab008c5a32cb7251cf8cbbe6e8dad3b1472126286c9bcb2"]

