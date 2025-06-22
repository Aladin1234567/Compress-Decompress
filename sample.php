<?php
/**
 * Aplikasi Kompres & De-kompres
 * =============================
 * 
 * Aplikasi web modern untuk kompresi file gambar, video, dan kode.
 * Mendukung berbagai format file dengan pengaturan kompresi yang fleksibel.
 * 
 * @author AI Assistant
 * @version 2.0.0
 * @license MIT
 */

declare(strict_types=1);

namespace CompressionApp;

use Exception;
use InvalidArgumentException;
use RuntimeException;

/**
 * Class untuk jenis kompresi yang didukung
 */
class CompressionType
{
    public const IMAGE = 'image';
    public const VIDEO = 'video';
    public const CODE = 'code';
    public const FILE = 'file';
}

/**
 * Class untuk format gambar yang didukung
 */
class ImageFormat
{
    public const JPEG = 'jpeg';
    public const PNG = 'png';
    public const WEBP = 'webp';
    public const GIF = 'gif';
}

/**
 * Class untuk format video yang didukung
 */
class VideoFormat
{
    public const MP4 = 'mp4';
    public const WEBM = 'webm';
    public const AVI = 'avi';
    public const MOV = 'mov';
}

/**
 * Data class untuk pengaturan kompresi
 */
class CompressionSettings
{
    public int $quality;
    public int $maxWidth;
    public int $maxHeight;
    public int $fps;
    public ?int $bitrate;
    public bool $removeComments;
    public bool $removeWhitespace;
    public bool $minifyKeys;
    
    public function __construct(
        int $quality = 80,
        int $maxWidth = 1920,
        int $maxHeight = 1080,
        int $fps = 30,
        ?int $bitrate = null,
        bool $removeComments = true,
        bool $removeWhitespace = true,
        bool $minifyKeys = false
    ) {
        $this->quality = $quality;
        $this->maxWidth = $maxWidth;
        $this->maxHeight = $maxHeight;
        $this->fps = $fps;
        $this->bitrate = $bitrate;
        $this->removeComments = $removeComments;
        $this->removeWhitespace = $removeWhitespace;
        $this->minifyKeys = $minifyKeys;
    }
}

/**
 * Kelas utama untuk menangani kompresi berbagai jenis file
 */
class FileCompressor
{
    private array $supportedImageFormats = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    private array $supportedVideoFormats = ['.mp4', '.webm', '.avi', '.mov'];
    private array $supportedCodeFormats = ['.php', '.js', '.html', '.css', '.json', '.xml', '.py'];
    
    private CompressionSettings $defaultSettings;
    
    public function __construct()
    {
        $this->defaultSettings = new CompressionSettings();
        error_log("FileCompressor initialized successfully");
    }
    
    /**
     * Mendeteksi jenis file berdasarkan ekstensi
     * 
     * @param string $filePath Path ke file yang akan dianalisis
     * @return string Jenis kompresi yang sesuai
     * @throws InvalidArgumentException Jika format file tidak didukung
     */
    public function detectFileType(string $filePath): string
    {
        $fileExtension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        $fileExtension = '.' . $fileExtension;
        
        if (in_array($fileExtension, $this->supportedImageFormats)) {
            return CompressionType::IMAGE;
        } elseif (in_array($fileExtension, $this->supportedVideoFormats)) {
            return CompressionType::VIDEO;
        } elseif (in_array($fileExtension, $this->supportedCodeFormats)) {
            return CompressionType::CODE;
        } else {
            return CompressionType::FILE;
        }
    }
    
    /**
     * Kompresi file gambar dengan pengaturan yang diberikan
     * 
     * @param string $inputPath Path file input
     * @param string $outputPath Path file output
     * @param CompressionSettings $settings Pengaturan kompresi
     * @return array Statistik kompresi
     * @throws RuntimeException Jika terjadi error saat kompresi
     */
    public function compressImage(string $inputPath, string $outputPath, CompressionSettings $settings): array
    {
        try {
            // Validasi file input
            if (!file_exists($inputPath)) {
                throw new RuntimeException("Input file not found: {$inputPath}");
            }
            
            // Simulasi kompresi gambar
            $originalSize = filesize($inputPath);
            $compressedSize = (int)($originalSize * ($settings->quality / 100));
            
            // Simulasi penulisan file terkompresi
            $compressedContent = "Compressed image with quality {$settings->quality}%";
            file_put_contents($outputPath, $compressedContent);
            
            $compressionRatio = (($originalSize - $compressedSize) / $originalSize) * 100;
            
            error_log("Image compressed successfully: {$compressionRatio}% reduction");
            
            return [
                'original_size' => $originalSize,
                'compressed_size' => $compressedSize,
                'compression_ratio' => $compressionRatio,
                'quality' => $settings->quality
            ];
            
        } catch (Exception $e) {
            error_log("Error compressing image: " . $e->getMessage());
            throw new RuntimeException("Failed to compress image: " . $e->getMessage());
        }
    }
    
