import {
  AlmeRecommendation,
  PortfolioEvidence,
  TemanBerpikirEvidence,
} from '../../types';

export interface AlmeInputData {
  quizScore?: number;
  experimentResultScore?: number;
  practiceScore?: number;
  assessmentResultScore?: number;
  literacyScore: number;
  numeracyScore: number;
  reasoningScore: number;
  missionProgressPercent?: number;
  completionTimeSeconds?: number; // untuk deteksi 'waktu sangat cepat'
  portfolioEvidence?: PortfolioEvidence;
  temanBerpikirEvidence?: TemanBerpikirEvidence;
  currentDifficulty?: number; // 1 to 5
}

/**
 * ALME (Adaptive Learning & Metacognitive Engine)
 * Pure Rule-Based JavaScript Engine — Tanpa External AI API.
 *
 * Mengikuti 7 tingkatan prioritas:
 * 1. Remedial (<60)
 * 2. Help Mission (Teman Berpikir level 3 / kesulitan terdeteksi)
 * 3. Numeracy (<80) / Literacy (<80) / Reasoning (<80)
 * 4. Strengthening (60-79)
 * 5. Continue (80-89)
 * 6. Enrichment (>=90)
 * 7. Difficulty Up (score >=90 dan waktu sangat cepat)
 */
