const fs = require('fs-extra');
const path = require('path');
const solc = require('solc');

async function compile() {
    try {
        console.log('Starting compilation...');
        
        const contractPath = path.resolve(__dirname, '../contracts/PasswordManager.sol');
        console.log('Contract path:', contractPath);
        
        if (!fs.existsSync(contractPath)) {
            throw new Error('Contract file not found at: ' + contractPath);
        }
        
        const source = fs.readFileSync(contractPath, 'utf8');
        console.log('Contract loaded, length:', source.length);

        const input = {
            language: 'Solidity',
            sources: { 
                'PasswordManager.sol': { 
                    content: source 
                } 
            },
            settings: { 
                outputSelection: { 
                    '*': { 
                        '*': ['abi', 'evm.bytecode'] 
                    } 
                } 
            }
        };

        console.log('Compiling contract...');
        const output = JSON.parse(solc.compile(JSON.stringify(input)));

        if (output.errors) {
            let hasError = false;
            output.errors.forEach(err => {
                console.error(err.formattedMessage);
                if (err.severity === 'error') {
                    hasError = true;
                }
            });
            if (hasError) {
                throw new Error('Compilation failed with errors');
            }
        }

        const contract = output.contracts['PasswordManager.sol']['PasswordManager'];
        
        if (!contract) {
            throw new Error('Contract not found in compilation output');
        }

        const artifactsDir = path.resolve(__dirname, '../artifacts');
        console.log('Creating artifacts directory:', artifactsDir);
        await fs.ensureDir(artifactsDir);

        const artifact = {
            abi: contract.abi,
            bytecode: contract.evm.bytecode.object
        };

        const artifactPath = path.join(artifactsDir, 'PasswordManager.json');
        await fs.writeFile(artifactPath, JSON.stringify(artifact, null, 2));

        console.log('✓ Contract compiled successfully!');
        console.log('✓ Artifact saved to:', artifactPath);
        
    } catch (err) {
        console.error('✗ Compilation error:', err.message);
        process.exit(1);
    }
}

compile();
