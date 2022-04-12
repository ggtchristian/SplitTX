from trace import Trace
import json
from hdwallet import HDWallet
import hdwallet
from hdwallet.utils import generate_entropy, generate_mnemonic
from hdwallet.symbols import BTCTEST as SYMBOL
from typing import Optional
from btcpy.setup import setup
from btcpy.structs.transaction import Transaction, TransactionFactory, MutableTransaction, TxIn, TxOut, Locktime
from btcpy.structs.crypto import PrivateKey, PublicKey
from btcpy.structs.script import Script, ScriptBuilder, PublicKey, ScriptSig
from btcpy.structs.sig import Solver, Sighash, P2pkhScript, P2pkhSolver, P2wshV0Solver
import mnemonic

hardmnemonic = 'wear two remove story disease quarter hard balcony ethics habit tool hero snack cover dizzy deliver genius neck firm hair erupt bulk earth vague'

#creates wallet with random or already established mnemonic. Writes xpub and mnemonic to file in /coldstorage/
class generateWallet:
    walletCount = 0
    def __init__(self, entropy = 256, password = None, mnemonic=None) :
        if mnemonic == None:
            self.entropy = entropy
            self.password = password   
            generateWallet.walletCount += 1 
            self.wallet = generateWallet.walletCount
            self.getXpub(self.generateMnemonic())
        else: 
            generateWallet.walletCount += 1 
            self.wallet = generateWallet.walletCount
            self.getXpub(mnemonic)
            f = open('coldstorage/walletinfo/mnemonic.txt', 'w')
            f.write(mnemonic)
            f.close()
    

    def generateMnemonic(self):
        STRENGTH : int = self.entropy
        LANGUAGE : str = 'english'
        PASSWORD : Optional[str] = self.password
        mnemonic = generate_mnemonic(LANGUAGE, STRENGTH)
        f = open('coldstorage/walletinfo/wallet' + str(self.wallet) + 'mnemonic.txt', 'w')
        f.write(mnemonic)
        f.close()
        return mnemonic

    def getXpub(self, mnemonic):
        wallet  = HDWallet(SYMBOL, False)
        wallet = wallet.from_mnemonic(mnemonic)
        wallet = wallet.from_path("m/44'/1'/0'")
        xpub = wallet.xpublic_key()
        f = open('coldstorage/walletinfo/wallet'+ str(self.wallet) + 'xPub.txt', 'w')
        f.write(xpub)
        f.close()

#defines the wallet I am using for testing
wallet = generateWallet(mnemonic=hardmnemonic)

#Called within the main reconstructTX() function.
#returns an array the signatures needed for a transaction based off of the array of paths found in utxoIndex.txt. Each path index corresponds to the utxo index in the transaction.
def getSignatures(index = str):
    #an array to store all of the reconstructed locking scripts and their corresponding unlocking scripts
    sigscripts = []
    #establishes wallet being used through the HDwallet python library
    seedFile = open('coldstorage/walletinfo/mnemonic.txt', 'r')
    mnemonic = seedFile.readline()
    wallet = HDWallet(SYMBOL, False)
    wallet = wallet.from_mnemonic(mnemonic)
    #finishes bip44 path with the parameter path retrieved from utxoIndex.txt to derive the utxo's owner
    wallet = wallet.from_path("m/44'/1'/0'/" +index)
    #retrieves the child's private and public key using HDwallet library, converts them into btcpy format
    priv = wallet.private_key()
    privKey = PrivateKey.unhexlify(priv)
    pub = wallet.public_key()
    pubKey = PublicKey.unhexlify(pub)
    #recreates the locking script used in the utxo and appends it to the sigscript array
    locking = sigscripts.append(P2pkhScript(pubKey))
    #generates an unlocking script using the correct private key and appends it to the sigscript array
    unlocking = sigscripts.append(P2pkhSolver(privKey))
    #function returns an array of the recreated locking scripts and their respective unlocking scripts
    return sigscripts

#Called within the main reconstructTX() function.
#returns a correctly formatted utxos being used in a btcpy transaction.
def constructUTXOS(script, index):
    #opens the file containing all updated available utxos
    raw = open('derivation/UTXOS.json')
    utxos = json.load(raw)
    #based off of the parameter index, a utxo is parsed and reformated 
    utxos =  utxos['table']
    val = utxos[index]['satoshis']
    vout = utxos[index]['vout']
    scriptpubkey = script
    #plugs all neccessary fields into btcpy TxOut() format
    to_spend = TxOut(value=val, n=vout, script_pubkey= scriptpubkey)
    return to_spend

#Main function call
#reads unsigned transaction hex and reconstructs with neccessary signatures it using btcpy. returns signed transaction hex and writes it to signedTX file
def reconstructTX():
    #establish two empty arrays. UTXOs being used and the signatures needed to unlock their funds
    signatures = []
    to_spend = []
    #reads the utxoIndex file and splits the paths into an array.
    index = open('coldstorage/unsignedTX/utxoIndex.txt', 'r')
    indexes = index.readlines()
    indexes = indexes[0].split(',')
    #reads the unsigned transaction file and reconstructs it into a mutable btcpy transaction
    txFile = open('coldstorage/unsignedTX/unsigned.txt', 'r')
    unsignedHex = txFile.readline()
    unsigned = MutableTransaction.unhexlify(unsignedHex)
    print(unsigned)
    #reads the length of inputs used in transaction
    inputs = unsigned.ins
    #iterates through each input and reconstructs their neccessary utxos and signatures
    for i in range(len(inputs)):
        #calls getSignatures() with index parameter from 'indexes' array
        sigscripts = getSignatures(indexes[i])
        #appends the unlocking script to the signature array
        signatures.append(sigscripts[1])
        #calls constructUTXOS() with the locking script generated from the first function call
        utxo = constructUTXOS(sigscripts[0], i)
        print(sigscripts[1])
        #appends TxOut() object to array
        to_spend.append(utxo)
    #after all input unlocking scripts are created, the unsigned mutable transaction is signed using the .spend() function with the utxo and signatures array as parameters
    signed = unsigned.spend(to_spend, signatures)
    print('\n', signed)
    #converts transaction object into the hex needed to broadcast and writes it into signedTX file to be read by connected script
    signed = signed.hexlify()
    signedTX = open('coldstorage/signedTX', 'w')
    signedTX.write(signed)
    signedTX.close
    return signed



reconstructTX()
