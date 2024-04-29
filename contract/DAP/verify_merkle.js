import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

import fs from 'fs';


const jsonString = fs.readFileSync('./NFT-Addresses.json', 'utf8');
const WhiteList = JSON.parse(jsonString);


const leaves = WhiteList.map((x) => keccak256(x));
const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
const rootHash = '0x' + merkleTree.getRoot().toString('hex');
const testAddress = '0xcc924d498ae08c844546cfce81556e7c1ff6b525';
const leaf = keccak256(testAddress);
const proof = merkleTree.getHexProof(leaf);
const isWhiteList = merkleTree.verify(proof, leaf, rootHash);

console.log('rootHash:: ', rootHash);
console.log('proof:: ', proof);
console.log('verify:: ', isWhiteList);

// rootHash::  0x34901f665ef4ef0590c9fc9c4cb8a9191ddaede10836a7d1b9859eca1145ddb0
// proof::  [
//     '0x1bcc0423f885629bab9c5152cf4bad8075f580160a96345c262f6c882dd6a04e',
//     '0x29206ed9199cd9ac38237639c630b9085eae3355a6211b2bc0421c7949b90a81',
//     '0x41bfe6c48a15635e8a3dded1640129d5cf98f52f6f598ee6e11089e4ce3a547c',
//     '0x771b798d0533cde3436e57e4f1b521a55f060112b1c686a09741837f4b78ecab',
//     '0xd9f44bc532955b0ea36593a4278493b461fd725b4c241bcf1c170cda358979ef',
//     '0x51dfaef5aa2a7d82ffde413b3c4aeff793b2bb4ba3d7c646898091b386f6fb00',
//     '0xed64f8ef47fe369dc6c7b63df21c7eb65b95bd7f62a88b6b2bd99fa2073c6287',
//     '0xb31aee2ace6148d019945bcdf5a15666bab360721b3c66f27b7e1c7f9b2f9051',
//     '0x0a92f5f8c316b2d31713522c343b7615e6182d8a94c3547b3b384643341acf55',
//     '0x7a338c2a2b1733f0575371488c2fc15d77bd2bd9eb25547f7eceab28fa30ac69'
// ]
// verify::  true


// proof:
// ["0x1bcc0423f885629bab9c5152cf4bad8075f580160a96345c262f6c882dd6a04e", "0x29206ed9199cd9ac38237639c630b9085eae3355a6211b2bc0421c7949b90a81", "0x41bfe6c48a15635e8a3dded1640129d5cf98f52f6f598ee6e11089e4ce3a547c", "0x771b798d0533cde3436e57e4f1b521a55f060112b1c686a09741837f4b78ecab", "0xd9f44bc532955b0ea36593a4278493b461fd725b4c241bcf1c170cda358979ef", "0x51dfaef5aa2a7d82ffde413b3c4aeff793b2bb4ba3d7c646898091b386f6fb00", "0xed64f8ef47fe369dc6c7b63df21c7eb65b95bd7f62a88b6b2bd99fa2073c6287", "0xb31aee2ace6148d019945bcdf5a15666bab360721b3c66f27b7e1c7f9b2f9051", "0xc06cdd5cf0244c0c3e22efc20facc1addd857db57933d636afc36830aba65c1b", "0x7a338c2a2b1733f0575371488c2fc15d77bd2bd9eb25547f7eceab28fa30ac69"]



// merlin mainnet:
// DAP_NFT: 0x885D6a66c35A1e91470a72d49bbb285c7b2a10A2



// merlin testnet:
// DAP:  0xEB465248119BeA7ba8761a6d6C5e71acA6C3c8Da
// DAP_NFT:
// DAP_NFT(Only 0.00000000001 ether;):
