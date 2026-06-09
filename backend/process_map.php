<?php
$file = '/Users/user/wifi-management/frontend/public/grobogan-map.png';
$im = imagecreatefrompng($file);

imagealphablending($im, false);
imagesavealpha($im, true);

$width = imagesx($im);
$height = imagesy($im);

$transparent = imagecolorallocatealpha($im, 0, 0, 0, 127);
$white = imagecolorallocatealpha($im, 255, 255, 255, 0);

for($x=0; $x<$width; $x++) {
    for($y=0; $y<$height; $y++) {
        $rgb = imagecolorat($im, $x, $y);
        $r = ($rgb >> 16) & 0xFF;
        $g = ($rgb >> 8) & 0xFF;
        $b = $rgb & 0xFF;
        $alpha = ($rgb & 0x7F000000) >> 24;
        
        if ($alpha >= 120) continue;
        
        // Grobogan is bright yellowish: R>230, G>230, B is slightly lower or similar
        // Let's assume Grobogan pixels have very high Red and Green (e.g. > 230)
        // And the surrounding areas (brown/green) have lower values.
        if ($r > 220 && $g > 220 && $b > 150) {
            imagesetpixel($im, $x, $y, $white);
        } else {
            imagesetpixel($im, $x, $y, $transparent);
        }
    }
}

$output = '/Users/user/wifi-management/frontend/public/grobogan-map-white.png';
imagepng($im, $output);
echo "Image processed. Kept only bright yellowish areas as white, rest transparent.\n";
?>
