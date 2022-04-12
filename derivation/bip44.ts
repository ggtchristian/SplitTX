import BIP32Factory, { BIP32Interface } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import * as bitcoin from 'bitcoinjs-lib';
import ECPairFactory from 'ecpair';


const bip32 = BIP32Factory(ecc);
const axios = require('axios');
const fs = require('fs');
const ECPair = ECPairFactory(ecc);
const {Transaction} = require('bitcore-lib')

const getChild = async (xpub: string ,account_index: number, change: boolean) => {
    if (change){
        //bip44 path to create hierarchy
        let path = "1/" + account_index.toString();
        let root = bip32.fromBase58(xpub, bitcoin.networks.testnet);
        let child = root.derivePath(path);
        return child
    }else {
        //bip44 path to create hierarchy
        let path = "0/" + account_index.toString();
        let root = bip32.fromBase58(xpub, bitcoin.networks.testnet)
        let child = root.derivePath(path);
        return child
    }
}
const getChildAddress =async (child) => {
    const { address } = bitcoin.payments.p2pkh({

        pubkey: child.publicKey,
        
        network: bitcoin.networks.testnet
        
        });
    return address
}
const getUtxo = async (address) => {
    try {
        const resp = await axios.get('https://blockstream.info/testnet/api/address/' + address + '/utxo');
        return resp.data;
    } catch (e) {
        console.log(e)
    }
};
const getTxHex = async(txid)=>{
    try {
        const resp = await axios.get('https://blockstream.info/testnet/api/tx/' + txid + '/hex');
        return resp.data;
    } catch (e) {
        console.log(e)
    }
};
const getTxHistory =async (address) => {
try {
    const resp = await axios.get('https://blockstream.info/testnet/api//address/'+address+'/txs');
    return resp.data;
} catch (e) {
    console.log(e)
}

};
const getFunds =async (address) => {
    let totalFunds: number = 0;
    let utxo = await getUtxo(address)
    for (let i = 0; i < utxo.length; i++){
        totalFunds = totalFunds + utxo[i].value
    }
    return totalFunds    
};
const getScript = async (txID) => {
    try {
        const resp = await axios.get('https://blockstream.info/testnet/api/tx/' + txID);
        return resp.data;
    } catch (e) {
        console.log(e)
    }
    
}

const getUnusedAddress =async (xpub) => {
    var obj = {
        table : []
    };
    let searchIndex = 0
    let gapLimit = 0
    while (gapLimit <= 20){
        let child = await getChild(xpub, searchIndex, false);
        let childAddress = await (getChildAddress(child))
        let txhis = await getTxHistory(childAddress)
        if (txhis.length === 0){
            obj.table.push({Index: searchIndex, Address: childAddress})
            gapLimit++
            searchIndex++
        }else{
            searchIndex++
          }
        }
    var json = JSON.stringify(obj, null, 2);
    fs.writeFileSync('derivation/emptyAddresses.json',json)
    return obj;
    }

