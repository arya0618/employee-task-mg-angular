export interface Employee{
    id:string;
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    email: string;
    phone: string;
    address:Address;
      company:EmpCompay
      image:string
}

export interface  Address {
        address: string;
        city: string;
        state: string;
        stateCode: string;
        postalCode: number;
        country:string;
      
      }

 export interface EmpCompay{
      
        department:string
        name:string
}