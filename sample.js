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

'use strict';

/**
 * Enum untuk jenis kompresi yang didukung
 */
const CompressionType = {
    IMAGE: 'image',
    VIDEO: 'video',
    CODE: 'code',
    FILE: 'file'
};

/**
 * Enum untuk format gambar yang didukung
 */
const ImageFormat = {
    JPEG: 'jpeg',
    PNG: 'png',
    WEBP: 'webp',
    GIF: 'gif'
};

/**
 * Enum untuk format video yang didukung
 */
const VideoFormat = {
    MP4: 'mp4',
    WEBM: 'webm',
    AVI: 'avi',
    MOV: 'mov'
};

/**
 * Class untuk pengaturan kompresi
 */
class CompressionSettings {
    constructor(options = {}) {
        this.quality = options.quality || 80;
        this.maxWidth = options.maxWidth || 1920;
        this.maxHeight = options.maxHeight || 1080;
        this.fps = options.fps || 30;
        this.bitrate = options.bitrate || null;
        this.removeComments = options.removeComments !== false;
        this.removeWhitespace = options.removeWhitespace !== false;
        this.minifyKeys = options.minifyKeys || false;
    }
}

/**
 * Kelas utama untuk menangani kompresi berbagai jenis file
 */
class FileCompressor {
    constructor() {
        this.supportedImageFormats = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        this.supportedVideoFormats = ['.mp4', '.webm', '.avi', '.mov'];
        this.supportedCodeFormats = ['.js', '.html', '.css', '.json', '.xml', '.py', '.php'];
        
        this.defaultSettings = new CompressionSettings();
        
        console.log('FileCompressor initialized successfully');
    }
    
    /**
     * Mendeteksi jenis file berdasarkan ekstensi
     * 
     * @param {string} filePath - Path ke file yang akan dianalisis
     * @returns {string} Jenis kompresi yang sesuai
     * @throws {Error} Jika format file tidak didukung
     */
    detectFileType(filePath) {
        const fileExtension = '.' + filePath.split('.').pop().toLowerCase();
        
        if (this.supportedImageFormats.includes(fileExtension)) {
            return CompressionType.IMAGE;
        } else if (this.supportedVideoFormats.includes(fileExtension)) {
            return CompressionType.VIDEO;
        } else if (this.supportedCodeFormats.includes(fileExtension)) {
            return CompressionType.CODE;
        } else {
            return CompressionType.FILE;
        }
    }
    
    /**
     * Kompresi file gambar dengan pengaturan yang diberikan
     * 
     * @param {string} inputPath - Path file input
     * @param {string} outputPath - Path file output
     * @param {CompressionSettings} settings - Pengaturan kompresi
     * @returns {Promise<Object>} Statistik kompresi
     * @throws {Error} Jika terjadi error saat kompresi
     */
    async compressImage(inputPath, outputPath, settings) {
        try {
            // Simulasi kompresi gambar
            const originalSize = 1024 * 1024; // 1MB simulasi
            const compressedSize = Math.floor(originalSize * (settings.quality / 100));
            
            // Simulasi penulisan file terkompresi
            const compressedContent = `Compressed image with quality ${settings.quality}%`;
            
            const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;
            
            console.log(`Image compressed successfully: ${compressionRatio.toFixed(2)}% reduction`);
            
            return {
                originalSize: originalSize,
                compressedSize: compressedSize,
                compressionRatio: compressionRatio,
                quality: settings.quality
            };
            
        } catch (error) {
            console.error('Error compressing image:', error.message);
            throw new Error(`Failed to compress image: ${error.message}`);
        }
    }
    
    /**
     * Kompresi file video dengan pengaturan yang diberikan
     * 
     * @param {string} inputPath - Path file input
     * @param {string} outputPath - Path file output
     * @param {CompressionSettings} settings - Pengaturan kompresi
     * @returns {Promise<Object>} Statistik kompresi
     * @throws {Error} Jika terjadi error saat kompresi
     */
    async compressVideo(inputPath, outputPath, settings) {
        try {
            // Simulasi kompresi video
            const originalSize = 50 * 1024 * 1024; // 50MB simulasi
            const compressedSize = Math.floor(originalSize * (settings.quality / 100) * 0.8);
            
            // Simulasi penulisan file terkompresi
            const compressedContent = `Compressed video with quality ${settings.quality}% and ${settings.fps} FPS`;
            
            const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;
            
            console.log(`Video compressed successfully: ${compressionRatio.toFixed(2)}% reduction`);
            
            return {
                originalSize: originalSize,
                compressedSize: compressedSize,
                compressionRatio: compressionRatio,
                quality: settings.quality,
                fps: settings.fps
            };
            
        } catch (error) {
            console.error('Error compressing video:', error.message);
            throw new Error(`Failed to compress video: ${error.message}`);
        }
    }
    
