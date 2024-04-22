import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

import fs from 'fs';


const jsonString = fs.readFileSync('./NFT-Addresses.json', 'utf8');
const WhiteList = JSON.parse(jsonString);


const leaves = WhiteList.map((x) => keccak256(x));
const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
const rootHash = '0x' + merkleTree.getRoot().toString('hex');
const testAddress = '0x05Ab5025Fe3f0a0d26fcd5201448D0Ffb16370df';
const leaf = keccak256(testAddress);
const proof = merkleTree.getHexProof(leaf);
const isWhiteList = merkleTree.verify(proof, leaf, rootHash);

console.log('rootHash:: ', rootHash);
console.log('proof:: ', proof);
console.log('verify:: ', isWhiteList);

// rootHash::  0x5660dc1cbf6521b6f4307d5f6fbef0b128eef9563e61a701688115ac3a484d36
// proof::  [
//     '0x1152b3db35c38498491e48a62afab3c042310656607ea1c0c600a69d410a4bba',
//     '0x9cc0a336e5a75047419b48a130f48653dd88ad6e68d220b0ef41ed1ef5d7c746',
//     '0x5c6e0886d8f5a809fda7c23a30030785e2d2d84157c72d3c202dddbc4b529f11',
//     '0x5100427a71141cce19f75202ee6a585b41bda79b855703c9efa7801a55292842',
//     '0x6ed8acce3e29c82776b764821b6323eaddb18df111873a5a222135d512a7e1ad',
//     '0x098aa0cd55288888568f17c2c260411a1499cea2f0b56e3fab1bdb432ad02496',
//     '0x734b2b1e7fa9157a761e2102169cce33b5890462155a67649acf06e0a3d5f8af',
//     '0xcc4c3e5e556331b129ba45daac41c20d84aff502a08d4c1baddbc126551b5856',
//     '0x93965eb0a5a98726e1ef4ac70740b5d4e7d2350e67252a63ac283904c89b41ad',
//     '0x34dcd03549a567ff25896826c40957c03d76d53b67231ee364483464533cb03e',
//     '0x4e3184e3369f28984a777cd389c4b67d40973b0ef05c8a097bc382117e99a1ad'
// ]
// verify::  true
// startTime: 1713945600

// proof:
// ["0x1152b3db35c38498491e48a62afab3c042310656607ea1c0c600a69d410a4bba", "0x9cc0a336e5a75047419b48a130f48653dd88ad6e68d220b0ef41ed1ef5d7c746", "0x5c6e0886d8f5a809fda7c23a30030785e2d2d84157c72d3c202dddbc4b529f11", "0x5100427a71141cce19f75202ee6a585b41bda79b855703c9efa7801a55292842", "0x6ed8acce3e29c82776b764821b6323eaddb18df111873a5a222135d512a7e1ad", "0x098aa0cd55288888568f17c2c260411a1499cea2f0b56e3fab1bdb432ad02496", "0x734b2b1e7fa9157a761e2102169cce33b5890462155a67649acf06e0a3d5f8af", "0xcc4c3e5e556331b129ba45daac41c20d84aff502a08d4c1baddbc126551b5856", "0x93965eb0a5a98726e1ef4ac70740b5d4e7d2350e67252a63ac283904c89b41ad", "0x34dcd03549a567ff25896826c40957c03d76d53b67231ee364483464533cb03e", "0x4e3184e3369f28984a777cd389c4b67d40973b0ef05c8a097bc382117e99a1ad"]


// merlin testnet:
// DAP:  0xEB465248119BeA7ba8761a6d6C5e71acA6C3c8Da
// DAP_NFT: 0x99Dffe61378348868E631766B0740e330B48666B
// DAP_NFT(Only 0.00000000001 ether;): 0x003eE97062411ADd6Ae6bc12EC50494cAb6F5284
