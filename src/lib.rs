#![allow(dead_code)] // この行でコンパイラのwaringsメッセージを止めます。
extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;

struct Complex{
    //複素数クラス
    real:f64,
    imag:f64,
}
impl Complex{
    fn new(real:f64,imag:f64)->Self{
        Self { real: real, imag: imag }
    }
    fn pow2(&mut self)->Complex{
        Complex{
            real:self.real.powi(2)-self.imag.powi(2),
            imag:2.0*self.real*self.imag,
        }
    }
    fn abs(&mut self)->f64{
        //絶対値
        (self.real.powi(2)+self.imag.powi(2)).sqrt()
    }
    fn abs_pow2(&mut self)->f64{
        //絶対値
        self.real.powi(2)+self.imag.powi(2)
    }
}

fn cadd(z1:&Complex,z2:&Complex)->Complex{
    Complex{
        real:z1.real+z2.real,
        imag:z1.imag+z2.imag,
    }
}

struct Mandelblot{
    z0:Complex,
    noc:u32
    //number of calculations
}
impl Mandelblot{
    fn new(z:Complex,noc:u32)->Self{
        Self{
            z0:z,
            noc:noc
        }
    }
    fn f(&mut self,z:&mut Complex,c:&Complex)->Complex{
        cadd(&z.pow2(),&c)
    }
    fn in_set(&mut self,c:&Complex)->bool{
        //100項目までに2を越える項がないことを確認する
        let mut z = Complex::new(self.z0.real,self.z0.imag);
        for _i in 0..self.noc{
            z = self.f(&mut z,&c);
            if z.abs()>2.0{
                return false
            }
        }
        return true
    }

    fn counter(&mut self,c:&Complex)->u32{
        let mut z=Complex::new(self.z0.real,self.z0.imag);
        for i in 0..self.noc{
            z = self.f(&mut z,&c);
            if z.abs_pow2()>4.0{
                return i
            }
        }
        return self.noc;
    }
}

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

#[wasm_bindgen]
pub fn mandelblot_set(
    width:u32,height:u32,
    draw_width:f64,draw_height:f64,
    draw_x:f64,draw_y:f64,
    noc:u32
    )->Vec<u8>
    {
    //ex.mandelblot_set(512,512,2.0,2.0,-2.0,1.0)
    //imageを使用しない方法
    //width:額縁の幅
    //height:額縁の高さ
    //draw_width:複素数平面上出の描画範囲幅
    //draw_height:複素数平面上での描画範囲高さ
    let mut rlist:Vec<u8>=Vec::new();
    let z0 = Complex::new(0.0,0.0);
    let mut mund = Mandelblot::new(z0,noc);
    for i in (0..width*height*4).step_by(4){
        let j = i/4;
        let x = j%width;
        let y = j/height;
        let z1 = Complex::new(
            (x as f64*draw_width + (draw_x*(width  as f64)))/(width as f64),
            (y as f64*draw_height + (draw_y*(height as f64)))/(height as f64)
        );
        let counter =mund.counter(&z1);
        if counter>=noc{
                rlist.push(0);
                rlist.push(0);
                rlist.push(0);
                rlist.push(255);
        }else{
                //let (r, g, b) = hsv_to_rgb(360.0*counter as f32/noc as f32);
                if counter%2==0{
                rlist.push(255);
                rlist.push(0);
                rlist.push(255);
                rlist.push(255);
                }else{
                rlist.push(255);
                rlist.push(255);
                rlist.push(0);
                rlist.push(255);

                }
        }
        //if mund.in_set(&z1){
        //    rlist.push(255);
        //    rlist.push(0);
        //    rlist.push(0);
        //    rlist.push(255);
        //}else{
        //    rlist.push(0);
        //    rlist.push(255);
        //    rlist.push(0);
        //    rlist.push(255);
        //}
    }
    rlist//値を返却
}


#[wasm_bindgen]
pub fn mandelblot_set2(   
    width:u32,height:u32,
    draw_width:f64,draw_height:f64,
    draw_x:f64,draw_y:f64,
    noc:u32
    )->Vec<u8>
    {
    //大幅変更版
    //ex.mandelblot_set(512,512,2.0,2.0,-2.0,1.0)
    //imageを使用しない方法
    //width:額縁の幅
    //height:額縁の高さ
    //draw_width:複素数平面上出の描画範囲幅
    //draw_height:複素数平面上での描画範囲高さ
    let mut rlist:Vec<u8>=Vec::new();
    let z0 = Complex::new(0.0,0.0);
    let mut mund = Mandelblot::new(z0,noc);
    for y in 0..height{
        for x in (0..width*4).step_by(4){
            let z1 = Complex::new(
                x as f64*draw_width/(width as f64) + draw_x  as f64,
                y as f64*draw_height/(height as f64) + draw_y as f64
            );
        let counter =mund.counter(&z1);
        if counter>=noc{
                rlist.push(0);
                rlist.push(0);
                rlist.push(0);
                rlist.push(255);
        }else{
                //let (r, g, b) = hsv_to_rgb(360.0*counter as f32/noc as f32);
                if counter%2==0{
                rlist.push(255);
                rlist.push(0);
                rlist.push(255);
                rlist.push(255);
                }else{
                rlist.push(255);
                rlist.push(255);
                rlist.push(0);
                rlist.push(255);

                }
        }
        }
    }
    rlist//値を返却
}