    /**
     * Kompresi file kode dengan pengaturan yang diberikan
     * 
     * @param {string} inputPath - Path file input
     * @param {string} outputPath - Path file output
     * @param {CompressionSettings} settings - Pengaturan kompresi
     * @returns {Promise<Object>} Statistik kompresi
     * @throws {Error} Jika terjadi error saat kompresi
     */
    async compressCode(inputPath, outputPath, settings) {
        try {
            // Simulasi membaca file
            const originalCode = this.getSampleCode();
            let compressedCode = originalCode;
            
            // Hapus komentar jika diaktifkan
            if (settings.removeComments) {
                compressedCode = this.removeComments(compressedCode);
            }
            
            // Hapus whitespace jika diaktifkan
            if (settings.removeWhitespace) {
                compressedCode = this.removeWhitespace(compressedCode);
            }
            
            // Minify keys jika diaktifkan
            if (settings.minifyKeys) {
                compressedCode = this.minifyKeys(compressedCode);
            }
            
            const originalSize = originalCode.length;
            const compressedSize = compressedCode.length;
            const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;
            
            console.log(`Code compressed successfully: ${compressionRatio.toFixed(2)}% reduction`);
            
            return {
                originalSize: originalSize,
                compressedSize: compressedSize,
                compressionRatio: compressionRatio,
                charactersRemoved: originalSize - compressedSize
            };
            
        } catch (error) {
            console.error('Error compressing code:', error.message);
            throw new Error(`Failed to compress code: ${error.message}`);
        }
    }
    
    /**
     * Hapus komentar dari kode JavaScript
     * 
     * @param {string} code - Kode yang akan dibersihkan
     * @returns {string} Kode tanpa komentar
     */
    removeComments(code) {
        // Hapus komentar multi-line /* */
        code = code.replace(/\/\*[\s\S]*?\*\//g, '');
        
        // Hapus komentar single-line //
        code = code.replace(/\/\/.*$/gm, '');
        
        return code;
    }
    
    /**
     * Hapus whitespace berlebih dari kode
     * 
     * @param {string} code - Kode yang akan dibersihkan
     * @returns {string} Kode tanpa whitespace berlebih
     */
    removeWhitespace(code) {
        // Hapus spasi di awal dan akhir
        code = code.trim();
        
        // Hapus baris kosong berlebih
        const lines = code.split('\n');
        const cleanedLines = [];
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine) {
                cleanedLines.push(trimmedLine);
            }
        }
        
