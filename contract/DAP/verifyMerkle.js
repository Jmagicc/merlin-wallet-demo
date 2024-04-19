import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

import fs from 'fs';


const jsonString = fs.readFileSync('./NFT-Addresses.json', 'utf8');
const WhiteList = JSON.parse(jsonString);


const leaves = WhiteList.map((x) => keccak256(x));
const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
const rootHash = '0x' + merkleTree.getRoot().toString('hex');
const testAddress = '0xC9D994e2E2614bE1218AfB55104723C2c2B8AA13';
const leaf = keccak256(testAddress);
const proof = merkleTree.getHexProof(leaf);
const isWhiteList = merkleTree.verify(proof, leaf, rootHash);

console.log('rootHash:: ', rootHash);
console.log('proof:: ', proof);
console.log('verify:: ', isWhiteList);

// rootHash::  0x44e436235c18cef5c4145e00dada9dfd92d2eb11dbd5f7a81cb8f8f1e0a8908e
// proof::  [
//     '0x729ffbffe681057be7afbb48b98aa316682cad9a80cf08ac43530c2bd8992cb7',
//     '0xa9ff1885859027dff8fdf196ddda6e6c1c44a4e8e416b41ad3aedd0a74b90a8c',
//     '0xb31aee2ace6148d019945bcdf5a15666bab360721b3c66f27b7e1c7f9b2f9051',
//     '0x875ebe45c403ac4c20e7d810b50c6527f6b4ec31374dc69c5c249d98cca05704'
// ]
// verify::  true

// proof:
// ["0x729ffbffe681057be7afbb48b98aa316682cad9a80cf08ac43530c2bd8992cb7","0xa9ff1885859027dff8fdf196ddda6e6c1c44a4e8e416b41ad3aedd0a74b90a8c","0xb31aee2ace6148d019945bcdf5a15666bab360721b3c66f27b7e1c7f9b2f9051","0x875ebe45c403ac4c20e7d810b50c6527f6b4ec31374dc69c5c249d98cca05704"]


// merlin testnet:
// DAP:  0xEB465248119BeA7ba8761a6d6C5e71acA6C3c8Da
// DAP_NFT: 0x99Dffe61378348868E631766B0740e330B48666B
// DAP_NFT(Only 0.00000000001 ether;): 0x003eE97062411ADd6Ae6bc12EC50494cAb6F5284
