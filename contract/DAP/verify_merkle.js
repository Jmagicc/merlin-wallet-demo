import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

import fs from 'fs';


const jsonString = fs.readFileSync('./NFT-Addresses.json', 'utf8');
const WhiteList = JSON.parse(jsonString);


const leaves = WhiteList.map((x) => keccak256(x));
const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
const rootHash = '0x' + merkleTree.getRoot().toString('hex');
const testAddress = '0x82900486E777D35F29dcC10b55dc649C8eD94816';
const leaf = keccak256(testAddress);
const proof = merkleTree.getHexProof(leaf);
const isWhiteList = merkleTree.verify(proof, leaf, rootHash);

console.log('rootHash:: ', rootHash);
console.log('proof:: ', proof);
console.log('verify:: ', isWhiteList);

// rootHash::  0xeefbcbf65c7624fa1a07459c524cd3a1b985fa535b864cdf1fa4cc344b6c0f6a
// proof::  [
//     '0x8aeefc280b9d09d81ad9ea5c882b11a9b9f65caf3e39b2d209aab5cfbc99bf12',
//     '0xe3197cb84d471d32b20fc7b7841b440e1072a594fd451c63532a5aabe58fddab',
//     '0xa7581cb900e94e195aba2020fb04e1ff70166ade8d748c76aa3c94a208e334d8',
//     '0x7d658bfc09e3db1f8090a30298e7a62b58eb8c8abe7940578ddd515fe06fc1bd'
// ]
// verify::  true



// proof:
// ["0x8aeefc280b9d09d81ad9ea5c882b11a9b9f65caf3e39b2d209aab5cfbc99bf12","0xe3197cb84d471d32b20fc7b7841b440e1072a594fd451c63532a5aabe58fddab","0xa7581cb900e94e195aba2020fb04e1ff70166ade8d748c76aa3c94a208e334d8","0x7d658bfc09e3db1f8090a30298e7a62b58eb8c8abe7940578ddd515fe06fc1bd"]



// merlin mainnet:
// DAP_NFT: 0x885D6a66c35A1e91470a72d49bbb285c7b2a10A2



// merlin testnet:
// DAP:  0xEB465248119BeA7ba8761a6d6C5e71acA6C3c8Da
// DAP_NFT:
// DAP_NFT(Only 0.00000000001 ether;):

// B²  mainnet
// DAP_NFT: 0xe30683D90fa2A21342FA430e67Bbb169d8A3b654
