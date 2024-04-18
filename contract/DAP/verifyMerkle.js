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

// rootHash::  0x4b3dbd8e7f3fbc62de6e52cb7fff89cc1645c30fff6af3ba9677688d6bd07803
// proof::  [
//     '0x729ffbffe681057be7afbb48b98aa316682cad9a80cf08ac43530c2bd8992cb7',
//     '0x1564d7a549021855b5e3d2937f0a09c484bdd39cf1585eab41c9fa9892a88233',
//     '0x8879504dced0bd639cbea7c1c04c8eb2c388786900bf449934a7845a27ca83fc',
//     '0x12b37de288dbd38a1c392686d43a5638b4a37f99ae976f1a7ae0362b989dcfa7',
//     '0xfda8ef7377e08f5dfe49e6190d7bd7428b6d853c95e52006a23222315a06e6fb',
//     '0x3942c4c5dfff24bad0ee30e9992006be1371fadb949af6f63115aa7f1010531a',
//     '0x875ebe45c403ac4c20e7d810b50c6527f6b4ec31374dc69c5c249d98cca05704'
// ]
// verify::  true

 // ["0x729ffbffe681057be7afbb48b98aa316682cad9a80cf08ac43530c2bd8992cb7", "0x1564d7a549021855b5e3d2937f0a09c484bdd39cf1585eab41c9fa9892a88233", "0x8879504dced0bd639cbea7c1c04c8eb2c388786900bf449934a7845a27ca83fc", "0x12b37de288dbd38a1c392686d43a5638b4a37f99ae976f1a7ae0362b989dcfa7", "0xfda8ef7377e08f5dfe49e6190d7bd7428b6d853c95e52006a23222315a06e6fb", "0x3942c4c5dfff24bad0ee30e9992006be1371fadb949af6f63115aa7f1010531a", "0x875ebe45c403ac4c20e7d810b50c6527f6b4ec31374dc69c5c249d98cca05704"]


// merlin testnet:
// DAP:  0xEB465248119BeA7ba8761a6d6C5e71acA6C3c8Da
// DAP_NFT: 0x3faE39D61ca46612e9C3Ff06724c651EbCA45e68
// DAP_NFT(Only 0.00000000001 ether;): 0x003eE97062411ADd6Ae6bc12EC50494cAb6F5284
