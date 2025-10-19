const { expect } = require('chai');
const { ethers } = require('ethers');
const fs = require('fs-extra');
const path = require('path');

describe("PasswordManager", function () {
  let provider;
  let wallet;
  let contract;

  before(async function () {
    // Connect to Ganache UI
    provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");
    const accounts = await provider.listAccounts();
    wallet = provider.getSigner(accounts[0]);

    // Load compiled contract artifact
    const artifactPath = path.resolve(__dirname, '../artifacts/PasswordManager.json');
    
    if (!fs.existsSync(artifactPath)) {
      throw new Error('Artifact not found. Run "npm run compile" first.');
    }
    
    const artifact = await fs.readJson(artifactPath);

    // Deploy contract for testing
    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
    contract = await factory.deploy();
    await contract.deployed();
    
    console.log('Test contract deployed at:', contract.address);
  });

  it("should add a new password entry", async function () {
    const service = "example.com";
    const encryptedPassword = "encrypted_password_123";

    const tx = await contract.addPassword(service, encryptedPassword);
    await tx.wait();

    const count = await contract.getPasswordCount();
    expect(count.toNumber()).to.equal(1);
  });

  it("should retrieve the added password", async function () {
    const [service, encryptedPassword, timestamp] = await contract.getPassword(0);
    
    expect(service).to.equal("example.com");
    expect(encryptedPassword).to.equal("encrypted_password_123");
    expect(timestamp.toNumber()).to.be.greaterThan(0);
  });

  it("should add multiple passwords", async function () {
    await contract.addPassword("github.com", "github_pass_encrypted");
    await contract.addPassword("twitter.com", "twitter_pass_encrypted");

    const count = await contract.getPasswordCount();
    expect(count.toNumber()).to.equal(3);
  });

  it("should retrieve all passwords", async function () {
    const allPasswords = await contract.getAllPasswords();
    expect(allPasswords.length).to.equal(3);
    expect(allPasswords[0].service).to.equal("example.com");
    expect(allPasswords[1].service).to.equal("github.com");
    expect(allPasswords[2].service).to.equal("twitter.com");
  });

  it("should delete a password", async function () {
    await contract.deletePassword(1);
    
    const count = await contract.getPasswordCount();
    expect(count.toNumber()).to.equal(2);
  });

  it("should revert when accessing invalid index", async function () {
    await expect(contract.getPassword(10)).to.be.revertedWith("Index out of bounds");
  });
});
