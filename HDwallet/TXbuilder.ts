//Christian Rodriguez
//Creating a Key Pair and Derived Children Addresses
//Raw Transaction Creation and Broadcasting to Bitcoin Testnet
//March 31, 2022

import BIP32Factory, { BIP32Interface } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import * as bip39 from 'bip39';
import * as bitcoin from 'bitcoinjs-lib';
import ECPairFactory from 'ecpair';

const bip32 = BIP32Factory(ecc);
const ECPair = ECPairFactory(ecc);
const axios = require('axios');
const fs = require('fs');


//Function that uses an API to fetches specified address' total UTXOs and returns an array using 
const getUtxo = async (address) => {
        try {
            const resp = await axios.get('https://blockstream.info/testnet/api/address/' + address + '/utxo');
            return resp.data;
        } catch (e) {
            console.log(e)
        }
    };

//Function that uses API to fetch a transaction hex for a specified transaction ID
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
//Function that uses API to post a specified transaction to the Bitcoin Testnet
const postTX = async(transaction)=>{
        try {
            const resp = await axios({
                method: 'post',
                url: 'https://blockstream.info/testnet/api/tx',
                data: transaction
            });
            return resp.data
        } catch (e){
            console.log(e)
        }
    };

//Function call that fetches total BTC balance for specified address
const getFunds =async (address) => {
    let totalFunds: number = 0;
    let utxo = await getUtxo(address)
    for (let i = 0; i < utxo.length; i++){
        totalFunds = totalFunds + utxo[i].value
    }
    return totalFunds    
};

const getChild = async (account_index: number, change: boolean) => {
    if (change){
        let mnemonic = 'wear two remove story disease quarter hard balcony ethics habit tool hero snack cover dizzy deliver genius neck firm hair erupt bulk earth vague'
        let seed = bip39.mnemonicToSeedSync(mnemonic)
        //bip44 path to create hierarchy
        let path = "m/44'/1'/0'/1/" + account_index.toString();
        //parent
        let root = bip32.fromSeed(seed);
        //derived child
        let child = root.derivePath(path);
        return child
    }else {
        let mnemonic = 'wear two remove story disease quarter hard balcony ethics habit tool hero snack cover dizzy deliver genius neck firm hair erupt bulk earth vague'
        let seed = bip39.mnemonicToSeedSync(mnemonic)
        //bip44 path to create hierarchy
        let path = "m/44'/1'/0'/0/" + account_index.toString();
        //parent
        let root = bip32.fromSeed(seed);
        //derived child
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

//Main Function Call to send Testnet Bitcoin

const getChangeAddress =async () => {
    var obj = {
        table : []
    };
    let flag = false
    let searchIndex = 0
    while (flag == false){
        let change = await getChild(searchIndex, true);
        let changeAddress = await (getChildAddress(change))
        let txhis = await getTxHistory(changeAddress)
        if (txhis.length === 0){
            console.log('Send Change To --> ', changeAddress);
            console.log('Updating change.json...')
            obj.table.push({Path: "m/44'/1'/0'/1/"+searchIndex.toString(), Address: changeAddress})
            var json = JSON.stringify(obj, null, 2);
            fs.writeFileSync('HDwallet/walletinfo/change.json',json)
            return changeAddress
            flag = true
        }else{
            searchIndex++
          }
        }
    }

const getUnusedAddress =async () => {
    var obj = {
        table : []
    };
    let searchIndex = 0
    let gapLimit = 0
    while (gapLimit <= 20){
        let child = await getChild(searchIndex, false);
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
    fs.writeFileSync('HDwallet/walletinfo/emptyAddresses.json',json)
    return obj;
    }

const getAllUTXOs =async (index) => {
    var obj = {
        table : []
    };
    let currentIndex = index
    while (currentIndex >= 0){
        let child = await getChild(currentIndex, false);
        let childAddress = await (getChildAddress(child))
        let utxos = await getUtxo(childAddress)
        if (utxos.length === 0){
            currentIndex--
        }else{
            obj.table.push({Signature: child, TotalFunds: await getFunds(childAddress), UTXOs: utxos})
            currentIndex--
          }
        }
    let Index = index
    while (Index >= 0){
        let child = await getChild(Index, true);
        let childAddress = await (getChildAddress(child))
        let utxos = await getUtxo(childAddress)
        if (utxos.length === 0){
            Index--
        }else{
            obj.table.push({Signature: child, TotalFunds: await getFunds(childAddress), UTXOs: utxos})
            Index--
          }
        }
    var json = JSON.stringify(obj, null, 2);
    fs.writeFileSync('HDwallet/walletinfo/UTXOS.json',json)
    return obj;
    }
const sendBTC = async (target: string, amount: number, changeAddress, UTXOS) => {
    const validator = (
        pubkey: Buffer,
        msghash: Buffer,
        signature: Buffer,
      ): boolean => ECPair.fromPublicKey(pubkey).verify(msghash, signature);
    let psbt = new bitcoin.Psbt({network: bitcoin.networks.testnet});
    let totalBTC: number = amount;
    let totalPayment = totalBTC + 600;
    let availableFunds = 0;
    let totalSpent = 0;
    let signatures = [];
    for (let i = 0; i < UTXOS.table.length;i++){
        availableFunds = availableFunds + UTXOS.table[i].TotalFunds
    };
    if (availableFunds>= amount+600){
        while(totalBTC> 0){
            for(let i = 0; i < UTXOS.table.length; i++){
                let utxo = UTXOS.table[i].UTXOs
                for(let x = 0; x < utxo.length; x++ ){
                    let txid = utxo[x].txid
                    let txhex = await getTxHex(txid);
                    psbt.addInput({
                        hash: txid,
                        index: utxo[x].vout,
                        nonWitnessUtxo: Buffer.from(txhex, 'hex')
                    })
                    totalSpent = totalSpent + utxo[x].value
                    totalBTC = totalBTC - utxo[x].value
                    signatures.push(UTXOS.table[i].Signature)
                }
            }

        }
    }else{
        console.log('Not Enough Funds!')
        return
    }
    let change = totalSpent - totalPayment;
    psbt.addOutput({
        address: target,
        value: amount,
    });
    psbt.addOutput({
        address: changeAddress,
        value: change,
    });
    for (let i = 0; i <signatures.length; i++){
        psbt.signInput(i, signatures[i])
        psbt.validateSignaturesOfInput(i, validator);
    }
    psbt.finalizeAllInputs();
    const tx = psbt.extractTransaction().toHex();
    console.log('Transaction Successful! TxID: ', await postTX(tx)); 
}

const main = async() =>{
    //UPDATES AVAILABLE FUNDS 
    /*let addressTable = await getUnusedAddress();
    let currentIndex = addressTable.table[0].Index
    let utxoTable = await getAllUTXOs(currentIndex)
    console.log('funds updated')
    await getChangeAddress()*/

    //sendBTC(TARGET, PAY, CHANGE, UTXOLIST)
    //let tx = sendBTC('mt4rDS9bgeY4kAjmyrgbaVM5kX67k8apxr', 73000,'mxvH1pGZ7Eb84gzuoitqjhNThgy1W5vBEV', utxoTable);

    //UPDATES JSON FILES AFTER TRANSACTION
    //let updateEmptyJSON = await getUnusedAddress();
    //let index = updateEmptyJSON.table[0].Index
    //let updateUtxoJSON = await getAllUTXOs(index)
    //console.log('JSON files updated')
}
main();

