import { TestProgress, SpeedTestResult, TestServer, GraphData, TestConfig } from '../types/speedTest';

import serverConfig from '../config/serverConfig';

// Declare the global Speedtest class from LibreSpeed
declare global {
  interface Window {
    Speedtest: any;
  }
  var Speedtest: any;
}

class LibreSpeedEngine {
  private speedtest: any;
  private onProgress?: (progress: TestProgress) => void;
  private onGraphUpdate?: (data: GraphData[]) => void;
  private config: TestConfig;
  private servers: TestServer[] = [
    {
      id: 'local',
      name: 'Local Server',
      location: 'Local Backend',
      host: 'http://localhost:8080',
      distance: 0
    }
  ];
  private graphData: GraphData[] = [];
  private startTime: number = 0;
  private isRunning: boolean = false;

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
      enableAutoProtocolOverhead: true
    };

    // Initialize speedtest asynchronously
    this.initializeSpeedtest().catch(console.error);
  }

  private async initializeSpeedtest() {
    // Load LibreSpeed script if not already loaded
    if (typeof window !== 'undefined' && !window.Speedtest) {
      await this.loadLibreSpeedScript();
    }

    // Create new Speedtest instance
    this.speedtest = new (window.Speedtest || Speedtest)();

    // Configure the speedtest with our server endpoints
    this.speedtest.setParameter('url_dl', serverConfig.endpoints.download);
    this.speedtest.setParameter('url_ul', serverConfig.endpoints.upload);
    this.speedtest.setParameter('url_ping', serverConfig.endpoints.ping);
    this.speedtest.setParameter('url_getIp', serverConfig.endpoints.getIP);
    
    // Set test parameters from config
    this.speedtest.setParameter('time_dl', this.config.duration);
    this.speedtest.setParameter('time_ul', this.config.duration);
    this.speedtest.setParameter('count_ping', 10);
    this.speedtest.setParameter('xhr_dlMultistream', this.config.parallelConnections);
    this.speedtest.setParameter('xhr_ulMultistream', this.config.parallelConnections);

    // Add test point
    this.speedtest.addTestPoint({
      name: 'LibreSpeed Backend',
      server: serverConfig.baseUrl,
      dlURL: serverConfig.endpoints.download,
      ulURL: serverConfig.endpoints.upload,
      pingURL: serverConfig.endpoints.ping,
      getIpURL: serverConfig.endpoints.getIP
    });

    // Set up callbacks
    this.speedtest.onupdate = (data: any) => this.handleUpdate(data);
    this.speedtest.onend = (aborted: boolean) => this.handleEnd(aborted);
  }

  private loadLibreSpeedScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Window object not available'));
        return;
      }

      const script = document.createElement('script');
      script.src = '/librespeed.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load LibreSpeed script'));
      document.head.appendChild(script);
    });
  }

  private handleUpdate(data: any) {
    if (!this.isRunning) return;

    const currentTime = Date.now();
    const elapsed = (currentTime - this.startTime) / 1000;

    // Convert LibreSpeed data to our format
    const progress: TestProgress = {
      phase: this.getPhaseFromTestState(data.testState),
      progress: this.getProgressFromTestState(data.testState, data.dlProgress, data.ulProgress, data.pingProgress),
      downloadSpeed: parseFloat(data.dlStatus) || 0,
      uploadSpeed: parseFloat(data.ulStatus) || 0,
      ping: parseFloat(data.pingStatus) || 0,
      jitter: parseFloat(data.jitterStatus) || 0,
      packetLoss: 0, // LibreSpeed doesn't provide packet loss in basic mode
      bufferBloat: { rating: 'A', latencyIncrease: 0 }, // Will be calculated separately
      clientIp: data.clientIp || '',
      serverInfo: this.servers[0],
      elapsedTime: elapsed
    };

    // Update graph data
    if (progress.downloadSpeed > 0 || progress.uploadSpeed > 0) {
      this.graphData.push({
        timestamp: currentTime,
        downloadSpeed: progress.downloadSpeed,
        uploadSpeed: progress.uploadSpeed,
        ping: progress.ping,
        jitter: progress.jitter
      });

      if (this.onGraphUpdate) {
        this.onGraphUpdate([...this.graphData]);
      }
    }

    if (this.onProgress) {
      this.onProgress(progress);
    }
  }

  private handleEnd(aborted: boolean) {
    this.isRunning = false;
    
    if (!aborted && this.onProgress) {
      // Send final results
      const finalProgress: TestProgress = {
        phase: 'complete',
        progress: 1,
        downloadSpeed: this.getMaxSpeed('download'),
        uploadSpeed: this.getMaxSpeed('upload'),
        ping: this.getAveragePing(),
        jitter: this.getAverageJitter(),
        packetLoss: 0,
        bufferBloat: { rating: 'A', latencyIncrease: 0 },
        clientIp: '',
        serverInfo: this.servers[0],
        elapsedTime: (Date.now() - this.startTime) / 1000
      };

      this.onProgress(finalProgress);
    }
  }

  private getPhaseFromTestState(testState: number): TestProgress['phase'] {
    switch (testState) {
      case -1:
      case 0:
        return 'initializing';
      case 1:
        return 'download';
      case 2:
        return 'ping';
      case 3:
        return 'upload';
      case 4:
        return 'complete';
      case 5:
        return 'error';
      default:
        return 'initializing';
    }
  }

  private getProgressFromTestState(testState: number, dlProgress: number, ulProgress: number, pingProgress: number): number {
    switch (testState) {
      case 1: // Download
        return dlProgress || 0;
      case 2: // Ping
        return pingProgress || 0;
      case 3: // Upload
        return ulProgress || 0;
      case 4: // Complete
        return 1;
      default:
        return 0;
    }
  }

  private getMaxSpeed(type: 'download' | 'upload'): number {
    if (this.graphData.length === 0) return 0;
    
    const speeds = this.graphData.map(d => type === 'download' ? d.downloadSpeed : d.uploadSpeed);
    return Math.max(...speeds);
  }

  private getAveragePing(): number {
    if (this.graphData.length === 0) return 0;
    
    const pings = this.graphData.filter(d => d.ping > 0).map(d => d.ping);
    return pings.length > 0 ? pings.reduce((a, b) => a + b, 0) / pings.length : 0;
  }

  private getAverageJitter(): number {
    if (this.graphData.length === 0) return 0;
    
    const jitters = this.graphData.filter(d => d.jitter > 0).map(d => d.jitter);
    return jitters.length > 0 ? jitters.reduce((a, b) => a + b, 0) / jitters.length : 0;
  }

  async runSpeedTest(): Promise<SpeedTestResult> {
    return new Promise(async (resolve, reject) => {
      // Ensure speedtest is initialized
      if (!this.speedtest) {
        try {
          await this.initializeSpeedtest();
        } catch (error) {
          reject(new Error('Failed to initialize LibreSpeed'));
          return;
        }
      }

      if (!this.speedtest) {
        reject(new Error('LibreSpeed not initialized'));
        return;
      }

      this.isRunning = true;
      this.startTime = Date.now();
      this.graphData = [];

      // Override the onend callback to resolve the promise
      const originalOnEnd = this.speedtest.onend;
      this.speedtest.onend = (aborted: boolean) => {
        originalOnEnd.call(this, aborted);
        
        if (aborted) {
          reject(new Error('Test aborted'));
        } else {
          const result: SpeedTestResult = {
            downloadSpeed: this.getMaxSpeed('download'),
            uploadSpeed: this.getMaxSpeed('upload'),
            ping: this.getAveragePing(),
            jitter: this.getAverageJitter(),
            packetLoss: 0,
            bufferBloat: { rating: 'A', latencyIncrease: 0 },
            clientIp: '',
            serverInfo: this.servers[0],
            timestamp: new Date(),
            testDuration: (Date.now() - this.startTime) / 1000,
            graphData: [...this.graphData]
          };
          resolve(result);
        }
      };

      // Start the test
      this.speedtest.start();
    });
  }

  async selectBestServer(): Promise<TestServer> {
    // For now, just return the local server
    // In the future, this could implement server selection logic
    return this.servers[0];
  }

  getAvailableServers(): TestServer[] {
    return [...this.servers];
  }

  setSelectedServer(serverId: string) {
    // For now, we only have one server
    // This method is kept for compatibility
  }

  abort() {
    if (this.speedtest && this.isRunning) {
      this.speedtest.abort();
      this.isRunning = false;
    }
  }

  dispose() {
    this.abort();
    this.speedtest = null;
    this.graphData = [];
  }
}

export default LibreSpeedEngine;