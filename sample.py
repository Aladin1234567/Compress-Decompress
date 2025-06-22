#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Aplikasi Kompres & De-kompres
=============================

Aplikasi web modern untuk kompresi file gambar, video, dan kode.
Mendukung berbagai format file dengan pengaturan kompresi yang fleksibel.

Author: AI Assistant
Version: 2.0.0
License: MIT
"""

import json
import os
import sys
from typing import Dict, List, Optional, Tuple, Union
from dataclasses import dataclass
from enum import Enum
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class CompressionType(Enum):
    """Enum untuk jenis kompresi yang didukung."""
    IMAGE = "image"
    VIDEO = "video"
    CODE = "code"
    FILE = "file"


class ImageFormat(Enum):
    """Enum untuk format gambar yang didukung."""
    JPEG = "jpeg"
    PNG = "png"
    WEBP = "webp"
    GIF = "gif"


class VideoFormat(Enum):
    """Enum untuk format video yang didukung."""
    MP4 = "mp4"
    WEBM = "webm"
    AVI = "avi"
    MOV = "mov"


@dataclass
class CompressionSettings:
    """Data class untuk pengaturan kompresi."""
    quality: int = 80
    max_width: int = 1920
    max_height: int = 1080
    fps: int = 30
    bitrate: Optional[int] = None
    remove_comments: bool = True
    remove_whitespace: bool = True
    minify_keys: bool = False


class FileCompressor:
    """
    Kelas utama untuk menangani kompresi berbagai jenis file.
    
    Attributes:
        supported_image_formats (List[str]): Format gambar yang didukung
        supported_video_formats (List[str]): Format video yang didukung
        supported_code_formats (List[str]): Format kode yang didukung
    """
    
    def __init__(self):
        self.supported_image_formats = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
        self.supported_video_formats = ['.mp4', '.webm', '.avi', '.mov']
        self.supported_code_formats = ['.py', '.js', '.php', '.html', '.css', '.json', '.xml']
        
        # Initialize compression settings
        self.default_settings = CompressionSettings()
        
        logger.info("FileCompressor initialized successfully")
    
    def detect_file_type(self, file_path: str) -> CompressionType:
        """
        Mendeteksi jenis file berdasarkan ekstensi.
        
        Args:
            file_path (str): Path ke file yang akan dianalisis
            
        Returns:
            CompressionType: Jenis kompresi yang sesuai
            
        Raises:
            ValueError: Jika format file tidak didukung
        """
        file_extension = Path(file_path).suffix.lower()
        
        if file_extension in self.supported_image_formats:
            return CompressionType.IMAGE
        elif file_extension in self.supported_video_formats:
            return CompressionType.VIDEO
        elif file_extension in self.supported_code_formats:
            return CompressionType.CODE
        else:
            return CompressionType.FILE
    
    def compress_image(self, 
                      input_path: str, 
                      output_path: str, 
                      settings: CompressionSettings) -> Dict[str, Union[int, float]]:
        """
        Kompresi file gambar dengan pengaturan yang diberikan.
        
        Args:
            input_path (str): Path file input
            output_path (str): Path file output
            settings (CompressionSettings): Pengaturan kompresi
            
        Returns:
            Dict[str, Union[int, float]]: Statistik kompresi
        """
        try:
            # Simulasi kompresi gambar
            original_size = os.path.getsize(input_path)
            compressed_size = int(original_size * (settings.quality / 100))
            
            # Simulasi penulisan file terkompresi
            with open(output_path, 'w') as f:
                f.write(f"Compressed image with quality {settings.quality}%")
            
            compression_ratio = ((original_size - compressed_size) / original_size) * 100
            
            logger.info(f"Image compressed successfully: {compression_ratio:.2f}% reduction")
            
            return {
                'original_size': original_size,
                'compressed_size': compressed_size,
                'compression_ratio': compression_ratio,
                'quality': settings.quality
            }
            
        except Exception as e:
            logger.error(f"Error compressing image: {str(e)}")
            raise
    
    def compress_video(self, 
                      input_path: str, 
                      output_path: str, 
                      settings: CompressionSettings) -> Dict[str, Union[int, float]]:
        """
        Kompresi file video dengan pengaturan yang diberikan.
        
        Args:
            input_path (str): Path file input
            output_path (str): Path file output
            settings (CompressionSettings): Pengaturan kompresi
            
        Returns:
            Dict[str, Union[int, float]]: Statistik kompresi
        """
        try:
            # Simulasi kompresi video
            original_size = os.path.getsize(input_path)
            compressed_size = int(original_size * (settings.quality / 100) * 0.8)
            
            # Simulasi penulisan file terkompresi
            with open(output_path, 'w') as f:
                f.write(f"Compressed video with quality {settings.quality}% and {settings.fps} FPS")
            
            compression_ratio = ((original_size - compressed_size) / original_size) * 100
            
            logger.info(f"Video compressed successfully: {compression_ratio:.2f}% reduction")
            
            return {
                'original_size': original_size,
                'compressed_size': compressed_size,
                'compression_ratio': compression_ratio,
                'quality': settings.quality,
                'fps': settings.fps
            }
            
        except Exception as e:
            logger.error(f"Error compressing video: {str(e)}")
            raise
    
    def compress_code(self, 
                     input_path: str, 
                     output_path: str, 
                     settings: CompressionSettings) -> Dict[str, Union[int, float]]:
        """
        Kompresi file kode dengan pengaturan yang diberikan.
        
        Args:
            input_path (str): Path file input
            output_path (str): Path file output
            settings (CompressionSettings): Pengaturan kompresi
            
        Returns:
            Dict[str, Union[int, float]]: Statistik kompresi
        """
        try:
            with open(input_path, 'r', encoding='utf-8') as f:
                original_code = f.read()
            
            compressed_code = original_code
            
            # Hapus komentar jika diaktifkan
            if settings.remove_comments:
                compressed_code = self._remove_comments(compressed_code)
            
            # Hapus whitespace jika diaktifkan
            if settings.remove_whitespace:
                compressed_code = self._remove_whitespace(compressed_code)
            
            # Minify keys jika diaktifkan
            if settings.minify_keys:
                compressed_code = self._minify_keys(compressed_code)
            
            # Tulis file terkompresi
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(compressed_code)
            
            original_size = len(original_code.encode('utf-8'))
            compressed_size = len(compressed_code.encode('utf-8'))
            compression_ratio = ((original_size - compressed_size) / original_size) * 100
            
            logger.info(f"Code compressed successfully: {compression_ratio:.2f}% reduction")
            
            return {
                'original_size': original_size,
                'compressed_size': compressed_size,
                'compression_ratio': compression_ratio,
                'characters_removed': len(original_code) - len(compressed_code)
            }
            
        except Exception as e:
            logger.error(f"Error compressing code: {str(e)}")
            raise
    
    def _remove_comments(self, code: str) -> str:
        """Hapus komentar dari kode Python."""
        lines = code.split('\n')
        cleaned_lines = []
        
        for line in lines:
            # Hapus komentar inline
            comment_pos = line.find('#')
            if comment_pos != -1:
                line = line[:comment_pos].rstrip()
            
            # Skip baris kosong setelah penghapusan komentar
            if line.strip():
                cleaned_lines.append(line)
        
        return '\n'.join(cleaned_lines)
    
    def _remove_whitespace(self, code: str) -> str:
        """Hapus whitespace berlebih dari kode."""
        # Hapus spasi di awal dan akhir
        code = code.strip()
        
        # Hapus baris kosong berlebih
        lines = code.split('\n')
        cleaned_lines = []
        
        for line in lines:
            if line.strip():
                cleaned_lines.append(line.strip())
        
        return '\n'.join(cleaned_lines)
    
    def _minify_keys(self, code: str) -> str:
        """Minify key names dalam JSON atau dictionary."""
        # Implementasi sederhana untuk minify keys
        # Dalam implementasi nyata, ini akan lebih kompleks
        return code.replace('"name"', '"n"').replace('"description"', '"d"')
    
    def get_compression_stats(self, input_path: str) -> Dict[str, any]:
        """
        Mendapatkan statistik file sebelum kompresi.
        
        Args:
            input_path (str): Path ke file input
            
        Returns:
            Dict[str, any]: Statistik file
        """
        try:
            file_size = os.path.getsize(input_path)
            file_type = self.detect_file_type(input_path)
            
            stats = {
                'file_path': input_path,
                'file_size': file_size,
                'file_type': file_type.value,
                'file_extension': Path(input_path).suffix.lower(),
                'can_compress': file_type != CompressionType.FILE
            }
            
            # Tambahan statistik berdasarkan jenis file
            if file_type == CompressionType.CODE:
                with open(input_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    stats['line_count'] = len(content.split('\n'))
                    stats['character_count'] = len(content)
                    stats['word_count'] = len(content.split())
            
            return stats
            
        except Exception as e:
            logger.error(f"Error getting file stats: {str(e)}")
            raise


def main():
    """Fungsi utama untuk demonstrasi."""
    print("=== Aplikasi Kompres & De-kompres ===")
    print("Versi: 2.0.0")
    print("Author: AI Assistant")
    print()
    
    # Inisialisasi compressor
    compressor = FileCompressor()
    
    # Contoh penggunaan
    test_files = [
        "sample.json",
        "sample.py", 
        "sample.php"
    ]
    
    for file_path in test_files:
        if os.path.exists(file_path):
            try:
                stats = compressor.get_compression_stats(file_path)
                print(f"File: {file_path}")
                print(f"  Size: {stats['file_size']} bytes")
                print(f"  Type: {stats['file_type']}")
                print(f"  Can compress: {stats['can_compress']}")
                
                if stats['file_type'] == 'code':
                    print(f"  Lines: {stats.get('line_count', 'N/A')}")
                    print(f"  Characters: {stats.get('character_count', 'N/A')}")
                
                print()
                
            except Exception as e:
                print(f"Error processing {file_path}: {str(e)}")
        else:
            print(f"File {file_path} not found")
    
    print("Demo completed successfully!")


if __name__ == "__main__":
    main() 