        return cleanedLines.join('\n');
    }
    
    /**
     * Minify key names dalam JSON atau object
     * 
     * @param {string} code - Kode yang akan diminify
     * @returns {string} Kode dengan key yang diminify
     */
    minifyKeys(code) {
        // Implementasi sederhana untuk minify keys
        code = code.replace(/"name"/g, '"n"');
        code = code.replace(/"description"/g, '"d"');
        code = code.replace(/"title"/g, '"t"');
        code = code.replace(/"content"/g, '"c"');
        code = code.replace(/"value"/g, '"v"');
        
        return code;
    }
    
    /**
     * Mendapatkan statistik file sebelum kompresi
     * 
     * @param {string} inputPath - Path ke file input
     * @returns {Object} Statistik file
     * @throws {Error} Jika terjadi error saat membaca file
     */
    getCompressionStats(inputPath) {
        try {
            const fileType = this.detectFileType(inputPath);
            const fileSize = 1024 * 1024; // 1MB simulasi
            
            const stats = {
                filePath: inputPath,
                fileSize: fileSize,
                fileType: fileType,
                fileExtension: '.' + inputPath.split('.').pop().toLowerCase(),
                canCompress: fileType !== CompressionType.FILE
            };
            
            // Tambahan statistik berdasarkan jenis file
            if (fileType === CompressionType.CODE) {
                const sampleCode = this.getSampleCode();
                stats.lineCount = sampleCode.split('\n').length;
                stats.characterCount = sampleCode.length;
                stats.wordCount = sampleCode.split(/\s+/).length;
            }
            
            return stats;
            
        } catch (error) {
            console.error('Error getting file stats:', error.message);
            throw new Error(`Failed to get file stats: ${error.message}`);
        }
    }
    
    /**
     * Mendapatkan daftar format file yang didukung
     * 
     * @returns {Object} Daftar format file yang didukung
     */
    getSupportedFormats() {
        return {
            images: this.supportedImageFormats,
            videos: this.supportedVideoFormats,
            code: this.supportedCodeFormats
        };
    }
    
    /**
     * Mendapatkan sample code untuk testing
     * 
     * @returns {string} Sample code
     */
    getSampleCode() {
        return `
            // Sample JavaScript code for testing
            const sampleData = {
                name: "Test User",
                description: "This is a test user for compression testing",
                age: 25,
                email: "test@example.com",
                preferences: {
                    theme: "dark",
                    language: "en",
                    notifications: true
                }
            };
            
            function processData(data) {
                // Process the data
                const processed = {
                    ...data,
                    processed: true,
                    timestamp: new Date().toISOString()
                };
                
                return processed;
            }
            
            // Export the function
            module.exports = {
                processData,
                sampleData
            };
        `;
    }
}

/**
 * Utility functions
 */
class CompressionUtils {
    /**
     * Format bytes ke human readable format
     * 
     * @param {number} bytes - Jumlah bytes
     * @param {number} decimals - Jumlah desimal
     * @returns {string} Formatted string
     */
    static formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    
    /**
     * Format duration ke human readable format
     * 
     * @param {number} seconds - Jumlah detik
     * @returns {string} Formatted string
     */
    static formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
    }
    
    /**
     * Format bitrate ke human readable format
     * 
     * @param {number} bitsPerSecond - Bitrate dalam bits per second
     * @returns {string} Formatted string
     */
    static formatBitrate(bitsPerSecond) {
        if (bitsPerSecond >= 1000000000) {
            return (bitsPerSecond / 1000000000).toFixed(1) + ' Gbps';
        } else if (bitsPerSecond >= 1000000) {
            return (bitsPerSecond / 1000000).toFixed(1) + ' Mbps';
        } else if (bitsPerSecond >= 1000) {
            return (bitsPerSecond / 1000).toFixed(1) + ' Kbps';
        } else {
            return bitsPerSecond + ' bps';
        }
    }
}

/**
 * Fungsi utama untuk demonstrasi
 */
function main() {
    console.log('=== Aplikasi Kompres & De-kompres ===');
    console.log('Versi: 2.0.0');
    console.log('Author: AI Assistant');
    console.log('Language: JavaScript');
    console.log();
    
    // Inisialisasi compressor
    const compressor = new FileCompressor();
    
    // Contoh penggunaan
    const testFiles = [
        'sample.json',
        'sample.py',
        'sample.php',
        'sample.js'
    ];
    
    for (const filePath of testFiles) {
        try {
            const stats = compressor.getCompressionStats(filePath);
            console.log(`File: ${filePath}`);
            console.log(`  Size: ${CompressionUtils.formatBytes(stats.fileSize)}`);
            console.log(`  Type: ${stats.fileType}`);
            console.log(`  Can compress: ${stats.canCompress ? 'Yes' : 'No'}`);
            
            if (stats.fileType === CompressionType.CODE) {
                console.log(`  Lines: ${stats.lineCount}`);
                console.log(`  Characters: ${stats.characterCount}`);
                console.log(`  Words: ${stats.wordCount}`);
            }
            
            console.log();
            
        } catch (error) {
            console.error(`Error processing ${filePath}:`, error.message);
        }
    }
    
    console.log('Demo completed successfully!');
}

// Export classes untuk penggunaan di module lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FileCompressor,
        CompressionSettings,
        CompressionType,
        ImageFormat,
        VideoFormat,
        CompressionUtils,
        main
    };
}

// Jalankan fungsi utama jika dijalankan langsung
if (typeof window === 'undefined') {
    main();
} 