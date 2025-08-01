console.log('Script loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing application...');
    
    // Initialize theme
    initializeTheme();
    
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        console.log('Theme toggle initialized');
    }

    // State
    let fileToCompress = null;
    let fileToDecompress = null;

    // DOM Elements
    const compressUploadBtn = document.getElementById('compress-upload-btn');
    const compressUploadInput = document.getElementById('compress-upload');
    const compressInfo = document.getElementById('compress-info');
    const compressBtn = document.getElementById('compress-btn');
    const compressionSettings = document.getElementById('compression-settings');

    const decompressUploadBtn = document.getElementById('decompress-upload-btn');
    const decompressUploadInput = document.getElementById('decompress-upload');
    const decompressInfo = document.getElementById('decompress-info');
    const decompressBtn = document.getElementById('decompress-btn');

    const comparisonResult = document.getElementById('comparison-result');
    const downloadLinks = document.getElementById('download-links');

    // Compression Settings Elements
    const qualitySlider = document.getElementById('quality-slider');
    const qualityValue = document.getElementById('quality-value');
    const sizeSlider = document.getElementById('size-slider');
    const sizeValue = document.getElementById('size-value');
    const fpsSlider = document.getElementById('fps-slider');
    const fpsValue = document.getElementById('fps-value');
    const formatSelect = document.getElementById('format-select');

    // Size presets
    const sizePresets = [
        { width: 320, height: 240, label: '320x240' },
        { width: 640, height: 480, label: '640x480' },
        { width: 1280, height: 720, label: '1280x720' },
        { width: 1920, height: 1080, label: '1920x1080' },
        { width: 3840, height: 2160, label: '3840x2160' }
    ];

    // Attach click listeners
    if (compressUploadBtn) {
        compressUploadBtn.addEventListener('click', () => {
            console.log('Compress upload button clicked');
            compressUploadInput.click();
        });
    }
    
    if (decompressUploadBtn) {
        decompressUploadBtn.addEventListener('click', () => {
            console.log('Decompress upload button clicked');
            decompressUploadInput.click();
        });
    }

    // Handle file selection for compression
    if (compressUploadInput) {
        compressUploadInput.addEventListener('change', (e) => {
            console.log('File selected for compression');
            fileToCompress = e.target.files[0];
            if (fileToCompress) {
                console.log('File selected:', fileToCompress.name, fileToCompress.size, 'bytes');
                
                const isImageFile = fileToCompress.type.startsWith('image/');
                const isVideoFile = fileToCompress.type.startsWith('video/');
                const isCodeFile = isCodeFileType(fileToCompress.name);
                
                let fileType = '';
                let fileIcon = '';
                if (isImageFile) {
                    fileType = '(Gambar)';
                    fileIcon = '<i class="fas fa-image"></i> ';
                } else if (isVideoFile) {
                    fileType = '(Video)';
                    fileIcon = '<i class="fas fa-video"></i> ';
                } else if (isCodeFile) {
                    fileType = '(Kode)';
                    fileIcon = '<i class="fas fa-code"></i> ';
                } else {
                    fileIcon = '<i class="fas fa-file"></i> ';
                }
                
                if (compressInfo) {
                    compressInfo.innerHTML = `${fileIcon}File: ${fileToCompress.name} (${formatBytes(fileToCompress.size)}) ${fileType}`;
                }
                if (compressBtn) {
                    compressBtn.disabled = false;
                }
                
                // Show compression settings
                if (compressionSettings) {
                    compressionSettings.style.display = 'block';
                }
                
                console.log('File type detected:', { isImageFile, isVideoFile, isCodeFile });
            }
        });
    }

    // Handle file selection for decompression
    if (decompressUploadInput) {
        decompressUploadInput.addEventListener('change', (e) => {
            console.log('File selected for decompression');
            fileToDecompress = e.target.files[0];
            if (fileToDecompress && decompressInfo) {
                console.log('Decompress file selected:', fileToDecompress.name);
                decompressInfo.innerHTML = `<i class="fas fa-file-archive"></i> File: ${fileToDecompress.name} (${formatBytes(fileToDecompress.size)})`;
                if (decompressBtn) {
                    decompressBtn.disabled = false;
                }
            }
        });
    }

    // Handle compression settings changes
    if (qualitySlider && qualityValue) {
        qualitySlider.addEventListener('input', (e) => {
            qualityValue.textContent = e.target.value + '%';
        });
    }

    if (sizeSlider && sizeValue) {
        sizeSlider.addEventListener('input', (e) => {
            const preset = sizePresets[e.target.value - 1];
            sizeValue.textContent = preset.label;
        });
    }

    if (fpsSlider && fpsValue) {
        fpsSlider.addEventListener('input', (e) => {
            fpsValue.textContent = e.target.value + ' FPS';
        });
    }

    // Handle compression button click
    if (compressBtn) {
        compressBtn.addEventListener('click', async () => {
            console.log('Compress button clicked');
            if (!fileToCompress) {
                console.log('No file selected for compression');
                return;
            }

            console.log('Starting compression process...');

            // Get compression settings
            const quality = qualitySlider ? parseInt(qualitySlider.value) / 100 : 0.8;
            const sizePreset = sizeSlider ? sizePresets[parseInt(sizeSlider.value) - 1] : sizePresets[2];
            const fps = fpsSlider ? parseInt(fpsSlider.value) : 30;
            const format = formatSelect ? formatSelect.value : 'auto';

            console.log('Compression settings:', { quality, sizePreset, fps, format });

            try {
                const isImageFile = fileToCompress.type.startsWith('image/');
                const isVideoFile = fileToCompress.type.startsWith('video/');
                const isCodeFile = isCodeFileType(fileToCompress.name);

                if (isImageFile) {
                    console.log('Compressing image...');
                    await compressImage(fileToCompress, quality, sizePreset, format);
                } else if (isVideoFile) {
                    console.log('Compressing video...');
                    await compressVideo(fileToCompress, quality, sizePreset, fps);
                } else if (isCodeFile) {
                    console.log('Compressing code...');
                    await compressCode(fileToCompress);
                } else {
                    console.log('Compressing as ZIP...');
                    await compressAsZip(fileToCompress);
                }
            } catch (error) {
                console.error('Compression error:', error);
                if (comparisonResult) {
                    comparisonResult.innerHTML = `<p style="color: red;"><i class="fas fa-exclamation-circle"></i> Error saat kompresi: ${error.message}</p>`;
                }
            }
        });
    }
    
    // Handle decompression button click
    if (decompressBtn) {
        decompressBtn.addEventListener('click', async () => {
            console.log('Decompress button clicked');
            if (!fileToDecompress) {
                console.log('No file selected for decompression');
                return;
            }

            try {
                console.log('Starting decompression...');
                const zip = await JSZip.loadAsync(fileToDecompress);
                const filenames = Object.keys(zip.files);
                
                if (filenames.length === 0) {
                    if (comparisonResult) {
                        comparisonResult.innerHTML = `<p><i class="fas fa-exclamation-triangle"></i> File zip ini kosong.</p>`;
                    }
                    return;
                }

                if (comparisonResult) {
                    comparisonResult.innerHTML = `<p><strong><i class="fas fa-folder-open"></i> File dalam ${fileToDecompress.name}:</strong></p><ul>`;
                }
                if (downloadLinks) {
                    downloadLinks.innerHTML = ''; // Clear previous links
                }

                for (const filename of filenames) {
                    const file = zip.file(filename);
                    if (file) {
                        const decompressedBlob = await file.async('blob');
                        if (comparisonResult) {
                            comparisonResult.innerHTML += `<li><i class="fas fa-file"></i> ${filename} (${formatBytes(decompressedBlob.size)})</li>`;
                        }
                        createDownloadLink(decompressedBlob, filename, 'unduh-dekompresi');
                    }
                }
                if (comparisonResult) {
                    comparisonResult.innerHTML += '</ul>';
                }

            } catch (error) {
                console.error('Decompression error:', error);
                if (comparisonResult) {
                    comparisonResult.innerHTML = `<p style="color: red;"><i class="fas fa-exclamation-circle"></i> Error saat de-kompresi: ${error.message}. Pastikan file adalah .zip yang valid.</p>`;
                }
            }
        });
    }

    // Helper functions
    function isCodeFileType(filename) {
        const codeExtensions = ['.json', '.py', '.php', '.js', '.css', '.html', '.htm', '.txt', '.md'];
        return codeExtensions.some(ext => filename.toLowerCase().endsWith(ext));
    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function createDownloadLink(blob, filename, type) {
        if (!downloadLinks) return;
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.className = 'download-link';
        link.innerHTML = `<i class="fas fa-download"></i> ${type === 'unduh-kompresi' ? 'Unduh File Terkompresi' : 'Unduh File'}`;
        
        downloadLinks.appendChild(link);
    }

    function toggleTheme() {
        const body = document.body;
        const themeIcon = document.querySelector('#theme-toggle i');
        
        if (body.classList.contains('light-theme')) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            if (themeIcon) {
                themeIcon.className = 'fas fa-sun';
            }
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            if (themeIcon) {
                themeIcon.className = 'fas fa-moon';
            }
            localStorage.setItem('theme', 'light');
        }
    }

    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        const body = document.body;
        const themeIcon = document.querySelector('#theme-toggle i');
        
        if (savedTheme === 'dark') {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            if (themeIcon) {
                themeIcon.className = 'fas fa-sun';
            }
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            if (themeIcon) {
                themeIcon.className = 'fas fa-moon';
            }
        }
    }

    // Compression functions
    async function compressCode(file) {
        try {
            const text = await file.text();
            let compressed = '';
            let language = '';
            let filename = file.name;

            // Determine language and compress accordingly
            if (filename.endsWith('.json')) {
                compressed = compressJsonCode(text);
                language = 'JSON';
            } else if (filename.endsWith('.py')) {
                compressed = compressPythonCode(text);
                language = 'Python';
            } else if (filename.endsWith('.php')) {
                compressed = compressPhpCode(text);
                language = 'PHP';
            } else if (filename.endsWith('.js')) {
                compressed = compressJavaScriptCode(text);
                language = 'JavaScript';
            } else if (filename.endsWith('.css')) {
                compressed = compressCssCode(text);
                language = 'CSS';
            } else if (filename.endsWith('.html') || filename.endsWith('.htm')) {
                compressed = compressHtmlCode(text);
                language = 'HTML';
            } else {
                compressed = compressGenericCode(text);
                language = 'Text';
            }

            const originalSize = new Blob([text]).size;
            const compressedSize = new Blob([compressed]).size;
            const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

            showCodeComparison(text, compressed, originalSize, compressedSize, compressionRatio, language, filename);

        } catch (error) {
            console.error('Code compression error:', error);
            if (comparisonResult) {
                comparisonResult.innerHTML = `<p style="color: red;"><i class="fas fa-exclamation-circle"></i> Error saat kompresi kode: ${error.message}</p>`;
            }
        }
    }

    function compressJsonCode(code) {
        try {
            const parsed = JSON.parse(code);
            return JSON.stringify(parsed);
        } catch {
            return code.replace(/\s+/g, ' ').trim();
        }
    }

    function compressPythonCode(code) {
        return code
            .replace(/^\s*#.*$/gm, '') // Remove comments
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/\s*([{}[\]])\s*/g, '$1') // Remove spaces around brackets
            .trim();
    }

    function compressPhpCode(code) {
        return code
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
            .replace(/\/\/.*$/gm, '') // Remove line comments
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .trim();
    }

    function compressJavaScriptCode(code) {
        return code
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
            .replace(/\/\/.*$/gm, '') // Remove line comments
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .trim();
    }

    function compressCssCode(code) {
        return code
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/\s*([{}:;])\s*/g, '$1') // Remove spaces around special characters
            .trim();
    }

    function compressHtmlCode(code) {
        return code
            .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .trim();
    }

    function compressGenericCode(code) {
        return code
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .trim();
    }

    function showCodeComparison(original, compressed, originalSize, compressedSize, compressionRatio, language, filename) {
        if (!comparisonResult) return;
        
        comparisonResult.innerHTML = `
            <div class="comparison-header">
                <h3><i class="fas fa-code"></i> Hasil Kompresi Kode</h3>
                <p><i class="fas fa-file-code"></i> ${language} - ${filename}</p>
            </div>
            
            <div class="code-preview">
                <div class="code-section">
                    <h4><i class="fas fa-file-alt"></i> Kode Asli</h4>
                    <pre><code>${escapeHtml(original)}</code></pre>
                </div>
                <div class="code-section">
                    <h4><i class="fas fa-compress-alt"></i> Kode Terkompresi</h4>
                    <pre><code>${escapeHtml(compressed)}</code></pre>
                </div>
            </div>
            
            <div class="compression-stats">
                <div class="stat-item">
                    <span class="stat-label"><i class="fas fa-weight-hanging"></i> Ukuran Asli:</span>
                    <span class="stat-value">${formatBytes(originalSize)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label"><i class="fas fa-compress"></i> Ukuran Terkompresi:</span>
                    <span class="stat-value">${formatBytes(compressedSize)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label"><i class="fas fa-percentage"></i> Rasio Kompresi:</span>
                    <span class="stat-value">${compressionRatio}%</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label"><i class="fas fa-save"></i> Penghematan:</span>
                    <span class="stat-value">${formatBytes(originalSize - compressedSize)}</span>
                </div>
            </div>
        `;

        // Create download links
        if (downloadLinks) {
            downloadLinks.innerHTML = '';
            const compressedBlob = new Blob([compressed], { type: 'text/plain' });
            createDownloadLink(compressedBlob, `compressed_${filename}`, 'unduh-kompresi');
        }
    }

    async function compressImage(file, quality, sizePreset, format) {
        try {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            
            await new Promise((resolve) => {
                img.onload = resolve;
            });

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Calculate new dimensions
            const aspectRatio = img.width / img.height;
            let newWidth = sizePreset.width;
            let newHeight = sizePreset.height;

            if (aspectRatio > 1) {
                newHeight = Math.round(newWidth / aspectRatio);
            } else {
                newWidth = Math.round(newHeight * aspectRatio);
            }

            canvas.width = newWidth;
            canvas.height = newHeight;

            // Draw and compress image
            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            let mimeType = 'image/jpeg';
            if (format === 'png') {
                mimeType = 'image/png';
            } else if (format === 'webp') {
                mimeType = 'image/webp';
            } else if (format === 'auto') {
                mimeType = file.type;
            }

            const compressedBlob = await new Promise((resolve) => {
                canvas.toBlob(resolve, mimeType, quality);
            });

            const originalSize = file.size;
            const compressedSize = compressedBlob.size;
            const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

            // Show image comparison
            if (comparisonResult) {
                comparisonResult.innerHTML = `
                    <div class="comparison-header">
                        <h3><i class="fas fa-image"></i> Hasil Kompresi Gambar</h3>
                    </div>
                    
                    <div class="image-comparison">
                        <div class="image-container">
                            <h4><i class="fas fa-image"></i> Gambar Asli</h4>
                            <img src="${URL.createObjectURL(file)}" alt="Original" style="max-width: 100%; height: auto;">
                            <div class="image-info">
                                <p><i class="fas fa-expand"></i> Resolusi: ${img.width}x${img.height}</p>
                                <p><i class="fas fa-weight-hanging"></i> Ukuran: ${formatBytes(originalSize)}</p>
                                <p><i class="fas fa-file-image"></i> Format: ${file.type}</p>
                            </div>
                        </div>
                        <div class="image-container">
                            <h4><i class="fas fa-compress"></i> Gambar Terkompresi</h4>
                            <img src="${URL.createObjectURL(compressedBlob)}" alt="Compressed" style="max-width: 100%; height: auto;">
                            <div class="image-info">
                                <p><i class="fas fa-expand"></i> Resolusi: ${newWidth}x${newHeight}</p>
                                <p><i class="fas fa-weight-hanging"></i> Ukuran: ${formatBytes(compressedSize)}</p>
                                <p><i class="fas fa-file-image"></i> Format: ${mimeType}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="compression-stats">
                        <div class="stat-item">
                            <span class="stat-label"><i class="fas fa-weight-hanging"></i> Ukuran Asli:</span>
                            <span class="stat-value">${formatBytes(originalSize)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label"><i class="fas fa-compress"></i> Ukuran Terkompresi:</span>
                            <span class="stat-value">${formatBytes(compressedSize)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label"><i class="fas fa-percentage"></i> Rasio Kompresi:</span>
                            <span class="stat-value">${compressionRatio}%</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label"><i class="fas fa-save"></i> Penghematan:</span>
                            <span class="stat-value">${formatBytes(originalSize - compressedSize)}</span>
                        </div>
                    </div>
                `;
            }

            // Create download links
            if (downloadLinks) {
                downloadLinks.innerHTML = '';
                const extension = mimeType.split('/')[1];
                createDownloadLink(compressedBlob, `compressed_${file.name.replace(/\.[^/.]+$/, '')}.${extension}`, 'unduh-kompresi');
            }

        } catch (error) {
            console.error('Image compression error:', error);
            if (comparisonResult) {
                comparisonResult.innerHTML = `<p style="color: red;"><i class="fas fa-exclamation-circle"></i> Error saat kompresi gambar: ${error.message}</p>`;
            }
        }
    }

    async function compressVideo(file, quality, sizePreset, fps) {
        try {
            if (comparisonResult) {
                comparisonResult.innerHTML = `
                    <div class="compression-progress">
                        <h3><i class="fas fa-video"></i> Kompresi Video Sedang Berlangsung...</h3>
                        <div class="progress-container">
                            <div class="progress-bar" id="progress-bar"></div>
                        </div>
                        <p class="progress-text" id="progress-text">Mempersiapkan kompresi...</p>
                    </div>
                `;
            }

            const video = document.createElement('video');
            video.src = URL.createObjectURL(file);
            video.muted = true;
            video.playsInline = true;

            await new Promise((resolve) => {
                video.addEventListener('loadedmetadata', resolve);
                video.load();
            });

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Calculate new dimensions
            const aspectRatio = video.videoWidth / video.videoHeight;
            let newWidth = sizePreset.width;
            let newHeight = sizePreset.height;

            if (aspectRatio > 1) {
                newHeight = Math.round(newWidth / aspectRatio);
            } else {
                newWidth = Math.round(newHeight * aspectRatio);
            }

            canvas.width = newWidth;
            canvas.height = newHeight;

            const stream = canvas.captureStream(fps);
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp9'
            });

            const chunks = [];
            let startTime = Date.now();

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const compressedBlob = new Blob(chunks, { type: 'video/webm' });
                const originalSize = file.size;
                const compressedSize = compressedBlob.size;
                const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
                const duration = (Date.now() - startTime) / 1000;

                // Show video comparison
                if (comparisonResult) {
                    comparisonResult.innerHTML = `
                        <div class="comparison-header">
                            <h3><i class="fas fa-video"></i> Hasil Kompresi Video</h3>
                            <p><i class="fas fa-clock"></i> Waktu kompresi: ${duration.toFixed(1)} detik</p>
                        </div>
                        
                        <div class="video-comparison">
                            <div class="video-container">
                                <h4><i class="fas fa-play"></i> Video Asli</h4>
                                <video controls class="comparison-video">
                                    <source src="${URL.createObjectURL(file)}" type="${file.type}">
                                </video>
                                <div class="video-info">
                                    <p><i class="fas fa-expand"></i> Resolusi: ${video.videoWidth}x${video.videoHeight}</p>
                                    <p><i class="fas fa-weight-hanging"></i> Ukuran: ${formatBytes(originalSize)}</p>
                                    <p><i class="fas fa-clock"></i> Durasi: ${formatDuration(video.duration)}</p>
                                </div>
                            </div>
                            <div class="video-container">
                                <h4><i class="fas fa-compress"></i> Video Terkompresi</h4>
                                <video controls class="comparison-video">
                                    <source src="${URL.createObjectURL(compressedBlob)}" type="video/webm">
                                </video>
                                <div class="video-info">
                                    <p><i class="fas fa-expand"></i> Resolusi: ${newWidth}x${newHeight}</p>
                                    <p><i class="fas fa-weight-hanging"></i> Ukuran: ${formatBytes(compressedSize)}</p>
                                    <p><i class="fas fa-video"></i> Frame Rate: ${fps} FPS</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="compression-stats">
                            <div class="stat-item">
                                <span class="stat-label"><i class="fas fa-weight-hanging"></i> Ukuran Asli:</span>
                                <span class="stat-value">${formatBytes(originalSize)}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label"><i class="fas fa-compress"></i> Ukuran Terkompresi:</span>
                                <span class="stat-value">${formatBytes(compressedSize)}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label"><i class="fas fa-percentage"></i> Rasio Kompresi:</span>
                                <span class="stat-value">${compressionRatio}%</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label"><i class="fas fa-save"></i> Penghematan:</span>
                                <span class="stat-value">${formatBytes(originalSize - compressedSize)}</span>
                            </div>
                        </div>
                    `;
                }

                // Create download links
                if (downloadLinks) {
                    downloadLinks.innerHTML = '';
                    createDownloadLink(compressedBlob, `compressed_${file.name.replace(/\.[^/.]+$/, '')}.webm`, 'unduh-kompresi');
                }
            };

            video.play();
            mediaRecorder.start();

            let frameCount = 0;
            const totalFrames = Math.ceil(video.duration * fps);

            const drawFrame = () => {
                if (video.ended || video.paused) {
                    mediaRecorder.stop();
                    return;
                }

                ctx.drawImage(video, 0, 0, newWidth, newHeight);
                frameCount++;
                
                const progress = (frameCount / totalFrames) * 100;
                updateProgress(progress, `Memproses frame ${frameCount}/${totalFrames}`);

                setTimeout(drawFrame, 1000 / fps);
            };

            drawFrame();

        } catch (error) {
            console.error('Video compression error:', error);
            if (comparisonResult) {
                comparisonResult.innerHTML = `<p style="color: red;"><i class="fas fa-exclamation-circle"></i> Error saat kompresi video: ${error.message}</p>`;
            }
        }
    }

    function updateProgress(percentage, text) {
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        
        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }
        if (progressText) {
            progressText.textContent = text;
        }
    }

    function formatDuration(seconds) {
        if (isNaN(seconds)) return 'Unknown';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
    }

    async function compressAsZip(file) {
        try {
            const zip = new JSZip();
            zip.file(file.name, file);
            
            const compressedBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
            
            const originalSize = file.size;
            const compressedSize = compressedBlob.size;
            const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

            if (comparisonResult) {
                comparisonResult.innerHTML = `
                    <div class="comparison-header">
                        <h3><i class="fas fa-file-archive"></i> Hasil Kompresi ZIP</h3>
                        <p><i class="fas fa-file"></i> File: ${file.name}</p>
                    </div>
                    
                    <div class="file-comparison">
                        <div class="comparison-before-info">
                            <h4><i class="fas fa-file"></i> File Asli</h4>
                            <div class="file-detail">
                                <span>Nama File:</span>
                                <span>${file.name}</span>
                            </div>
                            <div class="file-detail">
                                <span>Ukuran:</span>
                                <span>${formatBytes(originalSize)}</span>
                            </div>
                            <div class="file-detail">
                                <span>Tipe:</span>
                                <span>${file.type || 'Unknown'}</span>
                            </div>
                        </div>
                        <div class="comparison-after-info">
                            <h4><i class="fas fa-file-archive"></i> File ZIP</h4>
                            <div class="file-detail">
                                <span>Nama File:</span>
                                <span>${file.name}.zip</span>
                            </div>
                            <div class="file-detail">
                                <span>Ukuran:</span>
                                <span>${formatBytes(compressedSize)}</span>
                            </div>
                            <div class="file-detail">
                                <span>Tipe:</span>
                                <span>application/zip</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="compression-stats">
                        <div class="stat-item">
                            <span class="stat-label"><i class="fas fa-weight-hanging"></i> Ukuran Asli:</span>
                            <span class="stat-value">${formatBytes(originalSize)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label"><i class="fas fa-compress"></i> Ukuran Terkompresi:</span>
                            <span class="stat-value">${formatBytes(compressedSize)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label"><i class="fas fa-percentage"></i> Rasio Kompresi:</span>
                            <span class="stat-value">${compressionRatio}%</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label"><i class="fas fa-save"></i> Penghematan:</span>
                            <span class="stat-value">${formatBytes(originalSize - compressedSize)}</span>
                        </div>
                    </div>
                `;
            }

            // Create download links
            if (downloadLinks) {
                downloadLinks.innerHTML = '';
                createDownloadLink(compressedBlob, `${file.name}.zip`, 'unduh-kompresi');
            }

        } catch (error) {
            console.error('ZIP compression error:', error);
            if (comparisonResult) {
                comparisonResult.innerHTML = `<p style="color: red;"><i class="fas fa-exclamation-circle"></i> Error saat kompresi ZIP: ${error.message}</p>`;
            }
        }
    }

    console.log('Application initialized successfully');
});
