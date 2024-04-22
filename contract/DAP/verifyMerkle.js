import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

import fs from 'fs';


const jsonString = fs.readFileSync('./NFT-Addresses.json', 'utf8');
const WhiteList = JSON.parse(jsonString);


const leaves = WhiteList.map((x) => keccak256(x));
const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
const rootHash = '0x' + merkleTree.getRoot().toString('hex');
const testAddress = '0x4285710Ed2a30215d823927E281985011395176B';
const leaf = keccak256(testAddress);
const proof = merkleTree.getHexProof(leaf);
const isWhiteList = merkleTree.verify(proof, leaf, rootHash);

console.log('rootHash:: ', rootHash);
console.log('proof:: ', proof);
console.log('verify:: ', isWhiteList);

// rootHash::  0xc8fa620a9406e4ff8d7dcb6d993cb541a6019c6d9d2cb4db504b49c3c09c9995
// proof::  [
//     '0x1bcc0423f885629bab9c5152cf4bad8075f580160a96345c262f6c882dd6a04e',
//     '0x29206ed9199cd9ac38237639c630b9085eae3355a6211b2bc0421c7949b90a81',
//     '0x43484af76922c5501e8fed0c2d4b4c32d010799e8a3a2174b5ee77d090f59147',
//     '0x771b798d0533cde3436e57e4f1b521a55f060112b1c686a09741837f4b78ecab',
//     '0x51dfaef5aa2a7d82ffde413b3c4aeff793b2bb4ba3d7c646898091b386f6fb00',
//     '0xb31aee2ace6148d019945bcdf5a15666bab360721b3c66f27b7e1c7f9b2f9051',
//     '0x7a338c2a2b1733f0575371488c2fc15d77bd2bd9eb25547f7eceab28fa30ac69'
// ]
// verify::  true
// startTime: 1713945600

// proof:
// ["0x1bcc0423f885629bab9c5152cf4bad8075f580160a96345c262f6c882dd6a04e","0x29206ed9199cd9ac38237639c630b9085eae3355a6211b2bc0421c7949b90a81","0x43484af76922c5501e8fed0c2d4b4c32d010799e8a3a2174b5ee77d090f59147","0x771b798d0533cde3436e57e4f1b521a55f060112b1c686a09741837f4b78ecab","0x51dfaef5aa2a7d82ffde413b3c4aeff793b2bb4ba3d7c646898091b386f6fb00","0xb31aee2ace6148d019945bcdf5a15666bab360721b3c66f27b7e1c7f9b2f9051","0x7a338c2a2b1733f0575371488c2fc15d77bd2bd9eb25547f7eceab28fa30ac69"]


// merlin testnet:
// DAP:  0xEB465248119BeA7ba8761a6d6C5e71acA6C3c8Da
// DAP_NFT: 0x99Dffe61378348868E631766B0740e330B48666B
// DAP_NFT(Only 0.00000000001 ether;): 0x003eE97062411ADd6Ae6bc12EC50494cAb6F5284
