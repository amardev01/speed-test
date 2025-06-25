import { TestProgress, SpeedTestResult, TestServer, GraphData, TestConfig, TestProtocol } from '../types/speedTest';
import { WorkerMessageType, WorkerMessage } from './speedTestWorker';

class SpeedTestEngine {
  private servers: TestServer[] = [
    { id: '1', name: 'Local Server', location: 'Custom Backend', host: 'http://localhost:3000', distance: 0 },
  ];

  private onProgress?: (progress: TestProgress) => void;
  private onGraphUpdate?: (data: GraphData[]) => void;
  private graphData: GraphData[] = [];
  private worker: Worker | null = null;
  private config: TestConfig;

  constructor(
    onProgress?: (progress: TestProgress) => void,
    onGraphUpdate?: (data: GraphData[]) => void,
    config?: TestConfig
  ) {
    this.onProgress = onProgress;
    this.onGraphUpdate = onGraphUpdate;
    this.config = config || {
      duration: 10,
      parallelConnections: 4,
      enableBufferbloat: true,
      enableStressTest: false,
      enableAutoProtocolOverhead: true,
      protocol: TestProtocol.XHR // Default to XHR protocol
    };
    
    this.initWorker();
  }

  private initWorker() {
    // Terminate existing worker if it exists
    if (this.worker) {
      this.worker.terminate();
    }

    // Create a new worker
    this.worker = new Worker(new URL('./speedTestWorker.ts', import.meta.url), { type: 'module' });
    
    // Set up message handler
    this.worker.onmessage = this.handleWorkerMessage.bind(this);
    
    // Initialize worker with config
    this.sendMessageToWorker(WorkerMessageType.INITIALIZE, { config: this.config });
  }

  private handleWorkerMessage(event: MessageEvent<WorkerMessage>) {
    const { type, payload } = event.data;
    
    switch (type) {
      case WorkerMessageType.PROGRESS_UPDATE:
        if (this.onProgress) {
          this.onProgress(payload);
        }
        break;
        
      case WorkerMessageType.GRAPH_UPDATE:
        this.graphData = payload;
        if (this.onGraphUpdate) {
          this.onGraphUpdate(this.graphData);
        }
        break;
        
      case WorkerMessageType.TEST_COMPLETE:
        if (this.onProgress) {
          this.onProgress({
            phase: 'complete',
            progress: 100,
            currentSpeed: 0,
            elapsedTime: performance.now()
          });
        }
        break;
        
      case WorkerMessageType.TEST_ERROR:
        console.error('Speed test error:', payload.message);
        break;
        
      default:
        console.log('Received message from worker:', type, payload);
    }
  }

  private sendMessageToWorker(type: WorkerMessageType, payload?: any) {
    if (!this.worker) {
      console.error('Worker not initialized');
      return;
    }
    
    this.worker.postMessage({ type, payload });
  }

  async runSpeedTest(): Promise<SpeedTestResult> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Worker not initialized'));
        return;
      }
      
      // Reset graph data
      this.graphData = [];
      
      // Set up one-time listener for test completion
      const completeListener = (event: MessageEvent<WorkerMessage>) => {
        const { type, payload } = event.data;
        
        if (type === WorkerMessageType.TEST_COMPLETE) {
          // Remove this listener once test is complete
          this.worker?.removeEventListener('message', completeListener);
          resolve(payload as SpeedTestResult);
        } else if (type === WorkerMessageType.TEST_ERROR) {
          // Remove this listener on error
          this.worker?.removeEventListener('message', completeListener);
          reject(new Error(payload.message));
        }
      };
      
      // Add the temporary listener for completion/error
      this.worker.addEventListener('message', completeListener);
      
      // Start the test
      this.sendMessageToWorker(WorkerMessageType.START_TEST);
    });
  }

  abort() {
    this.sendMessageToWorker(WorkerMessageType.ABORT);
  }


  
  // Clean up resources when the engine is no longer needed
  dispose() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

export default SpeedTestEngine;