"use strict";
//Christian Rodriguez
//Creating a Key Pair and Derived Children Addresses
//Raw Transaction Creation and Broadcasting to Bitcoin Testnet
//March 31, 2022
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var bip32_1 = require("bip32");
var ecc = require("tiny-secp256k1");
var bip39 = require("bip39");
var bitcoin = require("bitcoinjs-lib");
var ecpair_1 = require("ecpair");
var bip32 = (0, bip32_1["default"])(ecc);
var ECPair = (0, ecpair_1["default"])(ecc);
var axios = require('axios');
var fs = require('fs');
//Function that uses an API to fetches specified address' total UTXOs and returns an array using 
var getUtxo = function (address) { return __awaiter(void 0, void 0, void 0, function () {
    var resp, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios.get('https://blockstream.info/testnet/api/address/' + address + '/utxo')];
            case 1:
                resp = _a.sent();
                return [2 /*return*/, resp.data];
            case 2:
                e_1 = _a.sent();
                console.log(e_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
//Function that uses API to fetch a transaction hex for a specified transaction ID
var getTxHex = function (txid) { return __awaiter(void 0, void 0, void 0, function () {
    var resp, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios.get('https://blockstream.info/testnet/api/tx/' + txid + '/hex')];
            case 1:
                resp = _a.sent();
                return [2 /*return*/, resp.data];
            case 2:
                e_2 = _a.sent();
                console.log(e_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getTxHistory = function (address) { return __awaiter(void 0, void 0, void 0, function () {
    var resp, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios.get('https://blockstream.info/testnet/api//address/' + address + '/txs')];
            case 1:
                resp = _a.sent();
                return [2 /*return*/, resp.data];
            case 2:
                e_3 = _a.sent();
                console.log(e_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
//Function that uses API to post a specified transaction to the Bitcoin Testnet
var postTX = function (transaction) { return __awaiter(void 0, void 0, void 0, function () {
    var resp, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios({
                        method: 'post',
                        url: 'https://blockstream.info/testnet/api/tx',
                        data: transaction
                    })];
            case 1:
                resp = _a.sent();
                return [2 /*return*/, resp.data];
            case 2:
                e_4 = _a.sent();
                console.log(e_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
//Function call that fetches total BTC balance for specified address
var getFunds = function (address) { return __awaiter(void 0, void 0, void 0, function () {
    var totalFunds, utxo, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                totalFunds = 0;
                return [4 /*yield*/, getUtxo(address)];
            case 1:
                utxo = _a.sent();
                for (i = 0; i < utxo.length; i++) {
                    totalFunds = totalFunds + utxo[i].value;
                }
                return [2 /*return*/, totalFunds];
        }
    });
}); };
var getChild = function (account_index, change) { return __awaiter(void 0, void 0, void 0, function () {
    var mnemonic, seed, path, root, child, mnemonic, seed, path, root, child;
    return __generator(this, function (_a) {
        if (change) {
            mnemonic = 'wear two remove story disease quarter hard balcony ethics habit tool hero snack cover dizzy deliver genius neck firm hair erupt bulk earth vague';
            seed = bip39.mnemonicToSeedSync(mnemonic);
            path = "m/44'/1'/0'/1/" + account_index.toString();
            root = bip32.fromSeed(seed);
            child = root.derivePath(path);
            return [2 /*return*/, child];
        }
        else {
            mnemonic = 'wear two remove story disease quarter hard balcony ethics habit tool hero snack cover dizzy deliver genius neck firm hair erupt bulk earth vague';
            seed = bip39.mnemonicToSeedSync(mnemonic);
            path = "m/44'/1'/0'/0/" + account_index.toString();
            root = bip32.fromSeed(seed);
            child = root.derivePath(path);
            return [2 /*return*/, child];
        }
        return [2 /*return*/];
    });
}); };
var getChildAddress = function (child) { return __awaiter(void 0, void 0, void 0, function () {
    var address;
    return __generator(this, function (_a) {
        address = bitcoin.payments.p2pkh({
            pubkey: child.publicKey,
            network: bitcoin.networks.testnet
        }).address;
        return [2 /*return*/, address];
    });
}); };
//Main Function Call to send Testnet Bitcoin
var getChangeAddress = function () { return __awaiter(void 0, void 0, void 0, function () {
    var obj, flag, searchIndex, change, changeAddress, txhis, json;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                obj = {
                    table: []
                };
                flag = false;
                searchIndex = 0;
                _a.label = 1;
            case 1:
                if (!(flag == false)) return [3 /*break*/, 5];
                return [4 /*yield*/, getChild(searchIndex, true)];
            case 2:
                change = _a.sent();
                return [4 /*yield*/, (getChildAddress(change))];
            case 3:
                changeAddress = _a.sent();
                return [4 /*yield*/, getTxHistory(changeAddress)];
            case 4:
                txhis = _a.sent();
                if (txhis.length === 0) {
                    console.log('Send Change To --> ', changeAddress);
                    console.log('Updating change.json...');
                    obj.table.push({ Path: "m/44'/1'/0'/1/" + searchIndex.toString(), Address: changeAddress });
                    json = JSON.stringify(obj, null, 2);
                    fs.writeFileSync('HDwallet/walletinfo/change.json', json);
                    return [2 /*return*/, changeAddress];
                    flag = true;
                }
                else {
                    searchIndex++;
                }
                return [3 /*break*/, 1];
            case 5: return [2 /*return*/];
        }
    });
}); };
var getUnusedAddress = function () { return __awaiter(void 0, void 0, void 0, function () {
    var obj, searchIndex, gapLimit, child, childAddress, txhis, json;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                obj = {
                    table: []
                };
                searchIndex = 0;
                gapLimit = 0;
                _a.label = 1;
            case 1:
                if (!(gapLimit <= 20)) return [3 /*break*/, 5];
                return [4 /*yield*/, getChild(searchIndex, false)];
            case 2:
                child = _a.sent();
                return [4 /*yield*/, (getChildAddress(child))];
            case 3:
                childAddress = _a.sent();
                return [4 /*yield*/, getTxHistory(childAddress)];
            case 4:
                txhis = _a.sent();
                if (txhis.length === 0) {
                    obj.table.push({ Index: searchIndex, Address: childAddress });
                    gapLimit++;
                    searchIndex++;
                }
                else {
                    searchIndex++;
                }
                return [3 /*break*/, 1];
            case 5:
                json = JSON.stringify(obj, null, 2);
                fs.writeFileSync('HDwallet/walletinfo/emptyAddresses.json', json);
                return [2 /*return*/, obj];
        }
    });
}); };
var getAllUTXOs = function (index) { return __awaiter(void 0, void 0, void 0, function () {
    var obj, currentIndex, child, childAddress, utxos, _a, _b, Index, child, childAddress, utxos, _c, _d, json;
    var _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                obj = {
                    table: []
                };
                currentIndex = index;
                _g.label = 1;
            case 1:
                if (!(currentIndex >= 0)) return [3 /*break*/, 8];
                return [4 /*yield*/, getChild(currentIndex, false)];
            case 2:
                child = _g.sent();
                return [4 /*yield*/, (getChildAddress(child))];
            case 3:
                childAddress = _g.sent();
                return [4 /*yield*/, getUtxo(childAddress)];
            case 4:
                utxos = _g.sent();
                if (!(utxos.length === 0)) return [3 /*break*/, 5];
                currentIndex--;
                return [3 /*break*/, 7];
            case 5:
                _b = (_a = obj.table).push;
                _e = { Signature: child };
                return [4 /*yield*/, getFunds(childAddress)];
            case 6:
                _b.apply(_a, [(_e.TotalFunds = _g.sent(), _e.UTXOs = utxos, _e)]);
                currentIndex--;
                _g.label = 7;
            case 7: return [3 /*break*/, 1];
            case 8:
                Index = index;
                _g.label = 9;
            case 9:
                if (!(Index >= 0)) return [3 /*break*/, 16];
                return [4 /*yield*/, getChild(Index, true)];
            case 10:
                child = _g.sent();
                return [4 /*yield*/, (getChildAddress(child))];
            case 11:
                childAddress = _g.sent();
                return [4 /*yield*/, getUtxo(childAddress)];
            case 12:
                utxos = _g.sent();
                if (!(utxos.length === 0)) return [3 /*break*/, 13];
                Index--;
                return [3 /*break*/, 15];
            case 13:
                _d = (_c = obj.table).push;
                _f = { Signature: child };
                return [4 /*yield*/, getFunds(childAddress)];
            case 14:
                _d.apply(_c, [(_f.TotalFunds = _g.sent(), _f.UTXOs = utxos, _f)]);
                Index--;
                _g.label = 15;
            case 15: return [3 /*break*/, 9];
            case 16:
                json = JSON.stringify(obj, null, 2);
                fs.writeFileSync('HDwallet/walletinfo/UTXOS.json', json);
                return [2 /*return*/, obj];
        }
    });
}); };
var sendBTC = function (target, amount, changeAddress, UTXOS) { return __awaiter(void 0, void 0, void 0, function () {
    var validator, psbt, totalBTC, totalPayment, availableFunds, totalSpent, signatures, i, i, utxo, x, txid, txhex, change, i, tx, _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                validator = function (pubkey, msghash, signature) { return ECPair.fromPublicKey(pubkey).verify(msghash, signature); };
                psbt = new bitcoin.Psbt({ network: bitcoin.networks.testnet });
                totalBTC = amount;
                totalPayment = totalBTC + 600;
                availableFunds = 0;
                totalSpent = 0;
                signatures = [];
                for (i = 0; i < UTXOS.table.length; i++) {
                    availableFunds = availableFunds + UTXOS.table[i].TotalFunds;
                }
                ;
                if (!(availableFunds >= amount + 600)) return [3 /*break*/, 9];
                _d.label = 1;
            case 1:
                if (!(totalBTC > 0)) return [3 /*break*/, 8];
                i = 0;
                _d.label = 2;
            case 2:
                if (!(i < UTXOS.table.length)) return [3 /*break*/, 7];
                utxo = UTXOS.table[i].UTXOs;
                x = 0;
                _d.label = 3;
            case 3:
                if (!(x < utxo.length)) return [3 /*break*/, 6];
                txid = utxo[x].txid;
                return [4 /*yield*/, getTxHex(txid)];
            case 4:
                txhex = _d.sent();
                psbt.addInput({
                    hash: txid,
                    index: utxo[x].vout,
                    nonWitnessUtxo: Buffer.from(txhex, 'hex')
                });
                totalSpent = totalSpent + utxo[x].value;
                totalBTC = totalBTC - utxo[x].value;
                signatures.push(UTXOS.table[i].Signature);
                _d.label = 5;
            case 5:
                x++;
                return [3 /*break*/, 3];
            case 6:
                i++;
                return [3 /*break*/, 2];
            case 7: return [3 /*break*/, 1];
            case 8: return [3 /*break*/, 10];
            case 9:
                console.log('Not Enough Funds!');
                return [2 /*return*/];
            case 10:
                change = totalSpent - totalPayment;
                psbt.addOutput({
                    address: target,
                    value: amount
                });
                psbt.addOutput({
                    address: changeAddress,
                    value: change
                });
                for (i = 0; i < signatures.length; i++) {
                    psbt.signInput(i, signatures[i]);
                    psbt.validateSignaturesOfInput(i, validator);
                }
                psbt.finalizeAllInputs();
                tx = psbt.extractTransaction().toHex();
                _b = (_a = console).log;
                _c = ['Transaction Successful! TxID: '];
                return [4 /*yield*/, postTX(tx)];
            case 11:
                _b.apply(_a, _c.concat([_d.sent()]));
                return [2 /*return*/];
        }
    });
}); };
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/];
    });
}); };
main();