const getAllUTXOs =async (index, xpub) => {
    var obj = {
        table : []
    };
    let utxoIndex = []
    let currentIndex = index
    while (currentIndex >= 0){
        let child = await getChild(xpub, currentIndex, false);
        let childAddress = await (getChildAddress(child))
        let utxos = await getUtxo(childAddress)
        if (utxos.length === 0){
            currentIndex--
        }else{
            for (let i = 0; i < utxos.length; i++){
                let txID = utxos[i].txid;
                let value = utxos[i].value
                let info = await getScript(txID)
                let data = info.vout
                let vout = utxos[i].vout
                let scriptpubkey = info.vout[vout].scriptpubkey
                utxoIndex.push('0/'+currentIndex)
                obj.table.push({txid: utxos[i].txid, vout: vout, address: childAddress, scriptPubKey: scriptpubkey, satoshis: utxos[i].value})
            }
            currentIndex--
          }
        }
    let Index = index
    while (Index >= 0){
        let child = await getChild(xpub, Index, true);
        let childAddress = await (getChildAddress(child))
        let utxos = await getUtxo(childAddress)
        if (utxos.length === 0){
            Index--
        }else{
            for (let i = 0; i < utxos.length; i++){
                let txID = utxos[i].txid;
                let value = utxos[i].value
                let info = await getScript(txID)
                let data = info.vout
                let vout = utxos[i].vout
                let scriptpubkey = info.vout[vout].scriptpubkey
                utxoIndex.push('1/'+currentIndex)
                obj.table.push({txid: utxos[i].txid, vout: vout, Address: childAddress, script: scriptpubkey, satoshis: utxos[i].value})
            }
            Index--
          }
        }
    fs.writeFileSync('coldstorage/unsignedTX/utxoIndex.txt', utxoIndex.toString(), (err)=>{
        if (err) throw err;
    })    
    var json = JSON.stringify(obj, null, 2);
    fs.writeFileSync('derivation/UTXOS.json',json)
    return obj;
    }

const postTX = async()=>{
    let transaction = fs.readFileSync('coldstorage/signedTX', 'utf8')
    try {
        const resp = await axios({
            method: 'post',
            url: 'https://blockstream.info/testnet/api/tx',
            data: transaction
        });
        console.log('Transaction Successful! TX ID: ', resp.data)
    } catch (e){
        console.log(e)
    }
};

const TXbuild =async (recipient: string, amount: number, change : string,utxos) => {
    /*let remainder = amount
    let to_spend = []
    while (remainder > 0){
        for (let i = 0; i < utxos.length; i++ ){
            to_spend.push(utxos[i])
            let utxoamount = utxos[i].satoshis
            remainder = remainder - utxoamount
        }
    }
    console.log(to_spend)*/

    var transaction = new Transaction().from(utxos).to(recipient, amount).change(change).sign()
    let serialized = transaction.toString()
    fs.writeFileSync('coldstorage/unsignedTX/unsigned.txt', serialized, (err)=>{
        if (err) throw err;
    })
    console.log(transaction.toObject())
    return serialized
    
}
const main =async () => {
    const xpub = fs.readFileSync('coldstorage/walletinfo/wallet1xPub.txt', 'utf8')

    let addressTable = await getUnusedAddress(xpub)
    let currentIndex = addressTable.table[0].Index
    let utxos = await getAllUTXOs(currentIndex, xpub)

    await postTX()
    //console.log(await getScript('784799199e6e1e1a9fc4471a043af4ca437153eb0369c1cf7d75fbd601e4d123'))
    //let test = utxos.table
    //console.log(test[1].satoshis)
    /*let index =  fs.readFileSync('coldstorage/unsignedTX/utxoIndex.txt', 'utf8')
    console.log(index.split(','))*/
    //await TXbuild('mgjZXKrukTgy5LxzqbTAnrHr6oW5ReTTTd', 69000, 'miXM6nD9LKsJds61B2AhsEJjNVXU6UJzRV',utxos.table)
    //transaction = new Transaction().from(utxos.table[0]).to('mt4rDS9bgeY4kAjmyrgbaVM5kX67k8apxr', 72000).sign('cQvmQtJxEZfoT37Kp321VdYBo3gijKuZVZMjG6y4HV8imepFYr9W')
    //.change('mxvH1pGZ7Eb84gzuoitqjhNThgy1W5vBEV')
    //console.log(transaction.isFullySigned())
    //var serialized = transaction.toString();
    /*obj.table.push(serialized)
    var json = JSON.stringify(obj, null, 2);
    fs.writeFileSync('coldstorage/unsigned.json',json)*/
    //let signed = fs.readFileSync('coldstorage/signedTX', 'utf8')
    //console.log(signed)
    //let txid = await postTX();
    //console.log('txid: ', txid)
    //const tx = new Transaction().from().change().sign()
    //const serial = tx.toObject
    //console.log(serial)

}
main()