    /**
     * Kompresi file video dengan pengaturan yang diberikan
     * 
     * @param string $inputPath Path file input
     * @param string $outputPath Path file output
     * @param CompressionSettings $settings Pengaturan kompresi
     * @return array Statistik kompresi
     * @throws RuntimeException Jika terjadi error saat kompresi
     */
    public function compressVideo(string $inputPath, string $outputPath, CompressionSettings $settings): array
    {
        try {
            // Validasi file input
            if (!file_exists($inputPath)) {
                throw new RuntimeException("Input file not found: {$inputPath}");
            }
            
            // Simulasi kompresi video
            $originalSize = filesize($inputPath);
            $compressedSize = (int)($originalSize * ($settings->quality / 100) * 0.8);
            
            // Simulasi penulisan file terkompresi
            $compressedContent = "Compressed video with quality {$settings->quality}% and {$settings->fps} FPS";
            file_put_contents($outputPath, $compressedContent);
            
            $compressionRatio = (($originalSize - $compressedSize) / $originalSize) * 100;
            
            error_log("Video compressed successfully: {$compressionRatio}% reduction");
            
            return [
                'original_size' => $originalSize,
                'compressed_size' => $compressedSize,
                'compression_ratio' => $compressionRatio,
                'quality' => $settings->quality,
                'fps' => $settings->fps
            ];
            
        } catch (Exception $e) {
            error_log("Error compressing video: " . $e->getMessage());
            throw new RuntimeException("Failed to compress video: " . $e->getMessage());
        }
    }
    
    /**
     * Kompresi file kode dengan pengaturan yang diberikan
     * 
     * @param string $inputPath Path file input
     * @param string $outputPath Path file output
     * @param CompressionSettings $settings Pengaturan kompresi
     * @return array Statistik kompresi
     * @throws RuntimeException Jika terjadi error saat kompresi
     */
    public function compressCode(string $inputPath, string $outputPath, CompressionSettings $settings): array
    {
        try {
            // Validasi file input
            if (!file_exists($inputPath)) {
                throw new RuntimeException("Input file not found: {$inputPath}");
            }
            
            $originalCode = file_get_contents($inputPath);
            $compressedCode = $originalCode;
            
            // Hapus komentar jika diaktifkan
            if ($settings->removeComments) {
                $compressedCode = $this->removeComments($compressedCode);
            }
            
            // Hapus whitespace jika diaktifkan
            if ($settings->removeWhitespace) {
                $compressedCode = $this->removeWhitespace($compressedCode);
            }
            
            // Minify keys jika diaktifkan
            if ($settings->minifyKeys) {
                $compressedCode = $this->minifyKeys($compressedCode);
            }
            
            // Tulis file terkompresi
            file_put_contents($outputPath, $compressedCode);
            
            $originalSize = strlen($originalCode);
            $compressedSize = strlen($compressedCode);
            $compressionRatio = (($originalSize - $compressedSize) / $originalSize) * 100;
            
            error_log("Code compressed successfully: {$compressionRatio}% reduction");
            
            return [
                'original_size' => $originalSize,
                'compressed_size' => $compressedSize,
                'compression_ratio' => $compressionRatio,
                'characters_removed' => $originalSize - $compressedSize
            ];
            
        } catch (Exception $e) {
            error_log("Error compressing code: " . $e->getMessage());
            throw new RuntimeException("Failed to compress code: " . $e->getMessage());
        }
    }
    
    /**
     * Hapus komentar dari kode PHP
     * 
     * @param string $code Kode yang akan dibersihkan
     * @return string Kode tanpa komentar
     */
    private function removeComments(string $code): string
    {
        // Hapus komentar multi-line /* */
        $code = preg_replace('/\/\*[\s\S]*?\*\//', '', $code);
        
        // Hapus komentar single-line //
        $code = preg_replace('/\/\/.*$/m', '', $code);
        
        // Hapus komentar hash #
        $code = preg_replace('/#.*$/m', '', $code);
        
        return $code;
    }
    
