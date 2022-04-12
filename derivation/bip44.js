"use strict";
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
var bitcoin = require("bitcoinjs-lib");
var ecpair_1 = require("ecpair");
var bip32 = (0, bip32_1["default"])(ecc);
var axios = require('axios');
var fs = require('fs');
var ECPair = (0, ecpair_1["default"])(ecc);
var Transaction = require('bitcore-lib').Transaction;
var getChild = function (xpub, account_index, change) { return __awaiter(void 0, void 0, void 0, function () {
    var path, root, child, path, root, child;
    return __generator(this, function (_a) {
        if (change) {
            path = "1/" + account_index.toString();
            root = bip32.fromBase58(xpub, bitcoin.networks.testnet);
            child = root.derivePath(path);
            return [2 /*return*/, child];
        }
        else {
            path = "0/" + account_index.toString();
            root = bip32.fromBase58(xpub, bitcoin.networks.testnet);
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
var getScript = function (txID) { return __awaiter(void 0, void 0, void 0, function () {
    var resp, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios.get('https://blockstream.info/testnet/api/tx/' + txID)];
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
var getUnusedAddress = function (xpub) { return __awaiter(void 0, void 0, void 0, function () {
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
                return [4 /*yield*/, getChild(xpub, searchIndex, false)];
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
                fs.writeFileSync('derivation/emptyAddresses.json', json);
                return [2 /*return*/, obj];
        }
    });
}); };
var getAllUTXOs = function (index, xpub) { return __awaiter(void 0, void 0, void 0, function () {
    var obj, utxoIndex, currentIndex, child, childAddress, utxos, i, txID, value, info, data, vout, scriptpubkey, Index, child, childAddress, utxos, i, txID, value, info, data, vout, scriptpubkey, json;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                obj = {
                    table: []
                };
                utxoIndex = [];
                currentIndex = index;
                _a.label = 1;
            case 1:
                if (!(currentIndex >= 0)) return [3 /*break*/, 11];
                return [4 /*yield*/, getChild(xpub, currentIndex, false)];
            case 2:
                child = _a.sent();
                return [4 /*yield*/, (getChildAddress(child))];
            case 3:
                childAddress = _a.sent();
                return [4 /*yield*/, getUtxo(childAddress)];
            case 4:
                utxos = _a.sent();
                if (!(utxos.length === 0)) return [3 /*break*/, 5];
                currentIndex--;
                return [3 /*break*/, 10];
            case 5:
                i = 0;
                _a.label = 6;
            case 6:
                if (!(i < utxos.length)) return [3 /*break*/, 9];
                txID = utxos[i].txid;
                value = utxos[i].value;
                return [4 /*yield*/, getScript(txID)];
            case 7:
                info = _a.sent();
                data = info.vout;
                vout = utxos[i].vout;
                scriptpubkey = info.vout[vout].scriptpubkey;
                utxoIndex.push('0/' + currentIndex);
                obj.table.push({ txid: utxos[i].txid, vout: vout, address: childAddress, scriptPubKey: scriptpubkey, satoshis: utxos[i].value });
                _a.label = 8;
            case 8:
                i++;
                return [3 /*break*/, 6];
            case 9:
                currentIndex--;
                _a.label = 10;
            case 10: return [3 /*break*/, 1];
            case 11:
                Index = index;
                _a.label = 12;
            case 12:
                if (!(Index >= 0)) return [3 /*break*/, 22];
                return [4 /*yield*/, getChild(xpub, Index, true)];
            case 13:
                child = _a.sent();
                return [4 /*yield*/, (getChildAddress(child))];
            case 14:
                childAddress = _a.sent();
                return [4 /*yield*/, getUtxo(childAddress)];
            case 15:
                utxos = _a.sent();
                if (!(utxos.length === 0)) return [3 /*break*/, 16];
                Index--;
                return [3 /*break*/, 21];
            case 16:
                i = 0;
                _a.label = 17;
            case 17:
                if (!(i < utxos.length)) return [3 /*break*/, 20];
                txID = utxos[i].txid;
                value = utxos[i].value;
                return [4 /*yield*/, getScript(txID)];
            case 18:
                info = _a.sent();
                data = info.vout;
                vout = utxos[i].vout;
                scriptpubkey = info.vout[vout].scriptpubkey;
                utxoIndex.push('1/' + currentIndex);
                obj.table.push({ txid: utxos[i].txid, vout: vout, Address: childAddress, script: scriptpubkey, satoshis: utxos[i].value });
                _a.label = 19;
            case 19:
                i++;
                return [3 /*break*/, 17];
            case 20:
                Index--;
                _a.label = 21;
            case 21: return [3 /*break*/, 12];
            case 22:
                fs.writeFileSync('coldstorage/unsignedTX/utxoIndex.txt', utxoIndex.toString(), function (err) {
                    if (err)
                        throw err;
                });
                json = JSON.stringify(obj, null, 2);
                fs.writeFileSync('derivation/UTXOS.json', json);
                return [2 /*return*/, obj];
        }
    });
}); };
var postTX = function () { return __awaiter(void 0, void 0, void 0, function () {
    var transaction, resp, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                transaction = fs.readFileSync('coldstorage/signedTX', 'utf8');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios({
                        method: 'post',
                        url: 'https://blockstream.info/testnet/api/tx',
                        data: transaction
                    })];
            case 2:
                resp = _a.sent();
                console.log('Transaction Successful! TX ID: ', resp.data);
                return [3 /*break*/, 4];
            case 3:
                e_5 = _a.sent();
                console.log(e_5);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var TXbuild = function (recipient, amount, change, utxos) { return __awaiter(void 0, void 0, void 0, function () {
    var transaction, serialized;
    return __generator(this, function (_a) {
        transaction = new Transaction().from(utxos).to(recipient, amount).change(change).sign();
        serialized = transaction.toString();
        fs.writeFileSync('coldstorage/unsignedTX/unsigned.txt', serialized, function (err) {
            if (err)
                throw err;
        });
        console.log(transaction.toObject());
        return [2 /*return*/, serialized];
    });
}); };
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var xpub, addressTable, currentIndex, utxos;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                xpub = fs.readFileSync('coldstorage/walletinfo/wallet1xPub.txt', 'utf8');
                return [4 /*yield*/, getUnusedAddress(xpub)];
            case 1:
                addressTable = _a.sent();
                currentIndex = addressTable.table[0].Index;
                return [4 /*yield*/, getAllUTXOs(currentIndex, xpub)];
            case 2:
                utxos = _a.sent();
                return [4 /*yield*/, postTX()
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
                ];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
main();
