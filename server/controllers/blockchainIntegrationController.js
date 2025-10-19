const { contract } = require('../services/blockchainService');
const { ethers } = require('ethers');

// Register password hash on blockchain
exports.registerOnBlockchain = async (req, res) => {
  try {
    if (!contract) throw new Error('Blockchain service not available');
    const passwordId = req.params.id;
    const password = await require('../models/PasswordModel').findOne({ _id: passwordId, userId: req.user._id });
    if (!password) throw new Error('Password not found');

    const dataString = JSON.stringify({ service: password.service, riskScore: password.riskScore, lastChanged: password.lastChanged });
    const hash = ethers.keccak256(ethers.toUtf8Bytes(dataString));
    const tx = await contract.registerPasswordHash(password._id.toString(), hash);
    const receipt = await tx.wait();
    password.blockchainHash = hash;
    password.blockchainTxHash = receipt.hash;
    password.blockchainTimestamp = new Date();
    password.integrityStatus = 'verified';
    await password.save();

    res.json({ success: true, data: { hash, txHash: receipt.hash } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Verify password integrity
exports.verifyIntegrity = async (req, res) => {
  try {
    if (!contract) throw new Error('Blockchain service not available');
    const passwordId = req.params.id;
    const password = await require('../models/PasswordModel').findOne({ _id: passwordId, userId: req.user._id });
    if (!password || !password.blockchainHash) throw new Error('Password not registered');

    const dataString = JSON.stringify({ service: password.service, riskScore: password.riskScore, lastChanged: password.lastChanged });
    const currentHash = ethers.keccak256(ethers.toUtf8Bytes(dataString));
    const isValid = await contract.verifyPasswordHash(password._id.toString(), currentHash);
    password.lastVerified = new Date();
    password.integrityStatus = isValid ? 'verified' : 'tampered';
    await password.save();

    res.json({ success: true, data: { isValid, storedHash: password.blockchainHash, currentHash } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get blockchain audit trail
exports.getAuditTrail = async (req, res) => {
  try {
    if (!contract) throw new Error('Blockchain service not available');
    const passwordId = req.params.id;
    const password = await require('../models/PasswordModel').findOne({ _id: passwordId, userId: req.user._id });
    if (!password) throw new Error('Password not found');

    const history = await contract.getHashHistory(password._id.toString());

    res.json({ success: true, data: { passwordId, service: password.service, hashHistory: history.map(h => h.toString()), totalUpdates: history.length } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

