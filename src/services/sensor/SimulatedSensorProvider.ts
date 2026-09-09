import { ISensorProvider, SensorReading } from './types';

/**
 * SimulatedSensorProvider
 *
 * Menghasilkan data sensor simulasi untuk 5 port secara dinamis pada website.
 * Nilai tidak pernah statis dan berfluktuasi secara alami menyerupai respon sensor laboratorium.
 */
export class SimulatedSensorProvider implements ISensorProvider {
  // Baseline values
  private currentTemp = 28.5; // °C
  private currentHumidity = 72; // %
  private motionTickCounter = 0;
  private currentVoltage = 5.1; // V
  private currentCurrent = 0.42; // A
  private currentConductivity = 320; // µS/cm
  private currentLight = 450; // Lux

  // Heating / environmental simulation bias
  private heatBias = 0.05;

  public setEnvironmentalBias(heatBias: number) {
    this.heatBias = heatBias;
  }

  public async read(): Promise<SensorReading> {
    // Port 1: Suhu probe (berfluktuasi halus + sedikit tren naik saat eksperimen)
    const tempNoise = (Math.random() - 0.48) * 0.15;
    this.currentTemp = Math.min(65.0, Math.max(20.0, this.currentTemp + tempNoise + this.heatBias));

    // Port 2: Kelembaban (berfluktuasi antara 65% - 80%)
    const humidityNoise = (Math.random() - 0.5) * 0.6;
    this.currentHumidity = Math.min(95, Math.max(40, this.currentHumidity + humidityNoise));

    // Port 3: Sensor gerak (0 atau 1, sesekali mendeteksi gerakan saat ada getaran/aktivitas)
    this.motionTickCounter++;
    const motion = this.motionTickCounter % 7 === 0 ? 1 : Math.random() > 0.85 ? 1 : 0;

    // Port 4: Tegangan, Arus & Konduktivitas (dinamis dengan noise analog realistis)
    const voltNoise = (Math.random() - 0.5) * 0.04;
    this.currentVoltage = parseFloat(Math.max(4.8, Math.min(5.3, this.currentVoltage + voltNoise)).toFixed(2));

    const currentNoise = (Math.random() - 0.5) * 0.02;
    this.currentCurrent = parseFloat(Math.max(0.35, Math.min(0.55, this.currentCurrent + currentNoise)).toFixed(2));

    const condNoise = (Math.random() - 0.5) * 4;
    this.currentConductivity = Math.round(Math.max(280, Math.min(450, this.currentConductivity + condNoise)));

    // Port 5: Sensor cahaya (lux dinamis)
    const lightNoise = (Math.random() - 0.5) * 12;
    this.currentLight = Math.round(Math.max(100, Math.min(900, this.currentLight + lightNoise)));

    return {
      timestamp: Date.now(),
      port1: {
        temperature: parseFloat(this.currentTemp.toFixed(1)),
      },
      port2: {
        humidity: Math.round(this.currentHumidity),
      },
      port3: {
        motion,
      },
      port4: {
        voltage: this.currentVoltage,
        current: this.currentCurrent,
        conductivity: this.currentConductivity,
      },
      port5: {
        light: this.currentLight,
      },
    };
  }

  public reset(initialTemp = 28.5, initialLight = 450) {
    this.currentTemp = initialTemp;
    this.currentHumidity = 72;
    this.currentVoltage = 5.1;
    this.currentCurrent = 0.42;
    this.currentConductivity = 320;
    this.currentLight = initialLight;
    this.motionTickCounter = 0;
  }
}