export class AlmeEngine {
  public static analyze(input: AlmeInputData): AlmeRecommendation {
    const scores = [
      input.quizScore,
      input.experimentResultScore,
      input.practiceScore,
      input.assessmentResultScore,
    ].filter((s): s is number => typeof s === 'number');

    const averageScore = scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : 75;

    let difficulty = input.currentDifficulty || 2;
    difficulty = Math.min(5, Math.max(1, difficulty));

    // =========================================================================
    // PRIORITAS 1: REMEDIAL (Skor < 60)
    // =========================================================================
    if (averageScore < 60) {
      const current = Math.round(averageScore);
      const target = 75;
      const gap = target - current;

      return {
        type: 'Remedial',
        title: 'Misi Remedial Terpandu',
        message: `Skor capaian Anda saat ini ${current}. Target ketuntasan minimal adalah ${target}.`,
        current: `${current}/100`,
        target: `${target}/100`,
        gap: `-${gap} poin`,
        reason: 'Rerata evaluasi konsep di bawah standar minimal ketuntasan (60).',
        actionText: 'Mulai Remedial',
        whyExplanation:
          'ALME mendeteksi beberapa konsep dasar yang membutuhkan penguatan kembali dengan scaffolding bertahap sebelum melanjutkan ke materi yang lebih kompleks.',
        difficultyLevel: Math.max(1, difficulty - 1),
      };
    }

    // =========================================================================
    // PRIORITAS 2: HELP MISSION (Bantuan Metakognitif / Scaffold Teman Berpikir)
    // =========================================================================
    if (
      input.temanBerpikirEvidence &&
      input.temanBerpikirEvidence.hintLevelReached >= 3
    ) {
      return {
        type: 'Help Mission',
        title: 'Misi Pendampingan Bersama Teman Berpikir',
        message:
          'Anda telah menggunakan 3 level petunjuk berturut-turut pada analisis data.',
        current: 'Level 3 Hint',
        target: 'Penyelesaian Mandiri (Level 1)',
        gap: 'Butuh Scaffolding Konsep',
        reason:
          'Deteksi tantangan kognitif saat merumuskan analisis dan hubungan variabel.',
        actionText: 'Konsultasi Bersama ALME',
        whyExplanation:
          'Teman Berpikir mencatat bahwa Anda mencapai batas hint maksimal. Sesi pendampingan konsep singkat disiapkan agar Anda dapat memecahkan masalah ini dengan percaya diri.',
        difficultyLevel: difficulty,
      };
    }

    // =========================================================================
    // PRIORITAS 3: NUMERACY / LITERACY / REASONING MISSIONS
    // =========================================================================
    // 3A. Numeracy < 80
    if (input.numeracyScore < 80) {
      const current = input.numeracyScore;
      const target = 80;
      const gap = target - current;

      return {
        type: 'Numeracy',
        title: 'Misi Penguatan Numerasi Sains',
        message: `Numerasi kamu masih ${current}. Target berikutnya ${target}.`,
        current,
        target,
        gap: `-${gap}`,
        reason:
          'Kemampuan membaca skala sensor dan mengolah data kuantitatif tabel perlu ditingkatkan.',
        actionText: 'Mulai Misi Numerasi',
        whyExplanation:
          'Misi eksplorasi MIPA memerlukan pemahaman membaca grafik dan kalkulasi kalor yang akurat untuk menarik kesimpulan yang valid.',
        difficultyLevel: difficulty,
      };
    }

    // 3B. Literacy < 80
    if (input.literacyScore < 80) {
      const current = input.literacyScore;
      const target = 80;
      const gap = target - current;

      return {
        type: 'Literacy',
        title: 'Misi Literasi Saintifik & Refleksi',
        message: `Literasi saintifik kamu berada di angka ${current}. Target pencapaian berikutnya ${target}.`,
        current,
        target,
        gap: `-${gap}`,
        reason:
          'Artikulasi argumen ilmiah dan sintesis kesimpulan pada portofolio dapat diperdalam.',
        actionText: 'Mulai Misi Literasi',
        whyExplanation:
          'Menuliskan refleksi yang bermakna adalah bagian inti dari pembelajaran Mindful. Tingkatkan kemampuan menyusun kalimat fakta dan opini saintifik.',
        difficultyLevel: difficulty,
      };
    }

    // 3C. Reasoning < 80
    if (input.reasoningScore < 80) {
      const current = input.reasoningScore;
      const target = 80;
      const gap = target - current;

      return {
        type: 'Reasoning',
        title: 'Misi Penalaran Logika Sebab-Akibat',
        message: `Skor penalaran saintifik kamu tercatat ${current}. Target capaian berikutnya ${target}.`,
        current,
        target,
        gap: `-${gap}`,
        reason:
          'Penjelasan hubungan sebab-akibat antar variabel penelitian memerlukan ketajaman komparasi.',
        actionText: 'Mulai Misi Penalaran',
        whyExplanation:
          'Mengidentifikasi mengapa suhu air naik ketika intensitas cahaya bertambah membutuhkan pemikiran kritis tingkat tinggi (HOTS).',
        difficultyLevel: difficulty,
      };
    }

    // =========================================================================
    // PRIORITAS 7: DIFFICULTY UP (Skor >= 90 dan waktu sangat cepat)
    // =========================================================================
    const isVeryFast =
      typeof input.completionTimeSeconds === 'number' &&
      input.completionTimeSeconds > 0 &&
      input.completionTimeSeconds < 120; // di bawah 2 menit

    if (averageScore >= 90 && isVeryFast) {
      const newDiff = Math.min(5, difficulty + 1);
      return {
        type: 'Difficulty Up',
        title: 'Tantangan Master MIPA (Level Kesulitan Naik)',
        message: `Luar biasa! Skor ${Math.round(averageScore)} dicapai dalam waktu sangat cepat (${input.completionTimeSeconds}s).`,
        current: `Tingkat ${difficulty}`,
        target: `Tingkat ${newDiff}`,
        gap: '+1 Level',
        reason:
          'Penguasaan materi sangat cepat dan akurat. Sistem meningkatkan kompleksitas tantangan.',
        actionText: 'Terima Tantangan Baru',
        whyExplanation:
          'ALME mendeteksi potensi akselerasi belajar. Menaikkan level kesulitan menjaga zona belajar Anda tetap berada dalam titik tantangan optimal (flow state).',
        difficultyLevel: newDiff,
      };
    }

    // =========================================================================
    // PRIORITAS 6: ENRICHMENT (Skor >= 90)
    // =========================================================================
    if (averageScore >= 90) {
      return {
        type: 'Enrichment',
        title: 'Misi Pengayaan Saintifik (Enrichment)',
        message: `Skor Anda ${Math.round(averageScore)} (Sangat Memuaskan). Waktunya mengeksplorasi studi kasus nyata!`,
        current: `${Math.round(averageScore)}/100`,
        target: 'Eksplorasi Mandiri',
        gap: 'Tuntas Utama',
        reason:
          'Telah menguasai konsep dasar dengan sempurna. Siap untuk proyek pemecahan masalah terbuka.',
        actionText: 'Mulai Pengayaan',
        whyExplanation:
          'Pembelajaran bermakna mendorong murid yang telah tuntas untuk mengaplikasikan sains dalam konteks teknologi masa depan dan energi terbarukan.',
        difficultyLevel: Math.min(5, difficulty + 1),
      };
    }

    // =========================================================================
    // PRIORITAS 4: STRENGTHENING (60 - 79)
    // =========================================================================
    if (averageScore >= 60 && averageScore <= 79) {
      const current = Math.round(averageScore);
      const target = 85;
      const gap = target - current;

      return {
        type: 'Strengthening',
        title: 'Misi Pemantapan Pemahaman (Strengthening)',
        message: `Skor capaian Anda ${current}. Target pemantapan berikutnya adalah ${target}.`,
        current: `${current}/100`,
        target: `${target}/100`,
        gap: `-${gap} poin`,
        reason:
          'Pemahaman dasar sudah terbentuk, namun membutuhkan latihan variasi studi kasus.',
        actionText: 'Coba Latihan Pemantapan',
        whyExplanation:
          'Latihan terarah akan mengubah pemahaman yang masih ragu-ragu menjadi penguasaan konsep yang solid sebelum melangkah ke misi asesmen.',
        difficultyLevel: difficulty,
      };
    }

    // =========================================================================
    // PRIORITAS 5: CONTINUE (80 - 89)
    // =========================================================================
    return {
      type: 'Continue',
      title: 'Lanjutkan Alur Misi Pembelajaran',
      message: `Progres belajar Anda sangat baik (Skor ${Math.round(averageScore)}). Lanjutkan ke misi berikutnya!`,
      current: `${Math.round(averageScore)}/100`,
      target: 'Misi Berikutnya',
      gap: 'Sesuai Target',
      reason: 'Semua indikator capaian berada dalam rentang target optimal.',
      actionText: 'Lanjutkan Misi',
      whyExplanation:
        'Konsistensi belajar Anda sudah tepat sasaran. Melanjutkan misi utama secara berurutan akan menjaga kesinambungan pemahaman Anda.',
      difficultyLevel: difficulty,
    };
  }
}