    /**
     * Hapus whitespace berlebih dari kode
     * 
     * @param string $code Kode yang akan dibersihkan
     * @return string Kode tanpa whitespace berlebih
     */
    private function removeWhitespace(string $code): string
    {
        // Hapus spasi di awal dan akhir
        $code = trim($code);
        
        // Hapus baris kosong berlebih
        $lines = explode("\n", $code);
        $cleanedLines = [];
        
        foreach ($lines as $line) {
            $line = trim($line);
            if (!empty($line)) {
                $cleanedLines[] = $line;
            }
        }
        
        return implode("\n", $cleanedLines);
    }
    
    /**
     * Minify key names dalam JSON atau array
     * 
     * @param string $code Kode yang akan diminify
     * @return string Kode dengan key yang diminify
     */
    private function minifyKeys(string $code): string
    {
        // Implementasi sederhana untuk minify keys
        $code = str_replace('"name"', '"n"', $code);
        $code = str_replace('"description"', '"d"', $code);
        $code = str_replace('"title"', '"t"', $code);
        $code = str_replace('"content"', '"c"', $code);
        $code = str_replace('"value"', '"v"', $code);
        
        return $code;
    }
    
    /**
     * Mendapatkan statistik file sebelum kompresi
     * 
     * @param string $inputPath Path ke file input
     * @return array Statistik file
     * @throws RuntimeException Jika terjadi error saat membaca file
     */
    public function getCompressionStats(string $inputPath): array
    {
        try {
            if (!file_exists($inputPath)) {
                throw new RuntimeException("File not found: {$inputPath}");
            }
            
            $fileSize = filesize($inputPath);
            $fileType = $this->detectFileType($inputPath);
            
            $stats = [
                'file_path' => $inputPath,
                'file_size' => $fileSize,
                'file_type' => $fileType,
                'file_extension' => '.' . strtolower(pathinfo($inputPath, PATHINFO_EXTENSION)),
                'can_compress' => $fileType !== CompressionType::FILE
            ];
            
            // Tambahan statistik berdasarkan jenis file
            if ($fileType === CompressionType::CODE) {
                $content = file_get_contents($inputPath);
                $stats['line_count'] = count(explode("\n", $content));
                $stats['character_count'] = strlen($content);
                $stats['word_count'] = str_word_count($content);
            }
            
            return $stats;
            
        } catch (Exception $e) {
            error_log("Error getting file stats: " . $e->getMessage());
            throw new RuntimeException("Failed to get file stats: " . $e->getMessage());
        }
    }
    
    /**
     * Mendapatkan daftar format file yang didukung
     * 
     * @return array Daftar format file yang didukung
     */
    public function getSupportedFormats(): array
    {
        return [
            'images' => $this->supportedImageFormats,
            'videos' => $this->supportedVideoFormats,
            'code' => $this->supportedCodeFormats
        ];
    }
}

/**
 * Fungsi utama untuk demonstrasi
 */
function main(): void
{
    echo "=== Aplikasi Kompres & De-kompres ===\n";
    echo "Versi: 2.0.0\n";
    echo "Author: AI Assistant\n";
    echo "Language: PHP\n\n";
    
    // Inisialisasi compressor
    $compressor = new FileCompressor();
    
    // Contoh penggunaan
    $testFiles = [
        'sample.json',
        'sample.py',
        'sample.php'
    ];
    
    foreach ($testFiles as $filePath) {
        if (file_exists($filePath)) {
            try {
                $stats = $compressor->getCompressionStats($filePath);
                echo "File: {$filePath}\n";
                echo "  Size: {$stats['file_size']} bytes\n";
                echo "  Type: {$stats['file_type']}\n";
                echo "  Can compress: " . ($stats['can_compress'] ? 'Yes' : 'No') . "\n";
                
                if ($stats['file_type'] === 'code') {
                    echo "  Lines: {$stats['line_count']}\n";
                    echo "  Characters: {$stats['character_count']}\n";
                    echo "  Words: {$stats['word_count']}\n";
                }
                
                echo "\n";
                
            } catch (Exception $e) {
                echo "Error processing {$filePath}: " . $e->getMessage() . "\n";
            }
        } else {
            echo "File {$filePath} not found\n";
        }
    }
    
    echo "Demo completed successfully!\n";
}

// Jalankan fungsi utama jika file dijalankan langsung
if (basename(__FILE__) === basename($_SERVER['SCRIPT_NAME'])) {
    main();
}
?> 