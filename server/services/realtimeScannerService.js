const { Worker } = require('worker_threads');
const path = require('path');

class RealtimeScannerService {
    constructor() {
        this.activeScans = new Map(); // userId -> { worker, interval }
    }

    startScanningForUser(userId, threshold) {
        // Stop existing scan if any
        this.stopScanningForUser(userId);

        console.log(`Starting real-time scan for user ${userId} with threshold ${threshold}%`);

        // Create worker for continuous scanning
        const workerPath = path.join(__dirname, '../workers/realtimeScanWorker.js');
        const worker = new Worker(workerPath, {
            workerData: { userId, threshold }
        });

        worker.on('message', (message) => {
            console.log(`[Scanner ${userId}] ${message.type}:`, message.data);
            
            // Handle different message types
            if (message.type === 'alert') {
                this.handleSecurityAlert(userId, message.data);
            } else if (message.type === 'status') {
                console.log(`[Scanner ${userId}] Status: ${message.data.status}`);
            }
        });

        worker.on('error', (error) => {
            console.error(`[Scanner ${userId}] Error:`, error);
        });

        worker.on('exit', (code) => {
            console.log(`[Scanner ${userId}] Worker exited with code ${code}`);
            this.activeScans.delete(userId);
        });

        // Set up periodic scanning (every 30 seconds)
        const scanInterval = setInterval(() => {
            worker.postMessage({ command: 'scan' });
        }, 30000);

        // Store worker and interval
        this.activeScans.set(userId, { worker, interval: scanInterval });

        // Start initial scan
        worker.postMessage({ command: 'scan' });
    }

    stopScanningForUser(userId) {
        const scan = this.activeScans.get(userId);
        
        if (scan) {
            console.log(`Stopping real-time scan for user ${userId}`);
            
            // Clear interval
            clearInterval(scan.interval);
            
            // Terminate worker
            scan.worker.terminate();
            
            // Remove from active scans
            this.activeScans.delete(userId);
        }
    }

    handleSecurityAlert(userId, alertData) {
        // In a real application, you would:
        // 1. Send email notification
        // 2. Create in-app notification
        // 3. Log to security events database
        
        console.log(`🚨 SECURITY ALERT for user ${userId}:`);
        console.log(`   Severity: ${alertData.severity}%`);
        console.log(`   Issue: ${alertData.issue}`);
        console.log(`   Affected: ${alertData.service}`);
        
        // TODO: Implement notification system
    }

    getActiveScanCount() {
        return this.activeScans.size;
    }

    isUserBeingScanned(userId) {
        return this.activeScans.has(userId);
    }
}

module.exports = new RealtimeScannerService();
