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

// rootHash::  0x25a627fce2b4a3e7c4b2cb90d49ed2c0798a3c359c123a2148e1d2cba68beb42
// proof::  [
//     '0xab468c6454286a1bfbf9e8cf0280bf4b7bbd08daaf21bcd494a86a8ed1c0a162',
//     '0x635e2dc70d454b5efc828813c27d8815cc4c18b791afb1a779bd3242e4a1db99',
//     '0xecfb10e60efbdd766ed2cc114c410cf01aa3656e3e4a21c9e160aa35d3550401',
//     '0x1f22d8919a21701b13446858dd328e3bf58370521deee6ae776c27830ce4d6a6',
//     '0x0e72614d66b179c6901c332e9d5d03bb99e9574c5f476fa6c0a501b2c347092f',
//     '0x014ffdcae87c85c46ecd3ff48f3433aa3e18a0b7f0b986d86a809d5b48c35251',
//     '0xe5b452ac4d05cce5c25fd971a0c2f6ee7c7e6bfab21fdcede083ffb814708d43',
//     '0xb53751157f07ea2cb754cd5551cbfbae460d3482917a6e9e15c29aaa67e58b63',
//     '0xefa50e5168fc8e2adedbb2540d2ce79e6690fc2f5ac37255ce8cf887c27cbffa',
//     '0x7a338c2a2b1733f0575371488c2fc15d77bd2bd9eb25547f7eceab28fa30ac69'
// ]
// verify::  true


// proof:
// ["0xab468c6454286a1bfbf9e8cf0280bf4b7bbd08daaf21bcd494a86a8ed1c0a162","0x635e2dc70d454b5efc828813c27d8815cc4c18b791afb1a779bd3242e4a1db99","0xecfb10e60efbdd766ed2cc114c410cf01aa3656e3e4a21c9e160aa35d3550401","0x1f22d8919a21701b13446858dd328e3bf58370521deee6ae776c27830ce4d6a6","0x0e72614d66b179c6901c332e9d5d03bb99e9574c5f476fa6c0a501b2c347092f","0x014ffdcae87c85c46ecd3ff48f3433aa3e18a0b7f0b986d86a809d5b48c35251","0xe5b452ac4d05cce5c25fd971a0c2f6ee7c7e6bfab21fdcede083ffb814708d43","0xb53751157f07ea2cb754cd5551cbfbae460d3482917a6e9e15c29aaa67e58b63","0xefa50e5168fc8e2adedbb2540d2ce79e6690fc2f5ac37255ce8cf887c27cbffa","0x7a338c2a2b1733f0575371488c2fc15d77bd2bd9eb25547f7eceab28fa30ac69"]



// merlin mainnet:
// DAP_NFT: 0x885D6a66c35A1e91470a72d49bbb285c7b2a10A2



// merlin testnet:
// DAP:  0xEB465248119BeA7ba8761a6d6C5e71acA6C3c8Da
// DAP_NFT:
// DAP_NFT(Only 0.00000000001 ether;):
