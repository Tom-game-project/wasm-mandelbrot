struct Float{
    sign:bool,//0または1
    nn:u128,
    dotpoint:i32
}
impl Float{
    fn new(sign:u8,nn:Vec<bool>,dotpoint:u32)->Self{
        self{
            sign,
            nn,
            dotpoint
        }
    }
    fn show(&mut self){
        println!("{}{:?}e{}",if sign{"-"}else{"+"},self.nn,dotpoint);
    }

}

fn fadd(a:Float,b:Float)->Float{
    match (a.sign,b.sign){
        (false,false)=>{
            return Float{
                sign:True,
                
            }
        }
        (false,true)=>{

        }
        (true,false)=>{

        }
        (true,true)=>{

        }
    }
}
fn fsub(a:Float,b:Float)->Float{
    //a-b

}


fn main(){
    let f1 = Float::new(0,5,-1);
    let f2 = Float::new(0,453,-3);

}