<?php
/**
 * ImageHelper — Utility for image compression and resizing
 */
class ImageHelper {
    
    /**
     * Compress and save uploaded image
     * 
     * @param array $file $_FILES item
     * @param string $folder Target folder in uploads/
     * @param int $quality Compression quality (0-100)
     * @param int $maxWidth Max width for resizing (optional)
     * @return string Relative path to saved file
     */
    public static function uploadAndCompress($file, $folder, $quality = 70, $maxWidth = 1200) {
        // 1. Whitelist ekstensi yang aman
        $allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

        if (!in_array($ext, $allowedExts)) {
            throw new Exception("Ekstensi file '$ext' tidak diizinkan.");
        }

        // 2. Validasi apakah file benar-benar gambar (MIME check)
        $check = getimagesize($file['tmp_name']);
        if ($check === false) {
            throw new Exception("File yang diupload bukan merupakan gambar valid.");
        }

        // 3. Batasi ukuran file (Maks 10MB)
        if ($file['size'] > 10 * 1024 * 1024) {
            throw new Exception("Ukuran file terlalu besar (Maks 10MB).");
        }

        $uploadDir = __DIR__ . '/../../uploads/' . $folder . '/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        // 4. Gunakan nama file acak yang lebih kuat (Secure Random)
        $filename = bin2hex(random_bytes(10)) . '.' . $ext;
        $target = $uploadDir . $filename;

        // Skip compression for non-image or SVG/GIF
        $compressable = ['jpg', 'jpeg', 'png', 'webp'];
        if (!in_array($ext, $compressable)) {
            if (move_uploaded_file($file['tmp_name'], $target)) {
                return 'uploads/' . $folder . '/' . $filename;
            }
            throw new Exception('Gagal memindahkan file.');
        }

        // Get original dimensions from earlier check
        $width = $check[0];
        $height = $check[1];

        // Load source image
        // We load it to ensure we can resize and to strip metadata/EXIF for security and size.
        $source = null;
        if ($ext === 'jpg' || $ext === 'jpeg') $source = imagecreatefromjpeg($file['tmp_name']);
        elseif ($ext === 'png')  $source = imagecreatefrompng($file['tmp_name']);
        elseif ($ext === 'webp') $source = imagecreatefromwebp($file['tmp_name']);

        if (!$source) {
            // Fallback if GD fails to load
            if (move_uploaded_file($file['tmp_name'], $target)) {
                return 'uploads/' . $folder . '/' . $filename;
            }
            throw new Exception('Gagal memproses gambar.');
        }

        // Resize ONLY if width > maxWidth
        if ($width > $maxWidth) {
            $newWidth = $maxWidth;
            $newHeight = floor($height * ($maxWidth / $width));
            $tmp = imagecreatetruecolor($newWidth, $newHeight);
            
            // Handle transparency for PNG/WebP
            if ($ext === 'png' || $ext === 'webp') {
                imagealphablending($tmp, false);
                imagesavealpha($tmp, true);
                $transparent = imagecolorallocatealpha($tmp, 255, 255, 255, 127);
                imagefilledrectangle($tmp, 0, 0, $newWidth, $newHeight, $transparent);
            }
            
            imagecopyresampled($tmp, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
            imagedestroy($source);
            $source = $tmp;
        }

        // Save with compression
        $success = false;
        if ($ext === 'jpg' || $ext === 'jpeg') {
            imageinterlace($source, 1); // Enable progressive JPEG
            $success = imagejpeg($source, $target, $quality);
        } elseif ($ext === 'png') {
            // PNG quality is 0-9
            $pngQuality = 9 - round(($quality / 100) * 9);
            $success = imagepng($source, $target, $pngQuality);
        } elseif ($ext === 'webp') {
            $success = imagewebp($source, $target, $quality);
        }

        imagedestroy($source);

        if (!$success) {
            throw new Exception('Gagal menyimpan gambar yang dikompres.');
        }

        return 'uploads/' . $folder . '/' . $filename;
    }
}
