import { SensorReading } from '../../types';

export type { SensorReading };

/**
 * Interface untuk Sensor Provider.
 * Memungkinkan pergantian mulus dari simulator website ke hardware nyata di masa depan.
 */
export interface ISensorProvider {
  /** Membaca satu frame pembacaan dari 5 port sensor */
  read(): Promise<SensorReading>;

  /** Memulai stream pembacaan jika diperlukan */
  start?(): void;

  /** Menghentikan stream pembacaan */
  stop?(): void;
}

/**
 * PLACEHOLDER ARSITEKTUR UNTUK MASA DEPAN (FutureHardwareProvider).
 *
 * PENTING:
 * Saat ini kita MASIH DALAM TAHAP WEBSITE DAN SIMULASI.
 * Placeholder ini disediakan murni sebagai kontrak arsitektur agar di masa depan,
 * saat hardware ESP32 atau sensor fisik siap diintegrasikan, pengembang hanya perlu
 * mengimplementasikan ISensorProvider tanpa merusak Misi 2, tabel, grafik, ALME, ataupun portofolio.
 *
 * JANGAN mengaktifkan koneksi hardware pada tahap ini!
 */
export class FutureHardwareProvider implements ISensorProvider {
  async read(): Promise<SensorReading> {
    throw new Error(
      'FutureHardwareProvider belum diimplementasikan. Gunakan SimulatedSensorProvider untuk tahap simulasi website.'
    );
  }
}
