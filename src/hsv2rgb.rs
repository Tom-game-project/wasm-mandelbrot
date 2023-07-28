fn hsv_to_rgb(h: f32) -> (u8, u8, u8) {
    let c =1.0;
    let x = c * (1.0 - (h / 60.0 % 2.0 - 1.0).abs());
    let m = 0.0;

    let (r, g, b) = if h >= 0.0 && h < 60.0 {
        (c, x, 0.0)
    } else if h >= 60.0 && h < 120.0 {
        (x, c, 0.0)
    } else if h >= 120.0 && h < 180.0 {
        (0.0, c, x)
    } else if h >= 180.0 && h < 240.0 {
        (0.0, x, c)
    } else if h >= 240.0 && h < 300.0 {
        (x, 0.0, c)
    } else if h >= 300.0 && h < 360.0 {
        (c, 0.0, x)
    } else {
        (0.0, 0.0, 0.0)
    };

    let (r, g, b) = ((r + m) * 255.0, (g + m) * 255.0, (b + m) * 255.0);

    (r as u8, g as u8, b as u8)
}

fn main() {
    let h: f32 = 180.0; // Hue (0 to 360)
    let (r, g, b) = hsv_to_rgb(h);

    println!("HSV({})", h);
    println!("RGB({}, {}, {})", r, g, b);
}