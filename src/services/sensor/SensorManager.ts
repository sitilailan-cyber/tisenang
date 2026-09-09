import { ISensorProvider, SensorReading } from './types';
import { SimulatedSensorProvider } from './SimulatedSensorProvider';

/**
 * SensorManager
 *
 * Abstraksi modular pengelola sensor.
 * Pada tahap saat ini menggunakan SimulatedSensorProvider (simulasi website murni).
 * Ketika di masa depan hardware siap, provider dapat diganti menjadi hardware provider
 * tanpa merombak logika Misi 2, tabel, grafik, maupun ALME.
 */
export class SensorManager {
  private provider: ISensorProvider;

  constructor(provider: ISensorProvider) {
    this.provider = provider;
  }

  public setProvider(newProvider: ISensorProvider): void {
    this.provider = newProvider;
  }

  public getProvider(): ISensorProvider {
    return this.provider;
  }

  public async readSensors(): Promise<SensorReading> {
    return this.provider.read();
  }
}

// Inisialisasi default untuk tahap saat ini:
// SensorManager -> SimulatedSensorProvider
export const defaultSimulatedProvider = new SimulatedSensorProvider();
export const sensorManager = new SensorManager(defaultSimulatedProvider);
