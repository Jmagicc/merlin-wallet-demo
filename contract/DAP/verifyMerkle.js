import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";


const WhiteList = [
    "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
    "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
]

const leaves = WhiteList.map((x) => keccak256(x));
const merkleTree = new MerkleTree(leaves, keccak256);
const rootHash ="0x"+ merkleTree.getRoot().toString("hex");


const testAddress ="0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";


const leaf = keccak256(testAddress);
const proof = merkleTree.getProof(leaf);
const proof32 = proof.map((x) => "0x" + x.data.toString("hex"));

const isWhiteList = merkleTree.verify(proof, leaf, rootHash)

console.log("rootHash:: ", rootHash)
console.log("leaf:: ", proof32)
console.log("verify:: ",isWhiteList)


// rootHash::  0xa7b65d7def4b9ccb18e34164671ec799d2f09710d3d80826bfacb00dc46bbd74
// leaf::  [
//     '0x999bf57501565dbd2fdcea36efa2b9aef8340a8901e3459f4a4c926275d36cdb',
//     '0x04a10bfd00977f54cc3450c9b25c9b3a502a089eba0097ba35fc33c4ea5fcb54'
// ]
// verify::  true
